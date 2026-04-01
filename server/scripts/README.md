# Scripts de Automação

Coleção de scripts organizados por categoria para operações do sistema.

## Estrutura

```
scripts/
├── database/       Migrações, seeds e manutenção do banco
├── deployment/     Deploy e configuração de servidores
├── development/    Ferramentas de apoio ao desenvolvimento
├── monitoring/     Health check e análise de performance
└── security/       Auditoria e limpeza de dados sensíveis
```

## Uso

```bash
# Gerenciamento de usuários de teste
node test-users-manager.js basic     # Criar perfis de teste
node test-users-manager.js list      # Listar usuários
node test-users-manager.js clean     # Remover dados de teste
```

## Convenções

- Nomes descritivos em `kebab-case`
- Cada script inclui tratamento de erros e logs informativos
- Scripts de banco de dados devem ser executados com backup prévio
- Testar em ambiente de desenvolvimento antes de executar em produção