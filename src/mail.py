import yagmail, os

email = os.getenv("MAIL_ADDR")
pw = os.getenv("MAIL_PW")
yag = yagmail.SMTP(email, pw)


def send_mail(to: str, subject: str, message_list: list):
    yag.send(to=to, subject=subject, contents=message_list)
