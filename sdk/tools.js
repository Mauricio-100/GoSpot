const { runScript } = require('../utils.js'); // On importe notre utilitaire

async function installTools() {
    // Cette fonction appelle simplement le script shell correspondant.
    await runScript('tools.sh');
}

module.exports = { installTools };
