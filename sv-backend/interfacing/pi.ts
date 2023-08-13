import {SlotStock, VendingItem} from "../data/vending";

const crypto = require("crypto")
const wss = require("./wss.js")

export interface OrderReq {
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

export interface Redeem {
    redeem: string, timestamp: string, slot: number
}

export interface StockResponse {
    refcode: string
    name: string
    price: number
    stock: string[]
    slots: string[]
    redeemcodes: Redeem[]
}

export interface RawItem {
    refcode: string
    name: string
    price: number
    stock: string // comma sep
    slots: string // comma sep
    redeemcodes: string // JSON string
}

export function checkStock(refcode: number): Promise<StockResponse|null> {
    return new Promise<StockResponse|null>((resolve, reject) => {
        const reqID = crypto.randomUUID().toString()
        const callback = (data: any, id: string) => {
            console.log("data", data)
            if (data["endpoint"] === "checkstock" && id == reqID) {
                const {refcode, name, price, stock, slots, redeemcodes} = data
                resolve({refcode, name, price, stock, slots, redeemcodes})
                return true
            } else {
                return false // our endpoint has not returned status yet.
            }
            return true
        }
        wss.checkStockReq(refcode, callback, reqID)

    })
}

/*
export type VendingItem = {
    name: string
    refcode: number
    slotStock: SlotStock[],
    price: number
}
 */
export function getInv(): Promise<VendingItem[]> {

    return new Promise<VendingItem[]>((resolve, reject) => {
        const reqID = crypto.randomUUID().toString()

        const callback = (data: any, id: string, endpoint?: string) => {
            console.log("data", data)
            if (data.endpoint == "getinv" && id === reqID) {
                const vendingItems = []

                for (const rawItem of data.data) {
                    console.log("ri", rawItem)
                    const sss: SlotStock[] = []
                    const parsedstock = rawItem[4].split(",")
                    const parsedslot = rawItem[3].split(",")
                    const redeems: Redeem[] = JSON.parse(rawItem[5])
                    const redeemslots: {[slot: number]: number} = {}
                    for (const ri of redeems) {
                        if (redeemslots[ri.slot]) {
                            redeemslots[ri.slot]++
                        } else {
                            redeemslots[ri.slot] = 1
                        }
                    }
                    console.log("psps", parsedslot, parsedstock, redeemslots)
                    for (let i=0; i< parsedstock.length; i++) {
                        let redeemed = Number(redeemslots[parsedslot[i]])
                        if (Number.isNaN(redeemed)) {
                            redeemed = 0
                        }
                        console.log("el", Number(parsedstock[i]), redeemed)


                        sss.push({
                            slot: Number(parsedslot[i]),
                            stock: Number(parsedstock[i]) - redeemed
                        })
                    }
                    console.log("sss", sss, redeemslots)
                    const vi: VendingItem = {
                        name: rawItem[1],
                        refcode: rawItem[0],
                        price: rawItem[2],
                        slotStock: sss
                    }
                    vendingItems.push(vi)
                }
                console.log("vi2", vendingItems)
                resolve(vendingItems)
                return true
            } else {
                return false
            }
            return true
        }

        wss.getInventory(callback ,reqID)

    })
}



export function placeOrder(refcode: number, slot?: number): Promise<string|null> {
    return new Promise<string|null>((resolve, reject) => {
        const reqID = crypto.randomUUID().toString()
        const callback = (data: any, id: string) => {
            console.log("data", data)
            if (data["endpoint"] === "placeorder" && id == reqID) {
                if (!data.message) {
                    resolve(data.reservation_code)
                } else {
                    // error
                    resolve(null)
                }
            } else {
                return false // our endpoint has not returned status yet.
            }
            return true
        }
        wss.placeOrder(refcode, callback, reqID, slot)

    })
}


export function findSlot(refcode: number): Promise<number|null> {
    return new Promise<number|null>((resolve, reject) => {
        const reqID = crypto.randomUUID().toString()
        const callback = (data: any, id: string) => {
            console.log("data", data)
            if (data["endpoint"] === "chooseslot" && id == reqID) {
                if (data.slot) {
                    // Slot is found
                    console.log("SLOT FOUND",data.slot)
                    resolve(data.slot)

                } else {
                    resolve(null)
                }
            } else {
                return false // our endpoint has not returned status yet.
            }
            return true
        }
        wss.findSlot(refcode, callback, reqID)

    })
}
