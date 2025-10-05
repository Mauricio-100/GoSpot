#!/usr/bin/env node

const readline = require('readline');
const chalk = require('chalk');
const boxen = require('boxen');
const os = require('os');

// === IMPORTATIONS DEPUIS VOS FICHIERS ===
const { startClient } = require('./client.js');
const { startServer } = require('./partage.js');
const { setTheme, runScript, simpleExit } = require('./utils.js');

// --- Vérification de Compatibilité ---
function checkCompatibility() {
    // ... (collez la fonction checkCompatibility ici) ...
}

// --- Menu Principal ---
async function mainMenuLogic() {
    setTheme('hacker');
    const title = `GoSpot Suite v5.3 sur ${os.platform()} (${os.arch()})`;
    console.log(boxen(chalk.bold(title), { padding: 1, borderColor: 'cyan' }));
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log(chalk.cyan('\n--- Connexion ---'));
    console.log('  1. Client (Rejoindre)');
    console.log('  2. Serveur (Partager)');
    console.log(chalk.yellow('\n--- Outils & SDK (via scripts) ---'));
    console.log('  3. Installer les outils');
    console.log('  4. Créer une clé SSH');
    console.log('  5. Administration du Serveur');
    console.log('\n  6. Quitter\n');

    rl.question(chalk.cyan('Votre choix (1-6) : '), async (choice) => {
        rl.close();
        let shouldReturnToMenu = false;

        switch (choice.trim()) {
            case '1': await startClient(); break;
            case '2': await startServer(); break;
            case '3': await runScript('tools.sh'); shouldReturnToMenu = true; break;
            case '4': await runScript('ssh_tool.sh'); shouldReturnToMenu = true; break; // On peut créer ce script pour ssh-keygen
            case '5': await runScript('login.sh'); shouldReturnToMenu = true; break;
            case '6': simpleExit(); break;
            default: console.log(chalk.red('\nChoix invalide.')); shouldReturnToMenu = true; break;
        }

        if (shouldReturnToMenu) {
            setTimeout(mainMenuLogic, 1500);
        }
    });
}

// --- Point d'Entrée ---
async function main() {
    checkCompatibility();
    const command = process.argv[2];
    if (command === 'login') { await runScript('login.sh'); mainMenuLogic(); }
    else if (command === 'serve') { await startServer(); }
    else if (command === 'connect') { await startClient(); }
    else { mainMenuLogic(); }
}

process.on('SIGINT', simpleExit);
main().catch(err => {
    console.error(chalk.red('Une erreur critique est survenue:'), err);
    simpleExit();
});
