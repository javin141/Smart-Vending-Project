import time

from Inventory_Array import get_item
from hal.hal_lcd import lcd
from hal.hal_servo import set_servo_position, init
from hal.hal_led import init, set_output
from hal.hal_buzzer import init, turn_on_with_timer


def dispense_drink(refcode):

    # Fetch the drink details from the get_item function
    item = get_item(refcode)

    if item:
        # Initialize the servo and LCD
        init()
        lcd_dispenser = lcd()

        # Spin the servo 180 degrees slowly

        # Display "Currently dispensing [Drink Name]"
        lcd_dispenser.lcd_display_string("Dispensing:", 1)
        lcd_dispenser.lcd_display_string(item["name"], 2)

        set_output(24, GPIO.HIGH)

        for i in range(0, 180, 5):
            set_servo_position(i)

        # Wait for 10 seconds
        time.sleep(3.5)
        turn_on_with_timer(0.5)

        # Spin the servo back to 0 degrees
        for i in range(180, 0, -5):
            set_servo_position(i)
        
        set_output(24, GPIO.LOW)

        # Display "Dispensing complete!"
        lcd_dispenser.lcd_clear()
        lcd_dispenser.lcd_display_string("Dispensing", 1)
        lcd_dispenser.lcd_display_string("Complete!", 2)

        for i in range(0, 10, 1):
            set_output(24, GPIO.HIGH)
            turn_on_with_timer(0.5)
            set_output(24, GPIO.LOW)
            time.sleep(0.5)

        # Clear the display
        lcd_dispenser.lcd_clear()

