// Rotas legadas do sistema Kanghoo
const Router = require('koa-router');
const router = new Router();
const db = require('../config/db');
const logger = require('../utils/logger');
const { autenticar } = require('../middlewares/authMiddleware');
const securityConfig = require('../config/security-config').securityConfig;


router.get('/api/dashboard', autenticar, async ctx => {
    ctx.status = 200;
    ctx.body = {
        message: "Dados do usuário carregados com sucesso!",
        usuario: { nome: ctx.state.usuario.nome }
    };
});

// Rota de perfil do motorista (versão em inglês)
router.get('/api/motorista/profile', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        const usuarioQuery = 'SELECT * FROM usuarios WHERE id = $1';
        const veiculoQuery = 'SELECT * FROM veiculos WHERE usuario_id = $1';
        const empresaQuery = 'SELECT * FROM empresas WHERE usuario_id = $1';

        const usuarioResult = await db.query(usuarioQuery, [userId]);
        const veiculoResult = await db.query(veiculoQuery, [userId]);
        const empresaResult = await db.query(empresaQuery, [userId]);

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
        logger.error("Erro ao buscar dados do perfil:", error);
        ctx.status = 500;
        ctx.body = { message: "Erro interno do servidor." };
    }
});

// Rota de perfil do motorista (versão em português)
router.get('/api/motorista/perfil', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        const usuarioQuery = 'SELECT * FROM usuarios WHERE id = $1';
        const veiculoQuery = 'SELECT * FROM veiculos WHERE usuario_id = $1';
        const empresaQuery = 'SELECT * FROM empresas WHERE usuario_id = $1';

        const usuarioResult = await db.query(usuarioQuery, [userId]);
        const veiculoResult = await db.query(veiculoQuery, [userId]);
        const empresaResult = await db.query(empresaQuery, [userId]);

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
        logger.error("Erro ao buscar dados do perfil:", error);
        ctx.status = 500;
        ctx.body = { message: "Erro interno do servidor." };
    }
});

// Rota para listar crianças do motorista
router.get('/api/motorista/criancas', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        
        const resultado = await db.query(`
            SELECT c.*, u.nome_completo as responsavel_nome, u.email as responsavel_email,
                   r.nome_rota, r.horario_inicio, r.horario_fim
            FROM criancas c
            LEFT JOIN usuarios u ON c.responsavel_id = u.id
            LEFT JOIN rotas r ON c.rota_id = r.id
            WHERE c.motorista_id = $1 AND c.ativo = true
            ORDER BY c.nome_completo
        `, [userId]);

        ctx.status = 200;
        ctx.body = {
            sucesso: true,
            criancas: resultado.rows
        };
    } catch (error) {
        logger.error('Erro ao listar crianças:', error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        };
    }
});

// Rota de perfil do responsável
router.get('/api/responsavel/perfil', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        const usuarioQuery = 'SELECT * FROM usuarios WHERE id = $1';
        const assinaturaQuery = 'SELECT * FROM assinaturas WHERE usuario_id = $1';

        const usuarioResult = await db.query(usuarioQuery, [userId]);
        const assinaturaResult = await db.query(assinaturaQuery, [userId]);

        if (usuarioResult.rows.length === 0) {
            ctx.status = 404;
            ctx.body = { message: "Usuário não encontrado." };
            return;
        }

        ctx.status = 200;
        ctx.body = {
            usuario: usuarioResult.rows[0],
            assinatura: assinaturaResult.rows.length > 0 ? assinaturaResult.rows[0] : null
        };

    } catch (error) {
        logger.error("Erro ao buscar dados do perfil do responsável:", error);
        ctx.status = 500;
        ctx.body = { message: "Erro interno do servidor." };
    }
});

