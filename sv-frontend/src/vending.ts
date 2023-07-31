
import {VendingItem} from "./objs/VendingItem";
import {CardDetails, getBearer} from "./auth.ts";
import {errPhraseToMsg, ErrResult} from "./objs/ErrResult.ts";
import {ROOT_BACKEND} from "./utils.ts";
//todo change to svc
export async function getItems(): Promise<VendingItem[]|null> {


    const result = await fetch(`${ROOT_BACKEND}/drinks`, {
        method: "GET",
        // mode: "cors", TODO get CORS working properly when in production
        cache: "no-cache",
        // credentials: "same-origin", // include, *same-origin, omit
    })

    if (result.ok) {
        const vendingItems = (await result.json()) as VendingItem[]
        return vendingItems
    } else {
        return null
    }


}

interface RedemtionDetails {
    redeemCode: string,
    time: number
}



export async function payFor(item: VendingItem, cardDetails: CardDetails): Promise<RedemtionDetails> {
    const url = `${ROOT_BACKEND}/drinks`
    const body = {
        refcode: item.refcode,
        paymentDetails: cardDetails
    }
    const bearer = getBearer()

    const result = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: bearer
        },
        method: "POST",
        body: JSON.stringify(body)
    })

    if (result.ok) {
        const redemtionDetails = await result.json() as RedemtionDetails
        return redemtionDetails
    } else {
        const err = await result.json() as ErrResult

        const errHrMsg = errPhraseToMsg(err.errphrase, err.error || "Error!")
        console.log(err, errHrMsg)
        throw new Error(errHrMsg)
    }
}











