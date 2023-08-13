const express = require("express")
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require('cors')
const User = require("./data/user");
const bodyParser = require("body-parser");
const {MyBankPaymentMethod} = require("./payment");
const {PiVendingProvider} = require("./data/vending");
const Order = require("./data/order");
const {getTokenFromReq} = require("./utils");
const mongoose = require("mongoose");
const {sendOrder} = require("./interfacing/pi");
const path = require("path");


const app = express()

dotenv.config()
console.log(process.env)

mongoose.connect(process.env.MONGODB_URL)

app.use(cors())
app.use(bodyParser.json())

const frontend = express.static(path.join(__dirname, '../frontend-build')) // Only possible in production. Will fail in development.
app.use(frontend)
const ua = express.Router()

const wss = require("./interfacing/wss")// Start WSS Server


ua.post("/login", async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})
    console.log("Username", username, user)


    const pwCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false
    if (!pwCorrect) {
        return res.status(403).json({error: "403 Forbidden, invalid credentials"})
    }

    const privKey = process.env["JWT_KEY"]
    const token = jwt.sign({
        username: user?.username,
        id: user._id, // For access via findById
        name: user?.name
    }, privKey)

    res.status(200).json({token, username: user.username})
})

ua.post("/signup", async (req, res) => {
    const {username, password, name} = req.body // Destructuring of body
    const userQuery = await User.findOne({username})
    console.log(userQuery, username, {username})
    if (userQuery) {
        return res.status(400).json({error: "Username taken", errphrase: "unt-6"})

    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const currentUser = new User({
        username, passwordHash, name
    }) // Create it just like an object

    let theUser = await currentUser.save()
    console.log("User saved", currentUser, username)

    const privKey = process.env["JWT_KEY"]
    const token = jwt.sign({
        username: theUser.username,
        id: theUser._id // For access via findById
    }, privKey)

    return res.status(201).json({token})
})


const oa = express.Router()

const vendingDataProvider = new PiVendingProvider()
const supportedPaymentMethods = new MyBankPaymentMethod() // If multiple methods are supported, the chain of responsibility pattern shall be used.
oa.post("/", async (req, res) => {
    console.log("POST DRINKS", req.body)

    // User will be POSTing the refcode, and payment method. We will get the data from the vending data provider (abstracted, replaceable)
    const {refcode, paymentDetails} = req.body
    const {owner, cardNumber, cvv, expDate, bankCode} = paymentDetails
    const token = getTokenFromReq(req)
    const userToken = jwt.verify(token, process.env["JWT_KEY"])
    if (!userToken.id) {
        return res.status(401).json({error: "Invalid token", errphrase: "ivt-3"})
    }
    const user = await User.findById(userToken.id)
    if (user == null) {
        return res.status(404).json({error: "User not found!", errphrase: "jtb-3"})
    }

    const slot = await vendingDataProvider.findSlot(refcode)
    if (slot == null) {
        return res.status(404).json({error: "No available stock", errphrase: "nas-1"})
    }
    const vendingItem = await vendingDataProvider.getItem(refcode)


    if (supportedPaymentMethods.bankCode !== bankCode) {
        return res.status(400).json({error: "Bank not supported", errphrase: "bns-2"})
    }

    const success = supportedPaymentMethods.pay(owner, cardNumber, cvv, expDate, vendingItem.price)
    if (success) {
        const redeemCode = await vendingDataProvider.placeOrder({refcode, slot})
        const time = new Date().getTime() / 1000
        const order = new Order({
            refcode, name: vendingItem.name, price: vendingItem.price, redeemCode, time, slot, user: user._id, orders: []
        })
        const savedOrder = await order.save()
        user.orders = user.orders.concat(savedOrder._id)
        await User.findByIdAndUpdate(user/* mongoose checks and gets id */, user, {new: true})
        res.status(201).json(
            { redeemCode, time }
        )
    } else {
        return res.status(400).json({error: "Payment failure", errphrase: "pay-4"})

    }

})


oa.get("/", async (req, res) => {
    console.log("GET DRINKS")
    const vendingDataProvider = new PiVendingProvider()
    // There is NO NEED to authenticate as this data is not user specific nor sensitive.
    const allItems = await vendingDataProvider.getAllItems()
    console.log("VI", allItems)
    return res.status(200).json(allItems)
})


oa.get("/orders", async (req, res) => {
    console.log("Orders endpoint")
    const token = getTokenFromReq(req)
    const userToken = jwt.verify(token, process.env["JWT_KEY"])
    if (!userToken.id) {
        return res.status(401).json({error: "Invalid token", errphrase: "ivt-3"})
    }
    const user = await User.findById(userToken.id)
    if (user == null) {
        return res.status(404).json({error: "User not found!", errphrase: "jtb-3"})
    }


    const userPopulated = await user.populate({
        path: 'orders',
        model: 'Order'
    })
    console.log("userpopulated", userPopulated)
    const allOrders = userPopulated.orders
    console.log("allOrders", allOrders)
    return res.status(200).json(allOrders)
})

app.get("/testgetitem", async (req, res)=>{
    const pr = new PiVendingProvider()

    res.send(await pr.getItem(6) ?? "333")
})

app.use("/users", ua)
app.use("/drinks", oa)
app.use("/*", frontend)



const PORT = 6788
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})