// Rota para status da assinatura do responsável
router.get('/api/responsavel/assinatura', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        
        const planoQuery = `
            SELECT 
                p.id,
                p.tipo_plano as nome,
                p.limite_rotas,
                p.limite_usuarios,
                p.data_inicio,
                p.data_fim as data_vencimento,
                p.ativo,
                p.criado_em,
                p.atualizado_em
            FROM planos_assinatura p
            WHERE p.usuario_id = $1
            ORDER BY p.criado_em DESC
            LIMIT 1
        `;

        const planoResult = await db.query(planoQuery, [userId]);

        if (planoResult.rows.length === 0) {
            ctx.status = 200;
            ctx.body = {
                assinatura: null,
                status: 'sem_assinatura',
                message: "Usuário não possui assinatura ativa."
            };
            return;
        }

        const plano = planoResult.rows[0];
        const agora = new Date();
        const dataVencimento = new Date(plano.data_vencimento);
        
        let status = 'ativa';
        if (dataVencimento < agora) {
            status = 'vencida';
        } else if (!plano.ativo) {
            status = 'cancelada';
        }

        ctx.status = 200;
        ctx.body = {
            assinatura: plano,
            status: status,
            dias_restantes: Math.ceil((dataVencimento - agora) / (1000 * 60 * 60 * 24))
        };

    } catch (error) {
        logger.error("Erro ao buscar status da assinatura:", error);
        ctx.status = 500;
        ctx.body = { message: "Erro interno do servidor." };
    }
});

// Rota para listar crianças do responsável
router.get('/api/responsavel/criancas', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        
        const criancasQuery = `
            SELECT c.*, r.nome_rota, r.horario_inicio, r.horario_fim,
                   u.nome_completo as motorista_nome, u.telefone as motorista_telefone
            FROM criancas c
            LEFT JOIN rotas r ON c.rota_id = r.id
            LEFT JOIN usuarios u ON c.motorista_id = u.id
            WHERE c.responsavel_id = $1 AND c.ativo = true
            ORDER BY c.nome_completo
        `;

        const criancasResult = await db.query(criancasQuery, [userId]);

        ctx.status = 200;
        ctx.body = {
            sucesso: true,
            criancas: criancasResult.rows,
            total: criancasResult.rows.length
        };

    } catch (error) {
        logger.error("Erro ao listar crianças do responsável:", error);
        ctx.status = 500;
        ctx.body = { 
            sucesso: false,
            message: "Erro interno do servidor." 
        };
    }
});

// Rota para iniciar conferência de crianças
router.post('/api/motorista/conferencia', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        const { rota_id, tipo_conferencia } = ctx.request.body;

        if (!rota_id || !tipo_conferencia) {
            ctx.status = 400;
            ctx.body = {
                sucesso: false,
                message: "Rota ID e tipo de conferência são obrigatórios."
            };
            return;
        }

        // Verificar se a rota pertence ao motorista
        const rotaQuery = 'SELECT * FROM rotas WHERE id = $1 AND motorista_id = $2';
        const rotaResult = await db.query(rotaQuery, [rota_id, userId]);

        if (rotaResult.rows.length === 0) {
            ctx.status = 403;
            ctx.body = {
                sucesso: false,
                message: "Rota não encontrada ou não pertence ao motorista."
            };
            return;
        }

        // Criar registro de conferência
        const conferenciaQuery = `
            INSERT INTO conferencias (motorista_id, rota_id, tipo_conferencia, data_inicio, status)
            VALUES ($1, $2, $3, NOW(), 'em_andamento')
            RETURNING *
        `;

        const conferenciaResult = await db.query(conferenciaQuery, [userId, rota_id, tipo_conferencia]);

        ctx.status = 200;
        ctx.body = {
            sucesso: true,
            conferencia: conferenciaResult.rows[0],
            message: "Conferência iniciada com sucesso."
        };

    } catch (error) {
        logger.error("Erro ao iniciar conferência:", error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: "Erro interno do servidor."
        };
    }
});

