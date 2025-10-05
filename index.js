#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const boxen = require('boxen');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// --- Fonctions Utilitaires et Thème ---
function setTheme(theme = 'default') { /* ... collez votre fonction setTheme ... */ }
function runScript(scriptName, args = []) {
    const scriptPath = path.join(__dirname, 'sdk', scriptName); // Chemin mis à jour vers sdk/
    return new Promise((resolve, reject) => { /* ... collez le reste de la fonction ... */ });
}
function simpleExit() { /* ... collez votre fonction simpleExit ... */ }

// --- Logiques Métier (Serveur et Client) ---
async function startServer() { /* ... collez votre fonction startServer ... */ }
async function startClient() { /* ... collez votre fonction startClient ... */ }

// --- NOUVELLES FONCTIONS MÉTIER ---

async function createSshKey() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Générateur de Clé SSH'), { padding: 1, borderColor: 'yellow' }));
    console.log('Cet outil va créer une nouvelle paire de clés SSH (publique et privée).\n');
    try {
        // On lance ssh-keygen en mode interactif pour que l'utilisateur puisse choisir le nom et le mot de passe
        await spawn('ssh-keygen', ['-t', 'ed25519'], { stdio: 'inherit' });
        console.log(chalk.green('\n✅ Clé SSH créée avec succès !'));
    } catch (e) {
        console.log(chalk.red('\nLa création de la clé a échoué.'));
    }
    await new Promise(r => setTimeout(r, 2000)); // Pause avant de revenir au menu
}

async function connectToDatabase() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('Client Base de Données'), { padding: 1, borderColor: 'magenta' }));
    
    // ⚠️ SÉCURITÉ : On ne stocke jamais les identifiants ! On les demande.
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
            // On utilise la commande 'mysql' avec la chaîne de connexion
            await spawn('mysql', [connectionString], { stdio: 'inherit' });
        } catch (e) {
            console.log(chalk.red('\nImpossible de se connecter. Assurez-vous que le client MySQL est installé (`GoS install`) et que la chaîne est correcte.'));
        }
        simpleExit();
    });
}


// --- Menu Principal Final ---

async function mainMenuLogic() {
    setTheme('hacker');
    console.log(boxen(chalk.bold('GoSpot Suite v4.0'), { padding: 1, borderColor: 'cyan' }));
    
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
        
        switch (choice.trim()) {
            case '1': await startClient(); break;
            case '2': await startServer(); break;
            case '3': await runScript('tools.sh'); break;
            case '4': await createSshKey(); break;
            case '5': await runScript('login.sh'); break;
            case '6': await connectToDatabase(); break;
            default: simpleExit(); break;
        }
        // Après chaque action (sauf la connexion DB qui quitte), on revient au menu
        if (!['6', '7'].includes(choice.trim())) {
            setTimeout(mainMenuLogic, 1000);
        }
    });
}

// --- Point d'entrée ---
async function main() {
    // Les commandes directes sont toujours possibles
    const command = process.argv[2];
    if (command === 'login') { await runScript('login.sh'); }
    else if (command === 'serve') { await startServer(); }
    else if (command === 'connect') { await startClient(); }
    else { mainMenuLogic(); } // Comportement par défaut : le menu
}

process.on('SIGINT', simpleExit);
main().catch(err => {
    console.error(chalk.red('Une erreur critique est survenue:'), err);
    simpleExit();
});
