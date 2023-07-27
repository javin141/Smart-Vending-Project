export interface ErrResult {
    error: string
    errphrase: string

}
export function errPhraseToMsg(errPhrase: string|undefined, fallback: string|undefined): string {
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
