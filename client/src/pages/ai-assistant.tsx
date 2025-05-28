import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  MessageCircle, 
  Download,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Zap,
  FileText,
  Users,
  Settings
} from "lucide-react";

export default function AIAssistant() {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: '👋 Olá! Sou o assistente oficial do MetaCircle! Como posso ajudar você hoje?',
      time: '14:30'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Adicionar mensagem do usuário
    setChatMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'user',
      message: newMessage,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }]);

    // Simular resposta do bot (em produção seria integração real)
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
• Eventos limitados

🥈 **Intermediário** - R$ 59,90/mês  
• Chat texto + áudio
• 5 mensagens/dia com especialista

👑 **Premium** - R$ 119,90/mês
• Acesso total + 3 SOS Clarissa/ano

🎁 **14 dias Premium GRÁTIS** para novos usuários!

Quer saber mais detalhes sobre algum plano específico?`;
    }

    if (msg.includes('whatsapp') || msg.includes('notifica')) {
      return `📱 **Notificações WhatsApp:**

✅ Eventos próximos
✅ Comentários e menções  
✅ Confirmações de agendamento
✅ Avisos importantes

**Para ativar:**
1. Vá em Configurações → Notificações
2. Adicione seu número do WhatsApp
3. Marque as opções desejadas

💡 **Dica:** Usuários Premium recebem notificações prioritárias!`;
    }

    if (msg.includes('erro') || msg.includes('problema') || msg.includes('bug')) {
      return `🔧 **Vou te ajudar a resolver!**

**Primeiros passos:**
✅ Atualizar página (F5)
✅ Limpar cache do navegador
✅ Testar em aba anônima

**Me conte mais:**
• Qual seu plano atual?
• Em que dispositivo está?
• Qual erro específico aparece?

Se persistir, posso escalar para nosso suporte técnico! 🚀`;
    }

    if (msg.includes('beta') || msg.includes('teste')) {
      return `🧪 **Modo Beta - Excelente pergunta!**

**Como funciona:**
• Admin ativa e todos ficam Premium grátis
• Perfeito para coletar feedback
• Quando terminar → período de graça com countdown
• Usuários têm tempo para decidir upgrade

**Benefícios:**
✅ Testar tudo sem limitações
✅ Corrigir bugs sem impacto na receita
✅ Transição suave para modelo pago

É uma estratégia muito inteligente! 🚀`;
    }

    return `Obrigado por sua pergunta! 😊

Para te ajudar melhor, posso explicar sobre:

💳 **Planos e preços**
📱 **Integrações WhatsApp**  
🔧 **Problemas técnicos**
🧪 **Modo Beta**
📚 **Como usar funcionalidades**

Ou digite sua dúvida específica que vou responder detalhadamente!`;
  };

  const quickQuestions = [
    "Qual a diferença entre os planos?",
    "Como ativar notificações WhatsApp?",
    "Estou com erro no sistema",
    "Como funciona o período de teste?",
    "Como agendar com especialista?"
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Assistente IA MetaCircle</h1>
            <p className="text-gray-600">Suporte inteligente 24/7 para todas suas dúvidas</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge className="bg-green-100 text-green-800">✅ Online</Badge>
          <Badge className="bg-blue-100 text-blue-800">🚀 Resposta Instantânea</Badge>
          <Badge className="bg-purple-100 text-purple-800">🧠 IA Treinada</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Principal */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat com Assistente IA
                <Badge className="ml-auto">Versão 2.0</Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Mensagens */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line text-sm">
                        {msg.message}
                      </div>
                      <div className={`text-xs mt-1 ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Perguntas Rápidas */}
              <div className="p-4 border-t bg-white">
                <div className="text-sm text-gray-600 mb-2">💡 Perguntas frequentes:</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setNewMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>

                {/* Input de Mensagem */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua dúvida..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="px-6">
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recursos do Assistente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Recursos IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Suporte 24/7</div>
                    <div className="text-xs text-gray-600">Respostas instantâneas</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Base Completa</div>
                    <div className="text-xs text-gray-600">Todas funcionalidades</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Escalação Humana</div>
                    <div className="text-xs text-gray-600">Quando necessário</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Sempre Atualizado</div>
                    <div className="text-xs text-gray-600">Última versão 2.0</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Manual Completo (PDF)
              </Button>
              
              <Button variant="outline" className="w-full justify-start" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Guia do Usuário
              </Button>
              
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Bot className="w-4 h-4 mr-2" />
                API Documentation
              </Button>
            </CardContent>
          </Card>

          {/* Suporte Humano */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Users className="w-5 h-5" />
                Suporte Humano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-green-800">
                  <strong>WhatsApp:</strong> 17997337322
                </div>
                <div className="text-sm text-green-800">
                  <strong>SOS Clarissa:</strong> Premium only
                </div>
                <div className="text-sm text-green-800">
                  <strong>Email:</strong> suporte@metasync.com.br
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contatar Humano
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}