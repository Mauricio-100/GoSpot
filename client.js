const { spawn } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { setTheme, simpleExit } = require('./utils.js');

async function startClient() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Client GoS'), { padding: 1, borderColor: 'cyan' }));
    console.log(chalk.yellow("ACTION : Assurez-vous d'être connecté au Wi-Fi du serveur.\n"));
    console.log(chalk.blue('Recherche du serveur sur le réseau...'));
    try {
        const { stdout } = await exec(`sh ${__dirname}/sdk/gos.sh connect`);
        const serverIp = stdout.trim();
        if (serverIp.includes('ERROR')) {
            console.log(chalk.red('Serveur introuvable.'));
            simpleExit();
            return;
        }
        console.log(chalk.green(`Serveur trouvé ! Adresse : ${serverIp}`));
        console.log(chalk.blue('\nNOTE : La première fois, le mot de passe "root" du serveur sera demandé.'));
        await new Promise((resolve, reject) => {
            const sshProcess = spawn('ssh', [`root@${serverIp}`], { stdio: 'inherit' });
            sshProcess.on('close', resolve);
            sshProcess.on('error', reject);
        });
    } catch (error) {
        console.log(chalk.red('La connexion a échoué.'));
    }
    simpleExit();
}

module.exports = { startClient };
