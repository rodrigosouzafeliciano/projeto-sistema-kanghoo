export class AuthController {
    constructor(registerUserUseCase, loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }

    async register(ctx) {
        try {
            const { 
                tipoCadastro, nomeCompleto, email, senha, celular, dataNascimento, 
                placa, renavam, lotacaoMaxima,
                razaoSocial, cnpj, nomeFantasia
            } = ctx.request.body;

            const userData = { tipoCadastro, nomeCompleto, email, senha, celular, dataNascimento };
            const vehicleData = { placa, renavam, lotacaoMaxima };
            const companyData = { razaoSocial, cnpj, nomeFantasia };

            const result = await this.registerUserUseCase.execute(userData, vehicleData, companyData);
            
            ctx.status = 201;
            ctx.body = { message: 'Usuário cadastrado com sucesso!', ...result };
        } catch (error) {
            ctx.status = error.message === 'Email already in use' ? 409 : 400;
            ctx.body = { error: error.message };
        }
    }

    async login(ctx) {
        try {
            const { email, senha } = ctx.request.body;
            const result = await this.loginUserUseCase.execute(email, senha);
            
            ctx.status = 200;
            ctx.body = { message: 'Login realizado com sucesso', ...result };
        } catch (error) {
            ctx.status = 401;
            ctx.body = { error: error.message };
        }
    }
}
