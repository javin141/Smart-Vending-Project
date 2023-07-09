import asyncio
from asyncio import Future
from abc import ABC, abstractmethod
import time

from hal import hal_lcd, hal_keypad, hal_rfid_reader, hal_key_l
from typing import Callable

from src.Inventory_Array import get_item

lcd = hal_lcd.lcd()
# keypad = hal_keypad.HALKeypad()
hal_key_l.init(lambda _: _)

# loop = asyncio.get_event_loop()


rfid_rd = hal_rfid_reader.SimpleMFRC522()


class PaymentMethod(ABC):

    @abstractmethod
    def process_payment(self, card_id: str, price: float) -> bool:
        pass


class RFIDPay(PaymentMethod):

    def process_payment(self, card_id: str, price: float) -> bool:
        return True  # TODO: check the actual ID of the RFID tag


def prompt(name: str, price: float, when_finished: Callable[[bool], None]):
    lcd.lcd_display_string(name, 1)
    lcd.lcd_display_string(f"${price} Yes(#)/No(*)", 2)


    def callback(position):
        if position == "*":
            when_finished(False)
        elif position == "#":
            when_finished(True)


    hal_key_l.change_callback(callback)


def read_card(price: float, payment_method: PaymentMethod = RFIDPay()) -> bool:
    """
    Reads the card and processes the payment according to the PaymentMethod supplied.
    NOTE: this method is blocking. You may want to run it on a seperate thread.
    :param price: price of item to be charged
    :param payment_method: Payment method
    :return: Returns success of transaction.
    """
    lcd.lcd_clear()
    lcd.lcd_display_string("Tap card", 1)
    card_id = rfid_rd.read_id()
    if card_id is None:
        raise Exception("RFID reader returns without card detected.")

    success = payment_method.process_payment(card_id, price)
    return success





#
# class Transaction:
#     def __init__(self, refcode: int, name: str, price: float, payment_methods=None):
#         if payment_methods is None:
#             payment_methods = [RFIDPay()]
#         self.name = name
#         self.refcode = refcode
#         self.price = price
#         self.payment_methods = payment_methods
#         self.success = False
#
#     async def read_card(self) -> Future[bool]:
#         lcd.lcd_display_string("Tap card", 1)
#         future: Future[bool] = loop.create_future()
#
#         card_id = rfid_rd.read_id()
#         success = False
#         for i in self.payment_methods:
#             if await i.process_payment(str(card_id), self.price):
#                 success = True
#                 break
#
#         future.set_result(success)
#         if success:
#             self.success = True
#         return future
#
#     async def process_transaction(self):
#
#         user_intent = await self.prompt_for_payment()
#         if not user_intent:
#             lcd.lcd_clear()
#
#             lcd.lcd_display_string("Have a nice day!", 1)
#             return
#         transaction_pass = await self.read_card()
#         if not transaction_pass:
#             lcd.lcd_clear()
#             lcd.lcd_display_string("Transaction fail")
#             await self.process_transaction()
#         else:
#             lcd.lcd_clear()
#             lcd.lcd_display_string("Payment successful")
#
#
# def pay_for(item: dict):
#     transaction = Transaction(item["refcode"], item["name"], item["price"])
#     asyncio.run(transaction.process_transaction())
#
#
#
