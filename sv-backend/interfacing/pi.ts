const Order = require("../data/order")

/**
 * Sends the order to the RPi.
 * @param order the order object.
 * @return redemption code valid for 24h.
 */
function sendOrder(order): string {
    const {refcode, slot} = order
    const orderCode = crypto.randomUUID()
    // TODO: send the data to the RPi!
    return orderCode
}
