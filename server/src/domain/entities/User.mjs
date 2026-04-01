export class User {
    constructor({
        id,
        nomeCompleto,
        email,
        senha,
        celular,
        dataNascimento,
        tipoCadastro,
        tipoUsuario,
        enderecoCompleto,
        criadoEm
    }) {
        this.id = id;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.senha = senha;
        this.celular = celular;
        this.dataNascimento = dataNascimento;
        this.tipoCadastro = tipoCadastro;
        this.tipoUsuario = tipoUsuario;
        this.enderecoCompleto = enderecoCompleto;
        this.criadoEm = criadoEm || new Date();
    }

    validate() {
        if (!this.email || !this.nomeCompleto) {
            throw new Error("User email and full name are required");
        }
        // Additional business-level validations (Big Tech style)
    }

    // Business Methods (Behavior is key in DDD)
    isMotorista() {
        return this.tipoCadastro === 'motorista_escolar' || this.tipoCadastro === 'motorista_excursao';
    }

    isResponsavel() {
        return this.tipoCadastro === 'responsavel';
    }
}
