#!/usr/bin/env node

const readline = require('readline');
const chalk = require('chalk');
const boxen = require('boxen');
const { startClient } = require('./client.js');
const { startServer } = require('./partage.js');
const { runScript, simpleExit, setTheme, checkCompatibility, getOsInfo } = require('./utils.js');

async function mainMenuLogic() {
    setTheme('hacker');
    const { distro, arch } = getOsInfo();
    const title = `GoSpot sur ${distro} (${arch})`;
    console.log(boxen(chalk.bold(title), { padding: 1, borderColor: 'cyan', title: 'GoSpot Stall 🛠️', titleAlignment: 'center' }));
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log(chalk.cyan('\n--- Connexion ---'));
    console.log('  1. Client (Rejoindre)');
    console.log('  2. Serveur (Partager)');
    console.log(chalk.yellow('\n--- Outils & SDK ---'));
    console.log('  3. Installer les outils');
    console.log('  4. Créer une nouvelle clé SSH');
    console.log('  5. Administration du Serveur');
    console.log('\n  6. Quitter\n');

    const choice = await new Promise(resolve => rl.question(chalk.cyan('Votre choix (1-6) : '), resolve));
    rl.close();
    
    let shouldReturnToMenu = false;
    switch (choice.trim()) {
        case '1': await startClient(); break;
        case '2': await startServer(); break;
        case '3': await runScript('tools.sh'); shouldReturnToMenu = true; break;
        case '4': await runScript('ssh_tool.sh'); shouldReturnToMenu = true; break;
        case '5': await runScript('login.sh'); shouldReturnToMenu = true; break;
        case '6': simpleExit(); break;
        default: console.log(chalk.red('\nChoix invalide.')); shouldReturnToMenu = true; break;
    }

    if (shouldReturnToMenu) {
        setTimeout(mainMenuLogic, 1500);
    }
}

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
