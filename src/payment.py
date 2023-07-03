import asyncio
from asyncio import Future
from abc import ABC, abstractmethod
from hal import hal_lcd, hal_keypad, hal_rfid_reader

lcd = hal_lcd.lcd()
keypad = hal_keypad.HALKeypad()
loop = asyncio.get_event_loop()
hal_rfid_reader.init()

rfid_rd = hal_rfid_reader.SimpleMFRC522()


class PaymentMethod(ABC):

    @abstractmethod
    def process_payment(self, card_id: str, price: float) -> Future[bool]:
        pass

class RFIDPay(PaymentMethod, ABC):

    def process_payment(self, card_id: str, price: float) -> Future[bool]:
        fut = loop.create_future()
        fut.set_result(True)
        return fut


class Transaction:
    def __init__(self, refcode: int, name: str, price: float, payment_methods=None):
        if payment_methods is None:
            payment_methods = [RFIDPay()]
        self.name = name
        self.refcode = refcode
        self.price = price
        self.payment_methods = payment_methods
        self.success = False

    async def prompt_for_payment(self) -> Future[bool]:
        lcd.lcd_display_string(self.name, 1)
        lcd.lcd_display_string(f"${self.price} Yes(#)/No(*)", 2)

        future: Future[bool] = loop.create_future()

        def callback(position):
            if position == "*":
                future.set_result(False)
            elif position == "#":
                future.set_result(True)

        keypad.add_callback(callback)

        return future

    async def read_card(self) -> Future[bool]:
        lcd.lcd_display_string("Tap card", 1)
        future: Future[bool] = loop.create_future()

        card_id = rfid_rd.read_id()
        success = False
        for i in self.payment_methods:
            if await i.process_payment(str(card_id), self.price):
                success = True
                break

        future.set_result(success)
        if success:
            self.success = True
        return future

    async def process_transaction(self):

        user_intent = await self.prompt_for_payment()
        if not user_intent:
            lcd.lcd_clear()

            lcd.lcd_display_string("Have a nice day!", 1)
            return
        transaction_pass = await self.read_card()
        if not transaction_pass:
            lcd.lcd_clear()
            lcd.lcd_display_string("Transaction fail")
            await self.process_transaction()
        else:
            lcd.lcd_clear()
            lcd.lcd_display_string("Payment successful")



def pay_for(item: dict):
    transaction = Transaction(item["refcode"], item["name"], item["price"])
    asyncio.run(transaction.process_transaction())

            

