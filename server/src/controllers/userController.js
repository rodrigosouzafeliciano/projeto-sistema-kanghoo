// Controlador de usuários — CRUD e perfil
const db = require('../config/db');
const logger = require('../utils/logger');

class UserController {
    
    // Rota: GET /api/dashboard
    static async getDashboardData(ctx) {
        ctx.status = 200;
        ctx.body = {
            message: "Dados do usuário carregados com sucesso!",
            usuario: { nome: ctx.state.usuario.nome }
        };
    }

    // Rota: GET /api/motorista/profile
    static async getMotoristaProfile(ctx) {
        try {
            const userId = ctx.state.usuario.userId;
            const usuarioResult = await db.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
            const veiculoResult = await db.query('SELECT * FROM veiculos WHERE usuario_id = $1', [userId]);
            const empresaResult = await db.query('SELECT * FROM empresas WHERE usuario_id = $1', [userId]);

            if (usuarioResult.rows.length === 0) {
                ctx.status = 404;
                ctx.body = { message: "Usuário não encontrado." };
                return;
            }

            ctx.status = 200;
            ctx.body = {
                usuario: usuarioResult.rows[0],
                veiculo: veiculoResult.rows.length > 0 ? veiculoResult.rows[0] : null,
                empresa: empresaResult.rows.length > 0 ? empresaResult.rows[0] : null
            };
        } catch (error) {
            logger.error('Erro ao buscar perfil do motorista:', error);
            ctx.status = 500;
            ctx.body = { message: "Erro ao buscar perfil." };
        }
    }

    // Rota: PUT /api/motorista/profile/update
    static async updateMotoristaProfile(ctx) {
        const userId = ctx.state.usuario.userId;
        const { usuario, veiculo, empresa } = ctx.request.body;

        const client = await db.getClient();
        await client.query('BEGIN');
        
        try {
            if (usuario) {
                const queryUsuario = `
                    UPDATE usuarios SET nome_completo = $1, celular = $2, data_nascimento = $3
                    WHERE id = $4
                `;
                await client.query(queryUsuario, [usuario.nome_completo, usuario.celular, usuario.data_nascimento, userId]);
            }

            if (veiculo) {
                const queryVeiculo = `
                    UPDATE veiculos SET placa = $1, renavam = $2, lotacao_maxima = $3
                    WHERE usuario_id = $4
                `;
                await client.query(queryVeiculo, [veiculo.placa, veiculo.renavam, veiculo.lotacao_maxima, userId]);
            }

            if (empresa) {
                const existEmpresa = await client.query('SELECT * FROM empresas WHERE usuario_id = $1', [userId]);
                if (existEmpresa.rows.length > 0) {
                    const queryEmpresa = `
                        UPDATE empresas SET razao_social = $1, nome_fantasia = $2, cnpj = $3
                        WHERE id = $4
                    `;
                    await client.query(queryEmpresa, [empresa.razao_social, empresa.nome_fantasia, empresa.cnpj, userId]);
                } else {
                    const queryNovaEmpresa = `
                        INSERT INTO empresas (usuario_id, razao_social, nome_fantasia, cnpj)
                        VALUES ($1, $2, $3, $4)
                    `;
                    await client.query(queryNovaEmpresa, [userId, empresa.razao_social, empresa.nome_fantasia, empresa.cnpj]);
                }
            }

            await client.query('COMMIT');
            client.release();
            ctx.status = 200;
            ctx.body = { message: "Perfil atualizado com sucesso!" };
        } catch (error) {
            await client.query('ROLLBACK');
            client.release();
            logger.error('Erro ao atualizar perfil do motorista:', error);
            ctx.status = 500;
            ctx.body = { message: "Erro ao atualizar perfil." };
        }
    }

    // Rota: GET /api/responsavel/profile
    static async getResponsavelProfile(ctx) {
        try {
            const userId = ctx.state.usuario.userId;
            const usuarioResult = await db.query('SELECT * FROM usuarios WHERE id = $1', [userId]);

            if (usuarioResult.rows.length === 0) {
                ctx.status = 404;
                ctx.body = { message: "Usuário não encontrado." };
                return;
            }

            ctx.status = 200;
            ctx.body = { usuario: usuarioResult.rows[0] };
        } catch (error) {
            logger.error('Erro ao buscar perfil do responsável:', error);
            ctx.status = 500;
            ctx.body = { message: "Erro ao buscar perfil." };
        }
    }
}

module.exports = UserController;
