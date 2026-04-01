# Usuários de Teste

Credenciais pré-configuradas para o ambiente de desenvolvimento. Geradas através do script `test-users-manager.js`.

## Perfis Disponíveis

| Tipo | E-mail | Senha |
|------|--------|-------|
| Responsável | `teste@login.com` | `teste123` |
| Responsável | `responsavel@teste.com` | `teste123` |
| Motorista Escolar | `motorista.escolar@teste.com` | `teste123` |
| Motorista Excursão | `motorista.excursao@teste.com` | `teste123` |
| Motorista Basic | `motorista.basic@teste.com` | `teste123` |
| Motorista Premium | `motorista.premium@teste.com` | `teste123` |
| Administrador | `admin@teste.com` | `admin123` |

## Comandos de Gerenciamento

```bash
# Criar usuários básicos (recomendado)
node test-users-manager.js basic

# Criar usuário único
node test-users-manager.js single

# Criar usuários com dados completos (veículos e empresas)
node test-users-manager.js complete

# Listar usuários existentes
node test-users-manager.js list

# Remover todos os usuários de teste
node test-users-manager.js clean
```

## Uso Programático

```javascript
import { TestUsersManager } from './test-users-manager.js';

const manager = new TestUsersManager();
await manager.createAllBasicTestUsers();
await manager.close();
```

## Observações

- Todas as senhas são armazenadas com hash Bcrypt (10 salt rounds)
- Usuários existentes têm suas senhas atualizadas automaticamente
- **Não utilizar em produção** — exclusivo para desenvolvimento e testes
