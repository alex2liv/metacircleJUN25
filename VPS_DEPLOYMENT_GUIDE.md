# MetaSync - Guia Completo de Deployment para VPS

## 📋 Pré-requisitos

### Sistema VPS:
- Ubuntu 20.04+ ou similar
- Node.js 18+ instalado
- PostgreSQL 12+ ou acesso ao Supabase
- Nginx (para proxy reverso)
- PM2 (para gerenciamento de processo)

## 🚀 Processo de Deployment

### 1. Preparação do Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y
```

### 2. Clone e Configuração do Projeto

```bash
# Clone do repositório
git clone [SEU_REPOSITORIO] /var/www/metasync
cd /var/www/metasync

# Instalar dependências
npm install

# Criar arquivo de ambiente
sudo nano .env
```

### 3. Configuração do .env

```env
# Banco de Dados (OBRIGATÓRIO)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/metasync"

# OpenAI API (OBRIGATÓRIO)
OPENAI_API_KEY="sk-proj-..."

# Configurações do Servidor
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Email (Opcional - SendGrid)
SENDGRID_API_KEY=""

# Pagamentos (Opcional - Stripe)
STRIPE_SECRET_KEY=""
STRIPE_PRICE_ID=""
VITE_STRIPE_PUBLIC_KEY=""

# SMS (Opcional - Twilio)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# WhatsApp (Opcional)
WHATSAPP_SESSION_PATH="/var/www/metasync/whatsapp-session"
```

### 4. Build da Aplicação

```bash
# Build do frontend
npm run build

# Configurar banco de dados
npm run db:push

# Testar aplicação
npm start
```

### 5. Configuração do PM2

```bash
# Criar arquivo de configuração PM2
sudo nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'metasync',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/metasync-error.log',
    out_file: '/var/log/pm2/metasync-out.log',
    log_file: '/var/log/pm2/metasync.log',
    time: true
  }]
};
```

```bash
# Iniciar com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configuração do Nginx

```bash
sudo nano /etc/nginx/sites-available/metasync
```

```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com www.SEU_DOMINIO.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/metasync /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d SEU_DOMINIO.com -d www.SEU_DOMINIO.com
```

## 🔧 Configurações Específicas

### Database Setup (PostgreSQL Local):

```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Configurar usuário
sudo -u postgres createuser --superuser metasync
sudo -u postgres psql -c "ALTER USER metasync PASSWORD 'senha_segura';"
sudo -u postgres createdb metasync_db -O metasync
```

### Firewall Configuration:

```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 📱 URLs de Acesso

### Sistema Principal:
- **MetaSync Admin**: `https://SEU_DOMINIO.com/metasync-admin`
- **Company Login**: `https://SEU_DOMINIO.com/company/:slug`
- **Specialist Login**: `https://SEU_DOMINIO.com/specialist-login`

### Funcionalidades Testadas:
- Dashboard multi-tenant
- Sistema de mensagens com mídia
- Gravação de áudio/vídeo
- Upload de arquivos
- WhatsApp integration (quando configurado)

## 🔍 Monitoramento

```bash
# Logs da aplicação
pm2 logs metasync

# Status dos processos
pm2 status

# Monitoramento em tempo real
pm2 monit

# Restart da aplicação
pm2 restart metasync
```

## 🚨 Troubleshooting

### Problemas Comuns:

1. **Erro de Database**: Verificar DATABASE_URL e conectividade
2. **Erro de OpenAI**: Verificar OPENAI_API_KEY
3. **Erro de Build**: Executar `npm run build` novamente
4. **Erro de Permissões**: Verificar ownership dos arquivos

### Comandos Úteis:

```bash
# Verificar logs
tail -f /var/log/pm2/metasync.log

# Restart completo
pm2 delete metasync
pm2 start ecosystem.config.js

# Verificar portas em uso
sudo netstat -tlnp | grep :3000
```

## ✅ Checklist Final

- [ ] .env configurado com todas as variáveis
- [ ] Database conectado e migrado
- [ ] Build da aplicação executado
- [ ] PM2 configurado e rodando
- [ ] Nginx configurado com proxy reverso
- [ ] SSL configurado
- [ ] Firewall configurado
- [ ] DNS apontando para o servidor
- [ ] Testes de funcionalidade executados

Sistema pronto para produção!