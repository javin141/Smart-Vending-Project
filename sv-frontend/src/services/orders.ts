import {getBearer} from "./auth.ts";
import {errPhraseToMsg, ErrResult} from "../objs/ErrResult.ts";
import {ROOT_BACKEND} from "./utils.ts";

export interface Order {
    refcode: number,
    name: string,
    price: number,
    redeemCode: string,
    time: number,
    slot: number,
    user: string,
    id: string,
    _id: string
}


async function getOrders(): Promise<Order[]> {
    const bearer = getBearer()
    const result = await fetch(`${ROOT_BACKEND}/drinks/orders`, {
        method: "GET",
        cache: "no-cache",
        headers: {
            Authorization: bearer
        }
    })
    console.log("result,", result)
    if (result.ok) {
        console.log("orders")
        const orders = await result.json() as Order[]
        console.log(orders)
        // NOTE: page will CRASH if server sends malformatted contents!
        return orders
    } else {
        const err = await result.json() as ErrResult
        const errHrMsg = errPhraseToMsg(err.errphrase, err.error || "Error!")
        console.log(err, errHrMsg)
        throw new Error(errHrMsg)
    }
}

export {getOrders}
