# Guia de Desenvolvimento

## Padrões de Código

- **Linting**: ESLint com regras configuradas em `.eslintrc.json`
- **Formatação**: Prettier para formatação automática
- **Módulos**: Camada Clean Architecture usa ESM (`import`/`export`); rotas legadas usam CommonJS
- **Idioma**: Código e comentários em português brasileiro

## Fluxo de Trabalho

1. Criar branch a partir de `main` (`feature/nome-da-funcionalidade`)
2. Desenvolver e testar localmente
3. Executar `npm run lint` e `npm test`
4. Criar pull request com descrição clara
5. Merge após revisão

## Estrutura de Código

### Arquitetura Limpa (ESM)

```
src/
├── domain/          Entidades e contratos (sem dependências externas)
├── application/     Casos de uso (orquestração)
├── infrastructure/  Implementações (PostgreSQL, serviços)
└── interface/       Controllers e middlewares HTTP
```

### Rotas Legadas (CommonJS)

```
src/
├── routes/          Rotas da API REST
├── controllers/     Controladores HTTP
├── middlewares/     Autenticação, validação, segurança
├── config/          Banco de dados, constantes, uploads
└── utils/           Logger, cache, GPS, notificações
```

## Testes

```bash
# Executar todos os testes
npm test

# Testes com hot-reload
npm run test:watch

# Relatório de cobertura
npm run test:coverage
```

## Comandos de Desenvolvimento

```bash
npm run dev          # Servidor com nodemon
npm run lint         # Verificação de código
npm run format       # Formatação automática
```

## Convenções

- Nomes de tabelas e colunas em `snake_case`
- Nomes de variáveis JavaScript em `camelCase`
- Nomes de classes em `PascalCase`
- Rotas da API com prefixo `/api/`
- Logs estruturados via `logger.info()`, `logger.error()`
