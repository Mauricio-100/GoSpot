#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// --- NOUVEAU : Gestion du Thème Terminal ---
function setTheme(theme = 'default') {
    let bgColor, fgColor;
    if (theme === 'hacker') {
        bgColor = chalk.bgHex('#0D0208');
        fgColor = chalk.hex('#00FF41');
    } else {
        // Code pour réinitialiser
        process.stdout.write('\x1Bc');
        return;
    }
    // Efface le terminal et applique le thème
    process.stdout.write('\x1Bc' + bgColor.open + fgColor.open);
}

// Fonction pour exécuter un script shell et hériter du terminal
function runScript(scriptName, args = []) {
    const scriptPath = path.join(__dirname, '..', scriptName);
    return new Promise((resolve, reject) => {
        const process = spawn('sh', [scriptPath, ...args], { stdio: 'inherit' });
        process.on('close', (code) => code === 0 ? resolve() : reject());
        process.on('error', reject);
    });
}

// --- Logique Serveur avec Log en Temps Réel ---
async function startServer() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Serveur GoS'), { padding: 1, borderColor: 'green' }));
    console.log(chalk.yellow("ACTION : Assurez-vous que le 'Partage de connexion' est bien activé.\n"));

    const spinner = ora('Démarrage et vérification du service SSH...').start();
    await exec(`sh ${path.join(__dirname, '..', 'GoS')} serve`);
    spinner.succeed(chalk.green('Serveur SSH actif.'));
    
    console.log(chalk.cyan(`\n  IP du serveur : 172.20.10.1`));
    console.log(chalk.cyan(`  Port SSH      : 22`));

    // NOUVEAU : Faux log en temps réel pour montrer l'activité
    const logSpinner = ora('En attente de connexions client...').start();
    let dots = 0;
    setInterval(() => {
        dots = (dots + 1) % 4;
        logSpinner.text = 'En attente de connexions client' + '.'.repeat(dots);
    }, 500);
}

// --- Logique Client ---
async function startClient() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Mode Client GoS'), { padding: 1, borderColor: 'cyan' }));
    console.log(chalk.yellow("ACTION : Assurez-vous d'être connecté au Wi-Fi du serveur.\n"));
    
    const spinner = ora('Recherche du serveur sur le réseau...').start();
    try {
        const { stdout } = await exec(`sh ${path.join(__dirname, '..', 'GoS')} connect`);
        const serverIp = stdout.trim();

        if (serverIp.includes('ERROR')) {
            spinner.fail(chalk.red('Serveur introuvable.'));
            resetAndExit();
        }
        
        spinner.succeed(chalk.green(`Serveur trouvé ! Adresse : ${serverIp}`));
        console.log(chalk.blue('\nNOTE : La première fois, le mot de passe "root" du serveur sera demandé.'));

        // La connexion SSH est interactive, on utilise spawn
        await spawn('ssh', [`root@${serverIp}`], { stdio: 'inherit' });
        
    } catch (error) {
        spinner.fail(chalk.red('La connexion a échoué.'));
    }
    resetAndExit();
}

function resetAndExit() {
    setTheme('default');
    process.exit(0);
}

// --- Orchestrateur de Commandes Yargs ---
const cli = yargs(hideBin(process.argv))
    .scriptName('GoS')
    .usage('Usage: $0 <command>')
    .command('$0', 'Lance le menu interactif Client/Serveur', {}, async () => {
        setTheme('hacker');
        const { mode } = await inquirer.prompt(/* ... Le menu inquirer ... */);
        if (mode === 'serve') await startServer();
        else if (mode === 'connect') await startClient();
        else resetAndExit();
    })
    .command('login', 'Gère la configuration du serveur (mot de passe, clés)', {}, () => {
        setTheme('hacker');
        runScript('login.sh').finally(() => resetAndExit());
    })
    .help('h').alias('h', 'help')
    .argv;

// Attrape le Ctrl+C pour réinitialiser le terminal
process.on('SIGINT', resetAndExit);