// Rota para cadastrar nova criança
router.post('/api/responsavel/criancas', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        const { 
            nome_completo, 
            data_nascimento, 
            endereco_residencial, 
            escola, 
            endereco_escola,
            rota_id,
            observacoes 
        } = ctx.request.body;

        // Validação básica
        if (!nome_completo || !data_nascimento || !endereco_residencial || !escola) {
            ctx.status = 400;
            ctx.body = {
                sucesso: false,
                message: "Nome completo, data de nascimento, endereço residencial e escola são obrigatórios."
            };
            return;
        }

        // Inserir nova criança
        const criancaQuery = `
            INSERT INTO criancas (
                responsavel_id, nome_completo, data_nascimento, 
                endereco_residencial, escola, endereco_escola, 
                rota_id, observacoes, ativo, criado_em
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
            RETURNING *
        `;

        const criancaResult = await db.query(criancaQuery, [
            userId, nome_completo, data_nascimento, 
            endereco_residencial, escola, endereco_escola, 
            rota_id, observacoes
        ]);

        ctx.status = 201;
        ctx.body = {
            sucesso: true,
            crianca: criancaResult.rows[0],
            message: "Criança cadastrada com sucesso."
        };

    } catch (error) {
        logger.error("Erro ao cadastrar criança:", error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: "Erro interno do servidor."
        };
    }
});

// Rota para preferências de notificação
router.get('/api/responsavel/notificacoes', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        
        const preferencesQuery = `
            SELECT * FROM notification_preferences 
            WHERE user_id = $1
        `;

        const preferencesResult = await db.query(preferencesQuery, [userId]);

        if (preferencesResult.rows.length === 0) {
            // Criar preferências padrão se não existirem
            const defaultPreferencesQuery = `
                INSERT INTO notification_preferences (
                    user_id, email_notifications, sms_notifications, 
                    push_notifications, arrival_notifications, 
                    departure_notifications, delay_notifications,
                    emergency_notifications, created_at
                )
                VALUES ($1, true, false, true, true, true, true, true, NOW())
                RETURNING *
            `;

            const defaultResult = await db.query(defaultPreferencesQuery, [userId]);
            
            ctx.status = 200;
            ctx.body = {
                sucesso: true,
                preferencias: defaultResult.rows[0],
                message: "Preferências padrão criadas."
            };
        } else {
            ctx.status = 200;
            ctx.body = {
                sucesso: true,
                preferencias: preferencesResult.rows[0]
            };
        }

    } catch (error) {
        logger.error("Erro ao buscar preferências de notificação:", error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: "Erro interno do servidor."
        };
    }
});

// Rota para buscar perfil de usuários (motoristas e responsáveis)
router.get('/api/usuarios/perfil', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        
        // Buscar dados do usuário
        const usuarioQuery = `
            SELECT u.id, u.nome_completo, u.email, u.celular, u.tipo_cadastro, 
                   u.data_nascimento, u.criado_em
            FROM usuarios u 
            WHERE u.id = $1
        `;
        
        const usuarioResult = await db.query(usuarioQuery, [userId]);
        
        if (usuarioResult.rows.length === 0) {
            ctx.status = 404;
            ctx.body = {
                sucesso: false,
                message: 'Usuário não encontrado'
            };
            return;
        }
        
        const dadosUsuario = usuarioResult.rows[0];
        let dadosAdicionais = {};
        
        // Se for motorista, buscar dados do veículo e empresa
        if (dadosUsuario.tipo_cadastro === 'motorista_escolar' || dadosUsuario.tipo_cadastro === 'motorista_excursao') {
            const veiculoQuery = `
                SELECT v.placa, v.renavam, v.lotacao_maxima
                FROM veiculos v
                WHERE v.usuario_id = $1
            `;
            
            const veiculoResult = await db.query(veiculoQuery, [userId]);
            
            if (veiculoResult.rows.length > 0) {
                dadosAdicionais.veiculo = veiculoResult.rows[0];
            }
            
            const empresaQuery = `
                SELECT e.razao_social, e.nome_fantasia, e.cnpj
                FROM empresas e
                WHERE e.usuario_id = $1
            `;
            
            const empresaResult = await db.query(empresaQuery, [userId]);
            
            if (empresaResult.rows.length > 0) {
                dadosAdicionais.empresa = empresaResult.rows[0];
            }
        }
        
        // Se for responsável, buscar dados do plano (se houver)
        if (dadosUsuario.tipo_cadastro === 'responsavel') {
            const planoQuery = `
                SELECT p.id, p.tipo_plano, p.limite_rotas, p.limite_usuarios, p.ativo
                FROM planos_assinatura p
                WHERE p.usuario_id = $1 AND p.ativo = true
            `;
            
            const planoResult = await db.query(planoQuery, [userId]);
            
            if (planoResult.rows.length > 0) {
                dadosAdicionais.plano = planoResult.rows[0];
            }
        }
        
        ctx.status = 200;
        ctx.body = {
            sucesso: true,
            dados: {
                ...dadosUsuario,
                ...dadosAdicionais
            }
        };
    } catch (error) {
        logger.error('Erro ao buscar perfil do usuário:', error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: 'Erro interno do servidor'
        };
    }
});

