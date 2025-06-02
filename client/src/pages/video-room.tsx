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
  const [showPin, setShowPin] = useState(true);
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
    { id: '1', name: 'Dra. Clarissa Vaz', isVideoOn: true, isAudioOn: true, isPresenting: false },
    { id: '2', name: 'Dr. João Silva', isVideoOn: true, isAudioOn: true, isPresenting: false },
    { id: '3', name: 'Dra. Maria Santos', isVideoOn: false, isAudioOn: true, isPresenting: false },
    { id: '4', name: 'Dr. Carlos Lima', isVideoOn: true, isAudioOn: false, isPresenting: false },
    { id: '5', name: 'Dra. Ana Costa', isVideoOn: true, isAudioOn: true, isPresenting: false },
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
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
                Você {!isVideoOn && '(câmera off)'}
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
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm flex items-center gap-1">
                  {participant.name}
                  {!participant.isAudioOn && <MicOff className="w-3 h-3" />}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Chat Sidebar (Desktop only) */}
        {viewMode === 'desktop' && showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Chat da Sala</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium text-blue-300">Dr. João:</span>
                  <span className="ml-2">Ótimo caso apresentado!</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-green-300">Dra. Maria:</span>
                  <span className="ml-2">Concordo, muito interessante</span>
                </div>
              </div>
            </div>
          </div>
        )}

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

          {viewMode === 'desktop' && (
            <Button
              size="sm"
              variant={showChat ? "default" : "secondary"}
              onClick={() => setShowChat(!showChat)}
              className="rounded-full w-12 h-12 p-0"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          )}

          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-12 h-12 p-0"
          >
            <Users className="w-5 h-5" />
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

    </div>
  );
}