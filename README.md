# Kanghoo — Plataforma de Transporte Escolar

Plataforma completa para gestão de transporte escolar e excursões com rastreamento em tempo real, conferência de embarque/desembarque e notificações automáticas para responsáveis.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Runtime** | Node.js v20+ (ES Modules) |
| **Framework** | Koa.js |
| **Banco de Dados** | PostgreSQL 14+ |
| **Cache** | Redis 7+ |
| **Tempo Real** | Socket.IO / WebSocket |
| **Proxy Reverso** | Nginx |
| **Containerização** | Docker / Docker Compose |
| **Monitoramento** | Prometheus + Grafana |
| **Injeção de Dependência** | Awilix |
| **Segurança** | JWT, Bcrypt, Rate Limiting |

## Início Rápido

```bash
# Instalar dependências
cd server && npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar em modo de desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
├── server/                  Backend (Node.js + Koa.js)
│   └── src/
│       ├── application/     Casos de uso
│       ├── config/          Configurações gerais
│       ├── controllers/     Controladores HTTP
│       ├── domain/          Entidades e contratos
│       ├── infrastructure/  Banco de dados e serviços externos
│       ├── interface/       Camada de entrega (HTTP/WS)
│       ├── middlewares/     Middlewares de segurança e validação
│       ├── routes/          Rotas da API REST
│       ├── services/        Serviços de negócio
│       └── utils/           Utilitários (logger, GPS, cache)
├── frontend/                Interface web
│   └── public/              Páginas HTML e assets
├── database/                Scripts SQL
├── nginx/                   Configuração do proxy reverso
├── monitoring/              Dashboards e métricas
├── docker-compose.yml       Orquestração (desenvolvimento)
└── docker-compose.prod.yml  Orquestração (produção)
```

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [Arquitetura](docs/ARQUITETURA.md) | Camadas do sistema e padrões de projeto |
| [Referência de APIs](docs/API.md) | Endpoints, payloads e exemplos |
| [Configuração](docs/guias/CONFIGURACAO.md) | Variáveis de ambiente e banco de dados |
| [Desenvolvimento](docs/guias/DESENVOLVIMENTO.md) | Fluxo de trabalho e padrões de código |
| [Usuários de Teste](docs/guias/USUARIOS_TESTE.md) | Credenciais para ambiente de desenvolvimento |
| [Deploy](docs/producao/DEPLOY.md) | Deploy com Docker e Nginx |
| [Segurança](docs/producao/SEGURANCA.md) | Hardening e configurações de firewall |
| [Monitoramento](docs/producao/MONITORAMENTO.md) | Métricas, logs e backup |

## Comandos Úteis

```bash
npm run dev          # Servidor com hot-reload (nodemon)
npm test             # Executar testes
npm run lint         # Análise de código
npm run format       # Formatação automática
```

## Licença

Projeto privado — todos os direitos reservados.
