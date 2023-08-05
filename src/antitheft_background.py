from threading import Thread

from hal import hal_adc

hal_adc.init()

bypass = False
THRESHOLD = 400  # TODO we need to calibrate this!
POT_CHANNEL = 1  # 0 <= adc <= 1023


def toggle_bypass() -> bool:
    global bypass
    bypass = not bypass
    return bypass


def antitheft_main():
    while True:
        if not bypass:
            if hal_adc.get_adc_value(POT_CHANNEL) > THRESHOLD:
                # Security breached.
                # Launch burglar program (coordinated by Tao's shell script) (status code 10)
                print("BURGLAR SYSTEM ACTIVATED")
                exit(10)  # The entire program will intentionally exit with a status code of 10


burglar_detect = Thread(target=antitheft_main)
burglar_detect.start()
