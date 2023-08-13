from mail import send_mail


def test_send():
    message = \
        """Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Nunc a tincidunt nisl. Nam porta nisl dignissim ante venenatis tempus. Sed accumsan ultrices ante eu auctor.
        """
    send_mail("lucius@czlucius.dev", "Test Email", [message])
    # We cannot verify the receipt of the email, hence we are just checking if any errors.
    # YagMail is relatively robust.
