<div align="center">

<img src="./assets/kanghoo-banner.svg" width="100%" alt="Kanghoo - School Transit & Excursion Management Platform" />

<br />

[![Node.js](https://img.shields.io/badge/Node.js_20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Koa.js](https://img.shields.io/badge/Koa.js-33333D?style=for-the-badge&logo=koa&logoColor=white)](https://koajs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis_7+-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prometheus](https://img.shields.io/badge/Prometheus_&_Grafana-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](https://prometheus.io/)

</div>

---

## 🌎 Overview (EN-US) · Visão Geral (PT-BR)

<table>
<tr>
<td width="50%" valign="top">

### 🇺🇸 English (EN-US)

**Kanghoo** is a full-stack school transport and excursion management platform featuring real-time vehicle GPS telemetry, student boarding/alighting confirmation, automated guardian notifications, and role-based access control (`Guardians`, `School Drivers`, `Excursion Drivers`, and `Administrators`).

- **Clean Architecture & DI:** Backend structured into `Domain`, `Application`, `Infrastructure`, and `Interface` layers with **Awilix** dependency injection across **23+ REST route modules**.
- **Real-Time GPS Telemetry:** Continuous low-latency vehicle position tracking and route geofencing powered by **Socket.IO** and **Redis 7+** (`ioredis`).
- **Relational Modeling & Security:** Normalized **PostgreSQL 14+** schema, stateless **JWT** authentication, **Bcrypt** password hashing, and **koa-ratelimit** protection.
- **Containers & Observability:** Development and production parity via **Docker Compose**, **Nginx** reverse proxy with SSL/TLS, and real-time node/database/cache metrics via **Prometheus** and **Grafana**.

</td>
<td width="50%" valign="top">

### 🇧🇷 Português (PT-BR)

**Kanghoo** é uma plataforma completa para gestão de transporte escolar e excursões com telemetria GPS em tempo real, conferência de embarque e desembarque de alunos, notificações automáticas para responsáveis e perfis de acesso hierárquicos (`Responsáveis`, `Motoristas Escolares`, `Motoristas de Excursão` e `Administradores`).

- **Clean Architecture e Injeção de Dependências:** Back-end organizado nas camadas `Domain`, `Application`, `Infrastructure` e `Interface` com **Awilix** em mais de **23 módulos de rotas REST**.
- **Telemetria GPS em Tempo Real:** Atualização contínua da posição dos veículos com baixa latência e cercas eletrônicas (`geofencing`) via **Socket.IO** e **Redis 7+** (`ioredis`).
- **Banco de Dados e Segurança:** Esquema relacional em **PostgreSQL 14+**, autenticação **JWT**, criptografia de senhas com **Bcrypt** e middleware de **rate limiting**.
- **Containers e Observabilidade:** Paridade entre desenvolvimento e produção com **Docker Compose**, proxy reverso **Nginx** com SSL/TLS e monitoramento em tempo real com **Prometheus** e **Grafana**.

</td>
</tr>
</table>

---

## 🛠️ Technology Stack · Stack Tecnológica

| Layer / Camada | Technology / Tecnologia |
| :--- | :--- |
| **Runtime & HTTP** | Node.js v20+ (ES Modules) · Koa.js (`koa-router`, `koa-bodyparser`, `koa-compress`, `@koa/cors`, `@koa/multer`) |
| **Architecture & DI** | Clean Architecture (`Domain`, `Application`, `Infrastructure`, `Interface`) · Awilix |
| **Database & Cache** | PostgreSQL 14+ (`pg`) · Redis 7+ (`ioredis`) |
| **Real-Time & Maps** | Socket.IO / WebSockets · Google Maps Services (`@googlemaps/google-maps-services-js`) · Nodemailer |
| **Security** | JWT (`jsonwebtoken`) · Bcrypt (`bcryptjs`) · Rate Limiting (`koa-ratelimit`) |
| **Infra & Proxy** | Docker · Docker Compose (`dev` & `prod`) · Nginx Reverse Proxy (SSL/TLS) |
| **Observability** | Prometheus · Grafana · Node Exporter · Postgres Exporter · Redis Exporter |
| **Testing & Quality** | Jest · Supertest · ESLint · Prettier · Husky |

---

## 📂 Project Structure · Estrutura do Projeto

```text
├── server/                  # Backend (Node.js + Koa.js)
│   ├── src/
│   │   ├── application/     # Use cases & application orchestration
│   │   ├── config/          # Environment, database & container wiring
│   │   ├── controllers/     # HTTP controllers
│   │   ├── domain/          # Domain entities & repository contracts
│   │   ├── infrastructure/  # PostgreSQL repositories & external services
│   │   ├── interface/       # Delivery layer (HTTP/WebSocket)
│   │   ├── middlewares/     # Auth, RBAC, rate-limiting & validation
│   │   ├── realtime/        # Socket.IO event handlers & telemetry hub
│   │   ├── routes/          # 23+ modular REST API routes
│   │   └── utils/           # Geolocation, caching & notification utilities
│   └── tests/               # Integration, security & WebSocket test suites
├── frontend/                # Web client interface & static portals
├── database/                # PostgreSQL schema & seed scripts
├── nginx/                   # Nginx reverse proxy & TLS configuration
├── monitoring/              # Prometheus targets & Grafana dashboards
├── docker-compose.yml       # Development environment orchestration
└── docker-compose.prod.yml  # Production environment orchestration
```

---

## 🚀 Quick Start · Início Rápido

```bash
# 1. Install backend dependencies / Instalar dependências
cd server && npm install

# 2. Configure environment variables / Configurar variáveis de ambiente
cp .env.example .env

# 3. Start development server / Iniciar servidor em modo de desenvolvimento
npm run dev
```

Server runs at / Servidor disponível em: `http://localhost:3000`

```bash
npm run dev            # Hot-reload development server (nodemon)
npm test               # Run automated test suites (Jest + Supertest)
npm run test:coverage  # Generate test coverage report
npm run lint           # Run static code analysis (ESLint)
npm run format         # Format source code (Prettier)
```

---

## 📚 Technical Documentation · Documentação Técnica

| Document / Documento | Scope / Descrição |
| :--- | :--- |
| [Architecture (`docs/ARQUITETURA.md`)](docs/ARQUITETURA.md) | Clean Architecture layers and design patterns / Camadas do sistema e padrões de projeto |
| [API Reference (`docs/API.md`)](docs/API.md) | REST endpoints, payloads, and examples / Endpoints, payloads e exemplos |
| [Configuration (`docs/guias/CONFIGURACAO.md`)](docs/guias/CONFIGURACAO.md) | Environment variables and database setup / Variáveis de ambiente e banco de dados |
| [Development (`docs/guias/DESENVOLVIMENTO.md`)](docs/guias/DESENVOLVIMENTO.md) | Workflow and coding standards / Fluxo de trabalho e padrões de código |
| [Test Accounts (`docs/guias/USUARIOS_TESTE.md`)](docs/guias/USUARIOS_TESTE.md) | Seeded development credentials / Credenciais para ambiente de desenvolvimento |
| [Deployment (`docs/producao/DEPLOY.md`)](docs/producao/DEPLOY.md) | Docker Compose and Nginx deployment / Deploy com Docker e Nginx |
| [Security (`docs/producao/SEGURANCA.md`)](docs/producao/SEGURANCA.md) | Hardening and firewall rules / Hardening e configurações de firewall |
| [Monitoring (`docs/producao/MONITORAMENTO.md`)](docs/producao/MONITORAMENTO.md) | Prometheus, Grafana, logs, and backups / Métricas, logs e backup |

---

<div align="center">

**Rodrigo Souza Feliciano** · Full Stack Software Developer & QA Analyst  
[Portfolio](https://portfolio-rodrigo-pink.vercel.app) · [LinkedIn](https://www.linkedin.com/in/rodrigosouzafeliciano/) · [Online Resume](https://github.com/rodrigosouzafeliciano/curriculo-online)

</div>
