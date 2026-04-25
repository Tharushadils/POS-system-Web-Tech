import { userTable } from '../db/database.js';
import { initDashboard } from './DashboardController.js';

const loginForm = document.getElementById('loginForm');
const txtUsername = document.getElementById('txtUsername');
const txtPassword = document.getElementById('txtPassword');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = txtUsername.value.trim();
    const password = txtPassword.value.trim();

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    const user = userTable.find(u => u.username === username && u.password === password);

    if (user) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        
        initDashboard();

        alert('Login successful!');
    } else {
        alert('Invalid username or password.');
    }
});
