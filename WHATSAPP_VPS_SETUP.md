# WhatsApp Web Automation - Guia de Instalação VPS

## Pré-requisitos

### Sistema Operacional
- Ubuntu 20.04 LTS ou superior
- Debian 10 ou superior  
- CentOS 8 ou superior

### Recursos Mínimos
- 2GB RAM
- 2 CPU cores
- 20GB disco
- Conexão estável de internet

## Instalação no VPS

### 1. Atualizar Sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Instalar Dependências do Chrome
```bash
sudo apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget
```

### 4. Instalar Google Chrome
```bash
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

### 5. Clonar e Configurar Projeto
```bash
git clone <seu-repositorio>
cd metasync
npm install
```

### 6. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
nano .env
```

Configurar:
```
DATABASE_URL=sua_url_do_banco
OPENAI_API_KEY=sua_chave_openai
NODE_ENV=production
PORT=3000
```

### 7. Configurar PM2 para Processo em Background
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### 8. Configurar Nginx (Opcional)
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/metasync
```

Configuração Nginx:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

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
}
```

```bash
sudo ln -s /etc/nginx/sites-available/metasync /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Configuração WhatsApp Web

### Limites Recomendados por Tipo de Número

#### Números Novos (< 30 dias)
- **Máximo por dia**: 50-100 mensagens
- **Máximo por hora**: 20-30 mensagens  
- **Intervalo mínimo**: 60-90 segundos
- **Recomendação**: Começar com 30 mensagens/dia

#### Números Antigos (> 30 dias)
- **Máximo por dia**: 200-300 mensagens
- **Máximo por hora**: 80-120 mensagens
- **Intervalo mínimo**: 30-45 segundos
- **Recomendação**: Começar com 150 mensagens/dia

### Boas Práticas

1. **Teste Gradual**
   - Comece com poucos contatos
   - Aumente gradualmente o volume
   - Monitore bloqueios

2. **Conteúdo das Mensagens**
   - Evite mensagens idênticas
   - Use variações no texto
   - Inclua nome personalizado

3. **Horários de Envio**
   - Evite madrugada (00h-06h)
   - Prefira horário comercial
   - Respeite fusos horários

4. **Monitoramento**
   - Acompanhe taxa de entrega
   - Monitore bloqueios
   - Ajuste limites conforme necessário

## Solução de Problemas

### Chrome não Inicializa
```bash
# Verificar se Chrome está instalado
google-chrome --version

# Testar execução
google-chrome --headless --no-sandbox --disable-gpu --dump-dom https://www.google.com
```

### Erro de Permissões
```bash
# Ajustar permissões da pasta do projeto
sudo chown -R $USER:$USER /caminho/para/projeto
chmod -R 755 /caminho/para/projeto
```

### WhatsApp Web não Conecta
- Verificar conectividade com web.whatsapp.com
- Limpar dados da sessão: `rm -rf whatsapp-sessions/`
- Regenerar QR Code

### Alto Uso de CPU/Memória
```bash
# Monitorar recursos
pm2 monit

# Ajustar configurações do Chrome
# No arquivo de configuração, adicionar mais argumentos:
args: [
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--single-process',
  '--disable-gpu'
]
```

## Segurança

### Firewall
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### SSL/HTTPS com Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

### Backup Automático
```bash
# Crontab para backup diário
0 2 * * * cd /caminho/para/projeto && tar -czf backup-$(date +\%Y\%m\%d).tar.gz whatsapp-sessions/ .env
```

## Monitoramento

### Logs do Sistema
```bash
# Ver logs do PM2
pm2 logs

# Ver logs específicos do WhatsApp
pm2 logs whatsapp

# Ver logs do sistema
journalctl -u nginx
```

### Alertas (Opcional)
Configure alertas para:
- Alto uso de CPU/RAM
- Falhas de conexão
- Bloqueios do WhatsApp
- Erros de autenticação

## Contatos de Suporte

Em caso de problemas técnicos:
1. Verifique os logs primeiro
2. Consulte a documentação da whatsapp-web.js
3. Entre em contato com suporte técnico