const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    name: {type: String, required: true},
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
})
userSchema.set("toJSON", {
    transform: (doc, rto) => {
        rto.id = rto._id.toString()
        delete rto.passwordHash
        delete rto.__v
    }
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)
module.exports = User
