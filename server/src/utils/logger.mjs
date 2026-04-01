// Serviço de logging — registra mensagens no console e em arquivo
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do arquivo de log
const LOG_DIR = path.join(__dirname, '../../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

// Criar diretório de logs se não existir
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

export const logger = {
    // Evento operacional normal
    info: (msg) => {
        const logMsg = `[INFO] ${new Date().toISOString()}: ${msg}\n`;
        console.log(logMsg.trim());
        fs.appendFileSync(LOG_FILE, logMsg);
    },
    // Erro que requer atenção
    error: (msg) => {
        const logMsg = `[ERROR] ${new Date().toISOString()}: ${msg}\n`;
        console.error(logMsg.trim());
        fs.appendFileSync(LOG_FILE, logMsg);
    },
    // Informação de depuração (apenas em desenvolvimento)
    debug: (msg) => {
        if (process.env.NODE_ENV !== 'production') {
            const logMsg = `[DEBUG] ${new Date().toISOString()}: ${msg}\n`;
            console.debug(logMsg.trim());
        }
    },
    // Situação inesperada que não impede o funcionamento
    warn: (msg) => {
        const logMsg = `[WARN] ${new Date().toISOString()}: ${msg}\n`;
        console.warn(logMsg.trim());
        fs.appendFileSync(LOG_FILE, logMsg);
    }
};

export default logger;