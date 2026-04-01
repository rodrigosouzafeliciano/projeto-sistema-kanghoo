const { securityConfig } = require('../config/security-config');

const rateLimitStore = new Map();

const rateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
    return async (ctx, next) => {
        const clientIP = ctx.request.ip || ctx.request.socket.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (rateLimitStore.has(clientIP)) {
            const requests = rateLimitStore.get(clientIP).filter(time => time > windowStart);
            rateLimitStore.set(clientIP, requests);
        }
        
        const requests = rateLimitStore.get(clientIP) || [];
        
        if (requests.length >= maxRequests) {
            ctx.status = 429;
            ctx.body = { 
                error: 'Muitas tentativas. Tente novamente em alguns minutos.',
                retryAfter: Math.ceil(windowMs / 1000)
            };
            ctx.set('Retry-After', Math.ceil(windowMs / 1000));
            return;
        }
        
        requests.push(now);
        rateLimitStore.set(clientIP, requests);
        
        await next();
    };
};

const loginRateLimit = rateLimit(
    securityConfig.rateLimit.loginWindowMs, 
    securityConfig.rateLimit.loginMaxRequests
);

const generalRateLimit = rateLimit(
    securityConfig.rateLimit.windowMs,
    securityConfig.rateLimit.maxRequests
);

const cadastroRateLimit = rateLimit(
    15 * 60 * 1000,
    10
);

module.exports = {
    rateLimit,
    loginRateLimit,
    generalRateLimit,
    cadastroRateLimit
};
