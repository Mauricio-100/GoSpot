#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// =================================================================
// Fonctions Utilitaires et Thème
// =================================================================

function setTheme(theme = 'default') {
    if (theme === 'hacker') {
        process.stdout.write('\x1Bc' + chalk.bgHex('#0D0208').open + chalk.hex('#00FF41').open);
    } else {
        process.stdout.write('\x1Bc');
    }
}

function runScript(scriptName, args = []) {
    // Le chemin est maintenant relatif à la racine, dans le dossier 'import'
    const scriptPath = path.join(__dirname, 'import', scriptName);
    return new Promise((resolve, reject) => {
        const process = spawn('sh', [scriptPath, ...args], { stdio: 'inherit' });
        process.on('close', (code) => code === 0 ? resolve() : reject(new Error(`Le script s'est terminé avec le code ${code}`)));
        process.on('error', reject);
    });
}

function simpleExit() {
    // On ne réinitialise plus le thème ici pour éviter tout conflit sur iSH
    process.exit(0);
}

// =================================================================
// Logiques Métier (Serveur et Client)
// =================================================================

async function startServer() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Serveur GoS'), { padding: 1, borderColor: 'green' }));
    console.log(chalk.yellow("ACTION : Assurez-vous que le 'Partage de connexion' est bien activé.\n"));

    const spinner = ora('Démarrage et vérification du service SSH...').start();
    await exec(`sh ${path.join(__dirname, 'import', 'GoS.sh')} serve`);
    spinner.succeed(chalk.green('Serveur SSH actif.'));
    
    console.log(chalk.cyan(`\n  IP du serveur : 172.20.10.1`));
    console.log(chalk.cyan(`  Port SSH      : 22`));

    const logSpinner = ora('En attente de connexions client...').start();
    let dots = 0;
    setInterval(() => {
        dots = (dots + 1) % 4;
        logSpinner.text = 'En attente de connexions client' + '.'.repeat(dots);
    }, 500);
}

async function startClient() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Client GoS'), { padding: 1, borderColor: 'cyan' }));
    console.log(chalk.yellow("ACTION : Assurez-vous d'être connecté au Wi-Fi du serveur.\n"));
    
    const spinner = ora('Recherche du serveur sur le réseau...').start();
    try {
        const { stdout } = await exec(`sh ${path.join(__dirname, 'import', 'GoS.sh')} connect`);
        const serverIp = stdout.trim();

        if (serverIp.includes('ERROR')) {
            spinner.fail(chalk.red('Serveur introuvable.'));
            simpleExit();
            return;
        }
        
        spinner.succeed(chalk.green(`Serveur trouvé ! Adresse : ${serverIp}`));
        console.log(chalk.blue('\nNOTE : La première fois, le mot de passe "root" du serveur sera demandé.'));

        await spawn('ssh', [`root@${serverIp}`], { stdio: 'inherit' });
        
    } catch (error) {
        spinner.fail(chalk.red('La connexion a échoué.'));
    }
    simpleExit();
}


// =================================================================
// Menu Principal et Point d'Entrée
// =================================================================

function mainMenuLogic() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('GoSpot : Menu Principal'), { padding: 1, borderColor: 'cyan' }));
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\n  1. Client (Rejoindre une connexion)');
    console.log('  2. Serveur (Partager la connexion)');
    console.log(chalk.yellow('\n  3. Administration du Serveur (login)'));
    console.log('\n  4. Quitter\n');

    rl.question(chalk.cyan('Votre choix (1-4) : '), async (choice) => {
        rl.close();
        
        switch (choice.trim()) {
            case '1':
                await startClient();
                break;
            case '2':
                await startServer();
                break;
            case '3':
                try {
                    await runScript('login.sh');
                } finally {
                    simpleExit();
                }
                break;
            case '4':
                simpleExit();
                break;
            default:
                console.log(chalk.red('\nChoix invalide. Veuillez réessayer.'));
                setTimeout(mainMenuLogic, 1000); 
                break;
        }
    });
}

const command = process.argv[2];

async function main() {
    if (command === 'login') {
        try {
            await runScript('login.sh');
        } finally {
            simpleExit();
        }
    } else if (command === 'serve') {
        await startServer();
    } else if (command === 'connect') {
        await startClient();
    } else {
        mainMenuLogic();
    }
}

process.on('SIGINT', simpleExit);

main().catch(err => {
    console.error(chalk.red('Une erreur critique est survenue:'), err);
    simpleExit();
});
