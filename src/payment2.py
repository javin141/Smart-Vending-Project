import asyncio
from asyncio import Future
from abc import ABC, abstractmethod
import time, selection
from threading import Thread

from hal import hal_lcd, hal_keypad, hal_rfid_reader, hal_keypad_neo, hal_buzzer
from typing import Callable

from Inventory_Array import get_item, choose_slot, update_item, update_stock
from dispense import dispense_drink
# from hal import hal_key_l
from keypad_interfacing import register_listener, interrupt_all

lcd = hal_lcd.lcd()
hal_buzzer.init()
# loop = asyncio.get_event_loop()


rfid_rd = hal_rfid_reader.SimpleMFRC522()


class PaymentMethod(ABC):

    @abstractmethod
    def process_payment(self, card_id: str, price: float) -> bool:
        pass


class RFIDPay(PaymentMethod):

    def process_payment(self, card_id: str, price: float) -> bool:
        return True


def prompt(name: str, price: float, when_finished: Callable[[bool], None]):
    lcd.lcd_clear()
    lcd.lcd_display_string(name, 1)
    lcd.lcd_display_string(f"${price} Y:#, N:*", 2)

    def callback(position):
        if position == "*":
            when_finished(False)
        elif position == "#":
            when_finished(True)

    time.sleep(1)
    register_listener(callback)


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
    card_id = rfid_rd.read_id() # Blocking call

    if card_id is None:
        print("RFID reader returns without card detected.")
        selection.main()
    else:
        hal_buzzer.beep(0.1, 0.5, 1)


    success = payment_method.process_payment(card_id, price)
    return success



def pay(refcode: int):
    interrupt_all()
    item = get_item(refcode)
    name = item["name"]
    price = item["price"]

    def user_intent(intent: bool):
        if intent:
            # We call the rest of the code from here.

            success = read_card(price)

            if success:
                lcd.lcd_clear()
                lcd.lcd_display_string("Payment success", 1)
                slot = choose_slot(refcode)
                update_stock(refcode, -1, slot)
                time.sleep(1)
                # Move to dispensing.
                dispense_drink(refcode)
                selection.main()
            else:
                lcd.lcd_clear()
                lcd.lcd_display_string("Payment failure", 1)
                time.sleep(2)
                # Recursively call the prompt function
                prompt(name, price, user_intent)

        else:
            lcd.lcd_clear()
            lcd.lcd_display_string("Have a nice day!", 1)
            time.sleep(2)
            selection.main()
            # Else, we just return.
    prompt(name, price, user_intent)




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
