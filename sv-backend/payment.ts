abstract class PaymentMethod {
    abstract bankCode: string
    abstract pay(owner: string, cardNumber: string, cvv: number, expDate: string, amount: number): boolean
}

class MyBankPaymentMethod extends PaymentMethod {
    pay(owner: string, cardNumber: string, cvv: number, expDate: string, amount: number): boolean {
        // https://www.checkout.com/docs/developer-resources/testing/test-cards
        if (owner == "John Doe" && cvv == 467 && expDate == "07/39" && cardNumber == "5585076576791786") {
            return true
        } else {
            return false
        }
    }

    bankCode: string = "myBank"

}
module.exports = {PaymentMethod, MyBankPaymentMethod}
