export function setCookie(key: string, value: string) {
    // TODO: extra feature: session cookie expiry
    window.localStorage.setItem(key, value)
}

export function getCookie(key: string): string|null {
    console.log("Cookie ", key, window.localStorage.getItem(key))
    return window.localStorage.getItem(key)
}

export function removeCookie(key: string) {
    window.localStorage.removeItem(key)
}


export function removeLogin() {
    removeCookie("SESSION")
    removeCookie("NAME")
}

export const ROOT_BACKEND = "http://localhost:6788"


export function getUnixTime(): number {
    return Date.now() / 1000
}
