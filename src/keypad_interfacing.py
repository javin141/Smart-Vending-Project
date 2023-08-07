from threading import Thread

from hal import hal_key_l

listeners = []

def register_listener(listener):
    listeners.append(listener)

def stop_listening(listener):
    listeners.remove(listener)

def interrupt_all():
    listeners.clear()

def callback(key):
    for listener in listeners:
        listener(key)

hal_key_l.init(callback)
thread = Thread(target=hal_key_l.get_key)
# Main thread for keypad interfacing
thread.start()