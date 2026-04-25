import { Item } from '../model/Item.js';
import { itemTable } from '../db/database.js';

const txtItemCode = document.getElementById('txtItemCode');
const txtItemDesc = document.getElementById('txtItemDesc');
const txtItemPrice = document.getElementById('txtItemPrice');
const txtItemQty = document.getElementById('txtItemQty');

const btnSave = document.getElementById('btnSaveItem');
const btnUpdate = document.getElementById('btnUpdateItem');
const btnDelete = document.getElementById('btnDeleteItem');
const btnClear = document.getElementById('btnClearItem');
const btnSearch = document.getElementById('btnSearchItem');
const txtSearch = document.getElementById('txtSearchItem');

const tableBody = document.getElementById('itemTableBody');

// Regex
const codePattern = /^I\d{3}$/;
const descPattern = /^[A-Za-z0-9 ,.-]+$/;
const pricePattern = /^\d+(\.\d{1,2})?$/;
const qtyPattern = /^\d+$/;

loadAllItems();

function validateItem() {
    let isValid = true;

    if (!codePattern.test(txtItemCode.value)) {
        txtItemCode.classList.add('is-invalid');
        isValid = false;
    } else {
        txtItemCode.classList.remove('is-invalid');
    }

    if (!descPattern.test(txtItemDesc.value)) {
        txtItemDesc.classList.add('is-invalid');
        isValid = false;
    } else {
        txtItemDesc.classList.remove('is-invalid');
    }

    if (!pricePattern.test(txtItemPrice.value) || parseFloat(txtItemPrice.value) <= 0) {
        txtItemPrice.classList.add('is-invalid');
        isValid = false;
    } else {
        txtItemPrice.classList.remove('is-invalid');
    }

    if (!qtyPattern.test(txtItemQty.value) || parseInt(txtItemQty.value) < 0) {
        txtItemQty.classList.add('is-invalid');
        isValid = false;
    } else {
        txtItemQty.classList.remove('is-invalid');
    }

    return isValid;
}

function clearForm() {
    txtItemCode.value = '';
    txtItemDesc.value = '';
    txtItemPrice.value = '';
    txtItemQty.value = '';
    
    txtItemCode.classList.remove('is-invalid');
    txtItemDesc.classList.remove('is-invalid');
    txtItemPrice.classList.remove('is-invalid');
    txtItemQty.classList.remove('is-invalid');
    
    txtItemCode.focus();
}

export function loadAllItems() {
    tableBody.innerHTML = '';
    itemTable.forEach(i => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i.code}</td>
            <td>${i.description}</td>
            <td>Rs. ${parseFloat(i.price).toFixed(2)}</td>
            <td>${i.qtyOnHand}</td>
        `;
        tr.addEventListener('click', () => {
            txtItemCode.value = i.code;
            txtItemDesc.value = i.description;
            txtItemPrice.value = i.price;
            txtItemQty.value = i.qtyOnHand;
        });
        tableBody.appendChild(tr);
    });
}

// Save
btnSave.addEventListener('click', () => {
    if (validateItem()) {
        const code = txtItemCode.value;
        if (itemTable.find(i => i.code === code)) {
            alert('Item Code already exists!');
            return;
        }
        
        let item = new Item(code, txtItemDesc.value, txtItemPrice.value, txtItemQty.value);
        itemTable.push(item);
        
        alert('Item saved successfully');
        clearForm();
        loadAllItems();
        
        import('./OrderController.js').then(module => module.loadItemCombo());
    } else {
        alert('Please check input fields');
    }
});

// Update
btnUpdate.addEventListener('click', () => {
    if (validateItem()) {
        const code = txtItemCode.value;
        let index = itemTable.findIndex(i => i.code === code);
        
        if (index > -1) {
            itemTable[index].description = txtItemDesc.value;
            itemTable[index].price = txtItemPrice.value;
            itemTable[index].qtyOnHand = txtItemQty.value;
            
            alert('Item updated successfully');
            clearForm();
            loadAllItems();
        } else {
            alert('Item not found!');
        }
    }
});

// Delete
btnDelete.addEventListener('click', () => {
    const code = txtItemCode.value;
    if (!code) return;
    
   let result = confirm("Are you sure? You won't be able to revert this!");

if (result) {
    let index = itemTable.findIndex(i => i.code === code);

    if (index > -1) {
        itemTable.splice(index, 1);

        alert("Item has been deleted.");

        clearForm();
        loadAllItems();

        import('./OrderController.js')
            .then(module => module.loadItemCombo());

    } else {
        alert("Error: Item not found!");
    }
} else {
    alert("Deletion cancelled.");
}
});


btnClear.addEventListener('click', clearForm);

// Search
btnSearch.addEventListener('click', () => {
    const term = txtSearch.value.toLowerCase().trim();
    if (!term) {
        loadAllItems();
        return;
    }
    
    tableBody.innerHTML = '';
    const filtered = itemTable.filter(i => 
        i.code.toLowerCase().includes(term) || 
        i.description.toLowerCase().includes(term)
    );
    
    filtered.forEach(i => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i.code}</td>
            <td>${i.description}</td>
            <td>Rs. ${parseFloat(i.price).toFixed(2)}</td>
            <td>${i.qtyOnHand}</td>
        `;
        tr.addEventListener('click', () => {
            txtItemCode.value = i.code;
            txtItemDesc.value = i.description;
            txtItemPrice.value = i.price;
            txtItemQty.value = i.qtyOnHand;
        });
        tableBody.appendChild(tr);
    });
});
