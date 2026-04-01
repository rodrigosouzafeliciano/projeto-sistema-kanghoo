// Hub de notificações em tempo real — integração com Socket.IO
const logger = require('../utils/logger');

class NotificationHub {
    constructor() {
        this.io = null;
        this.connectedClients = new Map();
    }

    // Inicializar com instância do Socket.IO
    initialize(io) {
        this.io = io;
        logger.info('NotificationHub inicializado.');
    }

    // Enviar notificação para um usuário específico
    sendToUser(userId, event, data) {
        if (!this.io) return;
        const socketId = this.connectedClients.get(userId);
        if (socketId) {
            this.io.to(socketId).emit(event, data);
        }
    }

    // Enviar notificação para todos os clientes conectados
    broadcast(event, data) {
        if (!this.io) return;
        this.io.emit(event, data);
    }

    // Registrar cliente conectado
    registerClient(userId, socketId) {
        this.connectedClients.set(userId, socketId);
    }

    // Remover cliente desconectado
    removeClient(userId) {
        this.connectedClients.delete(userId);
    }
}

module.exports = new NotificationHub();
