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
    abstract getItem(refcode: number): VendingItem|undefined
    abstract getItemBySlot(slot: number): VendingItem|undefined
    abstract changeStockBy(vendingItem: VendingItem, slot: number, by: number): void
    abstract findSlot(refcode: number): number|null
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


    getItemBySlot(slot: number): VendingItem|undefined {
        return this.inventory.find((value) => {
            return value.slotStock.find((slotStock) => {
                return slotStock.slot == slot
            })
        })
    }

    changeStockBy(vendingItem: VendingItem, slot: number, by: number) {
        const item = this.inventory[vendingItem.refcode]
        if (item === undefined) {return null}
        item.slotStock.find((val) => val?.slot == slot)!!.stock += 1
    }


    findSlot(refcode: number): number|null {
        const item = this.inventory[refcode]
        if (item === undefined) {
            return null
        }
        return item.slotStock.find((ss) => ss.stock > 0)?.slot ?? null
    }
}

module.exports = { VendingDataProvider, MockVendingProvider }
