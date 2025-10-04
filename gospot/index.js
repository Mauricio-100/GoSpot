#!/usr/bin/env node

const { execSync, exec } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Fonctions d'aide
const run = (cmd) => {
    try {
        return execSync(cmd, { encoding: 'utf8' });
    } catch (e) {
        console.error(chalk.red(`Erreur en exécutant : ${cmd}`));
        console.error(e.stderr);
        process.exit(1);
    }
};

// La logique principale
async function main() {
    const arg = process.argv[2];

    if (arg === 'serve') {
        // Logique du serveur...
        console.log(chalk.green('--- Démarrage de GoSpot en mode SERVEUR ---'));
        console.log(chalk.yellow("ACTION : Assurez-vous d'avoir activé le 'Partage de connexion'."));
        // ... (logique pour démarrer sshd etc.)
        console.log(chalk.green('✅ Serveur prêt !'));

    } else if (arg === 'connect') {
        // Logique du client...
        console.log(chalk.green('--- Démarrage de GoSpot en mode CLIENT ---'));
        console.log(chalk.yellow("ACTION : Assurez-vous d'être connecté au Wi-Fi du serveur."));
        
        console.log(chalk.blue('🕵️  Recherche d\'une clé SSH...'));
        // ... (logique pour trouver la clé)
        
        console.log(chalk.blue('\nRecherche du serveur...'));
        const serverIp = run("arp -a | grep -o '172.20.10.1'").trim();
        
        if (!serverIp) {
            console.error(chalk.red('ERREUR : Serveur introuvable.'));
            process.exit(1);
        }
        console.log(chalk.green(`Serveur trouvé ! Adresse : ${serverIp}`));
        
        // On passe à un shell interactif pour ssh et ssh-copy-id
        console.log(chalk.yellow("\nNOTE : La première fois, le mot de passe 'root' du serveur sera demandé."));
        const sshCopy = exec(`ssh-copy-id -o StrictHostKeyChecking=no root@${serverIp}`, { stdio: 'inherit' });

        sshCopy.on('close', (code) => {
            if (code === 0) {
                console.log(chalk.green('Clé autorisée ! Connexion en cours...'));
                exec(`ssh root@${serverIp}`, { stdio: 'inherit' });
            } else {
                console.error(chalk.red('La copie de la clé a échoué.'));
            }
        });

    } else {
        console.log('Usage: GoS [serve|connect]');
    }
}

main();
