import {checkStock, findSlot, getInv, OrderReq, placeOrder} from "../interfacing/pi";

export type SlotStock = {
    slot: number,
    stock: number
}
export type VendingItem = {
    name: string
    refcode: number
    slotStock: SlotStock[],
    price: number
}

abstract class VendingDataProvider {
    abstract getItem(refcode: number): Promise<VendingItem|undefined>
    // abstract getItemBySlot(slot: number): Promise<VendingItem|undefined>
    // abstract changeStockBy(vendingItem: VendingItem, slot: number, by: number): Promise<void>
    abstract placeOrder(order: OrderReq): Promise<string|null>
    abstract findSlot(refcode: number): Promise<number|null>
    abstract getAllItems(): Promise<VendingItem[]>
}

class PiVendingProvider extends VendingDataProvider {


    async getItem(refcode: number): Promise<VendingItem | undefined> {
        const stockReq = await checkStock(refcode)
        if (!stockReq) {return undefined}
        if (stockReq.stock.length !== stockReq.slots.length) {
            return undefined
        }
        const sss: SlotStock[] = []
        for (let i=0; i<stockReq.stock.length; i++) {
            sss.push({
                slot: Number(stockReq.slots[i]),
                stock: Number(stockReq.stock[i])
            })
        }
        const vendingItem: VendingItem = {
            name: stockReq.name,
            price: stockReq.price,
            refcode: Number(stockReq.refcode),
            slotStock: sss
        }
        console.log(vendingItem)
        return vendingItem
    }


    async placeOrder(order: OrderReq): Promise<string | null> {
        return placeOrder(order.refcode, order.slot)
    }

    async findSlot(refcode: number): Promise<number | null> {
        return findSlot(refcode)
    }

    async getAllItems(): Promise<VendingItem[]> {
        return getInv()
    }
}
//
// class MockVendingProvider extends VendingDataProvider {
//     inventory: VendingItem[] = [
//         {
//             "refcode": 1,
//             "name": "Coca-Cola",
//             "slotStock": [{slot: 1, stock: 5}, {slot: 2, stock: 7}, {slot: 3, stock: 4}],
//             "price": 1.50
//         },
//         {
//             "refcode": 2,
//             "name": "Sprite",
//             "slotStock": [{slot: 4, stock: 1}, {slot: 5, stock: 1}, {slot: 6, stock: 1}],
//             "price": 1.25
//         },
//         {
//             "refcode": 3,
//             "name": "Fanta",
//             "slotStock": [{slot: 7, stock: 5}, {slot: 8, stock: 7}, {slot: 9, stock: 4}],
//             "price": 1.30
//         },
//         {
//             "refcode": 4,
//             "name": "Pepsi",
//             "slotStock": [{slot: 10, stock: 5}, {slot: 11, stock: 7}, {slot: 12, stock: 4}],
//             "price": 1.20
//         },
//     ]
//
// async     getItem(refcode: number): Promise<VendingItem > {
//         return this.inventory[refcode]
//     }
//
//
// async     getItemBySlot(slot: number): Promise<VendingItem|undefined > {
//         return this.inventory.find((value) => {
//             return value.slotStock.find((slotStock) => {
//                 return slotStock.slot == slot
//             })
//         })
//     }
//
//     async changeStockBy(vendingItem: VendingItem, slot: number, by: number): Promise<void> {
//         const item = this.inventory[vendingItem.refcode]
//         if (item === undefined) {return}
//         item.slotStock.find((val) => val?.slot == slot)!!.stock += 1
//         return
//     }
//
//
// async     findSlot(refcode: number): Promise<number|null > {
//         const item = this.inventory[refcode]
//         if (item === undefined) {
//             return null
//         }
//         return item.slotStock.find((ss) => ss.stock > 0)?.slot ?? null
//     }
//
// async     getAllItems(): Promise<VendingItem[] > {
//         return this.inventory
//     }
// }

module.exports = { VendingDataProvider, PiVendingProvider }
