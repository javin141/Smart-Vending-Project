from threading import Thread
import os
from hal import hal_adc

hal_adc.init()

bypass = False
THRESHOLD = 970
POT_CHANNEL = 1  # 0 <= adc <= 1023


def toggle_bypass() -> bool:
    global bypass
    bypass = not bypass
    return bypass


def antitheft_main():
    while True:
        if not bypass:
            if hal_adc.get_adc_value(POT_CHANNEL) < THRESHOLD:
                # Security breached.
                # Launch burglar program (coordinated by Tao's shell script) (status code 10)
                print("BURGLAR SYSTEM ACTIVATED")
                open("statusfile", "w").write("10")
                os._exit(10)


def launch():
    burglar_detect = Thread(target=antitheft_main)
    burglar_detect.start()
