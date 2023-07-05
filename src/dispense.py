import time

def dispense_drink(refcode):
    # Connect to the database
    conn = sqlite3.connect('Vending.sqlite')
    c = conn.cursor()

    # Fetch the drink name from the database
    c.execute("SELECT drink_name FROM Vending WHERE refcode=?", (refcode,))
    drink_name = c.fetchone()

    if drink_name:
        # Initialize the servo and LCD
        init()
        lcd_dispenser = lcd()

        # Spin the servo 90 degrees slowly
        set_servo_position(90)

        # Display "Currently dispensing [Drink Name]"
        lcd_dispenser.lcd_display_string("Currently dispensing", 1)
        lcd_dispenser.lcd_display_string(drink_name[0], 2)

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

    # Close the database connection
    conn.close()
