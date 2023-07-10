const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("./data/user");
const app = express()


app.get("/", (req, res) => {
    res.send("Hello World!")
})

const ua = express.Router()

ua.get("/", async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})
    const pwCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false
    if (!pwCorrect) {
        res.status(403).json({error: "403 Forbidden, invalid credentials"})
    }

    const privKey = process.env["JWT_KEY"]
    const token = jwt.sign({
        username: user.username,
        id: user._id // For access via findById
    }, privKey)

    res.status(200).json({token, username: user.username})
})

ua.post("/", async (req, res) => {
    const {username, password, name} = req.body // Destructuring of body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const currentUser = new User({
        username, passwordHash, name
    }) // Create it just like an object

    const theUser = await currentUser.save()
    res.status(201).json(theUser)
})
