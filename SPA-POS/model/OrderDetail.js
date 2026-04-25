export class OrderDetail {
    constructor(orderId, itemCode, qty, unitPrice, total) {
        this.orderId = orderId;
        this.itemCode = itemCode;
        this.qty = qty;
        this.unitPrice = unitPrice;
        this.total = total;
    }
}
