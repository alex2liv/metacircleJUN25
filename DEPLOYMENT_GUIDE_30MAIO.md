# Guia de Deployment - MetaCircle (30/05/2025)

## Correções Implementadas Hoje

✅ **Logo MetaSync atualizado** - Versão horizontal mais profissional
✅ **Faixas salariais ajustadas** - Valores mensais: R$ 1.000-3.000, R$ 3.001-5.000, etc.
✅ **Botão de ajuda melhorado** - Removido efeito de piscar irritante
✅ **Sistema de autenticação aprimorado** - Acesso administrativo para gerenciar especialistas

## Pré-requisitos

- VPS com Node.js 18+ instalado
- PM2 para gerenciamento de processos
- Git configurado
- Acesso SSH à VPS

## 1. Atualizar Código na VPS

```bash
# Navegar para o diretório do projeto
cd /var/www/metacircle

# Parar o processo atual
pm2 stop metacircle

# Fazer backup (opcional)
cp -r . ../metacircle-backup-$(date +%Y%m%d)

# Atualizar código
git fetch origin
git pull origin main

# Instalar/atualizar dependências
npm install
```

## 2. Configurar Variáveis de Ambiente

Criar/atualizar arquivo `.env`:

```bash
nano .env
```

Conteúdo necessário:
```env
# Banco de Dados Supabase
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]

# OpenAI (para assistente IA funcionar)
OPENAI_API_KEY=sk-...

# Configurações do servidor
NODE_ENV=production
PORT=3091

# Configurações opcionais
VITE_STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

## 3. Executar Migrações do Banco

```bash
# Sincronizar schema com Supabase
npm run db:push
```

## 4. Build e Deploy

```bash
# Build da aplicação
npm run build

# Iniciar com PM2
pm2 start ecosystem.config.js

# Verificar status
pm2 status
pm2 logs metacircle
```

## 5. Configurar Nginx (se necessário)

Arquivo de configuração: `/etc/nginx/sites-available/metacircle`

```nginx
server {
    listen 80;
    server_name metacircle.metasyncdigital.com.br;

    location / {
        proxy_pass http://localhost:3091;
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

## 6. Verificações Pós-Deploy

- [ ] Site acessível em metacircle.metasyncdigital.com.br
- [ ] Login funcionando
- [ ] Dashboard carregando
- [ ] Botão "Ativar Admin" visível para usuários não-admin
- [ ] Assistente IA respondendo (se OPENAI_API_KEY configurada)
- [ ] Faixas salariais corretas no onboarding
- [ ] Logo MetaSync exibindo corretamente

## 7. Comandos Úteis

```bash
# Ver logs em tempo real
pm2 logs metacircle --lines 50

# Reiniciar aplicação
pm2 restart metacircle

# Parar aplicação
pm2 stop metacircle

# Ver status de todos os processos
pm2 list

# Monitoramento
pm2 monit
```

## Funcionalidades Principais a Testar

1. **Autenticação**
   - Login/logout
   - Recuperação de senha
   - Acesso administrativo

2. **Dashboard**
   - Estatísticas carregando
   - Posts recentes
   - Eventos próximos
   - Ranking de membros

3. **Criação de Conteúdo**
   - Criar posts
   - Agendar eventos
   - Gerenciar espaços

4. **Painel Administrativo**
   - Configurações gerais
   - Gerenciamento de usuários
   - Configuração de especialistas

5. **Assistente IA**
   - Chat rápido (botão flutuante)
   - Página completa do assistente
   - Respostas contextuais

## Problemas Conhecidos a Verificar

- Ações rápidas do assistente não respondendo
- WebSocket connections
- Notificações em tempo real
- Integração com MetaBridge (WhatsApp)

## Contato para Suporte

Em caso de problemas:
- WhatsApp: 17997337322
- Documentação: Verificar logs do PM2
- Monitoramento: `pm2 monit`