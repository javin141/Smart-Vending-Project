#!/usr/bin/python
from hal import hal_lcd as LCD
from payment2 import pay
from keypad_interfacing import register_listener, stop_listening

selection = []

def key_press(key):
    global selection, lcd
    final_choice = "not set"
    if key != "#":
        selection.append(key)
        current_selection = ''.join(map(str, selection))
        print(current_selection)
        lcd.lcd_display_string("Please select:")
        lcd.lcd_display_string(current_selection, 2)
    else:
        final_choice = ''.join(map(str, selection))
        selection = []
        print(final_choice)
        stop_listening(key_press)  # Remove the listener when "#" is pressed
        pay(int(final_choice))
        main(init=False)  # Continue in another thread.

    print(selection, final_choice)

def main(init=True):
    global lcd
    if init:
        lcd = LCD.lcd()
        lcd.lcd_clear()

    lcd.lcd_display_string("Please select")
    print(selection)

    register_listener(key_press)  # Use a lambda function to pass the 'key' argument

if __name__ == "__main__":
    main()
