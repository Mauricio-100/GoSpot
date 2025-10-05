const { spawn } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');
const { setTheme, simpleExit, findServerIp } = require('./utils.js');

async function startClient() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Client GoS'), { padding: 1, borderColor: 'cyan' }));
    console.log(chalk.yellow("ACTION : Assurez-vous d'être connecté au Wi-Fi du serveur.\n"));
    
    try {
        console.log(chalk.blue('Recherche du serveur sur le réseau...'));
        const serverIp = await findServerIp();

        if (!serverIp) {
            console.log(chalk.red('Serveur introuvable. Avez-vous rejoint le bon réseau Wi-Fi ?'));
            simpleExit();
            return;
        }
        
        console.log(chalk.green(`Serveur trouvé ! Adresse : ${serverIp}`));
        console.log(chalk.blue('\nNOTE : La première fois, le mot de passe "root" du serveur sera demandé.'));

        await new Promise((resolve) => {
            const sshProcess = spawn('ssh', [`root@${serverIp}`], { stdio: 'inherit' });
            sshProcess.on('close', resolve);
        });
        
    } catch (error) {
        console.log(chalk.red('La connexion a échoué.'));
        console.error(error.message);
    }
    
    simpleExit();
}

module.exports = { startClient };
