import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Video, 
  Users, 
  MessageSquare, 
  Shield, 
  Trash2, 
  Ban, 
  Eye,
  AlertTriangle,
  Clock,
  UserX,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: string;
  name: string;
  host: string;
  participants: number;
  duration: string;
  status: 'active' | 'scheduled' | 'ended';
  messages: number;
  reports: number;
}

interface ChatMessage {
  id: string;
  roomId: string;
  user: string;
  message: string;
  timestamp: Date;
  flagged: boolean;
}

export default function SpecialistRoomModeration() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [moderationNote, setModerationNote] = useState("");

  const handleBanUser = (username: string, duration: '15min' | '1hour' | 'permanent') => {
    const banMessages = {
      '15min': 'Você foi temporariamente impedido de enviar mensagens por 15 minutos devido a violação das regras de conduta da comunidade. Por favor, mantenha um ambiente respeitoso para todos.',
      '1hour': 'Você foi temporariamente impedido de enviar mensagens por 1 hora devido a violação das regras de conduta da comunidade. Pedimos que revise nossos termos de uso.',
      'permanent': 'Você foi permanentemente banido de enviar mensagens devido a violações graves das regras da comunidade. Para recursos, entre em contato com a administração.'
    };

    const durationText = {
      '15min': '15 minutos',
      '1hour': '1 hora',
      'permanent': 'permanentemente'
    };

    // Aqui seria implementada a lógica real de banimento no backend
    toast({
      title: "Usuário banido",
      description: `${username} foi banido por ${durationText[duration]}`,
    });

    // Simular notificação para o usuário banido
    setTimeout(() => {
      toast({
        title: `Notificação enviada para ${username}`,
        description: banMessages[duration],
        variant: "default",
      });
    }, 1000);

    setBanDialogOpen(false);
    setSelectedUser(null);
  };
  
  const [rooms] = useState<Room[]>([
    {
      id: 'casos-clinicos',
      name: 'Casos Clínicos Complexos',
      host: 'Dr. João Silva',
      participants: 12,
      duration: '45 min',
      status: 'active',
      messages: 23,
      reports: 0
    },
    {
      id: 'networking',
      name: 'Networking Livre',
      host: 'Dra. Maria Santos',
      participants: 8,
      duration: '32 min',
      status: 'active',
      messages: 15,
      reports: 1
    },
    {
      id: 'pe-diabetico',
      name: 'Estudos de Caso: Pé Diabético',
      host: 'Sistema',
      participants: 0,
      duration: '0 min',
      status: 'scheduled',
      messages: 0,
      reports: 0
    }
  ]);

  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      roomId: 'casos-clinicos',
      user: 'Dr. Carlos Lima',
      message: 'Excelente apresentação do caso, muito didático!',
      timestamp: new Date(Date.now() - 5 * 60000),
      flagged: false
    },
    {
      id: '2',
      roomId: 'networking',
      user: 'Dra. Ana Costa',
      message: 'Alguém tem experiência com essa técnica específica?',
      timestamp: new Date(Date.now() - 10 * 60000),
      flagged: true
    },
    {
      id: '3',
      roomId: 'casos-clinicos',
      user: 'Dr. Pedro Santos',
      message: 'Concordo completamente com o diagnóstico apresentado.',
      timestamp: new Date(Date.now() - 15 * 60000),
      flagged: false
    }
  ]);

  const joinRoom = (roomId: string) => {
    window.open(`/video-room/${roomId}?moderator=true`, '_blank');
    toast({
      title: "Entrando como moderador",
      description: "Você tem privilégios especiais nesta sala",
    });
  };

  const closeRoom = (roomId: string, roomName: string) => {
    toast({
      title: "Sala encerrada",
      description: `A sala "${roomName}" foi encerrada pelo especialista`,
    });
  };

  const deleteMessage = (messageId: string, userName: string) => {
    toast({
      title: "Mensagem removida",
      description: `Mensagem de ${userName} foi excluída por violação das diretrizes`,
    });
  };

  const banUser = (userName: string) => {
    setSelectedUser(userName);
    setBanDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Moderação de Salas
          </h1>
          <p className="text-gray-600">
            Gerencie e modere todas as videoconferências ativas da comunidade
          </p>
        </div>

        {/* Moderation Guidelines */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Shield className="w-5 h-5" />
              Diretrizes de Moderação
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <div className="space-y-2 text-sm">
              <p><strong>Como especialista, você tem autoridade para:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Remover mensagens consideradas ofensivas, discriminatórias ou inadequadas</li>
                <li>Excluir conteúdo sem comprovação científica ou que possa prejudicar pacientes</li>
                <li>Banir temporariamente usuários que violarem repetidamente as diretrizes</li>
                <li>Encerrar salas que fujam do propósito educacional/profissional</li>
                <li>Entrar em qualquer sala a qualquer momento para supervisão</li>
              </ul>
              <p className="mt-3 text-xs text-orange-600">
                <strong>Importante:</strong> Todas as ações de moderação são registradas para transparência e podem ser revisadas pela administração da plataforma.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Rooms */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Salas Ativas</CardTitle>
                <CardDescription>
                  Videoconferências em andamento que podem ser moderadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rooms.filter(room => room.status === 'active').map(room => (
                    <div key={room.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{room.name}</h4>
                          <p className="text-sm text-gray-600">Host: {room.host}</p>
                        </div>
                        <Badge className="bg-green-500 text-white">AO VIVO</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{room.participants} participantes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{room.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{room.messages} mensagens</span>
                        </div>
                        {room.reports > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{room.reports} denúncias</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => joinRoom(room.id)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Entrar como Moderador
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => closeRoom(room.id, room.name)}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Encerrar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Rooms */}
            <Card>
              <CardHeader>
                <CardTitle>Salas Agendadas</CardTitle>
                <CardDescription>
                  Próximas videoconferências programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rooms.filter(room => room.status === 'scheduled').map(room => (
                    <div key={room.id} className="border rounded-lg p-4 space-y-3 opacity-75">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{room.name}</h4>
                          <p className="text-sm text-gray-600">Agendada para 15:00</p>
                        </div>
                        <Badge variant="outline">AGENDADA</Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Inicia em 2h 30min
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Moderation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Moderação de Mensagens</CardTitle>
                <CardDescription>
                  Mensagens recentes e denúncias para revisão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`border rounded-lg p-3 ${message.flagged ? 'border-red-200 bg-red-50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">{message.user}</div>
                          <div className="text-xs text-gray-500">
                            {rooms.find(r => r.id === message.roomId)?.name} • {message.timestamp.toLocaleTimeString('pt-BR')}
                          </div>
                        </div>
                        {message.flagged && (
                          <Badge variant="destructive" className="text-xs">
                            DENUNCIADA
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{message.message}</p>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMessage(message.id, message.user)}
                          className="text-xs"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Excluir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => banUser(message.user)}
                          className="text-xs"
                        >
                          <UserX className="w-3 h-3 mr-1" />
                          Banir Usuário
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Moderation Log */}
            <Card>
              <CardHeader>
                <CardTitle>Registro de Moderação</CardTitle>
                <CardDescription>
                  Adicione notas sobre ações de moderação realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Ex: Removida mensagem com conteúdo inadequado na sala de Casos Clínicos às 14:30..."
                    value={moderationNote}
                    onChange={(e) => setModerationNote(e.target.value)}
                    rows={4}
                  />
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setModerationNote("");
                      toast({
                        title: "Registro salvo",
                        description: "Nota de moderação foi adicionada ao log",
                      });
                    }}
                  >
                    Adicionar ao Registro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>

      {/* Diálogo de Confirmação de Banimento */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Banimento</DialogTitle>
            <DialogDescription>
              Selecione o período de banimento para o usuário <strong>{selectedUser}</strong>:
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => selectedUser && handleBanUser(selectedUser, '15min')}
              className="justify-start text-left h-auto p-4"
            >
              <div>
                <div className="font-medium">Banir por 15 minutos</div>
                <div className="text-sm text-gray-500">Para infrações leves</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => selectedUser && handleBanUser(selectedUser, '1hour')}
              className="justify-start text-left h-auto p-4"
            >
              <div>
                <div className="font-medium">Banir por 1 hora</div>
                <div className="text-sm text-gray-500">Para comportamento inadequado</div>
              </div>
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleBanUser(selectedUser, 'permanent')}
              className="justify-start text-left h-auto p-4"
            >
              <div>
                <div className="font-medium">Banimento permanente</div>
                <div className="text-sm text-white/80">Para violações graves</div>
              </div>
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}