import sqlite3, os
from utils import *

DB_FILENAME = 'Vending.sqlite'
conn = sqlite3.connect(DB_FILENAME)
c = conn.cursor()

if not os.path.exists(DB_FILENAME):

    c.execute("""CREATE TABLE Vending (
            refcode integer,
            drink_name text,
            price integer,
            slot text
        )""")

    Initial_stock = [
                        ('0001','Coca-cola','1.5','1,2,3,4,5,6'),
                        ('0002','Sprite','1.7','7,8,9,10,11'),
                        ('0003','A&W','1.8','12,13,14,15,16,17'),
                        ('0004','Fanta_Grape','1.2','18,19,20,21,22,23'),
                        ('0005','Ice_Lemon_Tea','1.8','24,25,26,27,28,29,30'),
                        ('0006','Coke_Zero','1.7','31,32,33,34,35,36,37,38'),
                        ('0007','7-up','1.4','39,40,41,42,43,44,45')
    ]

    c.executemany("INSERT INTO Vending Values (?,?,?,?)", Initial_stock)


    conn.commit()
c.execute("Select * FROM Vending")
print(c.fetchall())
print("Successful execution")
def get_item(refcode: int) -> dict:

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


    ''' UPDATE tasks
              SET priority = ? ,
                  begin_date = ? ,
                  end_date = ?
              WHERE id = ?'''

# def add_to(refcode)


while True:
    exec(input(">>>"))
