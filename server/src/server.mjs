// Ponto de entrada do servidor Kanghoo
import app from './app.mjs';
import db from './infrastructure/config/db.mjs';
import logger from './utils/logger.mjs';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Inicialização das tabelas do banco de dados
        try {
            await db.criarTabelas();
        } catch (dbError) {
            logger.warn(`Banco de dados indisponível: ${dbError.message}. O servidor iniciará sem conexão ao banco.`);
        }
        
        const server = http.createServer(app.callback());

        // Configuração do WebSocket (Socket.IO)
        const io = new SocketServer(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Conexão de clientes via WebSocket
        io.on('connection', (socket) => {
            logger.info(`Cliente WebSocket conectado: ${socket.id}`);
        });

        server.listen(PORT, () => {
            logger.info(`Servidor Kanghoo iniciado em http://localhost:${PORT}`);
        });

        // Desligamento gracioso
        const shutdown = (signal) => {
            logger.info(`Sinal ${signal} recebido — encerrando servidor...`);
            server.close(() => {
                logger.info('Servidor HTTP encerrado.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        logger.error(`Erro crítico na inicialização: ${error.message}`);
        process.exit(1);
    }
};

startServer();
