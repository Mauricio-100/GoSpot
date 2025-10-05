#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
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
    const scriptPath = path.join(__dirname, 'sdk', scriptName);
    return new Promise((resolve, reject) => {
        const process = spawn('sh', [scriptPath, ...args], { stdio: 'inherit' });
        process.on('close', (code) => code === 0 ? resolve() : reject(new Error(`Le script s'est terminé avec le code ${code}`)));
        process.on('error', reject);
    });
}

function simpleExit() {
    process.exit(0);
}

// =================================================================
// Logiques Métier (Fonctions Complètes)
// =================================================================

async function startServer() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Serveur GoS'), { padding: 1, borderColor: 'green' }));
    console.log(chalk.yellow("ACTION : Assurez-vous que le 'Partage de connexion' est bien activé.\n"));

    console.log(chalk.blue('Démarrage et vérification du service SSH...'));
    await exec(`sh ${path.join(__dirname, 'sdk', 'gos.sh')} serve`);
    console.log(chalk.green('Serveur SSH actif.'));
    
    console.log(chalk.cyan(`\n  IP du serveur : 172.20.10.1`));
    console.log(chalk.cyan(`  Port SSH      : 22`));
    
    console.log(chalk.cyan('\nEn attente de connexions. Appuyez sur Ctrl+C pour quitter.'));
}

async function startClient() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Client GoS'), { padding: 1, borderColor: 'cyan' }));
    console.log(chalk.yellow("ACTION : Assurez-vous d'être connecté au Wi-Fi du serveur.\n"));
    
    console.log(chalk.blue('Recherche du serveur sur le réseau...'));
    
    try {
        const { stdout } = await exec(`sh ${path.join(__dirname, 'sdk', 'gos.sh')} connect`);
        const serverIp = stdout.trim();

        if (serverIp.includes('ERROR')) {
            console.log(chalk.red('Serveur introuvable.'));
            simpleExit();
            return;
        }
        
        console.log(chalk.green(`Serveur trouvé ! Adresse : ${serverIp}`));
        console.log(chalk.blue('\nNOTE : La première fois, le mot de passe "root" du serveur sera demandé.'));

        await spawn('ssh', [`root@${serverIp}`], { stdio: 'inherit' });
        
    } catch (error) {
        console.log(chalk.red('La connexion a échoué.'));
    }
    simpleExit();
}

async function createSshKey() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Générateur de Clé SSH'), { padding: 1, borderColor: 'yellow' }));
    console.log('Cet outil va créer une nouvelle paire de clés SSH (ed25519).\n');
    try {
        await spawn('ssh-keygen', ['-t', 'ed25519'], { stdio: 'inherit' });
        console.log(chalk.green('\n✅ Clé SSH créée avec succès !'));
    } catch (e) {
        console.log(chalk.red('\nLa création de la clé a échoué.'));
    }
}

async function connectToDatabase() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Client Base de Données'), { padding: 1, borderColor: 'magenta' }));
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(chalk.yellow('Collez votre chaîne de connexion MySQL et appuyez sur Entrée :\n'), async (connectionString) => {
        rl.close();
        if (!connectionString) {
            console.log(chalk.red('Aucune chaîne de connexion fournie.'));
            simpleExit();
            return;
        }
        try {
            console.log(chalk.blue('\nTentative de connexion...'));
            await spawn('mysql', [connectionString], { stdio: 'inherit' });
        } catch (e) {
            console.log(chalk.red('\nImpossible de se connecter. Le client MySQL est-il bien installé ? (`GoS` -> option 3)'));
        }
        simpleExit();
    });
}

// =================================================================
// Menu Principal et Point d'Entrée
// =================================================================

async function mainMenuLogic() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('GoSpot Suite v4.2'), { padding: 1, borderColor: 'cyan' }));
    
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log(chalk.cyan('\n--- Connexion ---'));
    console.log('  1. Client (Rejoindre)');
    console.log('  2. Serveur (Partager)');
    console.log(chalk.yellow('\n--- Outils & SDK ---'));
    console.log('  3. Installer les outils du SDK');
    console.log('  4. Créer une nouvelle clé SSH');
    console.log('  5. Administration du Serveur (login)');
    console.log(chalk.magenta('\n--- Base de Données ---'));
    console.log('  6. Se connecter à la base de données');
    console.log('\n  7. Quitter\n');

    rl.question(chalk.cyan('Votre choix (1-7) : '), async (choice) => {
        rl.close();
        
        let shouldReturnToMenu = false;

        switch (choice.trim()) {
            case '1': await startClient(); break;
            case '2': await startServer(); break;
            case '3': await runScript('tools.sh'); shouldReturnToMenu = true; break;
            case '4': await createSshKey(); shouldReturnTo-Menu = true; break;
            case '5': await runScript('login.sh'); shouldReturnToMenu = true; break;
            case '6': await connectToDatabase(); break;
            case '7': simpleExit(); break;
            default: console.log(chalk.red('\nChoix invalide.')); shouldReturnToMenu = true; break;
        }

        if (shouldReturnToMenu) {
            setTimeout(mainMenuLogic, 1500);
        }
    });
}

const command = process.argv[2];

async function main() {
    if (command === 'login') {
        await runScript('login.sh');
        mainMenuLogic();
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
