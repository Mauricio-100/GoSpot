#!/usr/bin/env node

const readline = require('readline');
const chalk = require('chalk');
const boxen = require('boxen');
const { startClient } = require('./client.js');
const { startServer } = require('./partage.js');
const { installTools } = require('./sdk/tools.js');
const { createSshKey } = require('./sdk/ssh.js');
const { adminMenu } = require('./sdk/login.js');
const { connectToDatabase } = require('./sdk/db.js');
const { simpleExit } = require('./utils.js');

async function mainMenuLogic() {
    console.log(boxen(chalk.bold('GoSpot stall🛠️'), { padding: 1, borderColor: 'cyan' }));
    
    // ... (La logique du menu readline qui appelle les fonctions importées)
    // Exemple:
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    // ... affiche les options ...
    const choice = await new Promise(resolve => rl.question('Votre choix : ', resolve));
    rl.close();
    
    let shouldReturnToMenu = false;
    switch (choice.trim()) {
        case '1': await startClient(); break;
        case '2': await startServer(); break;
        case '3': await installTools(); shouldReturnToMenu = true; break;
        case '4': await createSshKey(); shouldReturnToMenu = true; break;
        case '5': await adminMenu(); shouldReturnToMenu = true; break;
        case '6': await connectToDatabase(); break;
        default: simpleExit(); break;
    }
    if (shouldReturnToMenu) {
        setTimeout(mainMenuLogic, 1500);
    }
}

process.on('SIGINT', simpleExit);
mainMenuLogic().catch(err => {
    console.error(chalk.red('Une erreur critique est survenue:'), err);
    simpleExit();
});
