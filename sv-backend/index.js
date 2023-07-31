const express = require("express")
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require('cors')
const User = require("./data/user");
const bodyParser = require("body-parser");
const {MyBankPaymentMethod} = require("./payment.ts");
const {MockVendingProvider, VendingDataProvider} = require("./data/vending");
const Order = require("./data/order");
const {getTokenFromReq} = require("./utils");
const mongoose = require("mongoose");
const {sendOrder} = require("./interfacing/pi");
const app = express()

dotenv.config()

mongoose.connect(process.env.MONGODB_URL)

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Hello World!")
})

const ua = express.Router()

ua.post("/login", async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})
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
    if (await User.findOne({username})) {
        return res.status(400).json({error: "Username taken", errphrase: "unt-6"})

    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const currentUser = new User({
        username, passwordHash, name
    }) // Create it just like an object

    let theUser = await currentUser.save()

    const privKey = process.env["JWT_KEY"]
    const token = jwt.sign({
        username: theUser.username,
        id: theUser._id // For access via findById
    }, privKey)

    res.status(201).json({token})
})


const oa = express.Router()

const vendingDataProvider = new MockVendingProvider()
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

    const slot = vendingDataProvider.findSlot(refcode)
    if (slot == null) {
        return res.status(404).json({error: "No available stock", errphrase: "nas-1"})
    }
    const vendingItem = vendingDataProvider.getItem(refcode)


    if (supportedPaymentMethods.bankCode !== bankCode) {
        return res.status(400).json({error: "Bank not supported", errphrase: "bns-2"})
    }

    const success = supportedPaymentMethods.pay(owner, cardNumber, cvv, expDate, vendingItem.price)
    if (success) {
        const redeemCode = sendOrder({refcode, slot})
        const time = new Date().getTime() / 1000
        const order = new Order({
            refcode, name: vendingItem.name, price: vendingItem.price, redeemCode, time, slot, user: user._id, orders: []
        })
        const savedOrder = await order.save()
        user.orders = user.orders.concat(savedOrder._id)
        await user.save()
        res.status(201).json(
            { redeemCode, time }
        )
    } else {
        return res.status(400).json({error: "Payment failure", errphrase: "pay-4"})

    }

})


app.use("/users", ua)
app.use("/drinks", oa)

const PORT = 6788
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})
