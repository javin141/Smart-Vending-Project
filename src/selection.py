#!/usr/bin/python
import time, os

from hal import hal_lcd as LCD
from payment2 import pay
from keypad_interfacing import register_listener, stop_listening, interrupt_all
import antitheft_background
from Inventory_Array import get_item

selection = []
lcd = LCD.lcd()


def key_press(key):
    global selection, lcd
    final_choice = "not set"

    if key == "*":
        # Online
        open("statusfile", "w").write("11")
        os._exit(11)
    elif key != "#":
        selection.append(key)
        current_selection = ''.join(map(str, selection))
        print(current_selection)
        lcd.lcd_clear()
        lcd.lcd_display_string("Please select:")
        lcd.lcd_display_string(current_selection, 2)
    else:
        final_choice = ''.join(map(str, selection))
        selection = []
        print(final_choice)
        stop_listening(key_press)  # Remove the listener when "#" is pressed
        if final_choice == "67873":
            antitheft_background.toggle_bypass()
        elif final_choice == "68701":
            open("statusfile", "w").write("12")
            os._exit(12)

        else:
            item = get_item(int(final_choice))
            if item is None:
                # Not found!
                lcd.lcd_clear()
                lcd.lcd_display_string("Error!", 1)
                lcd.lcd_display_string("Not Found", 2)
                time.sleep(2)
                pass
            else:
                stock = sum(item["stock"])  # alr accounted for internally
                if stock > 0:
                    pay(int(final_choice))
                    return # Get dispensing to call main since its also multithreaded
                else:
                    lcd.lcd_clear()
                    lcd.lcd_display_string("No stock!", 1)
                    time.sleep(2)
        main(init=False)  # Continue

    print(selection, final_choice)

# NOTE: selection is SUPPOSED to check the validity of users choice, because payment is not designed for invalid input!
def main(init=True):
    interrupt_all()
    lcd.lcd_clear()

    lcd.lcd_display_string("Enter choice")
    lcd.lcd_display_string("* for online", 2)
    print(selection)

    register_listener(key_press)  # Use a lambda function to pass the 'key' argument

if __name__ == "__main__":
    main()
