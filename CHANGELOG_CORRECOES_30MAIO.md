# Changelog - Correções 30/05/2025

## Melhorias Implementadas

### 🎨 Interface e Design
- **Logo MetaSync atualizado**: Substituído logo vertical por versão horizontal mais profissional
- **Botão de ajuda otimizado**: Removido efeito de piscar irritante, mantendo apenas animação suave
- **Espaçamento aprimorado**: Logo com proporções mais equilibradas em todas as páginas

### 💰 Sistema de Onboarding  
- **Faixas salariais atualizadas**: 
  - R$ 1.000 - R$ 3.000
  - R$ 3.001 - R$ 5.000  
  - R$ 5.001 - R$ 7.000
  - R$ 7.001 - R$ 10.000
  - Acima de R$ 10.000
- **Texto atualizado**: Mudança de "receita anual" para "renda mensal"

### 🔧 Sistema Administrativo
- **Acesso administrativo**: Botão para ativar privilégios de admin no dashboard
- **Rota backend**: Endpoint para elevar permissões de usuário
- **Preparação para gestão de especialistas**: Sistema pronto para adicionar e gerenciar especialistas

### 📦 Deploy e Infraestrutura
- **Guia de deployment**: Instruções detalhadas para VPS
- **Script automatizado**: Deploy com backup e verificações
- **Configuração PM2**: Gerenciamento de processos otimizado
- **Variáveis de ambiente**: Documentação completa das configurações necessárias

## Arquivos Criados/Modificados

### Novos Arquivos
- `DEPLOYMENT_GUIDE_30MAIO.md` - Guia completo de deployment
- `deploy.sh` - Script automatizado para deploy na VPS
- `ecosystem.config.js` - Configuração PM2 para produção
- `CHANGELOG_CORRECOES_30MAIO.md` - Este arquivo

### Arquivos Modificados
- `client/src/pages/login.tsx` - Logo atualizado
- `client/src/pages/landing.tsx` - Logo atualizado  
- `client/src/pages/client-view.tsx` - Logo atualizado
- `client/src/pages/onboarding.tsx` - Faixas salariais atualizadas
- `client/src/pages/dashboard.tsx` - Botão de acesso administrativo
- `client/src/components/floating-help-button.tsx` - Removido piscar
- `server/routes.ts` - Rota para acesso administrativo

## Próximos Passos para Deploy

1. Subir código para GitHub com nome contendo "correcoes_30MAIO"
2. Na VPS: executar `git pull` e `./deploy.sh`
3. Configurar variáveis de ambiente (.env)
4. Testar funcionalidades principais
5. Documentar problemas encontrados para próxima iteração

## Funcionalidades Testadas em Desenvolvimento

- Sistema de onboarding completo
- Faixas salariais exibindo corretamente
- Logo horizontal em todas as páginas
- Botão de ajuda sem efeito irritante
- Dashboard carregando com dados

## Pendências para Teste em Produção

- Assistente IA com OpenAI real
- Integração WhatsApp via MetaBridge  
- Notificações em tempo real
- Sistema de autenticação completo
- Gestão de especialistas