// Rota para buscar status da assinatura
router.get('/api/assinaturas/status', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        
        // Buscar plano ativo do usuário
        const planoQuery = `
            SELECT p.id, p.tipo_plano as plano_nome, p.limite_rotas, p.limite_usuarios,
                   p.data_inicio, p.data_fim, p.ativo, p.criado_em
            FROM planos_assinatura p
            WHERE p.usuario_id = $1
            ORDER BY p.criado_em DESC
            LIMIT 1
        `;
        
        const planoResult = await db.query(planoQuery, [userId]);
        
        if (planoResult.rows.length === 0) {
            ctx.status = 200;
            ctx.body = {
                sucesso: true,
                dados: {
                    status: 'sem_plano',
                    message: 'Usuário não possui plano ativo',
                    plano_atual: null,
                    dias_restantes: 0,
                    vencimento: null
                }
            };
            return;
        }
        
        const dadosPlano = planoResult.rows[0];
        const hoje = new Date();
        let diasRestantes = 0;
        let statusFinal = dadosPlano.ativo ? 'ativa' : 'inativa';
        
        // Verificar se há data de fim e calcular dias restantes
        if (dadosPlano.data_fim) {
            const dataVencimento = new Date(dadosPlano.data_fim);
            diasRestantes = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
            
            // Verificar se o plano venceu
            if (diasRestantes <= 0 && dadosPlano.ativo) {
                statusFinal = 'vencida';
                
                // Atualizar status no banco
                await db.query(
                    'UPDATE planos_assinatura SET ativo = $1 WHERE id = $2',
                    [false, dadosPlano.id]
                );
            }
        }
        
        ctx.status = 200;
        ctx.body = {
            sucesso: true,
            dados: {
                id: dadosPlano.id,
                status: statusFinal,
                plano_atual: {
                    id: dadosPlano.id,
                    nome: dadosPlano.plano_nome,
                    limite_rotas: dadosPlano.limite_rotas,
                    limite_usuarios: dadosPlano.limite_usuarios
                },
                data_inicio: dadosPlano.data_inicio,
                data_vencimento: dadosPlano.data_fim,
                dias_restantes: Math.max(0, diasRestantes),
                valor: null, // Não há valor na tabela planos_assinatura
                renovacao_automatica: false // Pode ser implementado futuramente
            }
        };
    } catch (error) {
        logger.error('Erro ao buscar status da assinatura:', error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: 'Erro interno do servidor'
        };
    }
});

