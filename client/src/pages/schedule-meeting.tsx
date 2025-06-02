import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar,
  Clock,
  Video,
  Users,
  Crown,
  ArrowLeft,
  Star,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { format, addDays, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduledMeeting {
  id: number;
  title: string;
  description: string;
  date: Date;
  duration: number;
  withSpecialist: boolean;
  participants: number;
  roomLink: string;
  status: 'scheduled' | 'live' | 'completed';
}

export default function ScheduleMeeting() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [meetingData, setMeetingData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    withSpecialist: false,
    maxParticipants: 10
  });

  // Reuniões agendadas
  const [scheduledMeetings] = useState<ScheduledMeeting[]>([
    {
      id: 1,
      title: "Sessão de Mentoria com Clarissa",
      description: "Estratégias avançadas de marketing digital",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dias
      duration: 90,
      withSpecialist: true,
      participants: 8,
      roomLink: "metacircle.com/room/abc123",
      status: 'scheduled'
    },
    {
      id: 2,
      title: "Workshop: React Avançado",
      description: "Discussão sobre hooks e patterns",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias
      duration: 120,
      withSpecialist: false,
      participants: 15,
      roomLink: "metacircle.com/room/xyz789",
      status: 'scheduled'
    }
  ]);

  // Horários disponíveis da especialista
  const specialistAvailability = [
    { day: "Segunda", time: "14:00", available: true },
    { day: "Segunda", time: "16:00", available: false },
    { day: "Terça", time: "10:00", available: true },
    { day: "Terça", time: "14:00", available: true },
    { day: "Quarta", time: "09:00", available: true },
    { day: "Quinta", time: "15:00", available: true },
    { day: "Sexta", time: "11:00", available: false }
  ];

  const handleScheduleMeeting = () => {
    if (!meetingData.title || !meetingData.date || !meetingData.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, data e horário",
        variant: "destructive",
      });
      return;
    }

    const scheduledDate = new Date(`${meetingData.date}T${meetingData.time}`);
    const roomLink = `metacircle.com/room/${Math.random().toString(36).substr(2, 9)}`;

    toast({
      title: "🎉 Reunião agendada!",
      description: meetingData.withSpecialist 
        ? "Clarissa foi notificada e confirmará sua presença" 
        : "Link da sala foi gerado e participantes serão notificados",
      duration: 5000,
    });

    // Simular notificação WhatsApp
    setTimeout(() => {
      toast({
        title: "📱 Notificação enviada!",
        description: `WhatsApp enviado para ${meetingData.maxParticipants} membros`,
      });
    }, 2000);

    // Reset form
    setMeetingData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 60,
      withSpecialist: false,
      maxParticipants: 10
    });
  };

  const joinMeeting = (meeting: ScheduledMeeting) => {
    toast({
      title: "🚀 Entrando na reunião...",
      description: "Redirecionando para a sala de vídeo",
    });
    
    setTimeout(() => {
      setLocation('/video-call');
    }, 1500);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setLocation('/client-view')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendar Videochamada</h1>
          <p className="text-gray-600">Exclusivo para membros Premium</p>
        </div>
        
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-auto">
          <Crown className="w-4 h-4 mr-1" />
          PREMIUM
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de agendamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Nova Reunião
            </CardTitle>
            <CardDescription>
              Agende uma videochamada exclusiva para membros Premium
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Reunião *</Label>
              <Input
                id="title"
                placeholder="Ex: Workshop React Avançado"
                value={meetingData.title}
                onChange={(e) => setMeetingData({...meetingData, title: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o que será abordado na reunião..."
                value={meetingData.description}
                onChange={(e) => setMeetingData({...meetingData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="time">Horário *</Label>
                <Input
                  id="time"
                  type="time"
                  value={meetingData.time}
                  onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duração (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={meetingData.duration}
                  onChange={(e) => setMeetingData({...meetingData, duration: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="participants">Máx. Participantes</Label>
                <Input
                  id="participants"
                  type="number"
                  value={meetingData.maxParticipants}
                  onChange={(e) => setMeetingData({...meetingData, maxParticipants: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* Opção de convidar outros especialistas */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                    ES
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">Convidar Outros Especialistas</p>
                  <p className="text-sm text-gray-600">Colaborar com outros profissionais da equipe</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <Switch
                  checked={meetingData.withSpecialist}
                  onCheckedChange={(checked) => setMeetingData({...meetingData, withSpecialist: checked})}
                />
              </div>
            </div>

            {meetingData.withSpecialist && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Horários disponíveis da Clarissa:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {specialistAvailability.map((slot, index) => (
                    <div key={index} className={`p-2 rounded ${slot.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                      {slot.day} {slot.time} {slot.available ? '✅' : '❌'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleScheduleMeeting} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
              <Video className="w-4 h-4 mr-2" />
              Agendar Reunião
            </Button>
          </CardContent>
        </Card>

        {/* Reuniões agendadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Próximas Reuniões
            </CardTitle>
            <CardDescription>
              Suas videochamadas agendadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledMeetings.map((meeting) => (
              <div key={meeting.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                    <p className="text-sm text-gray-600">{meeting.description}</p>
                  </div>
                  {meeting.withSpecialist && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      COM CLARISSA
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(meeting.date, 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(meeting.date, 'HH:mm', { locale: ptBR })} ({meeting.duration}min)
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {meeting.participants} participantes
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Sala: {meeting.roomLink}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => joinMeeting(meeting)}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Entrar
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {scheduledMeetings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma reunião agendada</p>
                <p className="text-sm">Agende sua primeira videochamada Premium!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


    </div>
  );
}