#!/bin/bash

# MetaSync - Script de Deployment Automático para VPS
# ================================================

set -e  # Parar em caso de erro

echo "🚀 Iniciando deployment do MetaSync..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto MetaSync"
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "❌ Erro: Arquivo .env não encontrado!"
    echo "📝 Crie o arquivo .env baseado no .env.example"
    exit 1
fi

# Verificar variáveis obrigatórias
echo "🔍 Verificando configurações..."

if ! grep -q "DATABASE_URL=" .env || grep -q "DATABASE_URL=\"\"" .env; then
    echo "❌ Erro: DATABASE_URL não configurado no .env"
    exit 1
fi

if ! grep -q "OPENAI_API_KEY=" .env || grep -q "OPENAI_API_KEY=\"\"" .env; then
    echo "❌ Erro: OPENAI_API_KEY não configurado no .env"
    exit 1
fi

echo "✅ Configurações verificadas"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build

# Configurar banco de dados
echo "🗄️ Configurando banco de dados..."
npm run db:push

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2
fi

# Parar processos anteriores do MetaSync (se existirem)
echo "🛑 Parando processos anteriores..."
pm2 delete metasync 2>/dev/null || true

# Criar diretório de logs se não existir
sudo mkdir -p /var/log/pm2
sudo chown $(whoami):$(whoami) /var/log/pm2

# Iniciar aplicação com PM2
echo "🚀 Iniciando aplicação..."
pm2 start ecosystem.config.js

# Salvar configuração PM2
pm2 save

# Configurar PM2 para iniciar automaticamente
pm2 startup

# Verificar status
echo "📊 Status da aplicação:"
pm2 status

# Teste de conectividade
echo "🔍 Testando conectividade..."
sleep 5

if curl -f http://localhost:3000 &> /dev/null; then
    echo "✅ Aplicação rodando corretamente na porta 3000"
else
    echo "❌ Erro: Aplicação não está respondendo"
    echo "📋 Verificar logs: pm2 logs metasync"
    exit 1
fi

echo ""
echo "🎉 Deployment concluído com sucesso!"
echo ""
echo "📱 URLs de Acesso:"
echo "   MetaSync Admin: http://localhost:3000/metasync-admin"
echo "   Specialist Login: http://localhost:3000/specialist-login"
echo "   Company Management: http://localhost:3000/company-management"
echo ""
echo "🔧 Comandos úteis:"
echo "   Ver logs: pm2 logs metasync"
echo "   Status: pm2 status"
echo "   Restart: pm2 restart metasync"
echo "   Parar: pm2 stop metasync"
echo ""
echo "⚠️  Próximos passos:"
echo "   1. Configurar Nginx como proxy reverso"
echo "   2. Configurar SSL com Let's Encrypt"
echo "   3. Configurar domínio DNS"
echo "   4. Testar todas as funcionalidades"