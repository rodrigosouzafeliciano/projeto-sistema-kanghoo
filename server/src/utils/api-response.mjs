// Utilitários de resposta da API e tratamento global de erros
import logger from './logger.mjs';

// Middleware global de tratamento de erros
export const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        
        const response = {
            success: false,
            message: err.message || 'Erro interno do servidor',
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        };

        if (ctx.status >= 500) {
            logger.error(`Erro crítico em ${ctx.path}: ${err.message}`);
        } else {
            logger.info(`Erro do cliente em ${ctx.path}: ${err.message}`);
        }

        ctx.body = response;
    }
};

// Funções padronizadas de resposta
export const apiResponse = {
    // Resposta de sucesso
    success: (ctx, data, status = 200) => {
        ctx.status = status;
        ctx.body = {
            success: true,
            data
        };
    },
    // Resposta de erro
    error: (ctx, message, status = 400) => {
        ctx.status = status;
        ctx.body = {
            success: false,
            message
        };
    }
};

export default { errorHandler, apiResponse };