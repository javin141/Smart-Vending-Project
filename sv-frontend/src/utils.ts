export function setCookie(key, value) {
    // TODO: extra feature: session cookie expiry
    document.cookie = key + "=" + value +
        ";path=/";
}

export function getCookie(key: string): string|undefined {
    const cookies: string[] = document.cookie.split(";")
    for (let cookie of cookies) {
        let ck: string = cookie.trim()
        if (ck.startsWith(`${key}=`)) {
            return ck.substring(key.length + 1)
        }
    }

    return undefined


}
