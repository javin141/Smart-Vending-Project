import asyncio
from asyncio import Future

from hal import hal_lcd, hal_keypad

lcd = hal_lcd.lcd()
keypad = hal_keypad.HALKeypad()
loop = asyncio.get_event_loop()


class Transaction:
    def __init__(self, refcode: int, name: str, price: int):
        self.name = name
        self.refcode = refcode
        self.price = price

    async def prompt_for_payment(self) -> Future[bool]:
        lcd.lcd_display_string(self.name, 1)
        lcd.lcd_display_string(f"${self.price} Yes(#)/No(*)")

        future: Future[bool] = loop.create_future()

        def callback(position):
            if position == "*":
                future.set_result(False)
            elif position == "#":
                future.set_result(True)

        keypad.add_callback(callback)

        return future
