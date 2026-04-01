import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class LoginUser {
    constructor(userRepository, securityConfig) {
        this.userRepository = userRepository;
        this.securityConfig = securityConfig;
    }

    async execute(email, senha) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas');
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                tipo: user.tipoCadastro,
                nomeCompleto: user.nomeCompleto
            },
            this.securityConfig.jwt.secret,
            { expiresIn: this.securityConfig.jwt.expiresIn }
        );

        return { 
            token, 
            user: { 
                id: user.id, 
                nome: user.nomeCompleto, 
                email: user.email, 
                tipo: user.tipoCadastro 
            } 
        };
    }
}
