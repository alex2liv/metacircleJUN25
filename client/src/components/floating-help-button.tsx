import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  X, 
  MessageCircle, 
  Sparkles,
  HelpCircle,
  Phone,
  ExternalLink
} from "lucide-react";
import { useLocation } from "wouter";

export function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [, setLocation] = useLocation();
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: '👋 Olá! Como posso ajudar você hoje?\n\n💡 **Dicas rápidas:**\n• Digite "planos" para ver preços\n• Digite "erro" se estiver com problemas\n• Digite "whatsapp" para configurar notificações',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setChatMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'user',
      message: newMessage,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }]);

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        message: getBotResponse(newMessage),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);

    setNewMessage('');
  };

  const getBotResponse = (message: string) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('plano') || msg.includes('preço')) {
      return `💳 **Nossos Planos:**

🥉 **Básico** - Preço configurável no admin
• Chat apenas texto
• Eventos limitados

🥈 **Intermediário** - Preço configurável no admin  
• Chat texto + áudio
• 5 mensagens/dia com especialista

👑 **Premium** - Preço configurável no admin
• Acesso total + 3 SOS/ano
• Chat ilimitado com especialista

🎁 **14 dias Premium grátis** para testar!

Os preços são definidos pelo administrador da comunidade.`;
    }

    if (msg.includes('criar') || msg.includes('post') || msg.includes('evento')) {
      return `📝 **Criar Conteúdo:**

**Para criar posts:**
1. Clique no botão "+" no topo da tela
2. Selecione "Criar Post"
3. Escolha o espaço da comunidade
4. Adicione título e conteúdo

**Para agendar eventos:**
1. Clique no botão "+" 
2. Selecione "Agendar Evento"
3. Preencha detalhes do evento
4. Notificações WhatsApp automáticas

Precisa de ajuda com algo específico?`;
    }

    if (msg.includes('erro') || msg.includes('problema')) {
      return `🔧 **Vamos resolver!**

**Teste primeiro:**
✅ Atualizar página (F5)
✅ Limpar cache do navegador
✅ Verificar conexão internet

**Se persistir:**
📱 WhatsApp: 17997337322
💬 Chat completo: clique em "Assistente IA"
📧 Email: suporte@metasync.com.br

Me conte qual erro específico está vendo!`;
    }

    if (msg.includes('assistente') || msg.includes('ai') || msg.includes('gpt')) {
      return `🤖 **Sobre o Assistente IA:**

**Para ativar ChatGPT real:**
1. Vá no Painel Admin
2. Seção "Assistente IA"
3. Adicione sua chave OpenAI
4. Configure instruções personalizadas

**Sem chave:** Usa respostas básicas
**Com chave:** ChatGPT inteligente 24/7

Quer que eu explique como configurar?`;
    }

    return `Entendi! 😊 Posso ajudar com:

💳 **"planos"** - Ver preços e recursos
📝 **"criar post"** - Como publicar conteúdo  
🔧 **"erro"** - Resolver problemas técnicos
🤖 **"assistente"** - Configurar ChatGPT
📱 **WhatsApp:** 17997337322

Digite uma palavra-chave ou sua dúvida específica!`;
  };

  const quickActions = [
    { label: "Ver Planos", action: () => setNewMessage("Quais são os planos disponíveis?") },
    { label: "Criar Post", action: () => setNewMessage("Como criar post?") },
    { label: "Problema Técnico", action: () => setNewMessage("Estou com erro no sistema") },
    { label: "Configurar IA", action: () => setNewMessage("Como ativar assistente ChatGPT?") }
  ];

  return (
    <>
      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
            size="lg"
          >
            <Bot className="w-6 h-6 text-white" />
          </Button>
        )}
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 z-50 shadow-2xl">
          <Card className="h-full flex flex-col border-2 border-blue-200">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>Assistente MetaCircle</span>
                  <Badge className="bg-white/20 text-white text-xs">Online</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation("/ai-assistant")}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-gray-50 text-xs">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line text-xs">
                        {msg.message}
                      </div>
                      <div className={`text-xs mt-1 opacity-70 ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-2 border-t bg-white">
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={action.action}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-1">
                  <Input
                    placeholder="Digite sua dúvida..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 text-xs h-8"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="sm"
                    className="h-8 px-2"
                  >
                    <Sparkles className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Badge de Notificação (opcional) */}
      {!isOpen && (
        <div className="fixed bottom-16 right-4 z-40">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
            Precisa de ajuda? 👆
          </div>
        </div>
      )}
    </>
  );
}