export interface VendingItem {
    name: string
    refcode: number
    slotStock: SlotStock[],
    price: number

}

export type SlotStock = {
    slot: number,
    stock: number
}


export function getTotalStock(vendingItem: VendingItem): number {
    let stock = 0
    for (const ss of vendingItem.slotStock) {
        stock += ss.stock
    }
    return stock
}
