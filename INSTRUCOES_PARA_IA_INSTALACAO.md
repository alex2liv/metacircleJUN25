# Instruções para IA - Instalação MetaCircle na VPS

## Contexto do Projeto
Você está instalando o **MetaCircle**, uma plataforma de comunidades digitais em Node.js/React. O código já está atualizado com correções de 30/05/2025 incluindo logo horizontal, faixas salariais mensais e otimizações de interface.

## Informações da VPS
- **Domínio**: metacircle.metasyncdigital.com.br
- **Porta**: 3091
- **Diretório**: /var/www/metacircle
- **Processo**: PM2 com nome "metacircle"

## Passo 1: Preparar Ambiente

```bash
# Navegar para diretório
cd /var/www/metacircle

# Parar processo atual (se existir)
pm2 stop metacircle || echo "Processo não estava rodando"
pm2 delete metacircle || echo "Processo não existia"

# Fazer backup
cp -r . ../metacircle-backup-$(date +%Y%m%d-%H%M%S)
```

## Passo 2: Atualizar Código

```bash
# Buscar atualizações
git fetch origin
git pull origin main

# Verificar se as correções estão presentes
ls -la DEPLOYMENT_GUIDE_30MAIO.md
ls -la deploy.sh
ls -la CHANGELOG_CORRECOES_30MAIO.md
```

## Passo 3: Configurar Dependências

```bash
# Instalar dependências
npm install

# Verificar versões
node --version  # Deve ser 18+
npm --version
```

## Passo 4: Configurar Variáveis de Ambiente

Criar arquivo `.env` no diretório raiz:

```bash
nano .env
```

Conteúdo obrigatório:
```env
# Banco de Dados (OBRIGATÓRIO)
DATABASE_URL=postgresql://user:password@host:5432/database

# OpenAI para Assistente IA (RECOMENDADO)
OPENAI_API_KEY=sk-...

# Servidor
NODE_ENV=production
PORT=3091

# Opcionais
VITE_STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

**IMPORTANTE**: Peça ao usuário para fornecer o DATABASE_URL do Supabase e OPENAI_API_KEY se quiser o assistente funcionando.

## Passo 5: Banco de Dados

```bash
# Sincronizar schema (CRÍTICO)
npm run db:push

# Se der erro, verificar conexão com banco
echo "Testando conexão com banco..."
node -e "console.log(process.env.DATABASE_URL ? 'DATABASE_URL configurada' : 'DATABASE_URL FALTANDO')"
```

## Passo 6: Build e Deploy

```bash
# Build da aplicação
npm run build

# Verificar se build foi criado
ls -la dist/

# Tornar script executável
chmod +x deploy.sh

# OU iniciar manualmente com PM2:
pm2 start ecosystem.config.js
```

## Passo 7: Verificar Funcionamento

```bash
# Verificar processo
pm2 status
pm2 logs metacircle --lines 20

# Testar localmente
curl -I http://localhost:3091

# Verificar se porta está aberta
netstat -tlnp | grep 3091
```

## Passo 8: Configurar Nginx (se necessário)

Verificar se existe configuração:
```bash
ls -la /etc/nginx/sites-available/metacircle
ls -la /etc/nginx/sites-enabled/metacircle
```

Se não existir, criar:
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

## Checklist de Verificação Final

- [ ] Processo PM2 rodando: `pm2 status`
- [ ] Aplicação respondendo: `curl http://localhost:3091`
- [ ] Site acessível: `curl http://metacircle.metasyncdigital.com.br`
- [ ] Logs sem erros críticos: `pm2 logs metacircle`
- [ ] Banco conectando: verificar logs de conexão

## Funcionalidades para Testar Após Deploy

1. **Login/Logout**: Página inicial deve carregar
2. **Dashboard**: Estatísticas e dados devem aparecer
3. **Onboarding**: Faixas salariais corretas (R$ 1.000-3.000, etc.)
4. **Logo**: Versão horizontal deve aparecer
5. **Assistente**: Botão flutuante sem piscar

## Comandos de Monitoramento

```bash
# Ver logs em tempo real
pm2 logs metacircle

# Reiniciar se necessário
pm2 restart metacircle

# Ver uso de recursos
pm2 monit

# Ver informações detalhadas
pm2 show metacircle
```

## Resolução de Problemas Comuns

### Erro de Banco
- Verificar DATABASE_URL no .env
- Testar conexão com Supabase
- Executar `npm run db:push` novamente

### Erro de Build
- Verificar se todas as dependências foram instaladas
- Limpar cache: `npm cache clean --force`
- Deletar node_modules e reinstalar

### Erro de Porta
- Verificar se porta 3091 está livre: `lsof -i :3091`
- Matar processo se necessário: `kill -9 PID`

### Site não Carrega
- Verificar Nginx: `nginx -t && systemctl reload nginx`
- Verificar firewall: `ufw status`
- Verificar DNS do domínio

## Logs Importantes para Verificar

```bash
# Logs da aplicação
pm2 logs metacircle

# Logs do Nginx (se usado)
tail -f /var/log/nginx/error.log

# Logs do sistema
journalctl -u nginx -f
```

## Informações de Suporte

- **WhatsApp**: 17997337322
- **Arquivo de Deploy**: Use `./deploy.sh` se disponível
- **Backup**: Sempre em ../metacircle-backup-DATE
- **Documentação**: DEPLOYMENT_GUIDE_30MAIO.md