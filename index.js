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
// Logiques Métier (Serveur et Client) SANS ORA
// =================================================================

async function startServer() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Serveur GoS'), { padding: 1, borderColor: 'green' }));
    console.log(chalk.yellow("ACTION : Assurez-vous que le 'Partage de connexion' est bien activé.\n"));

    // Remplacement du spinner par un message simple
    console.log(chalk.blue('Démarrage et vérification du service SSH...'));
    await exec(`sh ${path.join(__dirname, 'import', 'GoS.sh')} serve`);
    console.log(chalk.green('Serveur SSH actif.'));
    
    console.log(chalk.cyan(`\n  IP du serveur : 172.20.10.1`));
    console.log(chalk.cyan(`  Port SSH      : 22`));
    
    // Remplacement du log en temps réel par un message statique
    console.log(chalk.cyan('\nEn attente de connexions. Appuyez sur Ctrl+C pour quitter.'));
}

async function startClient() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Client GoS'), { padding: 1, borderColor: 'cyan' }));
    console.log(chalk.yellow("ACTION : Assurez-vous d'être connecté au Wi-Fi du serveur.\n"));
    
    // Remplacement du spinner par un message simple
    console.log(chalk.blue('Recherche du serveur sur le réseau...'));
    
    try {
        const { stdout } = await exec(`sh ${path.join(__dirname, 'import', 'GoS.sh')} connect`);
        const serverIp = stdout.trim();

        if (serverIp.includes('ERROR')) {
            console.log(chalk.red('Serveur introuvable.'));
            simpleExit();
            return;
        }
        
        console.log(chalk.green(`Serveur trouvé ! Adresse : ${serverIp}`));
        console.log(chalk.blue('\nNOTE : La première fois, le mot de passe "root" du serveur sera demandé.'));

        await spawn('ssh', [`root@${serverIp}`], { stdio: 'inherit' });
        
    } catch (error) {
        console.log(chalk.red('La connexion a échoué.'));
    }
    simpleExit();
}


// =================================================================
// Menu Principal et Point d'Entrée (inchangé)
// =================================================================

function mainMenuLogic() { /* ... collez votre fonction mainMenuLogic ici ... */ }
const command = process.argv[2];
async function main() { /* ... collez votre fonction main ici ... */ }

process.on('SIGINT', simpleExit);
main().catch(err => {
    console.error(chalk.red('Une erreur critique est survenue:'), err);
    simpleExit();
});
