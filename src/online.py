import time
from threading import Thread
import  os, json
from hal import hal_lcd, hal_key_l
from Inventory_Array import get_item, update_item
from dispense import dispense_drink

lcd = hal_lcd.lcd()
hal_key_l.init(lambda _: _)
def exit_chk(key):
    if key == "*":
        open("statusfile", "w").write("0")
        os._exit(0)

def redeem_chk():
    # code = camera.read_barcode_loop_sync()
    # REMOVE WHEN IN PRODUCTION!
    code = '{"redeem":"1691487716", "refcode":8}'
    time.sleep(1)
    print("CODE DETECTED", code)

    # We need to check if the redeem code is valid.
    # QR code is in a JSON array
    try:
        order = json.loads(code)
    except json.decoder.JSONDecodeError as e:
        # Order invalid!
        invalid()

    rc = order["refcode"]
    print("refcode", rc)
    item = get_item(rc)
    if item is None:
        # Order invalid!
        invalid()

    rcs = item["redeemcodes"]
    print("rcs", rcs)
    match = None
    for rco in rcs:
        print("redeemcode mco", rco["redeem"], order["redeem"])
        if str(rco["redeem"]) == str(order["redeem"]):
            match = rco
            print("match", rco)
            break
    if match is not None:
        item["redeemcodes"].remove(match)
    else:
        invalid()


    update_item(rc, item)

    # Dispense
    dispense_drink(rc)
    # time.sleep alr
    lcd.lcd_clear()
    lcd.lcd_display_string("Thank you :)")
    time.sleep(1)


    open("statusfile", "w").write("0")
    os._exit(0)


def invalid():
    lcd.lcd_clear()
    lcd.lcd_display_string("Invalid!")
    time.sleep(2)

    open("statusfile", "w").write("0")
    os._exit(0)

def main():
    lcd.lcd_clear()
    lcd.lcd_display_string("Scan QR")
    lcd.lcd_display_string("* to exit", 2)

    hal_key_l.change_callback(exit_chk)
    thread = Thread(target=hal_key_l.get_key)
    thread.start()

    cam = Thread(target=redeem_chk)
    cam.start()



    pass