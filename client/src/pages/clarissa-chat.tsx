import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Crown, 
  Phone, 
  Video, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: number;
  content: string;
  sender: "user" | "clarissa";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  type: "text" | "system";
}

export default function ClarissaChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Status da Clarissa
  const [clarissaStatus] = useState({
    isOnline: true,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
    responseTime: "Responde em até 2 horas"
  });

  // Histórico de mensagens
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Olá! Sou a Clarissa, especialista em marketing digital. Como posso te ajudar hoje? 😊",
      sender: "clarissa",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "read",
      type: "text"
    },
    {
      id: 2,
      content: "Oi Clarissa! Estou com dúvidas sobre funis de vendas para meu negócio",
      sender: "user",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: "read",
      type: "text"
    },
    {
      id: 3,
      content: "Perfeito! Vou te ajudar com isso. Qual é o seu nicho de mercado?",
      sender: "clarissa",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      status: "read",
      type: "text"
    }
  ]);

  const isPremiumUser = user?.email === "alexandre.nunes@metasync.tech"; // Simular usuário premium

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
      type: "text"
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simular notificação para Clarissa
    toast({
      title: "📱 Mensagem enviada!",
      description: "Clarissa foi notificada no WhatsApp (17997337322)",
    });

    // Simular Clarissa digitando
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    // Simular resposta da Clarissa
    setTimeout(() => {
      setIsTyping(false);
      const clarissaResponse: Message = {
        id: Date.now() + 1,
        content: "Recebi sua mensagem! Vou analisar e responder em breve. 👍",
        sender: "clarissa",
        timestamp: new Date(),
        status: "delivered",
        type: "text"
      };
      setMessages(prev => [...prev, clarissaResponse]);
    }, 3000);
  };

  const handleScheduleCall = () => {
    toast({
      title: "📞 Redirecionando...",
      description: "Abrindo agendamento com Clarissa",
    });
    // Aqui redirecionaria para /schedule-clarissa
  };

  if (!isPremiumUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Crown className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Acesso Exclusivo Premium
            </h2>
            <p className="text-gray-600 mb-6">
              O chat direto com a Clarissa está disponível apenas para membros Premium.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade para Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      {/* Header do Chat */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/clarissa-avatar.jpg" />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                CL
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">Clarissa</h1>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Especialista
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                {clarissaStatus.isOnline ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600">Online agora</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-500">
                      Última vez: {format(clarissaStatus.lastSeen, 'HH:mm', { locale: ptBR })}
                    </span>
                  </>
                )}
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{clarissaStatus.responseTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleScheduleCall}>
              <Calendar className="w-4 h-4 mr-1" />
              Agendar
            </Button>
            
            <Button variant="outline" size="sm">
              <Video className="w-4 h-4 mr-1" />
              Videochamada
            </Button>

            <div className="flex items-center gap-1 text-xs text-gray-500 ml-4">
              <Phone className="w-3 h-3" />
              <span>17997337322</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-sm lg:max-w-md ${msg.sender === "user" ? "order-2" : "order-1"}`}>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
                
                <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}>
                  <span>{format(msg.timestamp, 'HH:mm', { locale: ptBR })}</span>
                  {msg.sender === "user" && (
                    <>
                      {msg.status === "sent" && <Clock className="w-3 h-3" />}
                      {msg.status === "delivered" && <CheckCircle2 className="w-3 h-3" />}
                      {msg.status === "read" && <CheckCircle2 className="w-3 h-3 text-purple-600" />}
                    </>
                  )}
                </div>
              </div>

              {msg.sender === "clarissa" && (
                <Avatar className="w-8 h-8 order-1 mr-2">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                    CL
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                    CL
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Área de Info */}
        <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span>Clarissa recebe notificação no WhatsApp quando você envia mensagem</span>
          </div>
        </div>

        {/* Área de Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Digite sua mensagem para Clarissa..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            💎 Chat exclusivo Premium • Resposta garantida em até 2 horas
          </div>
        </div>
      </div>
    </div>
  );
}