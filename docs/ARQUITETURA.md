# Arquitetura do Sistema

O Kanghoo segue os princípios de **Clean Architecture** com separação clara entre regras de negócio e detalhes de infraestrutura.

## Camadas

```
┌──────────────────────────────────────┐
│          Interface (HTTP/WS)         │  ← Controladores, Rotas, Middlewares
├──────────────────────────────────────┤
│        Aplicação (Use Cases)         │  ← Orquestração de regras de negócio
├──────────────────────────────────────┤
│       Domínio (Entities/Repos)       │  ← Entidades puras e contratos
├──────────────────────────────────────┤
│    Infraestrutura (DB/Serviços)      │  ← PostgreSQL, Google Maps, Redis
└──────────────────────────────────────┘
```

### Domínio (`src/domain`)

Contém entidades puras e contratos de repositórios. Não possui dependências externas.

- **Entities** — Objetos com identidade única (`User`, `Vehicle`, `Route`)
- **Repositories** — Interfaces que abstraem a persistência de dados

### Aplicação (`src/application`)

Casos de uso que implementam os processos do sistema.

- `RegisterUser` — Registro de novos usuários com hash de senha
- `LoginUser` — Autenticação e geração de token JWT

### Infraestrutura (`src/infrastructure`)

Implementações concretas e integrações externas.

- **Database** — Repositórios PostgreSQL (`PgUserRepository`, etc.)
- **Config** — Injeção de dependência via Awilix, configurações de segurança

### Interface (`src/interface`)

Camada de entrega para o mundo externo.

- **HTTP** — Controladores Koa e middlewares
- **WebSocket** — Rastreamento GPS em tempo real

## Injeção de Dependência

O container Awilix gerencia a criação e resolução de dependências, permitindo trocar implementações sem afetar regras de negócio.

```
container.js → registra repositórios, use cases e controllers
           ↓
app.js     → resolve e injeta nas rotas
```

## Módulos Legados

As rotas em `src/routes/` utilizam CommonJS (`require`/`module.exports`) e são carregadas no `app.js` via `createRequire`. Este código é funcional e estável — a migração para ESM será gradual.

## Segurança

| Recurso | Implementação |
|---------|--------------|
| Autenticação | JWT com expiração de 24h |
| Senhas | Bcrypt com 12 salt rounds |
| Rate Limiting | Por IP em todos os endpoints |
| Headers HTTP | CSP, HSTS, X-Frame-Options |
| Validação | Sanitização de entrada em todas as rotas |
