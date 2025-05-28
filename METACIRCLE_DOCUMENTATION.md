# MetaCircle - Documentação Completa do Sistema

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Funcionalidades Principais](#funcionalidades-principais)
4. [Sistema de Planos e Assinaturas](#sistema-de-planos-e-assinaturas)
5. [Painel Administrativo](#painel-administrativo)
6. [Integrações](#integrações)
7. [Guia do Usuário](#guia-do-usuário)
8. [Configurações Técnicas](#configurações-técnicas)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

---

## 🎯 Visão Geral

### O que é o MetaCircle?
O MetaCircle é uma plataforma de comunidades online moderna e inteligente, projetada para superar concorrentes como Circle.so, Discord e Slack. Faz parte do ecossistema MetaSync Digital, oferecendo experiências personalizadas e engajamento estratégico.

### Principais Diferenciais
- **Design Limpo e Moderno**: Interface intuitiva com gradientes azul-escuro para roxo profundo
- **Sistema de Gamificação**: Pontuação, ranking e termômetro de pontos para engajamento
- **Planos Inteligentes**: Três níveis com limitações estratégicas para conversão
- **Integrações Nativas**: WhatsApp, YouTube, PerfectPAY e sistemas de pagamento
- **Modo Beta**: Sistema de testes gratuitos com período de graça configurável

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológica
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Banco de Dados**: PostgreSQL (Supabase)
- **UI/UX**: Tailwind CSS + Shadcn/ui
- **Autenticação**: Passport.js + Sessões
- **Real-time**: WebSockets
- **Pagamentos**: Stripe + PerfectPAY

### Estrutura de Diretórios
```
metacircle/
├── client/src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── hooks/         # Hooks personalizados
│   └── lib/           # Utilitários e configurações
├── server/            # Backend Express
├── shared/            # Schemas e tipos compartilhados
└── attached_assets/   # Assets e documentação
```

---

## ⚡ Funcionalidades Principais

### 1. Sistema de Comunidades
- **Criação de Comunidades**: Customização completa com temas
- **Espaços**: Organização por categorias (posts, discussões, anúncios)
- **Posts e Discussões**: Sistema completo com comentários e reações
- **Membros**: Gerenciamento de usuários com diferentes permissões

### 2. Sistema de Eventos
- **Criação de Eventos**: Online e presenciais com calendário integrado
- **Notificações WhatsApp**: Avisos automáticos via MetaBridge
- **Participantes**: Controle de inscrições e limite de vagas
- **Integração YouTube**: Lives automáticas para eventos online

### 3. Cursos e Conteúdo
- **Integração PerfectPAY**: Cursos pagos com acesso automático
- **Vídeos Incorporados**: YouTube, Vimeo e outros players
- **Progresso do Aluno**: Acompanhamento detalhado
- **Certificados**: Emissão automática

### 4. Chat e Comunicação
- **Chat Geral**: Comunicação aberta para todos os membros
- **Chat com Especialista**: Acesso direto (Premium)
- **SOS Clarissa**: Suporte urgente (3 tickets/ano Premium)
- **Agendamentos**: Consultas individuais
- **Videochamadas**: Salas múltiplas simultâneas

### 5. Sistema de Ranking
- **Pontuação por Atividade**: Posts, comentários, participação
- **Termômetro de Pontos**: Visualização gamificada
- **Top Membros**: Ranking público mensal
- **Badges e Conquistas**: Sistema de recompensas

---

## 💳 Sistema de Planos e Assinaturas

### Planos Disponíveis

#### 🥉 Plano Básico (R$ 29,90/mês)
**Limitações Estratégicas:**
- Chat apenas com texto (sem áudio/vídeo)
- Acesso a eventos limitado
- Sem chat direto com especialista
- Sem agendamentos
- 24h de acesso Premium gratuito por mês

**Incluído:**
- Acesso a comunidades
- Posts e comentários
- Eventos básicos
- Ranking de pontos

#### 🥈 Plano Intermediário (R$ 59,90/mês)
**Limitações Estratégicas:**
- Chat com texto + microfone (sem vídeo)
- Acesso a eventos com restrições
- Chat com especialista limitado (5 mensagens/dia)
- 1 agendamento por mês
- 48h de acesso Premium gratuito por mês

**Incluído:**
- Tudo do Básico +
- Chat com áudio
- Prioridade em eventos
- Suporte intermediário

#### 👑 Plano Premium (R$ 119,90/mês)
**Acesso Total:**
- Chat completo (texto, áudio, vídeo)
- Acesso ilimitado a eventos
- Chat direto com especialista
- Agendamentos ilimitados
- 3 tickets SOS Clarissa por ano
- Suporte prioritário 24/7
- Acesso a todas as funcionalidades

### Sistema de Gamificação
**Período de Teste Gratuito:**
- 14 dias de acesso Premium completo
- Requer cartão de crédito antecipado
- Cobrança automática via PerfectPAY após trial
- Cancelamento disponível a qualquer momento

---

## 🛠️ Painel Administrativo

### Configurações do Especialista
- **Dados Pessoais**: Nome, telefone, email, bio
- **Especialidade**: Área de atuação
- **Avatar**: Foto de perfil personalizável
- **Status**: Ativo/Inativo

### Horários de Atendimento
- **Configuração Semanal**: Definir horários por dia
- **Dias Ativos**: Ativar/desativar dias específicos
- **Horários Flexíveis**: Início e fim personalizáveis
- **Exceções**: Feriados e ausências

### Modo Beta (Novidade!)
**Controle de Acesso Gratuito:**
- **Ativar/Desativar**: Switch principal do modo beta
- **Data de Fim**: Definir término do período de teste
- **Mensagem Personalizada**: Texto exibido aos usuários
- **Período de Graça**: 1-7 dias após fim do beta
- **Countdown Automático**: Avisos "Faltam X dias"

**Benefícios do Modo Beta:**
- Todos os usuários têm acesso Premium gratuito
- Perfeito para testes e coleta de feedback
- Correção de bugs sem impacto na receita
- Transition suave para modelo pago

### Automações e Integrações
**Notificações WhatsApp:**
- **MetaBridge**: Integração via Evolution API
- **Eventos**: Lembretes automáticos
- **Comentários**: Notificações de menções
- **Agendamentos**: Confirmações e lembretes

**N8N Workflow:**
- **Webhook URL**: Endpoint para automações
- **Resposta Automática**: Tempo configurável
- **Confirmação de Agendamentos**: Automática/Manual

---

## 🔗 Integrações

### MetaBridge (WhatsApp)
**Funcionalidades:**
- Notificações de eventos
- Alertas de comentários e menções
- Confirmações de agendamento
- Lembretes automáticos
- Suporte via WhatsApp

**Configuração:**
```json
{
  "whatsapp_number": "17997337322",
  "api_url": "https://metabridge.metasync.com.br",
  "webhook_events": ["comment", "event", "appointment"]
}
```

### PerfectPAY (Cursos)
**Integração Automática:**
- **Detecção de Compra**: Webhook automático
- **Acesso Liberado**: Instantâneo após pagamento
- **Senha Padrão**: 12345 (configurável)
- **Sincronização**: Email automático entre sistemas

**Configuração Admin:**
- URL da API PerfectPAY
- Chave de integração
- Senha padrão (editável em configurações)

### YouTube (Lives)
**Recursos:**
- **Incorporação de Vídeos**: Player nativo
- **Lives Automáticas**: Para eventos online
- **Notificações**: Avisos de início de transmissão
- **Chat Integrado**: Comentários sincronizados

### Stripe (Pagamentos)
**Processamento:**
- **Assinaturas Recorrentes**: Planos mensais/anuais
- **Cartões Salvos**: Checkout rápido
- **Webhooks**: Atualizações automáticas de status
- **Faturas**: Geração automática

---

## 👤 Guia do Usuário

### Primeiro Acesso
1. **Registro**: Email + senha ou login social
2. **Escolha do Plano**: 14 dias Premium gratuito
3. **Onboarding**: Tour guiado pelas funcionalidades
4. **Configuração de Perfil**: Avatar, bio, interesses

### Navegação Principal
**Dashboard:**
- Estatísticas da comunidade
- Feed de atividades recentes
- Eventos próximos
- Top membros do mês

**Espaços:**
- Posts por categoria
- Discussões ativas
- Arquivos compartilhados
- Histórico de conversas

**Eventos:**
- Calendário mensal
- Inscrições abertas
- Eventos passados
- Minhas participações

**Chat:**
- Sala geral da comunidade
- Chat direto com especialista (Premium)
- Histórico de conversas
- Notificações em tempo real

### Sistema de Pontos
**Como Ganhar Pontos:**
- Criar post: +10 pontos
- Comentar: +5 pontos
- Participar de evento: +20 pontos
- Receber like: +2 pontos
- Completar curso: +50 pontos

**Ranking Mensal:**
- Top 3 membros destacados
- Badges especiais
- Reconhecimento público
- Prêmios sazonais

---

## ⚙️ Configurações Técnicas

### Variáveis de Ambiente
```env
# Banco de Dados
DATABASE_URL=postgresql://...
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=senha
PGDATABASE=metacircle

# Autenticação
SESSION_SECRET=chave_secreta_forte

# Integrações
PERFECTPAY_API_URL=https://api.perfectpay.com.br
PERFECTPAY_API_KEY=sua_chave_api
METABRIDGE_WEBHOOK=https://n8n.metasync.com.br/webhook/whatsapp

# Stripe (se configurado)
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...
```

### Comandos Disponíveis
```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build

# Banco de Dados
npm run db:push      # Aplicar mudanças no schema
npm run db:studio    # Interface visual do banco
npm run db:seed      # Popular com dados de exemplo
```

### Estrutura do Banco
**Tabelas Principais:**
- `users` - Usuários do sistema
- `communities` - Comunidades criadas
- `spaces` - Espaços dentro das comunidades
- `posts` - Posts e discussões
- `events` - Eventos e agendamentos
- `member_points` - Sistema de pontuação
- `user_subscriptions` - Assinaturas ativas
- `specialist_settings` - Configurações do admin

---

## 🚨 Troubleshooting

### Problemas Comuns

#### "Erro de Conexão com Banco"
**Solução:**
1. Verificar variáveis de ambiente
2. Confirmar conexão com Supabase
3. Validar permissões de usuário
4. Reiniciar servidor

#### "WhatsApp não está enviando"
**Solução:**
1. Verificar MetaBridge ativo
2. Confirmar webhook N8N funcionando
3. Validar número do WhatsApp
4. Testar conexão manual

#### "Pagamentos não processando"
**Solução:**
1. Verificar chaves Stripe válidas
2. Confirmar webhook configurado
3. Testar em modo sandbox
4. Validar dados do cartão

#### "Vídeos não carregam"
**Solução:**
1. Verificar URL do YouTube válida
2. Confirmar vídeo público
3. Testar conexão de internet
4. Limpar cache do navegador

### Logs do Sistema
**Localização:**
- Frontend: Console do navegador
- Backend: Terminal do servidor
- Banco: Supabase Dashboard
- Webhooks: N8N logs

**Níveis de Log:**
- `ERROR`: Problemas críticos
- `WARN`: Avisos importantes
- `INFO`: Informações gerais
- `DEBUG`: Detalhes técnicos

---

## ❓ FAQ

### Sobre o Sistema
**Q: O MetaCircle funciona offline?**
A: Não, é uma plataforma online que requer conexão à internet.

**Q: Posso personalizar o design da comunidade?**
A: Sim, há opções de temas e cores personalizáveis no painel admin.

**Q: Quantos membros posso ter?**
A: Não há limite definido, mas performance pode variar com muitos usuários simultâneos.

### Sobre Planos
**Q: Posso mudar de plano a qualquer momento?**
A: Sim, upgrades são imediatos e downgrades ao final do ciclo atual.

**Q: O período de teste é realmente gratuito?**
A: Sim, 14 dias completos sem cobrança, mas requer cartão válido.

**Q: Posso cancelar antes do fim do trial?**
A: Sim, cancele a qualquer momento sem cobrança.

### Sobre Integrações
**Q: O WhatsApp funciona com qualquer número?**
A: Requer número verificado e integração via MetaBridge.

**Q: Posso usar outros players além do YouTube?**
A: Atualmente suporta YouTube, Vimeo planejado para próximas versões.

**Q: Como sincronizar com PerfectPAY?**
A: Configuração automática via webhook, apenas inserir chaves de API.

### Técnicas
**Q: Que navegadores são suportados?**
A: Chrome, Firefox, Safari, Edge - versões recentes recomendadas.

**Q: O sistema é responsivo?**
A: Sim, totalmente otimizado para desktop, tablet e mobile.

**Q: Há app mobile nativo?**
A: Não ainda, mas PWA funciona bem. App nativo planejado.

**Q: Posso fazer backup dos dados?**
A: Sim, via Supabase Dashboard ou API para exportação.

---

## 📞 Suporte e Contato

### Canais de Suporte
- **WhatsApp**: 17997337322
- **Email**: suporte@metasync.com.br
- **Chat no Sistema**: Disponível 24/7 para Premium
- **SOS Clarissa**: 3 atendimentos/ano (Premium)

### Documentação Técnica
- **API Docs**: `/api/docs`
- **Changelog**: `/CHANGELOG.md`
- **Issues**: GitHub repository
- **Updates**: Newsletter semanal

### Comunidade
- **Grupo Telegram**: MetaSync Developers
- **Discord**: Suporte da comunidade
- **Fórum**: Discussões e dúvidas
- **YouTube**: Tutoriais e novidades

---

## 🔄 Atualizações e Roadmap

### Versão Atual: 2.0.0
**Novidades:**
- ✅ Sistema de Modo Beta
- ✅ Período de Graça configurável
- ✅ Countdown visual para expiração
- ✅ Integração PerfectPAY aprimorada
- ✅ WhatsApp notifications via MetaBridge

### Próximas Versões
**v2.1.0 (Próximos 30 dias):**
- 🔄 App mobile nativo (Android)
- 🔄 Integração Chatwoot (MetaTalk)
- 🔄 Sistema de badges avançado
- 🔄 Relatórios de analytics

**v2.2.0 (Próximos 60 dias):**
- 🔄 Marketplace de plugins
- 🔄 API pública para desenvolvedores
- 🔄 Integrações Zapier/Make
- 🔄 Multi-linguagem

---

*Documentação gerada em: ${new Date().toLocaleDateString('pt-BR')}*
*Versão do Sistema: 2.0.0*
*© 2025 MetaSync Digital - Todos os direitos reservados*