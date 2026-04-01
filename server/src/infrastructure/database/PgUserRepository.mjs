import { UserRepository } from '../../domain/repositories/UserRepository.mjs';
import { User } from '../../domain/entities/User.mjs';

export class PgUserRepository extends UserRepository {
    constructor(dbClient) {
        super();
        this.db = dbClient;
    }

    async findByEmail(email) {
        const result = await this.db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) return null;
        
        const row = result.rows[0];
        return new User({
            id: row.id,
            nomeCompleto: row.nome_completo,
            email: row.email,
            senha: row.senha,
            celular: row.celular,
            dataNascimento: row.data_nascimento,
            tipoCadastro: row.tipo_cadastro,
            tipoUsuario: row.tipo_usuario,
            enderecoCompleto: row.endereco_completo,
            criadoEm: row.criado_em
        });
    }

    async create(user) {
        const query = `
            INSERT INTO usuarios (nome_completo, email, senha, celular, data_nascimento, tipo_cadastro) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
        const params = [
            user.nomeCompleto, 
            user.email, 
            user.senha, 
            user.celular, 
            user.dataNascimento, 
            user.tipoCadastro
        ];
        const result = await this.db.query(query, params);
        return result.rows[0].id;
    }

    async findById(id) {
        const result = await this.db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        
        const row = result.rows[0];
        return new User({
            id: row.id,
            nomeCompleto: row.nome_completo,
            email: row.email,
            senha: row.senha,
            celular: row.celular,
            dataNascimento: row.data_nascimento,
            tipoCadastro: row.tipo_cadastro,
            tipoUsuario: row.tipo_usuario,
            enderecoCompleto: row.endereco_completo,
            criadoEm: row.criado_em
        });
    }
}
