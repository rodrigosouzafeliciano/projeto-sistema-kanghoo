import { RouteRepository } from '../../domain/repositories/RouteRepository.mjs';
import { Route } from '../../domain/entities/Route.mjs';

export class PgRouteRepository extends RouteRepository {
    constructor(dbClient) {
        super();
        this.db = dbClient;
    }

    async findAllByMotoristaId(motoristaId) {
        const result = await this.db.query('SELECT * FROM rotas WHERE motorista_id = $1', [motoristaId]);
        return result.rows.map(row => new Route({
            id: row.id,
            motoristaId: row.motorista_id,
            nomeRota: row.nome_rota,
            descricao: row.descricao,
            horarioInicio: row.horario_inicio,
            horarioFim: row.horario_fim,
            diasSemana: row.dias_semana,
            ativo: row.ativo,
            criadoEm: row.criado_em
        }));
    }

    async create(route) {
        const query = `
            INSERT INTO rotas (motorista_id, nome_rota, descricao, horario_inicio, dias_semana) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const params = [
            route.motoristaId, 
            route.nomeRota, 
            route.descricao, 
            route.horarioInicio, 
            route.diasSemana
        ];
        const result = await this.db.query(query, params);
        return result.rows[0].id;
    }
}
