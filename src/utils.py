from hal import hal_buzzer
def serialise_ints(ints: list[int]) -> str:
    return ",".join(str(x) for x in ints)

def deserialise_ints(ser: str) -> list[int]:
    return [int(x) for x in ser.split(",")]


def alert_when_exception():
    hal_buzzer.init()
    hal_buzzer.beep(1, 1, 4)
