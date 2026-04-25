export class Order {
    constructor(orderId, date, customerId, discount, total) {
        this.orderId = orderId;
        this.date = date;
        this.customerId = customerId;
        this.discount = discount;
        this.total = total;
    }
}
