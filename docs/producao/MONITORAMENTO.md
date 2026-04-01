# Monitoramento e Backup

## Logs

Logs estruturados em formato texto com timestamp, gravados em `logs/app.log`.

```
[INFO] 2026-04-01T06:00:00.000Z: Servidor Kanghoo iniciado em http://localhost:3000
[ERROR] 2026-04-01T06:05:00.000Z: Erro na conexão com banco de dados
```

### Níveis de Log

| Nível | Uso |
|-------|-----|
| `debug` | Informações detalhadas para depuração |
| `info` | Eventos operacionais normais |
| `warn` | Situações inesperadas que não impedem o funcionamento |
| `error` | Erros que requerem atenção |

## Métricas (Prometheus + Grafana)

Ativar com o perfil de monitoramento:

```bash
docker-compose -f docker-compose.prod.yml --profile monitoring up -d
```

- **Prometheus**: `http://servidor:9090` — coleta de métricas
- **Grafana**: `http://servidor:3001` — dashboards visuais
- **Node Exporter**: Métricas do sistema operacional
- **Postgres Exporter**: Métricas do banco de dados
- **Redis Exporter**: Métricas do cache

### Métricas Coletadas

- Uso de CPU e memória por container
- Latência de requisições HTTP
- Conexões WebSocket ativas
- Tempo de resposta do banco de dados
- Taxa de erros por endpoint

## Backup

### Estratégia

| Tipo | Frequência | Retenção |
|------|-----------|----------|
| Banco de dados | Diário (02:00) | 30 dias |
| Uploads | Diário (03:00) | 30 dias |
| Logs | Semanal (domingo) | 12 semanas |
| Configurações | Antes de cada deploy | 12 meses |

### Backup Manual

```bash
# Banco de dados
docker-compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U postgres transporte_escolar > backup_$(date +%Y%m%d).sql

# Restauração
docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U postgres transporte_escolar < backup_20260401.sql
```

## Health Check

O endpoint `/api/health` retorna o status da aplicação:

```bash
curl http://localhost:3000/api/health
```

```json
{
  "status": "UP",
  "timestamp": "2026-04-01T06:00:00.000Z",
  "versao": "2.0.0"
}
```

Configurado como health check do Docker com intervalo de 30 segundos.
