from mail import send_mail


def test_send():
    message = \
        """
        SmartVending has been broken in and security breached. It is now put on theft mode.
        Enter the keycode at the vending machine to disarm it.
        """
    send_mail("lucius@czlucius.dev", "Breakin", [message])
    # We cannot verify the receipt of the email, hence we are just checking if any errors.
    # YagMail is relatively robust.
