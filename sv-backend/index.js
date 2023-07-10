const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.send("Hello World!")
})

const router = express.Router()

router.get("/", (req, res) => {

})
