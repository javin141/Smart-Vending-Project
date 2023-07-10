const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
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

const User = mongoose.model("User", userSchema)
module.exports = User
