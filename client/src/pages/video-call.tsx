import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  Users,
  MessageSquare,
  Settings,
  Maximize,
  ArrowLeft,
  Volume2,
  VolumeX,
  X,
  Pin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Participant {
  id: number;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isPresenting: boolean;
}

export default function VideoCall() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  
  // Estados da chamada
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isPresenting, setIsPresenting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [pinnedParticipant, setPinnedParticipant] = useState<number | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Participantes simulados
  const [participants] = useState<Participant[]>([
    {
      id: 1,
      name: "Alexandre Nunes",
      isMuted: false,
      isVideoOff: false,
      isPresenting: false
    },
    {
      id: 2,
      name: "Maria Silva",
      isMuted: false,
      isVideoOff: false,
      isPresenting: false
    },
    {
      id: 3,
      name: "João Santos",
      isMuted: true,
      isVideoOff: false,
      isPresenting: false
    },
    {
      id: 4,
      name: "Ana Costa",
      isMuted: false,
      isVideoOff: true,
      isPresenting: false
    }
  ]);

  useEffect(() => {
    // Iniciar stream de vídeo local
    startLocalVideo();
    
    // Simular duração da chamada
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Detectar mudança de tamanho de tela para mobile
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    setIsConnected(true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      toast({
        title: "📹 Câmera conectada!",
        description: "Você está visível para outros participantes",
      });
    } catch (error) {
      toast({
        title: "❌ Erro na câmera",
        description: "Não foi possível acessar câmera/microfone",
        variant: "destructive",
      });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
        toast({
          title: isVideoOn ? "📹 Câmera desligada" : "📹 Câmera ligada",
          description: isVideoOn ? "Você não está mais visível" : "Agora você está visível",
        });
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
        toast({
          title: isAudioOn ? "🔇 Microfone desligado" : "🎤 Microfone ligado",
          description: isAudioOn ? "Você está no mudo" : "Agora você pode falar",
        });
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true 
      });
      
      setIsPresenting(true);
      
      toast({
        title: "🖥️ Compartilhando tela",
        description: "Sua tela está sendo exibida para todos",
      });

      // Quando parar de compartilhar
      displayStream.getVideoTracks()[0].onended = () => {
        setIsPresenting(false);
        toast({
          title: "🖥️ Parou de compartilhar",
          description: "Compartilhamento de tela finalizado",
        });
      };
    } catch (error) {
      toast({
        title: "❌ Erro no compartilhamento",
        description: "Não foi possível compartilhar a tela",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    toast({
      title: "📞 Chamada finalizada",
      description: `Duração: ${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}`,
    });
    
    setLocation('/general-chat');
  };

  const handlePinParticipant = (participantId: number) => {
    if (pinnedParticipant === participantId) {
      setPinnedParticipant(null);
      toast({
        title: "📌 PIN removido",
        description: "Voltando para visualização normal",
      });
    } else {
      setPinnedParticipant(participantId);
      const participant = participants.find(p => p.id === participantId);
      toast({
        title: "📌 Participante fixado!",
        description: `${participant?.name} agora está em destaque`,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header da chamada */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-gray-700"
            onClick={() => setLocation('/general-chat')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div>
            <h2 className="font-bold">Chamada - Grupo Geral</h2>
            <p className="text-sm text-gray-300">
              {participants.length} participantes • {formatDuration(callDuration)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-green-600">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
            AO VIVO
          </Badge>
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            <Users className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Interface de vídeo com PIN */}
      <div className="flex-1 relative">
        {pinnedParticipant ? (
          // Modo PIN - Participante em tela cheia
          <div className="h-full relative">
            {/* Participante fixado em tela cheia */}
            <div className="h-full bg-gray-900">
              {(() => {
                const pinned = participants.find(p => p.id === pinnedParticipant) || 
                  (pinnedParticipant === user?.id ? { 
                    id: user.id, 
                    name: `${user.firstName} ${user.lastName}`, 
                    isVideoOff: !isVideoOn,
                    isMuted: !isAudioOn
                  } : null);
                
                return pinned ? (
                  <div className="relative h-full">
                    {!pinned.isVideoOff ? (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
                        <div className="text-center">
                          <Avatar className="w-32 h-32 mx-auto mb-4">
                            <AvatarFallback className="bg-purple-600 text-white text-4xl">
                              {pinned.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <h2 className="text-3xl font-bold text-white">{pinned.name}</h2>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Avatar className="w-32 h-32">
                          <AvatarFallback className="bg-purple-600 text-white text-4xl">
                            {pinned.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    
                    {/* Nome e status em tela cheia */}
                    <div className="absolute bottom-8 left-8 bg-black/70 px-6 py-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-white">{pinned.name}</span>
                        {pinned.isMuted && (
                          <MicOff className="w-6 h-6 text-red-400" />
                        )}
                        {pinned.isVideoOff && (
                          <VideoOff className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                    </div>

                    {/* Botão para remover PIN */}
                    <Button
                      onClick={() => handlePinParticipant(pinnedParticipant)}
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700"
                      size="lg"
                    >
                      <X className="w-6 h-6 mr-2" />
                      Remover PIN
                    </Button>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Miniaturas dos outros participantes no modo PIN */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
                {/* Miniatura do usuário local */}
                {pinnedParticipant !== user?.id && (
                  <div 
                    className="relative cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handlePinParticipant(user?.id || 0)}
                  >
                    <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
                      {isVideoOn ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-black/70 px-1 rounded text-xs text-white truncate max-w-16">
                      Você
                    </div>
                  </div>
                )}

                {/* Miniaturas dos outros participantes */}
                {participants.filter(p => p.id !== pinnedParticipant && p.id !== user?.id).map((participant) => (
                  <div 
                    key={participant.id}
                    className="relative cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handlePinParticipant(participant.id)}
                  >
                    <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
                      {!participant.isVideoOff ? (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-600 text-white text-xs">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-600 text-white text-xs">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-black/70 px-1 rounded text-xs text-white truncate max-w-16">
                      {participant.name.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Modo normal - Grid de vídeos
          <div className="p-4 h-full">
            <div className={`grid gap-4 h-full ${
              isMobileView 
                ? 'grid-cols-1' 
                : participants.length <= 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : participants.length <= 4
                    ? 'grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
                    : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {/* Vídeo local do usuário */}
              <Card className="bg-gray-800 border-gray-700 relative overflow-hidden group">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full">
                    {isVideoOn ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-blue-600 text-white text-xl">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    
                    {/* Nome do usuário */}
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
                      {user?.firstName} {user?.lastName} (Você)
                    </div>
                    
                    {/* Botão PIN */}
                    <Button
                      onClick={() => handlePinParticipant(user?.id || 0)}
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      <Pin className="w-4 h-4" />
                    </Button>
                    
                    {/* Indicadores */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {!isAudioOn && (
                        <div className="bg-red-600 p-1 rounded">
                          <MicOff className="w-3 h-3" />
                        </div>
                      )}
                      {!isVideoOn && (
                        <div className="bg-red-600 p-1 rounded">
                          <VideoOff className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vídeos dos outros participantes */}
              {participants.filter(p => p.id !== user?.id).map((participant) => (
                <Card key={participant.id} className="bg-gray-800 border-gray-700 relative overflow-hidden group">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full">
                      {!participant.isVideoOff ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback className="bg-blue-600 text-white text-xl">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback className="bg-gray-600 text-white text-xl">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      
                      {/* Nome do participante */}
                      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
                        {participant.name}
                      </div>
                      
                      {/* Botão PIN */}
                      <Button
                        onClick={() => handlePinParticipant(participant.id)}
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        <Pin className="w-4 h-4" />
                      </Button>
                      
                      {/* Indicadores */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {participant.isMuted && (
                          <div className="bg-red-600 p-1 rounded">
                            <MicOff className="w-3 h-3" />
                          </div>
                        )}
                        {participant.isVideoOff && (
                          <div className="bg-red-600 p-1 rounded">
                            <VideoOff className="w-3 h-3" />
                          </div>
                        )}
                        {participant.isPresenting && (
                          <div className="bg-green-600 p-1 rounded">
                            <Monitor className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controles da chamada */}
      <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
        {/* Toggle Áudio */}
        <Button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${isAudioOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </Button>

        {/* Toggle Vídeo */}
        <Button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </Button>

        {/* Compartilhar tela */}
        <Button
          onClick={startScreenShare}
          className={`p-3 rounded-full ${isPresenting ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
        >
          <Monitor className="w-6 h-6" />
        </Button>

        {/* Configurações */}
        <Button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700">
          <Settings className="w-6 h-6" />
        </Button>

        {/* Finalizar chamada */}
        <Button
          onClick={endCall}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700"
        >
          <PhoneOff className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}