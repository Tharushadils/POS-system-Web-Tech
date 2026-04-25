import { Customer } from '../model/Customer.js';
import { customerTable } from '../db/database.js';

const txtCusId = document.getElementById('txtCusId');
const txtCusName = document.getElementById('txtCusName');
const txtCusAddress = document.getElementById('txtCusAddress');
const txtCusSalary = document.getElementById('txtCusSalary');

const btnSave = document.getElementById('btnSaveCustomer');
const btnUpdate = document.getElementById('btnUpdateCustomer');
const btnDelete = document.getElementById('btnDeleteCustomer');
const btnClear = document.getElementById('btnClearCustomer');
const btnSearch = document.getElementById('btnSearchCustomer');
const txtSearch = document.getElementById('txtSearchCustomer');

const tableBody = document.getElementById('customerTableBody');

// regex 
const idPattern = /^C\d{3}$/;
const namePattern = /^[A-Za-z ]+$/;
const addressPattern = /^[A-Za-z0-9 ,.-]+$/;
const salaryPattern = /^\d+(\.\d{2})?$/;

// load all customers
loadAllCustomers();

function validateCustomer() {
    let isValid = true;

    if (!idPattern.test(txtCusId.value)) {
        txtCusId.classList.add('is-invalid');
        isValid = false;
    } else {
        txtCusId.classList.remove('is-invalid');
    }

    if (!namePattern.test(txtCusName.value)) {
        txtCusName.classList.add('is-invalid');
        isValid = false;
    } else {
        txtCusName.classList.remove('is-invalid');
    }

    if (!addressPattern.test(txtCusAddress.value)) {
        txtCusAddress.classList.add('is-invalid');
        isValid = false;
    } else {
        txtCusAddress.classList.remove('is-invalid');
    }

    if (!salaryPattern.test(txtCusSalary.value)) {
        txtCusSalary.classList.add('is-invalid');
        isValid = false;
    } else {
        txtCusSalary.classList.remove('is-invalid');
    }

    return isValid;
}

// Clear 
function clearForm() {
    txtCusId.value = '';
    txtCusName.value = '';
    txtCusAddress.value = '';
    txtCusSalary.value = '';
    
    txtCusId.classList.remove('is-invalid');
    txtCusName.classList.remove('is-invalid');
    txtCusAddress.classList.remove('is-invalid');
    txtCusSalary.classList.remove('is-invalid');
    
    txtCusId.focus();
}

// Load Table
export function loadAllCustomers() {
    tableBody.innerHTML = '';
    customerTable.forEach(c => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.address}</td>
            <td>${c.salary}</td>
        `;
       //pop-up
        tr.addEventListener('click', () => {
            txtCusId.value = c.id;
            txtCusName.value = c.name;
            txtCusAddress.value = c.address;
            txtCusSalary.value = c.salary;
        });
        tableBody.appendChild(tr);
    });
}

// Save
btnSave.addEventListener('click', () => {
    if (validateCustomer()) {
        const id = txtCusId.value;
        
        if (customerTable.find(c => c.id === id)) {
            alert('Customer ID already exists!');
            return;
        }
        
        let customer = new Customer(id, txtCusName.value, txtCusAddress.value, txtCusSalary.value);
        customerTable.push(customer);

        alert('Customer saved successfully');
        clearForm();
        loadAllCustomers();
        
        import('./OrderController.js').then(module => module.loadCustomerCombo());
    } else {
        alert('Please fix validation errors before saving.');
    }
});

// Update
btnUpdate.addEventListener('click', () => {
    if (validateCustomer()) {
        const id = txtCusId.value;
        let index = customerTable.findIndex(c => c.id === id);
        
        if (index > -1) {
            customerTable[index].name = txtCusName.value;
            customerTable[index].address = txtCusAddress.value;
            customerTable[index].salary = txtCusSalary.value;
            
            alert('Customer updated successfully');
            clearForm();
            loadAllCustomers();
        } else {
            alert('Customer not found!');
        }
    }
});

// Delete
btnDelete.addEventListener('click', () => {
    const id = txtCusId.value;
    if (!id) return;
    
    let result = confirm("Are you sure?\nYou won't be able to revert this!");

if (result) {
    let index = customerTable.findIndex(c => c.id === id);

    if (index > -1) {
        customerTable.splice(index, 1);
        alert('Customer deleted successfully');
        clearForm();
        loadAllCustomers();

        import('./OrderController.js')
            .then(module => module.loadCustomerCombo());
    } else {
        alert('Customer not found!');
    }
}
});

// Clear
btnClear.addEventListener('click', clearForm);

// Search
btnSearch.addEventListener('click', () => {
    const term = txtSearch.value.toLowerCase().trim();
    if (!term) {
        loadAllCustomers();
        return;
    }
    
    tableBody.innerHTML = '';
    const filtered = customerTable.filter(c => 
        c.id.toLowerCase().includes(term) || 
        c.name.toLowerCase().includes(term)
    );
    
    filtered.forEach(c => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.address}</td>
            <td>${c.salary}</td>
        `;
        tr.addEventListener('click', () => {
            txtCusId.value = c.id;
            txtCusName.value = c.name;
            txtCusAddress.value = c.address;
            txtCusSalary.value = c.salary;
        });
        tableBody.appendChild(tr);
    });
});
