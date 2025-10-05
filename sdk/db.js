const { spawn } = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');
const readline = require('readline');
const { simpleExit } = require('../utils.js');

async function connectToDatabase() {
    console.log(boxen(chalk.bold('Client Base de Données'), { padding: 1, borderColor: 'magenta' }));
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const connectionString = await new Promise(resolve => rl.question(chalk.yellow('Collez votre chaîne de connexion MySQL:\n'), resolve));
    rl.close();
    
    if (!connectionString) {
        console.log(chalk.red('Aucune chaîne de connexion fournie.'));
        simpleExit();
        return;
    }
    try {
        console.log(chalk.blue('\nTentative de connexion...'));
        await new Promise((resolve, reject) => {
            const mysqlProcess = spawn('mysql', [connectionString], { stdio: 'inherit' });
            mysqlProcess.on('close', resolve);
            mysqlProcess.on('error', reject);
        });
    } catch (e) {
        console.log(chalk.red('\nImpossible de se connecter.'));
    }
    simpleExit();
}

module.exports = { connectToDatabase };
