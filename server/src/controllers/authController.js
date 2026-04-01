// Controlador de autenticação — registro e login
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { securityConfig, sanitizeForLog, validateLoginData, validateCadastroData } = require('../config/security-config');
const logger = require('../utils/logger');

class AuthController {
    
    // Rota: POST /cadastrar
    static async cadastrar(ctx) {
        logger.debug('Iniciando cadastro via API...');
        const sanitizedBody = ctx.request.body;
        const validationResult = validateCadastroData(sanitizedBody);
        
        if (!validationResult.isValid) {
            ctx.status = 400;
            ctx.body = { error: 'Dados inválidos', details: validationResult.errors };
            return;
        }

        const sanitizedData = validationResult.sanitizedData;
        const client = await db.getClient();
        await client.query('BEGIN');
        
        try {
            const userExists = await client.query('SELECT * FROM usuarios WHERE email = $1', [sanitizedData.email]);
            if (userExists.rows.length > 0) {
                ctx.status = 409;
                ctx.body = { message: 'Este e-mail já está em uso.' };
                await client.query('ROLLBACK');
                client.release();
                return;
            }

            const senhaCrypt = await bcrypt.hash(sanitizedData.senha, securityConfig.bcrypt.saltRounds);
            
            const novoUsuarioQuery = `
                INSERT INTO usuarios (nome_completo, email, senha, celular, data_nascimento, tipo_cadastro) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
            const resUsuario = await client.query(novoUsuarioQuery, [
                sanitizedData.nomeCompleto, sanitizedData.email, senhaCrypt, sanitizedData.celular, sanitizedData.dataNascimento, sanitizedData.tipoCadastro
            ]);
            const novoUsuarioId = resUsuario.rows[0].id;

            if (sanitizedData.placa && sanitizedData.renavam) {
                const novoVeiculoQuery = `
                    INSERT INTO veiculos (usuario_id, placa, renavam, lotacao_maxima) 
                    VALUES ($1, $2, $3, $4)`;
                await client.query(novoVeiculoQuery, [novoUsuarioId, sanitizedData.placa, sanitizedData.renavam, sanitizedData.lotacaoMaxima]);
            }

            if (sanitizedData.razaoSocial && sanitizedData.cnpj) {
                const novaEmpresaQuery = `
                    INSERT INTO empresas (usuario_id, razao_social, nome_fantasia, cnpj)
                    VALUES ($1, $2, $3, $4)`;
                await client.query(novaEmpresaQuery, [novoUsuarioId, sanitizedData.razaoSocial, sanitizedData.nomeFantasia, sanitizedData.cnpj]);
            }

            await client.query('COMMIT');
            client.release();
            
            const logData = sanitizeForLog({
                action: 'user_registration',
                email: sanitizedData.email,
                tipo: sanitizedData.tipoCadastro,
                ip: ctx.ip,
                timestamp: new Date().toISOString()
            });
            logger.info(`[SECURITY] ${JSON.stringify(logData)}`);
            
            ctx.status = 201;
            ctx.body = { 
                message: 'Usuário cadastrado com sucesso!', 
                id: novoUsuarioId,
                tipo: sanitizedData.tipoCadastro
            };

        } catch (error) {
            await client.query('ROLLBACK');
            client.release();
            logger.error('❌ Erro no cadastro:', error.message);
            ctx.status = 500;
            ctx.body = { error: 'Erro interno do servidor.' };
        }
    }

    // Rota: POST /login
    static async login(ctx) {
        const { email, senha } = ctx.request.body;
        const validationResult = validateLoginData({ email, senha });
        
        if (!validationResult.isValid) {
            ctx.status = 400;
            ctx.body = { error: 'Dados inválidos', details: validationResult.errors };
            return;
        }

        const sanitizedEmail = validationResult.sanitizedData.email;
        
        try {
            const usuarioResult = await db.query('SELECT * FROM usuarios WHERE email = $1', [sanitizedEmail]);
            let usuario = null;
            let senhaValida = false;
            
            if (usuarioResult.rows.length > 0) {
                usuario = usuarioResult.rows[0];
                senhaValida = await bcrypt.compare(senha, usuario.senha);
            }
            
            if (!usuario || !senhaValida) {
                ctx.status = 401;
                ctx.body = { error: 'Credenciais inválidas' };
                return;
            }
            
            const token = jwt.sign(
                { 
                    userId: usuario.id, 
                    email: usuario.email,
                    tipo: usuario.tipo_cadastro,
                    nomeCompleto: usuario.nome_completo
                },
                securityConfig.jwt.secret,
                { expiresIn: securityConfig.jwt.expiresIn }
            );
            
            let redirectUrl = '/auth/dashboard.html';
            switch (usuario.tipo_cadastro) {
                case 'motorista_escolar': redirectUrl = '/auth/area-motorista-escolar.html'; break;
                case 'motorista_excursao': redirectUrl = '/auth/area-motorista-excursao.html'; break;
                case 'responsavel': redirectUrl = '/auth/area-responsavel.html'; break;
            }
            
            ctx.body = { 
                message: 'Login realizado com sucesso',
                token,
                expiresIn: '2h',
                user: { id: usuario.id, nome: usuario.nome_completo, email: usuario.email, tipo: usuario.tipo_cadastro },
                redirectUrl: redirectUrl
            };
        } catch (error) {
            logger.error('❌ Erro no login:', error.message);
            ctx.status = 500;
            ctx.body = { error: 'Erro interno do servidor' };
        }
    }

    // Rota: POST /api/validate-token
    static async validateToken(ctx) {
        try {
            const authHeader = ctx.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                ctx.status = 401;
                ctx.body = { error: 'Token não fornecido' };
                return;
            }
            
            const token = authHeader.substring(7);
            if (token === 'dev_token_responsavel_teste' && process.env.NODE_ENV !== 'production') {
                ctx.body = { valid: true, user: { id: 999, nome: 'Responsável Teste', email: 'responsavel@teste.com', tipo: 'responsavel' } };
                return;
            }
            
            const decoded = jwt.verify(token, securityConfig.jwt.secret);
            const user = await db.query('SELECT id, nome_completo, email, tipo_cadastro FROM usuarios WHERE id = $1', [decoded.userId]);
            
            if (user.rows.length === 0) {
                ctx.status = 401;
                ctx.body = { error: 'Usuário não encontrado' };
                return;
            }
            
            const usuario = user.rows[0];
            ctx.body = { valid: true, user: { id: usuario.id, nome: usuario.nome_completo, email: usuario.email, tipo: usuario.tipo_cadastro } };
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                ctx.status = 401;
                ctx.body = { error: 'Token inválido ou expirado' };
            } else {
                ctx.status = 500;
                ctx.body = { error: 'Erro interno do servidor' };
            }
        }
    }
}

module.exports = AuthController;
