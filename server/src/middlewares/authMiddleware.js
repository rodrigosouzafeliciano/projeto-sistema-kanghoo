// Middleware de autenticação JWT
const jwt = require('jsonwebtoken');
const { securityConfig, sanitizeForLog } = require('../config/security-config');
const logger = require('../utils/logger');
const db = require('../config/db');

const autenticar = async (ctx, next) => {
    const authHeader = ctx.headers.authorization;
    if (!authHeader) {
        ctx.status = 401;
        ctx.body = { message: 'Token de autenticação não fornecido.' };
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, securityConfig.jwt.secret);
        ctx.state.usuario = decoded;
        await next();
    } catch (err) {
        logger.error('Erro na verificação do token:', err.message);
        ctx.status = 401;
        ctx.body = { message: 'Token inválido ou expirado.' };
    }
};

module.exports = { autenticar };
