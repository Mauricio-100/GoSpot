#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const inquirer = require('inquirer');
const chalk = require('chalk');

// La Magie de `spawn`: lance un script shell et lui donne le contrôle du terminal
function runScript(scriptName, args = []) {
    // On construit le chemin absolu vers le script pour être sûr de le trouver
    // __dirname est le dossier courant (gospot/), '..' remonte d'un niveau
    const scriptPath = path.join(__dirname, '..', scriptName);
    
    // On retourne une promesse pour savoir quand le script a fini
    return new Promise((resolve, reject) => {
        const process = spawn(scriptPath, args, { stdio: 'inherit' });
        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Le script ${scriptName} s'est terminé avec une erreur (code: ${code})`));
            }
        });
        process.on('error', (err) => reject(err));
    });
}

// Le menu interactif principal
async function mainMenu() {
    console.clear();
    console.log(chalk.bold.green('🚀 GoSpot : Menu Principal'));
    
    const { mode } = await inquirer.prompt([{
        type: 'list',
        name: 'mode',
        message: 'Que voulez-vous faire ?',
        choices: [
            { name: 'Client (Rejoindre une connexion)', value: 'connect' },
            { name: 'Serveur (Partager la connexion)', value: 'serve' },
            new inquirer.Separator(),
            { name: 'Quitter', value: 'exit' },
        ],
    }]);

    if (mode === 'serve') {
        // Appelle le script ./GoS avec l'argument "serve"
        await runScript('GoS', ['serve']);
    } else if (mode === 'connect') {
        // Appelle le script ./GoS avec l'argument "connect"
        await runScript('GoS', ['connect']);
    } else {
        console.log(chalk.blue('À bientôt !'));
        process.exit(0);
    }
}

// L'orchestrateur de commandes
yargs(hideBin(process.argv))
    .command('$0', 'Lance le menu interactif Client/Serveur', {}, mainMenu)
    .command('install', 'Prépare votre système pour GoSpot', {}, () => runScript('install.sh'))
    .command('login', 'Gère la configuration du serveur (mot de passe, clés)', {}, () => runScript('login.sh'))
    .help()
    .argv;
