# Configuração do Ambiente

## Pré-requisitos

- **Node.js** >= 20.0.0
- **PostgreSQL** >= 14.0
- **Redis** >= 7.0
- **Docker** e **Docker Compose** (opcional, para produção)

## Variáveis de Ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cd server
cp .env.example .env
```

### Variáveis Obrigatórias

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transporte_escolar
DB_USER=postgres
DB_PASSWORD=sua_senha

# Segurança
JWT_SECRET=chave_secreta_jwt_com_no_minimo_32_caracteres
BCRYPT_ROUNDS=12

# Google Maps (opcional em desenvolvimento)
GOOGLE_MAPS_API_KEY=sua_chave_google_maps
```

### Variáveis Opcionais

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=senha_redis

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# WebSocket
WS_HEARTBEAT=30000
```

## Banco de Dados

### Configuração Manual

```bash
# Criar banco de dados
createdb transporte_escolar

# As tabelas são criadas automaticamente ao iniciar o servidor
npm run dev
```

### Via Docker

```bash
docker-compose up postgres redis -d
```

O script de inicialização em `database/init.sql` cria as tabelas e índices automaticamente.

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Motoristas, responsáveis e administradores |
| `veiculos` | Dados dos veículos cadastrados |
| `criancas` | Informações das crianças |
| `rotas_escolares` | Rotas de transporte escolar |
| `pacotes_excursao` | Pacotes de excursão |
| `rastreamento` | Registros de posição GPS |
| `avaliacoes` | Avaliações de motoristas |
| `contatos` | Mensagens do formulário de contato |

## Instalação

```bash
# Instalar dependências do backend
cd server && npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor inicia em `http://localhost:3000` e cria as tabelas automaticamente na primeira execução.
