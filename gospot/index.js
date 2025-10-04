#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline'); // MODULE INTÉGRÉ !
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// --- Fonctions Utilitaires (inchangées) ---
function setTheme(theme = 'default') { /* ... (collez la fonction setTheme d'avant) ... */ }
function runScript(scriptName, args = []) { /* ... (collez la fonction runScript d'avant) ... */ }
function resetAndExit() { /* ... (collez la fonction resetAndExit d'avant) ... */ }

// --- Logiques Serveur et Client (inchangées) ---
async function startServer() { /* ... (collez la fonction startServer d'avant) ... */ }
async function startClient() { /* ... (collez la fonction startClient d'avant) ... */ }

// --- NOUVEAU : Menu principal avec le module `readline` intégré ---
function mainMenuLogic() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('GoSpot : Menu Principal'), { padding: 1, borderColor: 'yellow' }));
    
    // On crée l'interface de lecture
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // On affiche le menu manuellement
    console.log('\n  1. Client (Rejoindre une connexion)');
    console.log('  2. Serveur (Partager la connexion)');
    console.log('  3. Quitter\n');

    // On pose la question à l'utilisateur
    rl.question(chalk.yellow('Votre choix : '), async (choice) => {
        // On ferme l'interface, c'est très important !
        rl.close();

        switch (choice.trim()) {
            case '1':
                await startClient();
                break;
            case '2':
                await startServer();
                break;
            case '3':
                resetAndExit();
                break;
            default:
                console.log(chalk.red('Choix invalide.'));
                resetAndExit();
                break;
        }
    });
}

// =================================================================
// POINT D'ENTRÉE PRINCIPAL (avec process.argv)
// =================================================================

const command = process.argv[2];

async function main() {
    switch (command) {
        case 'login':
            setTheme('hacker');
            await runScript('login.sh').finally(() => resetAndExit());
            break;

        case 'serve':
            await startServer();
            break;
            
        case 'connect':
            await startClient();
            break;
            
        default:
            // Si aucune commande, on lance notre nouveau menu readline
            mainMenuLogic();
            break;
    }
}

process.on('SIGINT', resetAndExit);

main().catch(err => {
    console.error(chalk.red('Une erreur critique est survenue:'), err);
    resetAndExit();
});
