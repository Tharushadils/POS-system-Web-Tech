import { initDashboard } from './DashboardController.js';

document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
    }
});

const navItems = document.querySelectorAll('.nav-item[data-target]');
const sections = document.querySelectorAll('.page-section');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        navItems.forEach(nav => nav.classList.remove('active'));
        
        item.classList.add('active');
    
        sections.forEach(sec => sec.style.display = 'none');

        const targetId = item.getAttribute('data-target');
        document.getElementById(targetId).style.display = 'block';

        if (targetId === 'dashboardSection') {
            initDashboard();
        }
    });
});

document.getElementById('btnLogout').addEventListener('click', (e) => {
    e.preventDefault();
    let result = confirm("Are you sure?\nYou will be logged out of the system.");

if (result) {
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';

    document.getElementById('txtUsername').value = '';
    document.getElementById('txtPassword').value = '';
}
});