// Rota para listar planos disponíveis
router.get('/api/planos', async ctx => {
    try {
        // Buscar todos os planos ativos
        const planosQuery = `
            SELECT id, tipo_plano, limite_rotas, limite_usuarios, 
                   ativo, criado_em
            FROM planos_assinatura 
            WHERE ativo = true
            ORDER BY tipo_plano ASC
        `;
        
        const planosResult = await db.query(planosQuery);
        
        // Formatar dados dos planos
        const planosFormatados = planosResult.rows.map(plano => {
            return {
                id: plano.id,
                nome: plano.tipo_plano,
                tipo_plano: plano.tipo_plano,
                limite_rotas: plano.limite_rotas,
                limite_usuarios: plano.limite_usuarios,
                ativo: plano.ativo,
                criado_em: plano.criado_em
            };
        });
        
        ctx.status = 200;
        ctx.body = {
            sucesso: true,
            dados: planosFormatados,
            total: planosFormatados.length
        };
    } catch (error) {
        logger.error('Erro ao buscar planos:', error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: 'Erro interno do servidor'
        };
    }
});

// Rota para listar crianças (responsáveis)
router.get('/api/criancas', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        
        // Verificar se é responsável
        const usuarioQuery = `
            SELECT tipo_cadastro FROM usuarios WHERE id = $1
        `;
        const usuarioResult = await db.query(usuarioQuery, [userId]);
        
        if (usuarioResult.rows.length === 0 || usuarioResult.rows[0].tipo_cadastro !== 'responsavel') {
            ctx.status = 403;
            ctx.body = {
                sucesso: false,
                message: 'Acesso negado. Apenas responsáveis podem acessar esta rota.'
            };
            return;
        }
        
        // Buscar crianças do responsável
        const criancasQuery = `
            SELECT c.id, c.nome_completo, c.data_nascimento, c.cpf, c.endereco_residencial,
                   c.escola, c.endereco_escola, c.observacoes_medicas, c.criado_em,
                   r.nome_rota as rota_nome, r.horario_ida, r.horario_volta,
                   u.nome_completo as motorista_nome, u.celular as motorista_telefone
            FROM criancas c
            LEFT JOIN rotas_escolares r ON c.rota_id = r.id
            LEFT JOIN usuarios u ON r.usuario_id = u.id
            WHERE c.responsavel_id = $1
            ORDER BY c.nome_completo ASC
        `;
        
        const criancasResult = await db.query(criancasQuery, [userId]);
        
        ctx.status = 200;
        ctx.body = {
            sucesso: true,
            dados: criancasResult.rows,
            total: criancasResult.rows.length
        };
    } catch (error) {
        logger.error('Erro ao buscar crianças:', error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: 'Erro interno do servidor'
        };
    }
});

// Rota para cadastrar crianças (responsáveis)
router.post('/api/criancas', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        const { nome, data_nascimento, cpf, endereco, escola, serie, turno, observacoes } = ctx.request.body;
        
        // Verificar se é responsável
        const usuarioQuery = `
            SELECT tipo_cadastro FROM usuarios WHERE id = $1
        `;
        const usuarioResult = await db.query(usuarioQuery, [userId]);
        
        if (usuarioResult.rows.length === 0 || usuarioResult.rows[0].tipo_cadastro !== 'responsavel') {
            ctx.status = 403;
            ctx.body = {
                sucesso: false,
                message: 'Acesso negado. Apenas responsáveis podem cadastrar crianças.'
            };
            return;
        }
        
        // Validar campos obrigatórios
        if (!nome || !data_nascimento || !cpf || !endereco || !escola) {
            ctx.status = 400;
            ctx.body = {
                sucesso: false,
                message: 'Campos obrigatórios: nome, data_nascimento, cpf, endereco, escola'
            };
            return;
        }
        
        // Verificar se CPF já existe
        const cpfExistenteQuery = `
            SELECT id FROM criancas WHERE cpf = $1
        `;
        const cpfExistenteResult = await db.query(cpfExistenteQuery, [cpf]);
        
        if (cpfExistenteResult.rows.length > 0) {
            ctx.status = 409;
            ctx.body = {
                sucesso: false,
                message: 'CPF já cadastrado no sistema'
            };
            return;
        }
        
        // Inserir criança
        const inserirCriancaQuery = `
            INSERT INTO criancas (nome_completo, data_nascimento, cpf, endereco_residencial, escola, 
                                endereco_escola, responsavel_id, ativo, criado_em)
            VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
            RETURNING id, nome_completo, data_nascimento, cpf, endereco_residencial, escola, endereco_escola
        `;
        
        const criancaResult = await db.query(inserirCriancaQuery, [
            nome, data_nascimento, cpf, endereco, escola, escola, userId
        ]);
        
        ctx.status = 201;
        ctx.body = {
            sucesso: true,
            message: 'Criança cadastrada com sucesso',
            dados: criancaResult.rows[0]
        };
    } catch (error) {
        logger.error('Erro ao cadastrar criança:', error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: 'Erro interno do servidor'
        };
    }
});

