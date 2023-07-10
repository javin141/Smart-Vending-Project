const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    refcode: Number,
    name: String,
    price: Number,
    redeemCode: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})


orderSchema.set("toJSON", {
    transform: (doc, rto) => {
        delete rto.__v
        rto.id = rto._id.toString()
    }
})
const Order = mongoose.model("Order", orderSchema)
