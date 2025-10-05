const { spawn } = require('child_process');
const chalk = require('chalk');

async function installTools() {
    console.log(chalk.blue('Mise à jour de la liste des paquets...'));
    
    const apkUpdate = spawn('apk', ['update'], { stdio: 'inherit' });
    await new Promise(resolve => apkUpdate.on('close', resolve));
    
    console.log(chalk.blue('\nInstallation des outils requis (SSH, Réseau, MySQL)...'));
    
    const apkAdd = spawn('apk', ['add', 'openssh', 'iproute2', 'mariadb-client'], { stdio: 'inherit' });
    await new Promise(resolve => apkAdd.on('close', resolve));

    console.log(chalk.green('\n✅ Tous les outils du SDK GoS sont installés !'));
}

module.exports = { installTools };
