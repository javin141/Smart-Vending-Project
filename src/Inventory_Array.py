import sqlite3

conn = sqlite3.connect('Vending.sqlite')

c = conn.cursor()

c.execute("""CREATE TABLE inventory (
        refcode integer,
        drink_name text,
        price integer
    )""")

Initial_stock = [ 
                    ('0001','Coca-cola','1.5'),
                    ('0002','Sprite','1.7'),
                    ('0003','A&W','1.8'),
                    ('0004','Fanta_Grape','1.2'),
                    ('0005','Ice_Lemon_Tea','1.8'),
                    ('0006','Coke_Zero','1.7'),
                    ('0007','7-up','1.4')
]

c.executemany("INSERT INTO Vending Values (?,?,?)", Initial_stock)

c.execute("Select * FROM Vending")
print(c.fetchall())
print("Successful execution")
conn.commit()
conn.close()