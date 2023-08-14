import sqlite3, os
import time
from typing import Optional
# from json import dumps, loads
import json
from utils import *


DB_FILENAME = 'Vending.sqlite'
pathexist = os.path.exists(DB_FILENAME)
print("pathexist", pathexist)
conn = sqlite3.connect(DB_FILENAME, check_same_thread=False)
c = conn.cursor()

if not pathexist:
    print("PATH DOES NOT EXIST!")
    c.execute("""CREATE TABLE Vending (
            refcode integer,
            drink_name text,
            price integer,
            slot text,
            stock text,
            redeemcodes text
        )""")
    # redeemcodes shall be a JSON encoded dict.
    # structure (TS format): (note that its a list)
    # {redeem: string, timestamp: string, slot: int}[]

    Initial_stock = [
        ('1', 'Coca-cola', '1.5', '1, 2, 3, 4, 5, 6', '3, 2, 6, 4, 7, 6', "[]"),
        ('2', 'Sprite', '1.7', '7, 8, 9, 10, 11', '2, 5, 3, 5, 6', "[]"),
        ('3', 'A&W', '1.8', '12, 13, 14, 15, 16, 17', '3, 2, 5, 4, 2, 3,', "[]"),
        ('4', 'Fanta_Grape', '1.2', '18, 19, 20, 21, 22, 23', '2, 5, 4, 3, 2, 5', "[]"),
        ('5', 'Ice_Lemon_Tea', '1.8', '24, 25, 26, 27, 28, 29, 30', '3, 2, 6, 4, 3, 5, 7', "[]"),
        ('6', 'Coke_Zero', '1.7', '31, 32, 33, 34, 35, 36, 37, 38', '3, 5, 2, 6, 3, 4, 5, 2', "[]"),
        ('7', '7-up', '1.4', '39, 40, 41, 42, 43, 44, 45', '6, 6, 7, 4, 3, 2, 6', "[]"),
        ("8", "Water", "0.9", "46, 47", "1, 1", "[]")
    ]

    c.executemany("INSERT INTO Vending Values(?,?,?,?,?,?)", Initial_stock)

    conn.commit()

c.execute("Select * FROM Vending")
print(c.fetchall())
print("Successful execution")


def get_all_not_deserialised() -> list:
    c.execute("Select * FROM Vending")
    results = c.fetchall()
    return results


def get_item(refcode: int, exclude_redeems: bool=False) -> Optional[dict]:
    """
    Gets an item based on its refcode.
    :param refcode: refcode of the item, an int.
    :return: a dictionary representing the item's structure.
        Keys available: refcode (int), name (str), price (float), slots (list)

    """

    cu = conn.cursor()
    print("rc", str(refcode))

    cu.execute("SELECT * FROM Vending WHERE refcode=?", [str(refcode)])
    try:
        results = cu.fetchall()[0]
    except Exception as e:
        print("Exception occurred", e)
        return None
    items = {
        "refcode": results[0],
        "name": results[1],
        "price": results[2],
    }
    print("Results,", results)
    try:
        slots = deserialise_ints(results[3])
    except Exception as e:
        print("Exception occurred, cannot deserialise", e)
        return None
    items["slots"] = slots
    try:
        stock = deserialise_ints(results[4])
    except Exception as e:
        print("Exception occurred, cannot deserialise", e)
        return None
    items["stock"] = stock
    try:
        redeemcodes = json.loads(results[5])
        if type(redeemcodes) == list:
            items["redeemcodes"] = redeemcodes

        else:
            raise Exception("redeemcode is not a list!")
        if not exclude_redeems:
            for redeemcode in redeemcodes:
                # {redeem: string, timestamp: string}
                slot = redeemcode["slot"]
                timestamp = redeemcode["timestamp"]
                time_int = int(timestamp)
                curr_time = int(time.time())
                diff = curr_time - time_int
                if diff < 86400:
                    # less than 24 h
                    try:
                        stock[slots.index(slot)] -= 1
                    except ValueError:
                        continue  # just ignore this and leave it as it is.


    except Exception as e:
        print("Exception occurred, cannot deserialise", e)
        return None
    items["stock"] = stock
    return items


def update_stock(refcode: int, difference: int, slot: int):
    item = get_item(refcode)
    stock = item["stock"]
    slots = item["slots"]
    index = slots.index(slot)
    stock[index] += difference

    update_dict = {"stock": stock}
    update_item(refcode, update_dict)


def update_item(refcode: int, new_item: dict):
    cu = conn.cursor()

    sql = "UPDATE Vending SET "
    binding = []
    if "name" in new_item:
        sql += "drink_name=? , "
        binding.append(new_item["name"])

    if "price" in new_item:
        sql += "price=? , "
        binding.append(new_item["price"])

    if "slot" in new_item:
        sql += "slot=? , "
        binding.append(serialise_ints(new_item["slots"]))

    if "stock" in new_item:
        sql += "stock=? , "
        binding.append(serialise_ints(new_item["stock"]))

    if "redeemcodes" in new_item:
        sql += "redeemcodes=?, "
        binding.append(json.dumps(new_item["redeemcodes"]))

    if len(binding) == 0:
        return None

    sql = sql.strip(", ")
    sql += " WHERE refcode=?"
    binding.append(refcode)

    print("SQL QUERY", sql, binding)
    cu.execute(sql, binding)
    conn.commit()


def choose_slot(refcode: int) -> Optional[int]:
    item = get_item(refcode)
    print("Item chosen", item)
    slots = item["slots"]
    stocks = item["stock"]
    try:
        print(stocks)
        if sum(stocks) <= 0:
            return None
    except:
        return None
    redeemcodes = item["redeemcodes"]
    # {redeem: string, timestamp: string, slot: int}[]

    slot = None
    rc_slots = {}
    for rc in redeemcodes:
        if rc_slots.get(rc.get("slot")) is None:
            rc_slots[rc.get("slot")] = 1
        else:
            rc_slots[rc.rc.get("slot")] += 1

    for index in range(len(slots)):
        ru = rc_slots.get(slots[index])
        if ru is None:
            ru = 0
        usable = slots[index] - ru
        if usable != 0:
            slot = slots[index]
            break

    return slot


# def add_to(refcode)


# For debug
if __name__ == "__main__":
    while True:
        exec(input(">>>"))
