import os
path = os.path.expanduser('~/.yagmail')
if not os.path.isfile(path):
    print("YAGMAIL FILE NOT FOUND!")
    # print(os.path.abspath("/home/pi/.yagmail"))
    open(path, "w").write("")

import yagmail, os

email = os.getenv("MAIL_ADDR")
pw = os.getenv("MAIL_PW")
yag = yagmail.SMTP(email, pw, host="smtppro.zoho.com", port=465)


def send_mail(to: str, subject: str, message_list: list):
    yag.send(to=to, subject=subject, contents=message_list)
