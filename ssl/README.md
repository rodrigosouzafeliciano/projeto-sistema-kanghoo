# Certificados SSL

Diretório para armazenamento de certificados SSL/TLS do ambiente de produção.

## Estrutura

```
ssl/
├── cert.pem          Certificado público
├── key.pem           Chave privada
├── fullchain.pem     Cadeia completa de certificados
└── dhparam.pem       Parâmetros Diffie-Hellman
```

## Geração via Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot

# Gerar certificado
certbot certonly --standalone -d seudominio.com -d www.seudominio.com

# Copiar para este diretório
cp /etc/letsencrypt/live/seudominio.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/seudominio.com/privkey.pem ssl/key.pem
cp /etc/letsencrypt/live/seudominio.com/cert.pem ssl/

# Gerar parâmetros DH
openssl dhparam -out ssl/dhparam.pem 2048
```

## Renovação Automática

```bash
# Adicionar ao crontab
0 12 * * * certbot renew --quiet && docker-compose restart nginx
```

## Observações

- Chaves privadas **nunca devem ser versionadas** no repositório
- Manter permissões restritivas (`chmod 600`) em arquivos de chave
- Certificados são referenciados automaticamente pelo `nginx.prod.conf`