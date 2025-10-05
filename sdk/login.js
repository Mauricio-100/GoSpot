const { spawn } = require('child_process');
const chalk = require('chalk');
const readline = require('readline');

async function adminMenu() {
    // ... (Logique du menu interactif pour le login, similaire au menu principal)
    console.log(chalk.yellow('\n--- Administration du Serveur ---'));
    console.log('1. Définir / Changer le mot de passe root');
    // Ajoutez d'autres options si nécessaire
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const choice = await new Promise(resolve => rl.question('Votre choix : ', resolve));
    rl.close();

    if (choice.trim() === '1') {
        await new Promise((resolve, reject) => {
            const passwdProcess = spawn('passwd', ['root'], { stdio: 'inherit' });
            passwdProcess.on('close', resolve);
            passwdProcess.on('error', reject);
        });
    }
}

module.exports = { adminMenu };
