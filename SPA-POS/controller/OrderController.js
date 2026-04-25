import { customerTable, itemTable, orderTable, orderDetailsTable } from '../db/database.js';
import { Order } from '../model/Order.js';
import { OrderDetail } from '../model/OrderDetail.js';

const txtOrderId = document.getElementById('txtOrderId');
const txtOrderDate = document.getElementById('txtOrderDate');
const cmbOrderCustomerId = document.getElementById('cmbOrderCustomerId');
const txtOrderCustomerName = document.getElementById('txtOrderCustomerName');

const cmbOrderItemCode = document.getElementById('cmbOrderItemCode');
const txtOrderItemDesc = document.getElementById('txtOrderItemDesc');
const txtOrderItemPrice = document.getElementById('txtOrderItemPrice');
const txtOrderItemQtyOnHand = document.getElementById('txtOrderItemQtyOnHand');
const txtOrderQty = document.getElementById('txtOrderQty');
const btnAddToCart = document.getElementById('btnAddToCart');

const cartTableBody = document.getElementById('cartTableBody');
const lblTotal = document.getElementById('lblTotal');
const lblSubTotal = document.getElementById('lblSubTotal');

const txtCash = document.getElementById('txtCash');
const txtDiscount = document.getElementById('txtDiscount');
const txtBalance = document.getElementById('txtBalance');
const btnPlaceOrder = document.getElementById('btnPlaceOrder');

const txtSearchOrder = document.getElementById('txtSearchOrder');
const btnSearchOrder = document.getElementById('btnSearchOrder');

let cart = [];
let netTotal = 0;

initOrderForm();

export function loadCustomerCombo() {
    cmbOrderCustomerId.innerHTML = '<option value="">Select Customer</option>';
    customerTable.forEach(c => {
        let opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.id;
        cmbOrderCustomerId.appendChild(opt);
    });
}

export function loadItemCombo() {
    cmbOrderItemCode.innerHTML = '<option value="">Select Item</option>';
    itemTable.forEach(i => {
        let opt = document.createElement('option');
        opt.value = i.code;
        opt.textContent = i.code;
        cmbOrderItemCode.appendChild(opt);
    });
}

function generateOrderId() {
    if (orderTable.length === 0) {
        return "OD-001";
    }
    const lastOrderId = orderTable[orderTable.length - 1].orderId;
    const split = lastOrderId.split("-");
    const num = parseInt(split[1]) + 1;
    return `OD-${String(num).padStart(3, '0')}`;
}

function initOrderForm() {
    txtOrderId.value = generateOrderId();
    
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    txtOrderDate.value = formattedDate;

    loadCustomerCombo();
    loadItemCombo();

    clearItemFields();
    txtOrderCustomerName.value = '';
    cmbOrderCustomerId.value = '';
    cart = [];
    updateCartTable();
    txtCash.value = '';
    txtDiscount.value = '';
    txtBalance.value = '';
}

cmbOrderCustomerId.addEventListener('change', () => {
    const id = cmbOrderCustomerId.value;
    const customer = customerTable.find(c => c.id === id);
    if (customer) {
        txtOrderCustomerName.value = customer.name;
    } else {
        txtOrderCustomerName.value = '';
    }
});

cmbOrderItemCode.addEventListener('change', () => {
    const code = cmbOrderItemCode.value;
    const item = itemTable.find(i => i.code === code);
    if (item) {
        txtOrderItemDesc.value = item.description;
        txtOrderItemPrice.value = item.price;
        txtOrderItemQtyOnHand.value = item.qtyOnHand;
    } else {
        clearItemFields();
    }
});

function clearItemFields() {
    cmbOrderItemCode.value = '';
    txtOrderItemDesc.value = '';
    txtOrderItemPrice.value = '';
    txtOrderItemQtyOnHand.value = '';
    txtOrderQty.value = '';
}

btnAddToCart.addEventListener('click', () => {
    const itemCode = cmbOrderItemCode.value;
    const qty = parseInt(txtOrderQty.value);
    
    if (!itemCode) {
        alert('Please select an item');
        return;
    }
    
    if (isNaN(qty) || qty <= 0) {
        alert('Please enter a valid quantity'); 
        return;
    }

    const item = itemTable.find(i => i.code === itemCode);
    
    let qtyInCart = 0;
    const existingItem = cart.find(c => c.itemCode === itemCode);
    if (existingItem) {
        qtyInCart = existingItem.qty;
    }

    if (qty + qtyInCart > item.qtyOnHand) {
        alert(`Only ${item.qtyOnHand - qtyInCart} units available in stock`);
        return;
    }

    if (existingItem) {
        existingItem.qty += qty;
        existingItem.total = existingItem.qty * parseFloat(item.price);
    } else {
        cart.push({
            itemCode: itemCode,
            description: item.description,
            price: item.price,
            qty: qty,
            total: qty * parseFloat(item.price)
        });
    }

    updateCartTable();
    clearItemFields();
});

