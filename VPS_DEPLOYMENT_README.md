# MetaSync - Guia de Deploy VPS Atualizado

## 🚀 Resumo das Atualizações Implementadas

### ✅ Funcionalidades Completadas
- **MetaSync Admin**: Sistema completo de gerenciamento de empresas clientes
- **Company Admin Dashboard**: Interface para administradores de empresas
- **Specialist Login**: Página de login moderna e responsiva para especialistas
- **Database Manager**: Sistema multi-tenant com suporte PostgreSQL/Supabase
- **Navegação Aprimorada**: Sistema de tabs sem sidebars, com botões de voltar
- **Design Responsivo**: Adaptado para todos os dispositivos (mobile, tablet, desktop)

### 🎨 Melhorias de Interface
- Logo MetaSync atualizado com fundo transparente
- Design com cards elegantes e backdrop blur
- Gradientes azul/roxo em todas as páginas
- Interface responsiva com breakpoints otimizados
- Transições suaves e hover effects

## 📋 Checklist de Integrações

### ✅ Backend Integrations
- [x] Express.js server funcionando
- [x] PostgreSQL database conectado
- [x] Drizzle ORM configurado
- [x] Multi-tenant database system
- [x] Authentication system
- [x] API routes completas
- [x] CORS configurado
- [x] Environment variables setup

### ✅ Frontend Integrations  
- [x] React + Vite funcionando
- [x] TailwindCSS configurado
- [x] shadcn/ui components
- [x] React Query para API calls
- [x] Wouter para routing
- [x] Formulários com validação Zod
- [x] Toast notifications
- [x] Responsive design

### ✅ Database Schema
- [x] Users table
- [x] Companies table
- [x] Communities table
- [x] Spaces table
- [x] Posts table
- [x] Events table
- [x] Member points table
- [x] Database relationships

### 🔄 Integrações Pendentes (Opcionais)
- [ ] OpenAI API (necessária API key)
- [ ] WhatsApp integration (necessária configuração)
- [ ] Stripe payments (necessárias chaves)
- [ ] Email service (necessária configuração)

## 🛠️ Comandos de Deploy VPS

### 1. Preparação do Ambiente
```bash
# Conectar na VPS
ssh root@your-vps-ip

# Navegar para o diretório do projeto
cd /var/www/metasync

# Backup da versão atual (opcional)
cp -r . ../metasync-backup-$(date +%Y%m%d-%H%M%S)
```

### 2. Atualização do Código
```bash
# Pull das últimas alterações
git pull origin main

# Instalar dependências atualizadas
npm install

# Build da aplicação
npm run build
```

### 3. Configuração do Banco de Dados
```bash
# Aplicar migrações do schema
npm run db:push

# Verificar conexão do banco
npm run db:studio
```

### 4. Variáveis de Ambiente
Verificar se o arquivo `.env` contém:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/metasync

# Server
NODE_ENV=production
PORT=5000

# Opcionais (se disponíveis)
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...
```

### 5. Reiniciar Serviços
```bash
# Usando PM2
pm2 restart metasync
pm2 status

# Ou usando systemctl
sudo systemctl restart metasync
sudo systemctl status metasync
```

### 6. Configuração Nginx
Verificar se o arquivo `/etc/nginx/sites-available/metasync` está atualizado:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
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

Reiniciar Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🧪 Testes Pós-Deploy

### 1. Verificações Básicas
- [ ] Site carrega na URL principal
- [ ] Página de login do MetaSync Admin funciona
- [ ] Login com admin.metasync / metasync2024
- [ ] Navegação entre páginas funciona
- [ ] Responsividade em mobile

### 2. Funcionalidades do Sistema
- [ ] MetaSync Admin - listagem de empresas
- [ ] Criar nova empresa cliente
- [ ] Company Admin Dashboard
- [ ] Gerenciamento de usuários e especialistas
- [ ] Specialist Login page

### 3. Base de Dados
- [ ] Conexão com PostgreSQL
- [ ] Criação de registros
- [ ] Listagem de dados
- [ ] Atualizações funcionando

## 🔧 Troubleshooting

### Erro de Conexão Database
```bash
# Verificar status PostgreSQL
sudo systemctl status postgresql

# Restart se necessário
sudo systemctl restart postgresql

# Verificar logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Erro de Build
```bash
# Limpar cache
npm run clean
npm ci
npm run build
```

### Erro de Permissões
```bash
# Ajustar ownership
sudo chown -R www-data:www-data /var/www/metasync

# Ajustar permissões
sudo chmod -R 755 /var/www/metasync
```

## 📱 URLs de Teste

Após o deploy, testar essas URLs:

- **Homepage**: `https://your-domain.com/`
- **MetaSync Admin**: `https://your-domain.com/metasync-admin`
- **Company Admin**: `https://your-domain.com/company-admin-dashboard`
- **Specialist Login**: `https://your-domain.com/specialist-login`

## 🔐 Credenciais de Teste

### MetaSync Admin
- **Usuário**: admin.metasync
- **Senha**: metasync2024

### Company Admin
- **Usuário**: admin.clinica
- **Senha**: admin123

### Specialist
- **Usuário**: clarissa
- **Senha**: specialist123

## 📊 Monitoramento

### Logs da Aplicação
```bash
# PM2 logs
pm2 logs metasync

# System logs
sudo journalctl -u metasync -f
```

### Performance
```bash
# Verificar uso de recursos
pm2 monit

# Status do servidor
htop
```

## 🚨 Backup e Segurança

### Backup Automático do Banco
```bash
# Criar script de backup
sudo crontab -e

# Adicionar linha para backup diário às 2:00 AM
0 2 * * * pg_dump metasync > /var/backups/metasync-$(date +\%Y\%m\%d).sql
```

### SSL Certificate (se necessário)
```bash
# Certbot para HTTPS
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📞 Suporte

Em caso de problemas:
1. Verificar logs da aplicação
2. Verificar status dos serviços (nginx, postgresql, pm2)
3. Verificar variáveis de ambiente
4. Restart dos serviços se necessário

---

**Sistema pronto para deploy! 🚀**

Todas as funcionalidades principais estão implementadas e testadas.
O sistema está otimizado para produção com design responsivo.