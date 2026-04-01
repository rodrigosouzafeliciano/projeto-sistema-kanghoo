// Controlador de contato — formulário do site
const db = require('../config/db');
const logger = require('../utils/logger');

class ContactController {
    
    // Rota: POST /api/contact
    static async enviarMensagem(ctx) {
        const { nome, email, telefone, assunto, mensagem, website } = ctx.request.body || {};

        // Honeypot simples contra bots
        if (website) {
            ctx.status = 200;
            ctx.body = { message: 'OK' };
            return;
        }

        if (!nome || !email || !mensagem) {
            ctx.status = 400;
            ctx.body = { message: 'Nome, e-mail e mensagem são obrigatórios.' };
            return;
        }

        try {
            const insertQuery = `
                INSERT INTO contatos (nome, email, telefone, assunto, mensagem, origem)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id;
            `;
            const res = await db.query(insertQuery, [
                nome,
                email,
                telefone || null,
                assunto || null,
                mensagem,
                'site'
            ]);
            ctx.status = 201;
            ctx.body = { message: 'Mensagem enviada com sucesso!', id: res.rows[0].id };
        } catch (error) {
            logger.error('Erro ao salvar contato:', error);
            ctx.status = 500;
            ctx.body = { message: 'Erro interno do servidor.' };
        }
    }
}

module.exports = ContactController;
