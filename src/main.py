import time
from threading import Thread
import queue

from hal import hal_led as led
from hal import hal_lcd as LCD
from hal import hal_adc as adc
from hal import hal_buzzer as buzzer
from hal import hal_keypad as keypad
from hal import hal_moisture_sensor as moisture_sensor
from hal import hal_input_switch as input_switch
from hal import hal_ir_sensor as ir_sensor
from hal import hal_rfid_reader as rfid_reader
from hal import hal_servo as servo
from hal import hal_temp_humidity_sensor as temp_humid_sensor
from hal import hal_usonic as usonic
from hal import hal_dc_motor as dc_motor

#Empty list to store sequence of keypad presses
shared_keypad_queue = queue.Queue()




#Call back function invoked when any key on keypad is pressed
def key_pressed(key):
    shared_keypad_queue.put(key)


def main():
    #initialization of HAL modules
    led.init()
    adc.init()
    buzzer.init()
  
    moisture_sensor.init()
    input_switch.init()
    ir_sensor.init()
    reader = rfid_reader.init()
    servo.init()
    temp_humid_sensor.init()
    usonic.init()
    dc_motor.init()

    keypad.init(key_pressed)
    keypad_thread = Thread(target=keypad.get_key)
    keypad_thread.start()

    lcd = LCD.lcd()
    lcd.lcd_clear()

    lcd.lcd_display_string("Mini-Project", 1)
    lcd.lcd_display_string("Dignostic Tests", 2)

    time.sleep(3)

    print("press 1 to test LED")
    print("press 2 to test potentiometer")
    print("press 3 to test buzzer")
    print("press 4 to test moizture sensor")
    print("press 5 to test ultrasonic sensor")  
    print("press 6 to test rfid reader") 
    print("press 7 to test LDR") 
    print("press 8 to test servo & DC motor") 
    print("press 9 to test temp & humidity")   

    while(True):
        lcd.lcd_clear()
        lcd.lcd_display_string("press any key!", 1)
     

        print("wait for key")
        keyvalue= shared_keypad_queue.get()

        print("key value ", keyvalue)
        

        if(keyvalue == 1): 
            lcd.lcd_display_string("key pressed "  +str(keyvalue), 1)
            lcd.lcd_display_string("LED TEST ", 2)
            led.set_output(1, 1)
            time.sleep(2)
            led.set_output(1, 0)
            time.sleep(2)

        elif (keyvalue == 2):
            pot_val = adc.get_adc_value(1)
            lcd.lcd_display_string("key pressed "  +str(keyvalue), 1)
            lcd.lcd_display_string("potval " +str(pot_val), 2)
            time.sleep(2)

        elif (keyvalue == 3):
            lcd.lcd_display_string("key pressed "  +str(keyvalue), 1)
            lcd.lcd_display_string("Buzzer TEST ", 2)
            buzzer.beep(0.5, 0.5, 1)

        elif (keyvalue == 4):
            lcd.lcd_display_string("key pressed "  +str(keyvalue), 1)
            sensor_val = moisture_sensor.read_sensor()
            lcd.lcd_display_string("moisture " +str(sensor_val), 2)
            time.sleep(2)

        elif (keyvalue == 5):
            lcd.lcd_display_string("key pressed "  +str(keyvalue), 1)            
            sensor_val = usonic.get_distance()
            lcd.lcd_display_string("distance " +str(sensor_val), 2)
            time.sleep(2)   

        elif (keyvalue == 6):
            lcd.lcd_display_string("key pressed "  +str(keyvalue), 1)           
            id = reader.read_id_no_block()
            id = str(id)
        
            if id != "None":
                print("RFID card ID = " + id)
                # Display RFID card ID on LCD line 2
                lcd.lcd_display_string(id, 2) 
            time.sleep(2)   

        elif (keyvalue == 7):
            lcd.lcd_display_string("key pressed "  +str(keyvalue), 1)            
            pot_val = adc.get_adc_value(0)
            lcd.lcd_display_string("LDR " +str(pot_val), 2)
            time.sleep(2)

        elif (keyvalue == 8):
            lcd.lcd_display_string("key pressed "  +str(keyvalue), 1)     
            lcd.lcd_display_string("servo/DC test ", 2)  
            servo.set_servo_position(20)
            time.sleep(1)  
            servo.set_servo_position(80)
            time.sleep(1)     
            servo.set_servo_position(120)
            time.sleep(1)            
            dc_motor.set_motor_speed(50)
            time.sleep(4)   
            dc_motor.set_motor_speed(0)
            time.sleep(2) 

        elif (keyvalue == 9):
            temperature, humidity = temp_humid_sensor.read_temp_humidity()
            lcd.lcd_display_string("Temperature "  +str(temperature), 1)  
            lcd.lcd_display_string("Humidity "  +str(humidity), 2) 
            time.sleep(2)  

        time.sleep(1)





if __name__ == '__main__':
    main()