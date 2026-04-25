import { customerTable, itemTable, orderTable } from '../db/database.js';

export function initDashboard() {
    document.getElementById('lblTotalCustomers').innerText = customerTable.length;
    document.getElementById('lblTotalItems').innerText = itemTable.length;
    document.getElementById('lblTotalOrders').innerText = orderTable.length;

    const tbody = document.getElementById('recentOrdersTableBody');
    tbody.innerHTML = '';

    //last 5 orders
    const recentOrders = [...orderTable].reverse().slice(0, 5);

    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No recent orders found.</td></tr>';
    }

    recentOrders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.customerId}</td>
            <td>${order.date}</td>
            <td>Rs. ${parseFloat(order.total).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}
