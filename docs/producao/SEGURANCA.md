# Segurança em Produção

## Configurações de Firewall

### Linux (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

Portas de desenvolvimento (3000, 5000, 8080, 9090) devem permanecer bloqueadas.

## Headers HTTP

Configurados automaticamente via middleware e Nginx:

| Header | Valor | Finalidade |
|--------|-------|-----------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Forçar HTTPS |
| `X-Frame-Options` | `DENY` | Prevenir clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevenir MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | Proteção contra XSS |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controle de referrer |

## Autenticação

- **JWT** com expiração de 24 horas
- **Bcrypt** com 12 salt rounds para hash de senhas
- **Rate limiting** por IP (100 requisições por 15 minutos)
- **CORS** restritivo com origens permitidas explícitas

## SSL/TLS

Configuração mínima recomendada:

- Protocolos: TLSv1.2, TLSv1.3
- Certificados Let's Encrypt com renovação automática
- Parâmetros Diffie-Hellman de 2048 bits
- HSTS habilitado

## Boas Práticas

- Executar containers como usuário não-root
- Manter imagens Docker atualizadas
- Rotacionar chaves JWT periodicamente
- Monitorar tentativas de login falhadas
- Manter logs de auditoria por no mínimo 90 dias
- Realizar backups criptografados diariamente
