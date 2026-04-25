import { userTable } from '../db/database.js';

const txtNewUsername = document.getElementById('txtNewUsername');
const txtNewPassword = document.getElementById('txtNewPassword');
const btnSaveSettings = document.getElementById('btnSaveSettings');

function loadSettings() {
    txtNewUsername.value = userTable[0].username;
    txtNewPassword.value = userTable[0].password;
}

loadSettings();

btnSaveSettings.addEventListener('click', () => {
    const newUsername = txtNewUsername.value.trim();
    const newPassword = txtNewPassword.value.trim();

    if (!newUsername || !newPassword) {
        alert('Please enter both username and password. ');
        return;
    }

    userTable[0].username = newUsername;
    userTable[0].password = newPassword;

    alert('Credentials updated successfully. ');

});
