// Middleware de limitação de requisições por IP
import { securityConfig } from '../../../infrastructure/config/security-config.mjs';

// Armazena contadores de requisições por IP
const rateLimitStore = new Map();

export const generalRateLimit = async (ctx, next) => {
    const clientIP = ctx.ip;
    const now = Date.now();
    const windowStart = now - securityConfig.rateLimit.windowMs;

    if (!rateLimitStore.has(clientIP)) {
        rateLimitStore.set(clientIP, []);
    }

    // Filtra apenas requisições dentro da janela de tempo
    let requests = rateLimitStore.get(clientIP);
    requests = requests.filter(time => time > windowStart);
    requests.push(now);
    rateLimitStore.set(clientIP, requests);

    // Bloqueia se exceder o limite
    if (requests.length > securityConfig.rateLimit.maxRequests) {
        ctx.status = 429;
        ctx.body = { error: 'Muitas requisições. Tente novamente mais tarde.' };
        return;
    }

    await next();
};
