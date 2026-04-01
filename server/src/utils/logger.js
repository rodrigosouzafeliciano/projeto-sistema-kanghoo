// Wrapper CommonJS para o módulo de logging
// Utilizado pelas rotas legadas via require('../utils/logger')
const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logger = {
    info: (msg, ...args) => {
        const extra = args.length > 0 ? ' ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') : '';
        const logMsg = `[INFO] ${new Date().toISOString()}: ${msg}${extra}\n`;
        console.log(logMsg.trim());
        fs.appendFileSync(LOG_FILE, logMsg);
    },
    error: (msg, ...args) => {
        const extra = args.length > 0 ? ' ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') : '';
        const logMsg = `[ERROR] ${new Date().toISOString()}: ${msg}${extra}\n`;
        console.error(logMsg.trim());
        fs.appendFileSync(LOG_FILE, logMsg);
    },
    debug: (msg) => {
        if (process.env.NODE_ENV !== 'production') {
            const logMsg = `[DEBUG] ${new Date().toISOString()}: ${msg}\n`;
            console.debug(logMsg.trim());
        }
    },
    warn: (msg, ...args) => {
        const extra = args.length > 0 ? ' ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') : '';
        const logMsg = `[WARN] ${new Date().toISOString()}: ${msg}${extra}\n`;
        console.warn(logMsg.trim());
        fs.appendFileSync(LOG_FILE, logMsg);
    }
};

module.exports = logger;
