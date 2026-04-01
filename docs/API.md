# Referência de APIs

## Autenticação

Todas as rotas protegidas requerem o header:

```
Authorization: Bearer <token_jwt>
```

### Registro de Usuário

```http
POST /api/auth/register
Content-Type: application/json

{
  "nome_completo": "João Silva",
  "email": "joao@email.com",
  "senha": "senha_segura",
  "tipo_cadastro": "motorista_escolar"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha_segura"
}
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "usuario": {
      "id": 1,
      "nome_completo": "João Silva",
      "tipo_cadastro": "motorista_escolar"
    }
  }
}
```

---

## Verificação de Saúde

```http
GET /api/health
```

**Resposta:**

```json
{
  "status": "UP",
  "timestamp": "2026-04-01T06:00:00.000Z",
  "versao": "2.0.0"
}
```

---

## Motorista Escolar

**Prefixo:** `/api/motorista-escolar`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:------------:|
| `GET` | `/criancas` | Listar crianças do motorista | Sim |
| `POST` | `/iniciar-viagem` | Iniciar nova viagem | Sim |
| `POST` | `/atualizar-localizacao` | Atualizar posição GPS | Sim |
| `GET` | `/rotas` | Listar rotas do motorista | Sim |
| `POST` | `/rotas` | Criar nova rota | Sim |

---

## Rotas Escolares

**Prefixo:** `/api/rotas-escolares`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:------------:|
| `POST` | `/criar` | Criar rota escolar | Sim |
| `GET` | `/minhas-rotas` | Listar rotas do motorista | Sim |
| `PUT` | `/editar/:id` | Editar rota existente | Sim |
| `DELETE` | `/excluir/:id` | Excluir rota | Sim |
| `POST` | `/adicionar-crianca` | Adicionar criança à rota | Sim |
| `DELETE` | `/remover-crianca` | Remover criança da rota | Sim |

---

## Responsável

**Prefixo:** `/api/responsavel`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:------------:|
| `GET` | `/rastrear-crianca/:id` | Rastrear localização da criança | Sim |
| `GET` | `/historico-viagens/:crianca_id` | Histórico de viagens | Sim |

---

## Rastreamento GPS

**Prefixo:** `/api/gps`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:------------:|
| `GET` | `/status` | Status do serviço GPS | Não |
| `POST` | `/simulate-position` | Simular posição (desenvolvimento) | Não |
| `GET` | `/active-vehicles` | Veículos ativos | Sim |
| `POST` | `/start-tracking` | Iniciar rastreamento | Sim |
| `POST` | `/stop-tracking` | Parar rastreamento | Sim |
| `POST` | `/update-position` | Atualizar posição | Sim |

---

## Conferência de Crianças

**Prefixo:** `/api/conferencia`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:------------:|
| `GET` | `/rota/:id/criancas` | Listar crianças da rota | Sim |
| `POST` | `/embarque` | Registrar embarque | Sim |
| `POST` | `/desembarque` | Registrar desembarque | Sim |
| `GET` | `/status/:rota_id` | Status da conferência | Sim |

---

## Planos de Assinatura

**Prefixo:** `/api/planos-assinatura`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:------------:|
| `GET` | `/tipos` | Listar planos disponíveis | Não |
| `POST` | `/ativar` | Ativar plano para usuário | Sim |
| `PUT` | `/upgrade` | Upgrade de plano | Sim |
| `GET` | `/meu-plano` | Consultar plano atual | Sim |

---

## Google Maps

**Prefixo:** `/api/maps`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:------------:|
| `GET` | `/config` | Configuração do mapa | Não |
| `GET` | `/status` | Status do serviço | Não |
| `POST` | `/calculate-route` | Calcular rota entre pontos | Sim |
| `POST` | `/geocode` | Converter endereço em coordenadas | Sim |

---

## Busca de Transportes

**Prefixo:** `/api/transportes`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|:------------:|
| `GET` | `/buscar` | Buscar transportes disponíveis | Não |
| `GET` | `/:id` | Detalhes de um transporte | Não |

---

## WebSocket

**Conexão:** `ws://localhost:3000`

### Eventos de Entrada

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `auth` | `{ token: string }` | Autenticação do cliente |
| `location_update` | `{ latitude, longitude, velocidade }` | Envio de posição GPS |

### Eventos de Saída

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `location_update` | `{ motorista_id, latitude, longitude }` | Posição atualizada do motorista |
| `boarding_event` | `{ crianca_id, tipo, localizacao }` | Embarque ou desembarque |
| `notification` | `{ titulo, mensagem, tipo }` | Notificação em tempo real |
