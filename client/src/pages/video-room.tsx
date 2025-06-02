import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Settings, 
  Users, 
  MessageSquare,
  Monitor,
  Smartphone,
  Volume2,
  VolumeX,
  Share,
  Hand,
  Send,
  Shield,
  Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  name: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isPresenting: boolean;
  hasHandRaised: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export default function VideoRoom() {
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showChat, setShowChat] = useState(false);
  const [hasHandRaised, setHasHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [roomPin] = useState("1234");
  const [showPin, setShowPin] = useState(false);
  const [isModerator] = useState(() => {
    return window.location.search.includes('moderator=true');
  });
  const [roomInfo] = useState({
    title: "Casos Clínicos Complexos",
    host: "Dra. Clarissa Vaz",
    duration: "32 min",
    participantCount: 12
  });

  const [participants] = useState<Participant[]>([
    { id: '1', name: 'Dra. Clarissa Vaz', isVideoOn: true, isAudioOn: true, isPresenting: false, hasHandRaised: false },
    { id: '2', name: 'Dr. João Silva', isVideoOn: true, isAudioOn: true, isPresenting: false, hasHandRaised: true },
    { id: '3', name: 'Dra. Maria Santos', isVideoOn: false, isAudioOn: true, isPresenting: false, hasHandRaised: false },
    { id: '4', name: 'Dr. Carlos Lima', isVideoOn: true, isAudioOn: false, isPresenting: false, hasHandRaised: false },
    { id: '5', name: 'Dra. Ana Costa', isVideoOn: true, isAudioOn: true, isPresenting: false, hasHandRaised: true },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Dr. João Silva',
      message: 'Excelente apresentação do caso!',
      timestamp: new Date(Date.now() - 5 * 60000)
    },
    {
      id: '2',
      userId: '5',
      userName: 'Dra. Ana Costa',
      message: 'Tenho uma dúvida sobre o protocolo usado',
      timestamp: new Date(Date.now() - 3 * 60000)
    }
  ]);

  useEffect(() => {
    // Initialize video stream
    initializeVideo();
  }, []);

  const initializeVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Erro de acesso à câmera",
        description: "Não foi possível acessar a câmera/microfone. Verifique as permissões.",
        variant: "destructive"
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Câmera desligada" : "Câmera ligada",
      description: isVideoOn ? "Sua câmera foi desabilitada" : "Sua câmera foi habilitada"
    });
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? "Microfone desligado" : "Microfone ligado", 
      description: isAudioOn ? "Seu microfone foi desabilitado" : "Seu microfone foi habilitado"
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Parou de compartilhar" : "Compartilhando tela",
      description: isScreenSharing ? "Compartilhamento de tela finalizado" : "Sua tela está sendo compartilhada"
    });
  };

  const toggleHandRaise = () => {
    setHasHandRaised(!hasHandRaised);
    toast({
      title: hasHandRaised ? "Mão abaixada" : "Mão levantada",
      description: hasHandRaised ? "Você abaixou a mão" : "Você levantou a mão para falar",
    });
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: 'Você',
        message: chatMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada no chat",
      });
    }
  };

  const copyRoomPin = () => {
    navigator.clipboard.writeText(roomPin);
    toast({
      title: "PIN copiado",
      description: `PIN da sala ${roomPin} copiado para área de transferência`,
    });
  };

  const leaveRoom = () => {
    toast({
      title: "Saindo da sala...",
      description: "Você será redirecionado para o dashboard"
    });
    // In real app: navigate back to dashboard
    setTimeout(() => {
      window.close();
    }, 2000);
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
      
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">
              {roomInfo.title}
              {isModerator && <span className="ml-2 text-yellow-400">[MODERADOR]</span>}
            </h1>
            <p className="text-sm text-gray-300">com {roomInfo.host} • {roomInfo.duration} • {roomInfo.participantCount} participantes</p>
          </div>


          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-600 rounded-lg overflow-hidden">
              <Button
                size="sm"
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setViewMode('desktop')}
                className="rounded-none border-0"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setViewMode('mobile')}
                className="rounded-none border-0"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            <Badge className="bg-red-500">AO VIVO</Badge>
          </div>
        </div>
      </div>

      <div className={`flex ${viewMode === 'mobile' ? 'flex-col' : 'h-[calc(100vh-80px)]'}`}>
        
        {/* Video Grid */}
        <div className={`${viewMode === 'mobile' ? 'w-full' : 'flex-1'} p-4`}>
          <div className={`grid gap-4 h-full ${
            viewMode === 'mobile' 
              ? 'grid-cols-1 max-h-96' 
              : participants.length <= 4 
                ? 'grid-cols-2' 
                : 'grid-cols-3'
          }`}>
            
            {/* Local Video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              {/* Your Hand Raised Indicator */}
              {hasHandRaised && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black rounded-full p-1 animate-pulse z-10">
                  <Hand className="w-4 h-4" />
                </div>
              )}
              
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
                Você {!isVideoOn && '(câmera off)'} {!isAudioOn && '(mic off)'}
              </div>
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                  <VideoOff className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Participants Videos */}
            {participants.slice(0, viewMode === 'mobile' ? 2 : 8).map((participant) => (
              <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                {participant.isVideoOn ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-2xl font-bold">{participant.name.split(' ').map(n => n[0]).join('')}</div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <VideoOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {/* Hand Raised Indicator */}
                {participant.hasHandRaised && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black rounded-full p-1 animate-pulse z-10">
                    <Hand className="w-4 h-4" />
                  </div>
                )}
                
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm flex items-center gap-1">
                  {participant.name}
                  {!participant.isAudioOn && <MicOff className="w-3 h-3" />}
                </div>
              </div>
            ))}

          </div>
        </div>



      </div>

      {/* Controls */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-gray-800 border border-gray-600 rounded-full px-6 py-3 flex items-center gap-4">
          
          <Button
            size="sm"
            variant={isAudioOn ? "default" : "destructive"}
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          <Button
            size="sm"
            variant={isVideoOn ? "default" : "destructive"}
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            size="sm"
            variant={isSpeakerOn ? "default" : "secondary"}
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className="rounded-full w-12 h-12 p-0"
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>

          <Button
            size="sm"
            variant={isScreenSharing ? "default" : "secondary"}
            onClick={toggleScreenShare}
            className="rounded-full w-12 h-12 p-0"
          >
            <Share className="w-5 h-5" />
          </Button>

          <Button
            size="sm"
            variant={hasHandRaised ? "default" : "secondary"}
            onClick={toggleHandRaise}
            className={`rounded-full w-12 h-12 p-0 ${hasHandRaised ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
          >
            <Hand className="w-5 h-5" />
          </Button>

          <Button
            size="sm"
            variant={showChat ? "default" : "secondary"}
            onClick={() => setShowChat(!showChat)}
            className="rounded-full w-12 h-12 p-0"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          <Button
            size="sm"
            variant={showPin ? "default" : "secondary"}
            onClick={() => setShowPin(!showPin)}
            className="rounded-full w-12 h-12 p-0"
          >
            <Lock className="w-5 h-5" />
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={leaveRoom}
            className="rounded-full w-12 h-12 p-0"
          >
            <Phone className="w-5 h-5 rotate-[135deg]" />
          </Button>

        </div>
      </div>

      {/* PIN Modal */}
      {showPin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 max-w-sm w-full mx-4">
            <div className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">PIN da Sala</h3>
              <div className="text-3xl font-mono font-bold text-blue-400 mb-4 tracking-widest">
                {roomPin}
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Compartilhe este PIN para outros participantes entrarem na sala
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={copyRoomPin}
                  className="flex-1"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Copiar PIN
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowPin(false)}
                  className="flex-1"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Extended Panel */}
      {showChat && (
        <div className="fixed top-4 bottom-20 right-4 w-96 bg-gray-800 border border-gray-600 rounded-lg shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-lg">Chat da Sala</h3>
            <div className="flex items-center gap-2">
              {isModerator && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Moderador
                </Badge>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowChat(false)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700/70 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <span className="font-medium text-blue-300 text-sm">{msg.userName}:</span>
                      <p className="text-gray-300 mt-1 leading-relaxed">{msg.message}</p>
                    </div>
                    {isModerator && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => toast({
                          title: "Mensagem removida",
                          description: `Mensagem de ${msg.userName} foi excluída`,
                        })}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {msg.timestamp.toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700 bg-gray-800/80">
            <div className="flex gap-3">
              <Input
                placeholder="Digite sua mensagem..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendChatMessage();
                  }
                }}
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-10 text-sm rounded-lg"
              />
              <Button
                onClick={sendChatMessage}
                disabled={!chatMessage.trim()}
                size="sm"
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Pressione Enter para enviar
            </p>
          </div>
        </div>
      )}

    </div>
  );
}