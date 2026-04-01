// Configuração do pool de conexão PostgreSQL (camada de infraestrutura)
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import logger from '../../utils/logger.mjs';

dotenv.config();

const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(poolConfig);

export const db = {
    query: (text, params) => {
        logger.debug(`Consulta executada: ${text}`);
        return pool.query(text, params);
    },
    getClient: () => pool.connect(),
    criarTabelas: async () => {
        const criarTabelaUsuarios = `
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome_completo VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(100) NOT NULL,
                tipo_cadastro VARCHAR(30) NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(criarTabelaUsuarios);
        logger.info('Tabelas do banco de dados verificadas/criadas.');
    }
};

export default db;
