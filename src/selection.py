from hal import hal_keypad as keypad


selection = []
final_choice = o #set as global variable

def key_press(key):
    lcd.lcd_clear()
    if selection[-1] != # 
    selection.append(key)
    print(selection)
    elif 
    selection = selection[:-1]
    final_choice =''join(map(str,selection))
    selection = []

def main():
    lcd = LCD.lcd()
    lcd.lcd_clear()

    lcd.lcd_display_string("Please make your" \n "Selection")
    keypad.init(key_press)
    if final_choice != 0

    
    keypad_thread = Thread(target=keypad.get_key)
    keypad_thread.start()
