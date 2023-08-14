import os
try:
    os.remove("Vending.sqlite")
    os.remove("../Vending.sqlite")
except OSError:
    pass

from Inventory_Array import get_item, update_item, get_all_not_deserialised, update_stock, choose_slot


def test_get_all():
    correct = [(1, 'Coca-cola', 1.5, '1, 2, 3, 4, 5, 6', '3, 2, 6, 4, 7, 6', '[]'), (2, 'Sprite', 1.7, '7, 8, 9, 10, 11', '2, 5, 3, 5, 6', '[]'),
     (3, 'A&W', 1.8, '12, 13, 14, 15, 16, 17', '3, 2, 5, 4, 2, 3,', '[]'), (4, 'Fanta_Grape', 1.2, '18, 19, 20, 21, 22, 23', '2, 5, 4, 3, 2, 5', '[]'), (5, 'Ice_Lemon_Tea', 1.8, '24, 25, 26, 27, 28, 29, 30', '3, 2, 6, 4, 3, 5, 7', '[]'), (6, 'Coke_Zero', 1.7, '31, 32, 33, 34, 35, 36, 37, 38', '3, 5, 2, 6, 3, 4, 5, 2', '[]'), (7, '7-up', 1.4, '39, 40, 41, 42, 43, 44, 45', '6, 6, 7, 4, 3, 2, 6', '[]'), (8, 'Water', 0.9, '46, 47', '1, 1', '[]')]

    all = get_all_not_deserialised()
    assert correct == all

def test_get_des():
    correct = {'refcode': 1, 'name': 'Coca-cola', 'price': 1.5, 'slots': [1, 2, 3, 4, 5, 6], 'stock': [3, 2, 6, 4, 7, 6],
     'redeemcodes': []}
    item = get_item(1)
    assert correct == item


def test_update():
    to_update = {'refcode': 1, 'name': 'Coke', 'price': 15, 'slots': [99,133,134,156,178], 'stock': [3, 2, 6, 9, 8],
     'redeemcodes': []}
    update_item(1, to_update)



