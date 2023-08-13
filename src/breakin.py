"""
This file is to be run standalone and not from other Vending files.
It is to be run if a break in is detected.
This program assumes that a break in is detected if it is run.
"""

import os
import time, uuid
import camera
from threading import Thread

from hal import hal_buzzer, hal_lcd, hal_key_l
from mail import send_mail

hal_buzzer.init()
lcd = hal_lcd.lcd()
hal_key_l.init(lambda _: _)


message = \
"""
SmartVending has been broken in and security breached. It is now put on theft mode.
Enter the keycode at the vending machine to disarm it.
A picture has been captured from the camera and attached to this email.
"""


def generate_prompt(inp):
    lcd.lcd_clear()
    lcd.lcd_display_string("Breakin! PIN?")
    lcd.lcd_display_string(inp, 2)


def main():
    # Break in
    # If correct PIN is entered, the program exits with status 8.
    print("in breakin.py")

    keypad_entries = []
    generate_prompt("")

    def beep_continuously():
        while True:
            hal_buzzer.beep(0.5, 0.5, 2)

    def access_code_entering(key):
        print("Entries", keypad_entries)
        if key != "#":
            keypad_entries.append(str(key))
            generate_prompt("".join(keypad_entries))
        else:
            keycode = "".join(keypad_entries)
            print(keycode)
            if keycode != "6653":
                keypad_entries.clear()
                lcd.lcd_clear()
                lcd.lcd_display_string("Wrong PIN")
                time.sleep(2)
                generate_prompt("")
            else:
                # Correct!
                # We shall turn off beep and re launch selection.
                hal_buzzer.turn_off()

                open("statusfile", "w").write("0")
                os._exit(8)

    hal_key_l.change_callback(access_code_entering)
    beep_thread = Thread(target=beep_continuously)
    access_code_thread = Thread(target=hal_key_l.get_key)
    print("Entries", keypad_entries)

    beep_thread.start()
    access_code_thread.start()
    the_uuid = uuid.uuid4()
    filepath = f"/tmp/pic-{the_uuid}.jpg"
    camera.capture_to(filepath)
    print("Picture taken")

    send_mail("mml45q932@mozmail.com", "SmartVending theft alert", [message, filepath])
    print("Sent mail")
