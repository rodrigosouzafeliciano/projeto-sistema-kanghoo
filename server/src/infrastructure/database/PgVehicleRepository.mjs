import { VehicleRepository } from '../../domain/repositories/VehicleRepository.mjs';
import { Vehicle } from '../../domain/entities/Vehicle.mjs';

export class PgVehicleRepository extends VehicleRepository {
    constructor(dbClient) {
        super();
        this.db = dbClient;
    }

    async findByUserId(userId) {
        const result = await this.db.query('SELECT * FROM veiculos WHERE usuario_id = $1', [userId]);
        if (result.rows.length === 0) return null;
        
        return new Vehicle({
            id: result.rows[0].id,
            usuarioId: result.rows[0].usuario_id,
            placa: result.rows[0].placa,
            renavam: result.rows[0].renavam,
            lotacaoMaxima: result.rows[0].lotacao_maxima,
            anoFabricacao: result.rows[0].ano_fabricacao,
            cor: result.rows[0].cor,
            modelo: result.rows[0].modelo,
            marca: result.rows[0].marca,
            criadoEm: result.rows[0].criado_em
        });
    }

    async create(vehicle) {
        const query = `
            INSERT INTO veiculos (usuario_id, placa, renavam, lotacao_maxima) 
            VALUES ($1, $2, $3, $4) RETURNING id`;
        const params = [
            vehicle.usuarioId, 
            vehicle.placa, 
            vehicle.renavam, 
            vehicle.lotacaoMaxima
        ];
        const result = await this.db.query(query, params);
        return result.rows[0].id;
    }
}
