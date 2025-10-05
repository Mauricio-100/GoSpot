const { spawn } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');

async function createSshKey() {
    console.log(boxen(chalk.bold('Générateur de Clé SSH'), { padding: 1, borderColor: 'yellow' }));
    console.log('Cet outil va créer une nouvelle paire de clés SSH (ed25519).\n');
    try {
        await new Promise((resolve, reject) => {
            const keygenProcess = spawn('ssh-keygen', ['-t', 'ed25519'], { stdio: 'inherit' });
            keygenProcess.on('close', resolve);
            keygenProcess.on('error', reject);
        });
        console.log(chalk.green('\n✅ Clé SSH créée avec succès !'));
    } catch (e) {
        console.log(chalk.red('\nLa création de la clé a échoué.'));
    }
}

module.exports = { createSshKey };
