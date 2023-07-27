import {setCookie} from "./utils";
import {LoginResult} from "./auth";
import {VendingItem} from "./objs/VendingItem";

export async function getItems(): Promise<VendingItem[]|null> {


    const result = await fetch("http://localhost:6788/drinks", {
        method: "GET",
        // mode: "cors", TODO get CORS working properly when in production
        cache: "no-cache",
        // credentials: "same-origin", // include, *same-origin, omit
    })

    if (result.ok) {
        const vendingItems = (await result.json())
        return vendingItems
    } else {
        return null
    }


}
