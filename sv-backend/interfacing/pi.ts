const Order = require("../data/order")
const crypto = require("crypto")

interface OrderReq {
    refcode: number
    slot: number
}

/**
 * Sends the order to the RPi.
 * @param order the orderpythj object.
 * @return redemption code valid for 24h.
 */
export function sendOrder(order: OrderReq): string {
    const {refcode, slot} = order
    const orderCode = crypto.randomUUID()
    // TODO: send the data to the RPi!
    return orderCode
}
