const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk');
const os = require('os');
const fs = require('fs');
const boxen = require('boxen');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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

function getOsInfo() {
    const platform = os.platform();
    const arch = os.arch();
    let distro = 'Inconnue';

    if (platform === 'linux') {
        try {
            const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
            const match = osRelease.match(/^PRETTY_NAME="(.+?)"/m);
            if (match) {
                distro = match[1];
            }
        } catch (e) {
            distro = 'Linux';
        }
    }
    return { platform, arch, distro };
}

function checkCompatibility() {
    const { platform } = getOsInfo();

    if (platform === 'linux') { return; }
    if (platform === 'win32') {
        console.log(boxen(chalk.bold.yellow('GoSpot pour Windows'), { title: 'Bientôt disponible !' }));
        simpleExit();
    }
    console.log(boxen(chalk.bold.red('Plateforme non supportée'), {}));
    console.log(`Désolé, GoSpot n'est pas encore compatible avec '${platform}'.`);
    process.exit(1);
}

async function findServerIp() {
    try {
        const { stdout } = await exec("ifconfig 2>/dev/null | grep -E 'inet (192\\.168\\.[0-9]+\\.1|172\\.20\\.10\\.1)' | awk '{print $2}'");
        if (stdout.trim()) return stdout.trim();
    } catch (e) { /* continue */ }

    try {
        const { stdout } = await exec("ip a 2>/dev/null | grep -E 'inet (192\\.168\\.[0-9]+\\.1|172\\.20\\.10\\.1)' | awk '{print $2}'");
        if (stdout.trim()) return stdout.trim();
    } catch (e) { /* continue */ }
    
    try {
        await exec("ping -c 1 -W 2 172.20.10.1 > /dev/null 2>&1");
        return "172.20.10.1";
    } catch (e) { /* continue */ }

    return null;
}

module.exports = {
    setTheme,
    runScript,
    simpleExit,
    getOsInfo,
    checkCompatibility,
    findServerIp
};
