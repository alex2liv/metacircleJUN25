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

🥉 **Básico** - R$ 29,90/mês
• Chat apenas texto

🥈 **Intermediário** - R$ 59,90/mês  
• Chat texto + áudio

👑 **Premium** - R$ 119,90/mês
• Acesso total + SOS Clarissa

🎁 **14 dias grátis** para novos usuários!

Quer detalhes de algum plano específico?`;
    }

    if (msg.includes('whatsapp') || msg.includes('notifica')) {
      return `📱 **Configurar WhatsApp:**

1. Vá em Configurações → Notificações
2. Adicione seu número
3. Ative as opções desejadas

✅ Eventos, comentários e agendamentos
💡 Premium recebe notificações prioritárias!`;
    }

    if (msg.includes('erro') || msg.includes('problema')) {
      return `🔧 **Vamos resolver!**

**Teste primeiro:**
✅ Atualizar página (F5)
✅ Limpar cache do navegador

**Se persistir:**
📱 WhatsApp: 17997337322
💬 Chat completo no assistente IA

Precisa de mais detalhes?`;
    }

    return `Entendi! 😊 Para ajuda mais detalhada:

🤖 **Chat Completo:** Clique em "Assistente IA"
📱 **WhatsApp:** 17997337322  
📧 **Email:** suporte@metasync.com.br

Ou me diga especificamente o que precisa!`;
  };

  const quickActions = [
    { label: "Ver Planos", action: () => setNewMessage("Quais são os planos disponíveis?") },
    { label: "Problema Técnico", action: () => setNewMessage("Estou com erro no sistema") },
    { label: "WhatsApp", action: () => setNewMessage("Como configurar WhatsApp?") },
    { label: "Suporte Humano", action: () => window.open("https://wa.me/5517997337322", "_blank") }
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