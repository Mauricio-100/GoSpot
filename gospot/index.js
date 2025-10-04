#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// --- Fonctions Utilitaires et Thème ---
function setTheme(theme = 'default') {
    if (theme === 'hacker') {
        process.stdout.write('\x1Bc' + chalk.bgHex('#0D0208').open + chalk.hex('#00FF41').open);
    } else {
        process.stdout.write('\x1Bc');
    }
}

function runScript(scriptName, args = []) { /* ... collez la fonction runScript d'avant ... */ }

// MODIFIÉ : On ne réinitialise plus le thème ici pour éviter le crash
function simpleExit() {
    process.exit(0);
}

// --- Logiques Serveur et Client (inchangées) ---
async function startServer() { /* ... collez votre fonction startServer ici ... */ }
async function startClient() { /* ... collez votre fonction startClient ici ... */ }

// --- NOUVEAU : Menu principal complet et sécurisé ---
function mainMenuLogic() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('GoSpot : Menu Principal'), { padding: 1, borderColor: 'cyan' }));
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\n  1. Client (Rejoindre une connexion)');
    console.log('  2. Serveur (Partager la connexion)');
    console.log(chalk.yellow('\n  3. Administration du Serveur (login)')); // NOUVELLE OPTION
    console.log('\n  4. Quitter\n');

    rl.question(chalk.cyan('Votre choix (1-4) : '), async (choice) => {
        rl.close();

        switch (choice.trim()) {
            case '1':
                await startClient();
                break;
            case '2':
                await startServer();
                break;
            case '3': // NOUVEAU
                // Appelle directement la logique de login.sh
                await runScript('login.sh').finally(() => simpleExit());
                break;
            case '4':
                simpleExit();
                break;
            default:
                // Gère les mauvaises saisies pour éviter le crash
                console.log(chalk.red('\nChoix invalide. Veuillez réessayer.'));
                // Rappelle le menu au lieu de crasher
                setTimeout(mainMenuLogic, 1000); 
                break;
        }
    });
}

// --- Point d'entrée principal (simplifié) ---
// On lance toujours le menu principal. Les commandes directes sont un bonus.
const command = process.argv[2];

async function main() {
    if (command === 'login') {
        await runScript('login.sh');
    } else if (command === 'serve') {
        await startServer();
    } else if (command === 'connect') {
        await startClient();
    } else {
        // Le comportement par défaut est de TOUJOURS montrer le menu.
        mainMenuLogic();
    }
}

process.on('SIGINT', simpleExit);

main().catch(err => {
    console.error(chalk.red('Une erreur critique est survenue:'), err);
    simpleExit();
});
