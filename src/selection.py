#!/usr/bin/python
from hal import hal_keypad as keypad
from threading import Thread
from hal import hal_lcd as LCD
from payment2 import pay
selection = []
# final_choice = 0 #set as global variable

def key_press(key):
    global selection, lcd
    final_choice = "not set"
#    lcd.lcd_clear()
    if key != "#":
        selection.append(key)
        print(selection)
    else: 
        final_choice = ''.join(map(str,selection))
        selection = []
        print(final_choice)
        pay(int(final_choice))


    print(selection, final_choice)

def main():
    global lcd
    lcd = LCD.lcd()
    lcd.lcd_clear()

    lcd.lcd_display_string("Please select")
    print(selection)

    keypad.init(key_press)


    



    keypad_thread = Thread(target=keypad.get_key)
    keypad_thread.start()

if __name__ == "__main__":
    main()
