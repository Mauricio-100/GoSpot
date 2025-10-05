const { spawn } = require('child_process');
const chalk = require('chalk');
// ... (etc.)

async function adminMenu() {
    // ... (la logique JS du menu admin)
    // Exemple :
    await new Promise(resolve => {
        const passwd = spawn('passwd', ['root'], { stdio: 'inherit' });
        passwd.on('close', resolve);
    });
}

module.exports = { adminMenu };
