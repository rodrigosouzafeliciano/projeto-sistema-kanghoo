# Deploy em Produção

## Requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- Certificados SSL válidos
- Domínio configurado com DNS apontando para o servidor

## Deploy com Docker Compose

### 1. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Altere obrigatoriamente:

```env
NODE_ENV=production
JWT_SECRET=<chave_com_256_bits_ou_mais>
DB_PASSWORD=<senha_forte>
REDIS_PASSWORD=<senha_forte>
GOOGLE_MAPS_API_KEY=<chave_de_producao>
```

### 2. Certificados SSL

Coloque os certificados na pasta `ssl/`:

```
ssl/
├── cert.pem        Certificado público
├── key.pem         Chave privada
├── fullchain.pem   Cadeia completa
└── dhparam.pem     Parâmetros Diffie-Hellman
```

Para gerar via Let's Encrypt:

```bash
certbot certonly --standalone -d seudominio.com -d www.seudominio.com
```

### 3. Build e Deploy

```bash
# Build da imagem de produção
docker build -f Dockerfile.prod -t kanghoo:latest .

# Iniciar todos os serviços
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Verificar logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### 4. Verificação

```bash
# Saúde da aplicação
curl https://seudominio.com/api/health

# Status dos containers
docker-compose -f docker-compose.prod.yml ps
```

## Serviços

| Serviço | Porta Externa | Descrição |
|---------|:------------:|-----------|
| Nginx | 80, 443 | Proxy reverso com SSL |
| App | 5000 (interno) | Backend Koa.js |
| PostgreSQL | 5432 (interno) | Banco de dados |
| Redis | 6379 (interno) | Cache e sessões |

## Monitoramento (Opcional)

```bash
# Iniciar com perfil de monitoramento
docker-compose -f docker-compose.prod.yml --profile monitoring up -d
```

| Serviço | Porta | Descrição |
|---------|:-----:|-----------|
| Prometheus | 9090 | Coleta de métricas |
| Grafana | 3001 | Dashboards |

## Atualização

```bash
git pull origin main
docker-compose -f docker-compose.prod.yml build app
docker-compose -f docker-compose.prod.yml up -d app
```

## Rollback

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```