// Rota para buscar preferências de notificação
router.get('/api/notificacoes/preferencias', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        
        // Buscar preferências existentes
        const preferenciaQuery = `
            SELECT * FROM preferencias_notificacao WHERE usuario_id = $1
        `;
        const preferenciaResult = await db.query(preferenciaQuery, [userId]);
        
        if (preferenciaResult.rows.length === 0) {
            // Criar preferências padrão se não existirem
            const criarPreferenciaQuery = `
                INSERT INTO preferencias_notificacao 
                (usuario_id, email_ativo, sms_ativo, push_ativo, 
                 notif_chegada, notif_saida, notif_atraso, notif_emergencia, 
                 criado_em, atualizado_em)
                VALUES ($1, true, true, true, true, true, true, true, NOW(), NOW())
                RETURNING *
            `;
            const novaPreferenciaResult = await db.query(criarPreferenciaQuery, [userId]);
            
            ctx.status = 200;
            ctx.body = {
                sucesso: true,
                dados: novaPreferenciaResult.rows[0]
            };
        } else {
            ctx.status = 200;
            ctx.body = {
                sucesso: true,
                dados: preferenciaResult.rows[0]
            };
        }
    } catch (error) {
        logger.error('Erro ao buscar preferências de notificação:', error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: 'Erro interno do servidor'
        };
    }
});

