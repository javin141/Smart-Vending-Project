import time

from Inventory_Array import get_item
from src.hal.hal_lcd import lcd
from hal.hal_servo import set_servo_position, init


def dispense_drink(refcode):

    # Fetch the drink details from the get_item function
    item = get_item(refcode)

    if item:
        # Initialize the servo and LCD
        init()
        lcd_dispenser = lcd()

        # Spin the servo 90 degrees slowly
        set_servo_position(90)

        # Display "Currently dispensing [Drink Name]"
        lcd_dispenser.lcd_display_string("Currently dispensing", 1)
        lcd_dispenser.lcd_display_string(item["name"], 2)

        # Wait for 10 seconds
        time.sleep(10)

        # Spin the servo back to 0 degrees
        set_servo_position(0)

        # Display "Dispensing complete!"
        lcd_dispenser.lcd_clear()
        lcd_dispenser.lcd_display_string("Dispensing complete!", 1)

        # Wait for another 10 seconds
        time.sleep(10)

        # Clear the display
        lcd_dispenser.lcd_clear()
