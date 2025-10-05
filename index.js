#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const boxen = require('boxen');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// =================================================================
// Fonctions Utilitaires et Thème
// =================================================================

function setTheme(theme = 'default') { /* ... collez votre fonction setTheme ... */ }
function runScript(scriptName, args = []) { /* ... collez votre fonction runScript ... */ }
function simpleExit() { /* ... collez votre fonction simpleExit ... */ }

// =================================================================
// Logiques Métier (Serveur et Client)
// =================================================================

async function startServer() { /* ... collez votre fonction startServer ... */ }
async function startClient() { /* ... collez votre fonction startClient ... */ }
async function createSshKey() { /* ... collez votre fonction createSshKey ... */ }
async function connectToDatabase() { /* ... collez votre fonction connectToDatabase ... */ }

// =================================================================
// Menu Principal et Point d'Entrée
// =================================================================

async function mainMenuLogic() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('GoSpot Suite v4.1'), { padding: 1, borderColor: 'cyan' }));
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log(chalk.cyan('\n--- Connexion ---'));
    console.log('  1. Client (Rejoindre)');
    console.log('  2. Serveur (Partager)');
    console.log(chalk.yellow('\n--- Outils & SDK ---'));
    console.log('  3. Installer les outils du SDK');
    console.log('  4. Créer une nouvelle clé SSH');
    console.log('  5. Administration du Serveur (login)');
    console.log(chalk.magenta('\n--- Base de Données ---'));
    console.log('  6. Se connecter à la base de données');
    console.log('\n  7. Quitter\n');

    rl.question(chalk.cyan('Votre choix (1-7) : '), async (choice) => {
        rl.close();
        
        let shouldReturnToMenu = false;

        switch (choice.trim()) {
            case '1':
                await startClient(); // Cette fonction gère sa propre sortie
                break;
            case '2':
                await startServer(); // Cette fonction reste en vie
                break;
            case '3':
                await runScript('tools.sh');
                shouldReturnToMenu = true;
                break;
            case '4':
                await createSshKey();
                shouldReturnToMenu = true;
                break;
            case '5':
                await runScript('login.sh');
                shouldReturnToMenu = true;
                break;
            case '6':
                await connectToDatabase(); // Cette fonction gère sa propre sortie
                break;
            case '7':
                simpleExit();
                break;
            default:
                console.log(chalk.red('\nChoix invalide.'));
                shouldReturnToMenu = true;
                break;
        }

        // --- LA CORRECTION EST ICI ---
        // Si une action doit revenir au menu, on le fait après une courte pause.
        if (shouldReturnToMenu) {
            setTimeout(mainMenuLogic, 1500); // Pause de 1.5s pour que l'utilisateur voie le résultat
        }
    });
}

const command = process.argv[2];

async function main() {
    if (command === 'login') {
        await runScript('login.sh');
        mainMenuLogic(); // Revenir au menu après
    } else if (command === 'serve') {
        await startServer();
    } else if (command === 'connect') {
        await startClient();
    } else {
        mainMenuLogic();
    }
}

process.on('SIGINT', simpleExit);
main().catch(err => {
    console.error(chalk.red('Une erreur critique est survenue:'), err);
    simpleExit();
});
