#!/bin/bash

# Script de Deploy - MetaCircle (30/05/2025)
# Correções: Logo horizontal, faixas salariais mensais, botão ajuda sem piscar

echo "🚀 Iniciando deploy do MetaCircle..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Parar processo atual
echo "⏹️  Parando processo atual..."
pm2 stop metacircle 2>/dev/null || echo "Processo não estava rodando"

# Backup do diretório atual
echo "💾 Criando backup..."
BACKUP_DIR="../metacircle-backup-$(date +%Y%m%d-%H%M%S)"
cp -r . "$BACKUP_DIR"
echo "Backup criado em: $BACKUP_DIR"

# Atualizar código
echo "📥 Atualizando código do GitHub..."
git fetch origin
git pull origin main

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "Crie o arquivo .env com as variáveis necessárias:"
    echo "DATABASE_URL=postgresql://..."
    echo "OPENAI_API_KEY=sk-..."
    echo "NODE_ENV=production"
    echo "PORT=3091"
    exit 1
fi

# Executar migrações
echo "🗄️  Sincronizando banco de dados..."
npm run db:push

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
pm2 start ecosystem.config.js 2>/dev/null || pm2 start npm --name "metacircle" -- run start

# Verificar status
echo "✅ Verificando status..."
pm2 status

echo ""
echo "🎉 Deploy concluído!"
echo "📱 Site: http://metacircle.metasyncdigital.com.br"
echo "📊 Monitoramento: pm2 logs metacircle"
echo ""
echo "🔍 Funcionalidades a testar:"
echo "- Login/logout"
echo "- Dashboard com estatísticas"
echo "- Botão 'Ativar Admin'"
echo "- Assistente IA (botão flutuante)"
echo "- Faixas salariais no onboarding"
echo "- Logo MetaSync horizontal"