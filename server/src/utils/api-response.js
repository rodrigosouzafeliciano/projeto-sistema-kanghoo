// Wrapper CommonJS para o módulo api-response
// Utilizado pelas rotas legadas via require('../utils/api-response')

const apiResponse = {
    success: (ctx, data, status = 200) => {
        ctx.status = status;
        ctx.body = { success: true, data };
    },
    error: (ctx, message, status = 400) => {
        ctx.status = status;
        ctx.body = { success: false, message };
    }
};

module.exports = apiResponse;
