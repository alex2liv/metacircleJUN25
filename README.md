# 🚀 MetaCircle - Plataforma de Comunidades Digitais

> **Versão Enterprise** - A mais avançada plataforma de comunidades do Brasil, superando Circle.so, Discord e Slack.

![MetaCircle](./attached_assets/a88aad12-debb-48b7-9a26-acf54585d11e%20(1).png)

## 🆕 Última Atualização - 30/05/2025
- Logo MetaSync horizontal mais profissional
- Faixas salariais mensais no onboarding (R$ 1.000-10.000+)
- Interface de ajuda otimizada sem efeitos irritantes
- Sistema de acesso administrativo aprimorado

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [APIs e Integrações](#apis-e-integrações)
- [Preparação Mobile](#preparação-mobile)
- [Deploy](#deploy)
- [Licença](#licença)

## 🎯 Sobre o Projeto

**MetaCircle** é uma plataforma SaaS de comunidades digitais moderna, desenvolvida para superar todos os concorrentes do mercado. Faz parte do ecossistema **MetaSync Digital** que inclui:

- **MetaHub**: Centro de controle
- **MetaBridge**: Integração WhatsApp (Evolution API)
- **MetaTalk**: Atendimento (Chatwoot)
- **MetaCircle**: Comunidades (este projeto)

### 🎯 Diferenciais Competitivos

✅ **IA Integrada** - GPT-4o para assistente inteligente  
✅ **WhatsApp Nativo** - Notificações via MetaBridge  
✅ **Analytics Profissional** - Dashboards em tempo real  
✅ **White Label** - Personalização completa  
✅ **Mobile Ready** - PWA + Apps nativos preparados  
✅ **Enterprise Security** - Rate limiting, auditoria, backups  

## 🚀 Funcionalidades

### 👥 Gestão de Comunidades
- **Espaços Personalizados** - Posts, discussões e arquivos
- **Sistema de Ranking** - Gamificação com pontos e níveis
- **Membros e Permissões** - Controle granular de acesso

### 📅 Eventos e Cursos
- **Calendário Inteligente** - Eventos online e presenciais
- **Integração PerfectPAY** - Cursos pagos automáticos
- **YouTube Live** - Transmissões ao vivo integradas
- **Notificações WhatsApp** - Lembretes automáticos

### 💬 Chat e Comunicação
- **Chats em Tempo Real** - WebSocket para mensagens instantâneas
- **Três Níveis de Acesso** - Básico, Intermediário, Premium
- **Moderação ao Vivo** - Sistema Q&A e "levantar a mão"
- **Suporte Clarissa** - 3 tickets SOS anuais (Premium)

### 📱 Videochamadas
- **Salas Múltiplas** - Várias reuniões simultâneas
- **PIN para Destaque** - Modo tela cheia para palestrantes
- **Gravação** - Disponível para revisão posterior

### 🤖 IA e Automação
- **Assistente GPT-4o** - Suporte inteligente 24/7
- **Respostas Contextuais** - Baseadas no conteúdo da comunidade
- **Moderação Automática** - Filtros de spam e conteúdo

### 📊 Analytics Enterprise
- **Dashboard Completo** - Métricas de engajamento
- **Relatórios PDF** - Automáticos semanais/mensais
- **Integração Analytics** - Google, Facebook Pixel, Hotjar
- **Auditoria** - Logs de todas as ações administrativas

### 🎨 Personalização
- **Temas Customizáveis** - Cores e branding próprios
- **Upload de Logo** - Identidade visual do cliente
- **Domínios Personalizados** - Seu próprio endereço
- **CSS Customizável** - Controle total do design

## 🛠️ Tecnologias

### Frontend
- **React 18** - Interface moderna e responsiva
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Design system profissional
- **Wouter** - Roteamento leve e eficiente
- **TanStack Query** - Gerenciamento de estado e cache

### Backend
- **Node.js + Express** - API REST robusta
- **WebSocket** - Comunicação em tempo real
- **Drizzle ORM** - Banco de dados type-safe
- **PostgreSQL** - Banco principal (Supabase/Neon)

### Integrações
- **OpenAI GPT-4o** - Inteligência artificial
- **Supabase** - Backend as a Service
- **Evolution API** - WhatsApp Business
- **PerfectPAY** - Pagamentos e cursos
- **SendGrid** - Sistema de emails

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL (ou conta Supabase)
- Conta OpenAI para IA

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/metacircle.git
cd metacircle
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# Banco de Dados
DATABASE_URL="sua_url_do_supabase"

# OpenAI
OPENAI_API_KEY="sua_chave_openai"

# Email (opcional)
SENDGRID_API_KEY="sua_chave_sendgrid"

# Stripe (se usar pagamentos)
STRIPE_SECRET_KEY="sua_chave_stripe"
VITE_STRIPE_PUBLIC_KEY="sua_chave_publica_stripe"
```

### 4. Execute as Migrações
```bash
npm run db:push
```

### 5. Inicie o Servidor
```bash
npm run dev
```

🎉 **Pronto!** Acesse `http://localhost:5173`

## ⚙️ Configuração

### 🔧 Painel Administrativo
Acesse `/specialist-admin` para configurar:

1. **Perfil do Especialista** - Nome, foto, especialidade
2. **Horários de Atendimento** - Disponibilidade para consultas
3. **Banco de Dados** - Conexão Supabase
4. **Email/SMTP** - Configuração de envios
5. **Analytics** - Google Analytics, Facebook Pixel
6. **Segurança** - Rate limiting, backups, auditoria
7. **Personalização** - Cores, logo, domínio customizado
8. **Mobile Apps** - Preparação Android/iOS

### 📧 Sistema de Convites
Acesse `/invite-members` para:

- **Upload em Massa** - CSV com 800+ emails
- **Convites Individuais** - Para casos específicos
- **Mensagens Personalizadas** - Texto do convite
- **Relatórios** - Status de cada envio

## 📱 Como Usar

### 👤 Para Usuários

1. **Acesse a Plataforma** - Link de convite ou registro
2. **Complete o Perfil** - Foto e informações básicas
3. **Explore Espaços** - Participe das discussões
4. **Participe de Eventos** - Calendário integrado
5. **Use o Chat** - Comunicação em tempo real
6. **Ganhe Pontos** - Sistema de gamificação

### 👨‍💼 Para Administradores

1. **Painel Admin** - `/specialist-admin`
2. **Criar Espaços** - Organize por temas
3. **Gerenciar Membros** - Convites e permissões
4. **Criar Eventos** - Com notificações automáticas
5. **Analytics** - Acompanhe métricas
6. **Personalizar** - Branding da comunidade

## 🔗 APIs e Integrações

### WhatsApp (MetaBridge)
```javascript
// Notificação automática de evento
const notification = {
  phone: "5511999999999",
  message: "🎉 Novo evento: Reunião às 14h",
  communityId: 1
};
```

### PerfectPAY
```javascript
// Webhook de curso comprado
app.post('/api/webhook/perfectpay', (req, res) => {
  const { email, courseId, status } = req.body;
  // Liberação automática de acesso
});
```

### OpenAI Assistant
```javascript
// Chat com IA contextual
const response = await openai.chat.completions.create({
  model: "gpt-4o", // modelo mais recente
  messages: [
    { role: "system", content: "Você é assistente da comunidade..." },
    { role: "user", content: "Como faço para..." }
  ]
});
```

## 📱 Preparação Mobile

### PWA (Progressive Web App)
✅ **Manifest.json** configurado  
✅ **Service Worker** preparado  
✅ **Responsive Design** completo  
✅ **Offline Mode** parcial  

### Apps Nativos (Próxima Fase)
- **React Native** ou **Flutter**
- **Push Notifications** nativas
- **Deep Links** para conteúdo específico
- **Sincronização offline/online**

### Configuração no Admin
```javascript
// Configurações mobile no painel
const mobileConfig = {
  androidAppEnabled: true,
  iosAppEnabled: true, 
  pushNotificationsEnabled: true,
  appName: "MetaCircle",
  playStoreUrl: "...",
  appStoreUrl: "..."
};
```

## 🚀 Deploy

### Replit (Recomendado)
1. **Push para Git** - Seu repositório
2. **Import no Replit** - Conecte o repo
3. **Configure Secrets** - Variáveis de ambiente
4. **Deploy** - Botão automático

### VPS Tradicional
```bash
# Preparação do servidor
npm run build
npm run start

# Com PM2 (recomendado)
pm2 start npm --name "metacircle" -- start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Roadmap

### 🎯 Versão Atual (1.0)
✅ Comunidades e chat  
✅ Eventos e calendário  
✅ IA integrada  
✅ Analytics profissional  
✅ Sistema de convites  

### 🚀 Próximas Versões

**v1.1 - Marketplace**
- [ ] Loja de cursos integrada
- [ ] Pagamentos Stripe/PerfectPAY
- [ ] Comissões para criadores

**v1.2 - Mobile Apps**
- [ ] App Android nativo
- [ ] App iOS nativo  
- [ ] Push notifications
- [ ] Modo offline

**v1.3 - Enterprise+**
- [ ] Multi-tenancy
- [ ] API para terceiros
- [ ] Integrações Zapier
- [ ] White label completo

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Email**: suporte@metasync.com.br
- **WhatsApp**: (17) 99733-7322
- **Documentação**: Em desenvolvimento
- **Issues**: Use o GitHub Issues

## 🏆 Criado por MetaSync Digital

**MetaCircle** é desenvolvido pela **MetaSync Digital**, especializada em soluções tecnológicas inovadoras para transformação digital de empresas.

---

⭐ **Se este projeto te ajudou, deixe uma estrela!** ⭐

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2025  
**Status**: ✅ Produção Ready