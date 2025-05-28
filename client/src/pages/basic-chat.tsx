import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Image, 
  FileText, 
  Camera,
  ArrowLeft,
  Phone,
  MoreVertical,
  Smile,
  Lock,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatMessage {
  id: number;
  content: string;
  authorId: number;
  author: {
    firstName: string;
    lastName: string;
  };
  type: 'text' | 'audio' | 'image' | 'document';
  timestamp: Date;
  audioUrl?: string;
  imageUrl?: string;
  documentUrl?: string;
  fileName?: string;
}

export default function BasicChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");

  // Simulação de plano básico
  const userPlan = "basic"; // "basic", "intermediate", "premium"

  // Mensagens simuladas do chat (limitadas para básico)
  const [messages] = useState<ChatMessage[]>([
    {
      id: 1,
      content: "Oi pessoal! Como estão hoje? 😊",
      authorId: 2,
      author: { firstName: "Maria", lastName: "Silva" },
      type: 'text',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 2,
      content: "Bem! Mas só posso mandar texto no plano básico 😅",
      authorId: 3,
      author: { firstName: "João", lastName: "Santos" },
      type: 'text',
      timestamp: new Date(Date.now() - 25 * 60 * 1000)
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      toast({
        title: "💬 Mensagem enviada!",
        description: `"${message.substring(0, 30)}..."`,
      });
      setMessage("");
    }
  };

  const showUpgradeMessage = (feature: string) => {
    toast({
      title: `🔒 ${feature} é Premium!`,
      description: "Upgrade para Intermediário e ganhe 48h Premium grátis!",
      duration: 5000,
    });
  };

  const renderMessage = (msg: ChatMessage) => {
    const isMyMessage = msg.authorId === user?.id;
    
    return (
      <div key={msg.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex gap-2 max-w-[70%] ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isMyMessage && (
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                {msg.author.firstName[0]}{msg.author.lastName[0]}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`rounded-lg p-3 ${
            isMyMessage 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            {!isMyMessage && (
              <p className="text-xs font-medium mb-1 text-gray-600">
                {msg.author.firstName} {msg.author.lastName}
              </p>
            )}
            
            <p className="text-sm">{msg.content}</p>
            
            <p className="text-xs opacity-75 mt-1">
              {format(msg.timestamp, 'HH:mm', { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header do Chat */}
      <div className="bg-gradient-to-r from-gray-500 to-slate-600 text-white p-4 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20 p-2"
          onClick={() => setLocation('/spaces')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-lg">💬</span>
        </div>
        
        <div className="flex-1">
          <h2 className="font-bold">Grupo Geral (Básico)</h2>
          <p className="text-sm text-gray-100">Modo limitado - upgrade para mais recursos</p>
        </div>
        
        <Badge className="bg-gray-600 text-white">
          <Lock className="w-3 h-3 mr-1" />
          BÁSICO
        </Badge>
      </div>

      {/* Banner de Upgrade no Chat */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 text-center">
        <p className="text-sm">
          🚀 <strong>Upgrade para Intermediário</strong> e ganhe microfone + 48h Premium grátis!
        </p>
        <Button 
          size="sm" 
          className="bg-white text-blue-600 hover:bg-gray-100 mt-2"
          onClick={() => {
            toast({
              title: "🚀 Redirecionando para upgrade!",
              description: "48h de acesso Premium grátis",
              duration: 3000,
            });
            setTimeout(() => {
              window.open('https://clarissavaz.academy.perfectpay.com.br', '_blank');
            }, 1000);
          }}
        >
          Fazer Upgrade Agora
        </Button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-2">
          {messages.map(renderMessage)}
          
          {/* Mensagem sobre limitações */}
          <div className="text-center py-4">
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 max-w-md mx-auto">
              <Lock className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-800">
                <strong>Plano Básico:</strong> Apenas mensagens de texto disponíveis
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Upgrade para enviar áudios, fotos e documentos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de digitação limitada */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center gap-2">
          {/* Botão de anexos bloqueado */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 cursor-not-allowed p-2"
            disabled
            onClick={() => showUpgradeMessage('Anexos')}
          >
            <Paperclip className="w-5 h-5" />
            <Lock className="w-3 h-3 absolute" />
          </Button>

          {/* Botão de fotos bloqueado */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 cursor-not-allowed p-2"
            disabled
            onClick={() => showUpgradeMessage('Fotos')}
          >
            <Image className="w-5 h-5" />
            <Lock className="w-3 h-3 absolute" />
          </Button>

          {/* Campo de texto */}
          <div className="flex-1 relative">
            <Input
              placeholder="Digite sua mensagem... (apenas texto no básico)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-12"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:bg-gray-100 p-1"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          {/* Botão de microfone bloqueado */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 cursor-not-allowed p-2 relative"
            disabled
            onClick={() => showUpgradeMessage('Microfone')}
          >
            <Mic className="w-5 h-5" />
            <Lock className="w-3 h-3 absolute -top-1 -right-1 bg-white rounded-full" />
          </Button>

          {/* Botão de enviar */}
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-blue-600 hover:bg-blue-700 p-2"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Aviso sobre limitações */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            🔒 Microfone e anexos disponíveis no plano Intermediário
          </p>
        </div>
      </div>
    </div>
  );
}