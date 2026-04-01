// Configuração centralizada de segurança (ESM)
import dotenv from 'dotenv';
dotenv.config();

// Políticas de segurança do sistema
export const securityConfig = {
    // Autenticação JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'kanghoo_secret_2026',
        expiresIn: '24h'
    },
    // Hash de senhas
    bcrypt: {
        saltRounds: 12
    },
    // Limitação de requisições por IP
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 100
    }
};

// Headers HTTP de segurança
export const getSecurityHeaders = () => ({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: http://localhost:*; connect-src 'self'"
});
