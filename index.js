#!/usr/bin/env node

const readline = require('readline');
const chalk = require('chalk');
const boxen = require('boxen');
const os = require('os');

// === IMPORTATIONS DEPUIS VOS FICHIERS MODULES ===
// Assurez-vous que ces fichiers existent à la racine de votre projet
const { startClient } = require('./client.js');
const { startServer } = require('./partage.js');
const { runScript, simpleExit, setTheme, checkCompatibility } = require('./utils.js');
const { installTools } = require('./sdk/tools.js');
const { createSshKey } = require('./sdk/ssh.js');
const { adminMenu } = require('./sdk/login.js');
const { connectToDatabase } = require('./sdk/db.js');


// --- Menu Principal ---
async function mainMenuLogic() {
    setTheme('hacker');
    const title = `GoSpot Suite v5.3 sur ${os.platform()} (${os.arch()})`;
    console.log(boxen(chalk.bold(title), { padding: 1, borderColor: 'cyan', title: 'GoSpot Stall 🛠️', titleAlignment: 'center' }));
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log(chalk.cyan('\n--- Connexion ---'));
    console.log('  1. Client (Rejoindre)');
    console.log('  2. Serveur (Partager)');
    console.log(chalk.yellow('\n--- Outils & SDK ---'));
    console.log('  3. Installer les outils');
    console.log('  4. Créer une nouvelle clé SSH');
    console.log('  5. Administration du Serveur');
    console.log(chalk.magenta('\n--- Base de Données ---'));
    console.log('  6. Se connecter à la base de données');
    console.log('\n  7. Quitter\n');

    const choice = await new Promise(resolve => rl.question(chalk.cyan('Votre choix (1-7) : '), resolve));
    rl.close();
    
    let shouldReturnToMenu = false;
    switch (choice.trim()) {
        case '1': await startClient(); break;
        case '2': await startServer(); break;
        case '3': await installTools(); shouldReturnToMenu = true; break;
        case '4': await createSshKey(); shouldReturnToMenu = true; break;
        case '5': await adminMenu(); shouldReturnToMenu = true; break;
        case '6': await connectToDatabase(); break;
        case '7': simpleExit(); break;
        default: console.log(chalk.red('\nChoix invalide.')); shouldReturnToMenu = true; break;
    }

    if (shouldReturnToMenu) {
        setTimeout(mainMenuLogic, 1500);
    }
}

// --- Point d'Entrée ---
async function main() {
    checkCompatibility();
    const command = process.argv[2];
    
    // Commandes directes pour les utilisateurs avancés
    if (command === 'login') { await adminMenu(); }
    else if (command === 'serve') { await startServer(); }
    else if (command === 'connect') { await startClient(); }
    else if (command === 'install') { await installTools(); }
    else { mainMenuLogic(); } // Comportement par défaut
}

process.on('SIGINT', simpleExit);

main().catch(err => {
    console.error(chalk.red('Une erreur critique est survenue:'), err);
    simpleExit();
});
