const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk');

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

module.exports = { setTheme, runScript, simpleExit };
