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
  Smile
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

export default function GeneralChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Mensagens simuladas do chat
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
      content: "Tudo bem! Acabei de assistir o último curso da Clarissa",
      authorId: 3,
      author: { firstName: "João", lastName: "Santos" },
      type: 'text',
      timestamp: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
      id: 3,
      content: "Áudio sobre o workshop de hoje...",
      authorId: 2,
      author: { firstName: "Maria", lastName: "Silva" },
      type: 'audio',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      audioUrl: "audio-exemplo.mp3"
    },
    {
      id: 4,
      content: "Compartilhando material do curso",
      authorId: 1,
      author: { firstName: "Alexandre", lastName: "Nunes" },
      type: 'document',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      documentUrl: "material-curso.pdf",
      fileName: "Material_Curso_React.pdf"
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      toast({
        title: "Mensagem enviada!",
        description: `"${message.substring(0, 30)}..."`,
      });
      setMessage("");
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    toast({
      title: "🎤 Gravando áudio",
      description: "Clique novamente para parar",
    });

    // Simular tempo de gravação
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 10000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    
    toast({
      title: "🎵 Áudio enviado!",
      description: `Áudio de ${recordingTime}s enviado para o grupo`,
    });
  };

  const handleFileUpload = (type: 'document' | 'image') => {
    if (type === 'document') {
      fileInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'image') => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: type === 'document' ? "📎 Documento enviado!" : "📷 Foto enviada!",
        description: `${file.name} foi compartilhado no grupo`,
      });
    }
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
            
            {msg.type === 'text' && (
              <p className="text-sm">{msg.content}</p>
            )}
            
            {msg.type === 'audio' && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="h-1 bg-white/30 rounded-full">
                    <div className="h-1 bg-white rounded-full w-2/3"></div>
                  </div>
                  <p className="text-xs mt-1">0:15</p>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  ▶️
                </Button>
              </div>
            )}
            
            {msg.type === 'document' && (
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                <div>
                  <p className="text-sm font-medium">{msg.fileName}</p>
                  <p className="text-xs opacity-75">PDF • 2.3 MB</p>
                </div>
              </div>
            )}
            
            {msg.type === 'image' && (
              <div className="w-40 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center gap-3">
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
          <h2 className="font-bold">Grupo Geral</h2>
          <p className="text-sm text-blue-100">156 membros • 12 online</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-2">
          {messages.map(renderMessage)}
        </div>
      </div>

      {/* Barra de digitação */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center gap-2">
          {/* Botão de anexos */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:bg-gray-100 p-2"
              onClick={() => handleFileUpload('document')}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            
            {/* Inputs ocultos para upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFileSelected(e, 'document')}
            />
          </div>

          {/* Botão de fotos */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:bg-gray-100 p-2"
            onClick={() => handleFileUpload('image')}
          >
            <Image className="w-5 h-5" />
          </Button>
          
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelected(e, 'image')}
          />

          {/* Campo de texto */}
          <div className="flex-1 relative">
            <Input
              placeholder="Digite sua mensagem..."
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

          {/* Botão de microfone */}
          <Button 
            variant="ghost" 
            size="sm" 
            className={`p-2 ${isRecording ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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
        
        {/* Indicador de gravação */}
        {isRecording && (
          <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Gravando... {recordingTime}s
          </div>
        )}
      </div>
    </div>
  );
}