// Rota para buscar notificações
router.get('/api/notificacoes', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        const { limite = 20, offset = 0, lida } = ctx.query;
        
        let whereClause = 'WHERE usuario_id = $1';
        let params = [userId];
        
        // Filtrar por status de leitura se especificado
        if (lida !== undefined) {
            whereClause += ' AND lida = $2';
            params.push(lida === 'true');
        }
        
        // Buscar notificações
        const notificacoesQuery = `
            SELECT id, titulo, mensagem, tipo, lida, criado_em, 
                   dados_extras, prioridade
            FROM notificacoes 
            ${whereClause}
            ORDER BY criado_em DESC
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;
        
        params.push(parseInt(limite), parseInt(offset));
        
        const notificacoesResult = await db.query(notificacoesQuery, params);
        
        // Contar total de notificações
        const countQuery = `
            SELECT COUNT(*) as total FROM notificacoes ${whereClause}
        `;
        const countResult = await db.query(countQuery, params.slice(0, -2));
        
        // Contar notificações não lidas
        const naoLidasQuery = `
            SELECT COUNT(*) as nao_lidas FROM notificacoes 
            WHERE usuario_id = $1 AND lida = false
        `;
        const naoLidasResult = await db.query(naoLidasQuery, [userId]);
        
        ctx.status = 200;
        ctx.body = {
            sucesso: true,
            dados: {
                notificacoes: notificacoesResult.rows,
                total: parseInt(countResult.rows[0].total),
                nao_lidas: parseInt(naoLidasResult.rows[0].nao_lidas),
                limite: parseInt(limite),
                offset: parseInt(offset)
            }
        };
    } catch (error) {
        logger.error('Erro ao buscar notificações:', error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: 'Erro interno do servidor'
        };
    }
});

// Rota para iniciar conferência
router.post('/api/conferencia/iniciar', autenticar, async ctx => {
    try {
        const userId = ctx.state.usuario.userId;
        const { rota_id, tipo_conferencia = 'ida' } = ctx.request.body;
        
        // Verificar se é motorista
        const usuarioQuery = `
            SELECT tipo_cadastro FROM usuarios WHERE id = $1
        `;
        const usuarioResult = await db.query(usuarioQuery, [userId]);
        
        if (usuarioResult.rows.length === 0 || usuarioResult.rows[0].tipo_cadastro !== 'motorista') {
            ctx.status = 403;
            ctx.body = {
                sucesso: false,
                message: 'Acesso negado. Apenas motoristas podem iniciar conferência.'
            };
            return;
        }
        
        // Validar campos obrigatórios
        if (!rota_id) {
            ctx.status = 400;
            ctx.body = {
                sucesso: false,
                message: 'Campo obrigatório: rota_id'
            };
            return;
        }
        
        // Verificar se a rota pertence ao motorista
        const rotaQuery = `
            SELECT id, nome FROM rotas_escolares 
            WHERE id = $1 AND motorista_id = $2 AND ativo = true
        `;
        const rotaResult = await db.query(rotaQuery, [rota_id, userId]);
        
        if (rotaResult.rows.length === 0) {
            ctx.status = 404;
            ctx.body = {
                sucesso: false,
                message: 'Rota não encontrada ou não pertence ao motorista'
            };
            return;
        }
        
        // Verificar se já existe uma conferência ativa para esta rota hoje
        const conferenciaAtivaQuery = `
            SELECT id FROM conferencias 
            WHERE rota_id = $1 AND DATE(criado_em) = CURRENT_DATE 
            AND status = 'em_andamento' AND tipo = $2
        `;
        const conferenciaAtivaResult = await db.query(conferenciaAtivaQuery, [rota_id, tipo_conferencia]);
        
        if (conferenciaAtivaResult.rows.length > 0) {
            ctx.status = 409;
            ctx.body = {
                sucesso: false,
                message: 'Já existe uma conferência ativa para esta rota hoje'
            };
            return;
        }
        
        // Criar nova conferência
        const criarConferenciaQuery = `
            INSERT INTO conferencias (rota_id, motorista_id, tipo, status, criado_em)
            VALUES ($1, $2, $3, 'em_andamento', NOW())
            RETURNING id, rota_id, tipo, status, criado_em
        `;
        
        const conferenciaResult = await db.query(criarConferenciaQuery, [rota_id, userId, tipo_conferencia]);
        
        // Buscar crianças da rota para inicializar a conferência
        const criancasQuery = `
            SELECT c.id, c.nome_completo, c.endereco, rc.ordem_parada
            FROM criancas c
            JOIN rota_criancas rc ON c.id = rc.crianca_id
            WHERE rc.rota_id = $1 AND rc.ativo = true
            ORDER BY rc.ordem_parada
        `;
        const criancasResult = await db.query(criancasQuery, [rota_id]);
        
        ctx.status = 201;
        ctx.body = {
            sucesso: true,
            message: 'Conferência iniciada com sucesso',
            dados: {
                conferencia: conferenciaResult.rows[0],
                rota: rotaResult.rows[0],
                criancas: criancasResult.rows
            }
        };
    } catch (error) {
        logger.error('Erro ao iniciar conferência:', error);
        ctx.status = 500;
        ctx.body = {
            sucesso: false,
            message: 'Erro interno do servidor'
        };
    }
});

// --- ROTAS DA API ---
// Importar rotas

module.exports = router;
