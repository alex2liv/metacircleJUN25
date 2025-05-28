import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Video,
  Users,
  Crown,
  Star,
  ArrowLeft,
  Clock,
  Play,
  Pause,
  Volume2,
  Maximize,
  Monitor,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LiveRoom {
  id: number;
  title: string;
  description: string;
  host: {
    name: string;
    avatar?: string;
  };
  participants: number;
  maxParticipants: number;
  startTime: Date;
  duration: number;
  withSpecialist: boolean;
  roomLink: string;
  status: 'live' | 'waiting' | 'recording';
  topic: string;
}

export default function LiveRooms() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Salas ativas simultâneas
  const [liveRooms] = useState<LiveRoom[]>([
    {
      id: 1,
      title: "Mentoria com Clarissa - Marketing Digital",
      description: "Estratégias avançadas para captar leads qualificados",
      host: { name: "Clarissa Vaz" },
      participants: 23,
      maxParticipants: 50,
      startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 min atrás
      duration: 90,
      withSpecialist: true,
      roomLink: "metacircle.com/room/clarissa-marketing",
      status: 'live',
      topic: 'marketing'
    },
    {
      id: 2,
      title: "Workshop React - Hooks Avançados",
      description: "Implementando custom hooks e patterns",
      host: { name: "Alexandre Nunes" },
      participants: 15,
      maxParticipants: 30,
      startTime: new Date(Date.now() - 20 * 60 * 1000), // 20 min atrás
      duration: 120,
      withSpecialist: false,
      roomLink: "metacircle.com/room/react-workshop",
      status: 'live',
      topic: 'tech'
    },
    {
      id: 3,
      title: "Networking Premium - Conecte-se",
      description: "Espaço para networking entre membros Premium",
      host: { name: "Maria Silva" },
      participants: 8,
      maxParticipants: 20,
      startTime: new Date(Date.now() - 10 * 60 * 1000), // 10 min atrás
      duration: 60,
      withSpecialist: false,
      roomLink: "metacircle.com/room/networking",
      status: 'live',
      topic: 'networking'
    },
    {
      id: 4,
      title: "Sessão de Dúvidas - Q&A Geral",
      description: "Tire suas dúvidas sobre os cursos",
      host: { name: "João Santos" },
      participants: 12,
      maxParticipants: 25,
      startTime: new Date(Date.now() + 5 * 60 * 1000), // em 5 min
      duration: 45,
      withSpecialist: false,
      roomLink: "metacircle.com/room/qa-session",
      status: 'waiting',
      topic: 'support'
    }
  ]);

  const joinRoom = (room: LiveRoom) => {
    if (room.status === 'waiting') {
      toast({
        title: "⏰ Sala ainda não iniciou",
        description: `Aguarde ${Math.ceil((room.startTime.getTime() - Date.now()) / 60000)} minutos`,
      });
      return;
    }

    toast({
      title: "🚀 Entrando na sala...",
      description: `Conectando com ${room.participants} participantes`,
    });
    
    setTimeout(() => {
      setLocation('/video-call');
    }, 1500);
  };

  const getTopicColor = (topic: string) => {
    const colors = {
      marketing: 'bg-pink-100 text-pink-800 border-pink-200',
      tech: 'bg-blue-100 text-blue-800 border-blue-200',
      networking: 'bg-purple-100 text-purple-800 border-purple-200',
      support: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[topic as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTopicIcon = (topic: string) => {
    const icons = {
      marketing: '📈',
      tech: '💻',
      networking: '🤝',
      support: '💡'
    };
    return icons[topic as keyof typeof icons] || '🎯';
  };

  const getRoomStatusBadge = (room: LiveRoom) => {
    if (room.status === 'live') {
      return (
        <Badge className="bg-red-600 text-white">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
          AO VIVO
        </Badge>
      );
    }
    if (room.status === 'waiting') {
      return (
        <Badge className="bg-yellow-600 text-white">
          <Clock className="w-3 h-3 mr-1" />
          AGUARDANDO
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-600 text-white">
        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
        GRAVANDO
      </Badge>
    );
  };

  const getElapsedTime = (startTime: Date) => {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 60000);
    if (elapsed < 0) return 'Inicia em breve';
    return `${elapsed}min ao vivo`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setLocation('/schedule-meeting')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salas Ao Vivo</h1>
          <p className="text-gray-600">Múltiplas videochamadas simultâneas</p>
        </div>
        
        <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white ml-auto animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
          {liveRooms.filter(r => r.status === 'live').length} SALAS ATIVAS
        </Badge>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {liveRooms.filter(r => r.status === 'live').length}
            </div>
            <p className="text-sm text-gray-600">Salas Ao Vivo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {liveRooms.reduce((sum, room) => sum + room.participants, 0)}
            </div>
            <p className="text-sm text-gray-600">Participantes Online</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {liveRooms.filter(r => r.withSpecialist).length}
            </div>
            <p className="text-sm text-gray-600">Com Clarissa</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {liveRooms.filter(r => r.status === 'waiting').length}
            </div>
            <p className="text-sm text-gray-600">Próximas Salas</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid de salas ao vivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {liveRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTopicIcon(room.topic)}</span>
                    <Badge className={`text-xs ${getTopicColor(room.topic)}`}>
                      {room.topic.toUpperCase()}
                    </Badge>
                    {getRoomStatusBadge(room)}
                  </div>
                  
                  <CardTitle className="text-lg leading-tight">
                    {room.title}
                  </CardTitle>
                  
                  <CardDescription className="mt-1">
                    {room.description}
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`text-white text-sm ${
                      room.withSpecialist 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    }`}>
                      {room.host.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{room.host.name}</p>
                    {room.withSpecialist && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-purple-600">Especialista</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-600">
                  <p>{getElapsedTime(room.startTime)}</p>
                  <p className="text-xs">{room.duration} min total</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Barra de ocupação */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Participantes</span>
                  <span>{room.participants}/{room.maxParticipants}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{width: `${(room.participants / room.maxParticipants) * 100}%`}}
                  ></div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => joinRoom(room)}
                  className={`flex-1 ${
                    room.status === 'live' 
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' 
                      : room.status === 'waiting'
                      ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  }`}
                  disabled={room.participants >= room.maxParticipants}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {room.status === 'live' ? 'Entrar Ao Vivo' : 
                   room.status === 'waiting' ? 'Aguardar Início' : 'Assistir Gravação'}
                </Button>
                
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" size="sm">
                  <Monitor className="w-4 h-4" />
                </Button>
              </div>

              {room.participants >= room.maxParticipants && (
                <p className="text-center text-sm text-red-600 mt-2">
                  🔴 Sala lotada - aguarde uma vaga
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão para criar nova sala */}
      <Card className="border-dashed border-2 border-gray-300 hover:border-purple-400 transition-colors cursor-pointer">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Criar Nova Sala</h3>
          <p className="text-gray-600 mb-4">Inicie uma videochamada Premium instantânea</p>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => setLocation('/schedule-meeting')}
          >
            <Crown className="w-4 h-4 mr-2" />
            Criar Sala Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}