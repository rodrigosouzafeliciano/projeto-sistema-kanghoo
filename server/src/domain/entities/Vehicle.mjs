export class Vehicle {
    constructor({
        id,
        usuarioId,
        placa,
        renavam,
        lotacaoMaxima,
        anoFabricacao,
        cor,
        modelo,
        marca,
        criadoEm
    }) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.placa = placa;
        this.renavam = renavam;
        this.lotacaoMaxima = lotacaoMaxima;
        this.anoFabricacao = anoFabricacao;
        this.cor = cor;
        this.modelo = modelo;
        this.marca = marca;
        this.criadoEm = criadoEm || new Date();
    }

    validate() {
        if (!this.placa || !this.renavam) {
            throw new Error("Plate and Renavam are mandatory for vehicles");
        }
        if (this.lotacaoMaxima <= 0) {
            throw new Error("Max capacity must be greater than 0");
        }
    }
}
