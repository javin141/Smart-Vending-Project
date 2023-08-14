import {getCookie, ROOT_BACKEND} from "./utils.ts";
import {errPhraseToMsg, ErrResult} from "../objs/ErrResult.ts";
import {store} from "../main.tsx";
import {setLoggedIn} from "../login_reducers.ts";

export function getLogin(): string|boolean {
    const cookie = getCookie("SESSION")
    const name = getCookie("NAME")
    return cookie ? (name ?? true) : false
}

export type LoginResult = {
    success: boolean
    token?: string
    errMsg?: string
}

export interface CardDetails {
    owner: string
    cardNumber: string
    expDate: string
    cvv: number
    bankCode: string
}

// interface TokenDetails

export function getBearer() {
    return `Bearer ${getCookie("SESSION") ?? ""}`
}



export async function login(username: string, password: string, failureMsg: string): Promise<LoginResult> {
    const data = {
        username,
        password
    }

    const result = await fetch(`${ROOT_BACKEND}/users/login`, {
        method: "POST",
        // mode: "cors", TODO get CORS working properly when in production
        cache: "no-cache",
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    if (result.ok) {
        const {token} = (await result.json()) as {token: string}
        store.dispatch(setLoggedIn(token))
        return {
            success: true,
            token
        }
    } else {
        const {errphrase, error} = (await result.json()) as ErrResult
        const errMsg = errPhraseToMsg(errphrase, error || failureMsg)
        return {
            success: false,
            errMsg
        }
    }


}


export async function signup(name: string, username: string, password: string, failureMsg: string): Promise<LoginResult> {
    console.log("username")
    const data = {
        name,
        username,
        password
    }

    const result = await fetch(`${ROOT_BACKEND}/users/signup`, {
        method: "POST",
        // mode: "cors", TODO get CORS working properly when in production
        cache: "no-cache",
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    if (result.ok) {
        const {token} = (await result.json()) as {token: string}
        store.dispatch(setLoggedIn(token))
        return {
            success: true,
            token
        }
    } else {
        const {errphrase, error} = (await result.json()) as ErrResult
        const errMsg = errPhraseToMsg(errphrase, error || failureMsg)
        return {
            success: false,
            errMsg
        }
    }


}

