type SlotStock = {
    slot: number,
    stock: number
}
type VendingItem = {
    name: string
    refcode: number
    slotStock: SlotStock[],
    price: number
}

abstract class VendingDataProvider {
    abstract getItem(refcode: number): VendingItem
    abstract getItemBySlot(slot: number): VendingItem
    abstract changeStockBy(vendingItem: VendingItem, slot: number, by: number)
    abstract findSlot(refcode: number): number
}

class MockVendingProvider extends VendingDataProvider {
    inventory: VendingItem[] = [
        {
            "refcode": 1,
            "name": "Coca-Cola",
            "slotStock": [{slot: 1, stock: 5}, {slot: 2, stock: 7}, {slot: 3, stock: 4}],
            "price": 1.50
        },
        {
            "refcode": 2,
            "name": "Sprite",
            "slotStock": [{slot: 4, stock: 5}, {slot: 5, stock: 7}, {slot: 6, stock: 4}],
            "price": 1.25
        },
        {
            "refcode": 3,
            "name": "Fanta",
            "slotStock": [{slot: 7, stock: 5}, {slot: 8, stock: 7}, {slot: 9, stock: 4}],
            "price": 1.30
        },
        {
            "refcode": 4,
            "name": "Pepsi",
            "slotStock": [{slot: 10, stock: 5}, {slot: 11, stock: 7}, {slot: 12, stock: 4}],
            "price": 1.20
        },
    ]

    getItem(refcode: number): VendingItem {
        return this.inventory[refcode]
    }


    getItemBySlot(slot: number): VendingItem {
        return this.inventory.find((value) => {
            return value.slotStock.find((slotStock) => {
                return slotStock.slot == slot
            })
        })
    }

    changeStockBy(vendingItem: VendingItem, slot: number, by: number) {
        this.inventory[vendingItem.refcode]
            .slotStock.find((val) => val.slot == slot).stock += 1
    }


    findSlot(refcode: number): number {
        return this.inventory[refcode].slotStock.find((ss) => ss.stock > 0).slot ?? null
    }
}

module.exports = { VendingDataProvider, MockVendingProvider }
