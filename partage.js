const { exec } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');
const util = require('util');
const promiseExec = util.promisify(exec);

async function startServer() {
    console.log(boxen(chalk.bold('Mode Serveur GoS'), { padding: 1, borderColor: 'green' }));
    console.log(chalk.yellow("ACTION : Assurez-vous que le 'Partage de connexion' est bien activé.\n"));

    console.log(chalk.blue('Démarrage et vérification du service SSH...'));
    await promiseExec("if ! pgrep -f 'sshd' > /dev/null; then sshd; fi");
    console.log(chalk.green('Serveur SSH actif.'));
    
    console.log(chalk.cyan(`\n  IP du serveur : 172.20.10.1`));
    console.log(chalk.cyan(`  Port SSH      : 22`));
    
    console.log(chalk.cyan('\nEn attente de connexions. Appuyez sur Ctrl+C pour quitter.'));
}

module.exports = { startServer };