function updateCartTable() {
    cartTableBody.innerHTML = '';
    netTotal = 0;

    cart.forEach((c, index) => {
        netTotal += c.total;
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.itemCode}</td>
            <td>${c.description}</td>
            <td>${parseFloat(c.price).toFixed(2)}</td>
            <td>${c.qty}</td>
            <td>${parseFloat(c.total).toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button></td>
        `;
        cartTableBody.appendChild(tr);
    });

    calculateTotal();
}

window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartTable();
}

function calculateTotal() {
    let discount = parseFloat(txtDiscount.value) || 0;
    let subTotal = netTotal - (netTotal * (discount / 100));
    
    lblTotal.innerText = netTotal.toFixed(2);
    lblSubTotal.innerText = subTotal.toFixed(2);

    calculateBalance();
}

function calculateBalance() {
    let subTotal = parseFloat(lblSubTotal.innerText) || 0;
    let cash = parseFloat(txtCash.value) || 0;
    
    if (txtCash.value) {
        txtBalance.value = (cash - subTotal).toFixed(2);
    } else {
        txtBalance.value = '';
    }
}

txtDiscount.addEventListener('keyup', calculateTotal);
txtCash.addEventListener('keyup', calculateBalance);

btnPlaceOrder.addEventListener('click', () => {
    if (!cmbOrderCustomerId.value) {
        alert('Please select a customer');
        return;
    }
    
    if (cart.length === 0) {
        alert('Cart is empty. Please add items.');
        return;
    }

    const cash = parseFloat(txtCash.value) || 0;
    const subTotal = parseFloat(lblSubTotal.innerText) || 0;

    if (cash < subTotal) {
        alert('Insufficient Cash!');
        return;
    }

    let order = new Order(
        txtOrderId.value,
        txtOrderDate.value,
        cmbOrderCustomerId.value,
        parseFloat(txtDiscount.value) || 0,
        subTotal
    );
    orderTable.push(order);

    cart.forEach(c => {
        let detail = new OrderDetail(order.orderId, c.itemCode, c.qty, c.price, c.total);
        orderDetailsTable.push(detail);

        let item = itemTable.find(i => i.code === c.itemCode);
        if (item) {
            item.qtyOnHand -= c.qty;
        }
    });

    alert('Order Placed Successfully!');
    
    import('./ItemController.js').then(module => module.loadAllItems());
    
    initOrderForm();
});

btnSearchOrder.addEventListener('click', () => {
    const searchId = txtSearchOrder.value.trim();
    if (!searchId) return;

    const order = orderTable.find(o => o.orderId === searchId);
    if (order) {
        txtOrderId.value = order.orderId;
        txtOrderDate.value = order.date;
        cmbOrderCustomerId.value = order.customerId;

        const event = new Event('change');
        cmbOrderCustomerId.dispatchEvent(event);

        txtDiscount.value = order.discount;
        lblTotal.innerText = 'Search Mode'; 
        lblSubTotal.innerText = parseFloat(order.total).toFixed(2);
        
        cartTableBody.innerHTML = '';
        const details = orderDetailsTable.filter(d => d.orderId === order.orderId);
        details.forEach(d => {
            const item = itemTable.find(i => i.code === d.itemCode);
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${d.itemCode}</td>
                <td>${item ? item.description : 'Unknown'}</td>
                <td>${parseFloat(d.unitPrice).toFixed(2)}</td>
                <td>${d.qty}</td>
                <td>${parseFloat(d.total).toFixed(2)}</td>
                <td><span class="badge bg-secondary">Archived</span></td>
            `;
            cartTableBody.appendChild(tr);
        });

        btnPlaceOrder.disabled = true;
        btnAddToCart.disabled = true;

        alert('Order details loaded.');
    } else {
        alert('Order ID does not exist');

        btnPlaceOrder.disabled = false;
        btnAddToCart.disabled = false;
        initOrderForm();
    }
});
