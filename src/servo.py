import RPi.GPIO as GPIO
from time import sleep

def servo_init():
    GPIO.setmode(GPIO.BCM)  # choose BCM mode
    GPIO.setwarnings(False)
    GPIO.setup(26, GPIO.OUT)  # set GPIO 26 as output

# position [0 deg to 180 deg]
def set_servo_position(position):
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(26, GPIO.OUT)
    PWM = GPIO.PWM(26, 50)  # set 50Hz PWM output at GPIO26

    position = (-10 * position) / 180 + 12

    print("position = " + str(position))

    PWM.start(position)
    sleep(0.05)
    PWM.stop()
    GPIO.cleanup()
