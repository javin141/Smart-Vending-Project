import sqlite3, os
from utils import *

DB_FILENAME = 'Vending.sqlite'
conn = sqlite3.connect(DB_FILENAME)
c = conn.cursor()

if not os.path.exists(DB_FILENAME):
    print("PATH DOES NOT EXIST!")
    c.execute("""CREATE TABLE Vending (
            refcode integer,
            drink_name text,
            price integer,
            slot text
            stock text
        )""")

    Initial_stock = [
                        ('0001','Coca-cola','1.5','1,2,3,4,5,6','3,2,6,4,7,6'),
                        ('0002','Sprite','1.7','7,8,9,10,11','2,5,3,5,6'),
                        ('0003','A&W','1.8','12,13,14,15,16,17','3,2,5,4,2,3,'),
                        ('0004','Fanta_Grape','1.2','18,19,20,21,22,23','2,5,4,3,2,5'),
                        ('0005','Ice_Lemon_Tea','1.8','24,25,26,27,28,29,30','3,2,6,4,3,5,7'),
                        ('0006','Coke_Zero','1.7','31,32,33,34,35,36,37,38''3,5,2,6,3,4,5,2'),
                        ('0007','7-up','1.4','39,40,41,42,43,44,45','6,6,7,4,3,2,6')
    ]

    c.executemany("INSERT INTO Vending Values (?,?,?,?,?)", Initial_stock)


    conn.commit()
c.execute("Select * FROM Vending")
print(c.fetchall())
print("Successful execution")
def get_item(refcode: int) -> dict:
    """
    Gets an item based on its refcode.
    :param refcode: refcode of the item, an int.
    :return: a dictionary representing the item's structure.
        Keys available: refcode (int), name (str), price (float), slots (list)

    """

    cu = conn.cursor()
    cu.execute("SELECT * FROM Vending WHERE refcode=?", str(refcode))
    results = cu.fetchall()[0]
    items = {
        "refcode": results[0],
        "name": results[1],
        "price": results[2],
        }

    slots = deserialise_ints(results[3])
    items["slots"] = slots
    
    stock = deserialise_ints(results[4])
    items["stock"] = stock
    return items
    

def update_item(refcode: int, new_item: dict):
    cu = conn.cursor()

    sql = "UPDATE Vending SET "
    binding = []
    if "name" in new_item:
        sql += "name=? , "
        binding.append(new_item["name"])

    if "price" in new_item:
        sql += "price=? , "
        binding.append(new_item["price"])

    if "slot" in new_item:
        sql += "slot=? , "
        binding.append(serialise_ints(new_item["slot"]))

    if "stock" in new_item:
        sql += "stock=? , "
        binding.append(serialise_ints(new_item["stock"]))

    if len(binding) == 0:
        return None

    sql = sql.strip(", ")
    sql += " WHERE refcode=?"
    binding.append(refcode)

    print("SQL QUERY", sql, binding)
    cu.execute(sql, binding)


def choose_slot(refcode: int) -> int|NoneType:
    item = get_item(refcode)
    slots = item["slot"]
    slot = None
    for i in slots:
        if i != 0:
            slot = i
            break
    return slot
# def add_to(refcode)

"""
# For debug
while True:
    exec(input(">>>"))
    """
