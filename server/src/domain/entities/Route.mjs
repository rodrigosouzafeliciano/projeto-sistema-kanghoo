export class Route {
    constructor({
        id,
        motoristaId,
        nomeRota,
        descricao,
        horarioInicio,
        horarioFim,
        diasSemana,
        ativo,
        criadoEm
    }) {
        this.id = id;
        this.motoristaId = motoristaId;
        this.nomeRota = nomeRota;
        this.descricao = descricao;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.diasSemana = diasSemana;
        this.ativo = ativo || true;
        this.criadoEm = criadoEm || new Date();
    }

    validate() {
        if (!this.nomeRota || !this.motoristaId) {
            throw new Error("Route name and respective driver ID are required");
        }
        if (!this.horarioInicio) {
            throw new Error("Route start time is mandatory");
        }
    }
}
