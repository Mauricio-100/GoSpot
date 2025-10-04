#!/usr/bin/env node

// On importe les outils nécessaires
const { spawn } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Fonction pour exécuter une commande et retourner le résultat (silencieusement)
async function runCmd(cmd) {
    try {
        const { stdout } = await exec(cmd);
        return stdout.trim();
    } catch (e) {
        return null;
    }
}

// Fonction pour lancer un processus interactif (comme ssh)
function spawnInteractive(cmd, args) {
    return new Promise((resolve, reject) => {
        const process = spawn(cmd, args, { stdio: 'inherit' });
        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Le processus s'est terminé avec le code ${code}`));
            }
        });
        process.on('error', (err) => {
            reject(err);
        });
    });
}

// --- LOGIQUE DE L'APPLICATION ---

async function startServer() {
    console.log(chalk.yellow("ACTION : Assurez-vous que le 'Partage de connexion' est bien activé."));
    const spinner = ora('Démarrage du serveur SSH...').start();
    await runCmd('[ ! -f "/etc/ssh/ssh_host_rsa_key" ] && ssh-keygen -A');
    await runCmd('sshd');
    spinner.succeed(chalk.green('Serveur SSH démarré.'));
    
    const serverIp = await runCmd("ip a | grep -o '172.20.10.1'");
    console.log(chalk.green(`\n✅ Serveur prêt ! En attente d'un client...`));
    console.log(`Mon IP est : ${chalk.bold.cyan(serverIp)}`);
}

async function startClient() {
    console.log(chalk.yellow("ACTION : Assurez-vous d'être connecté au Wi-Fi du serveur.\n"));

    const spinner = ora('Recherche du serveur sur le réseau...').start();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Attente pour la connexion
    const serverIp = await runCmd("arp -a | grep -o '172.20.10.1'");

    if (!serverIp) {
        spinner.fail(chalk.red('Serveur introuvable.'));
        return;
    }
    spinner.succeed(chalk.green(`Serveur trouvé ! Adresse : ${serverIp}`));

    console.log(chalk.blue('\nNOTE : La première fois, le mot de passe "root" du serveur sera demandé pour autoriser votre clé.'));

    try {
        await spawnInteractive('ssh-copy-id', ['-o', 'StrictHostKeyChecking=no', `root@${serverIp}`]);
        console.log(chalk.green('\nClé autorisée ! Connexion en cours...'));
        await spawnInteractive('ssh', [`root@${serverIp}`]);
    } catch (error) {
        console.error(chalk.red('\nLa connexion a échoué. Avez-vous entré le bon mot de passe ?'));
    }
}

// --- POINT D'ENTRÉE PRINCIPAL ---
async function main() {
    console.clear();
    console.log(chalk.bold.green('🚀 Bienvenue dans GoSpot !'));
    
    const { mode } = await inquirer.prompt([
        {
            type: 'list',
            name: 'mode',
            message: 'Que voulez-vous faire ?',
            choices: [
                { name: 'Serveur (Partager la connexion)', value: 'serve' },
                { name: 'Client (Rejoindre une connexion)', value: 'connect' },
                new inquirer.Separator(),
                { name: 'Quitter', value: 'exit' },
            ],
        },
    ]);

    if (mode === 'serve') {
        await startServer();
    } else if (mode === 'connect') {
        await startClient();
    } else {
        console.log(chalk.blue('À bientôt !'));
        process.exit(0);
    }
}

main().catch(err => {
    console.error(chalk.red('Une erreur inattendue est survenue:'), err);
});
