import {getCookie, setCookie} from "./utils";

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


function errPhraseToMsg(errPhrase: string|undefined, fallback: string|undefined): string {
    switch (errPhrase) {
        case "ivt-3": return "Invalid token"
        case "jtb-3": return "User not found"
        case "nas-1": return "No available stock"
        case "bns-2": return "Bank not supported"
        case "pay-4": return "Payment failure"
        case "unt-6": return "Username taken"
        default:
            console.error("Error", errPhrase)
            return fallback || "Error"
    }
}


export async function login(username: string, password: string, failureMsg: string): Promise<LoginResult> {
    const data = {
        username,
        password
    }

    const result = await fetch("http://localhost:6788/users/login", {
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
        const {token, name} = (await result.json())
        setCookie("SESSION", token)
        setCookie("NAME", name)
        return {
            success: true,
            token
        }
    } else {
        const {errphrase, error} = (await result.json())
        const errMsg = errPhraseToMsg(errphrase, error || failureMsg)
        return {
            success: false,
            errMsg
        }
    }


}


export async function signup(name: string, username: string, password: string, failureMsg: string): Promise<LoginResult> {
    const data = {
        name,
        username,
        password
    }

    const result = await fetch("http://localhost:6788/users/signup", {
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
        const token = (await result.json()).token
        setCookie("SESSION", token)
        setCookie("USER_DISPLAYNAME", name)
        return {
            success: true,
            token
        }
    } else {
        const {errphrase, error} = (await result.json())
        const errMsg = errPhraseToMsg(errphrase, error || failureMsg)
        return {
            success: false,
            errMsg
        }
    }


}

