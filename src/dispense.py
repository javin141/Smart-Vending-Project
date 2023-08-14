import time

from Inventory_Array import get_item
from hal.hal_lcd import lcd
from hal.hal_servo import set_servo_position, init
from hal.hal_led import set_output
from hal import hal_led, hal_servo
from hal.hal_buzzer import init, turn_on_with_timer

import RPi.GPIO as GPIO

def dispense_drink(refcode):

    # Fetch the drink details from the get_item function
    item = get_item(refcode)

    if item:
        # Initialize the servo and LCD
        hal_servo.init()
        hal_led.init()

        lcd_dispenser = lcd()

        # Spin the servo 180 degrees slowly

        # Display "Currently dispensing [Drink Name]"
        lcd_dispenser.lcd_clear()
        lcd_dispenser.lcd_display_string("Dispensing", 1)
        lcd_dispenser.lcd_display_string(f"{item['name']} [{item['refcode']}]", 2)

        set_output(24, GPIO.HIGH)

        for i in range(0, 180, 5):
            set_servo_position(i)

        turn_on_with_timer(0.5)

        # Spin the servo back to 0 degrees
        for i in range(180, 0, -5):
            set_output(24, GPIO.HIGH)
            set_servo_position(i)
            set_output(24, GPIO.LOW)
        
        set_output(24, GPIO.LOW)

        # Display "Dispensing complete!"
        lcd_dispenser.lcd_clear()
        lcd_dispenser.lcd_display_string("Dispensing", 1)
        lcd_dispenser.lcd_display_string("Complete!", 2)

        time.sleep(3)


        # Clear the display
        lcd_dispenser.lcd_clear()

