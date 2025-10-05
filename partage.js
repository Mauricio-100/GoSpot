const { exec } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');
const util = require('util');
const promiseExec = util.promisify(exec);
const { setTheme, findServerIp } = require('./utils.js');

async function startServer() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Serveur GoS'), { padding: 1, borderColor: 'green' }));
    console.log(chalk.yellow("ACTION : Assurez-vous que le 'Partage de connexion' est bien activé.\n"));
    
    try {
        console.log(chalk.blue('Vérification et démarrage du service SSH...'));
        await promiseExec("if ! pgrep -f 'sshd' > /dev/null; then /usr/sbin/sshd; fi");
        console.log(chalk.green('Service SSH actif.'));

        console.log(chalk.blue('Détection de l\'adresse IP du serveur...'));
        const serverIp = await findServerIp();

        if (!serverIp) {
            console.log(chalk.red('Impossible de trouver l\'adresse IP du serveur. Le Partage de connexion est-il bien activé ?'));
            return;
        }

        console.log(chalk.green('Serveur prêt !'));
        console.log(chalk.cyan(`\n  Connectez-vous à cette IP : ${serverIp}`));
        console.log(chalk.cyan(`  Port SSH                  : 22`));
        
        console.log(chalk.cyan('\nLe serveur est en cours d\'exécution. Appuyez sur Ctrl+C pour l\'arrêter.'));

    } catch (error) {
        console.log(chalk.red('Une erreur est survenue lors du démarrage du serveur.'));
        console.error(error.stderr || error.message);
    }
}

module.exports = { startServer };
