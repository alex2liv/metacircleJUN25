import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { 
  Video, 
  MessageSquare, 
  Calendar,
  FileText,
  Mic,
  Camera,
  Users,
  Bell,
  LogOut,
  Play,
  Clock,
  Eye,
  MessageCircle,
  Settings,
  BookOpen,
  BarChart3
} from "lucide-react";
import metaSyncIcon from "@assets/icone_matasync.png";

export default function SpecialistDashboardMain() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setLocation("/login");
  };

  const handleStartLive = () => {
    // Gerar ID único para a nova live
    const roomId = `live-${Date.now()}`;
    setLocation(`/video-room/${roomId}`);
  };

  const handleScheduleMeeting = () => {
    setLocation("/schedule-meeting");
  };

  const handleViewConversations = () => {
    setLocation("/general-chat");
  };

  const stats = {
    activeLives: 2,
    pendingMessages: 15,
    scheduledMeetings: 8,
    totalMembers: 234
  };

  const recentActivities = [
    { id: 1, type: "live", title: "Live sobre Funis de Vendas", time: "2h atrás", viewers: 45 },
    { id: 2, type: "message", title: "Nova pergunta de Maria Silva", time: "5min atrás" },
    { id: 3, type: "meeting", title: "Consultoria agendada com João", time: "Amanhã 14h" },
    { id: 4, type: "document", title: "Novo material enviado", time: "1h atrás" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={metaSyncIcon} 
              alt="MetaSync" 
              className="h-12 w-12"
            />
            <div className="border-l border-gray-300 pl-3">
              <h1 className="text-xl font-bold text-gray-900">
                Dashboard do Especialista
              </h1>
              <p className="text-sm text-gray-600">
                Área de Moderação e Conteúdo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Online
            </Badge>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">Especialista</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.activeLives}</div>
              <p className="text-sm text-gray-600">Lives Ativas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.pendingMessages}</div>
              <p className="text-sm text-gray-600">Mensagens Pendentes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.scheduledMeetings}</div>
              <p className="text-sm text-gray-600">Reuniões Agendadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalMembers}</div>
              <p className="text-sm text-gray-600">Membros Ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                onClick={handleStartLive}
                className="h-20 flex flex-col gap-2 bg-red-600 hover:bg-red-700"
              >
                <Video className="w-6 h-6" />
                <span>Iniciar Live</span>
              </Button>
              
              <Button 
                onClick={handleViewConversations}
                variant="outline" 
                className="h-20 flex flex-col gap-2"
              >
                <MessageSquare className="w-6 h-6" />
                <span>Ver Conversas</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setLocation("/specialist-room-moderation")}
              >
                <Users className="w-6 h-6" />
                <span>Moderar Salas</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <Button 
                onClick={() => setLocation("/specialist-agenda")}
                variant="outline" 
                className="h-20 flex flex-col gap-2"
              >
                <Calendar className="w-6 h-6" />
                <span>Gerenciar Agenda</span>
              </Button>
              
              <Button 
                onClick={() => setLocation("/specialist-clients")}
                variant="outline" 
                className="h-20 flex flex-col gap-2"
              >
                <Users className="w-6 h-6" />
                <span>Meus Clientes</span>
              </Button>
              
              <Button 
                onClick={() => setLocation("/settings")}
                variant="outline" 
                className="h-20 flex flex-col gap-2"
              >
                <Settings className="w-6 h-6" />
                <span>Configurações</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-full">
                      {activity.type === 'live' && <Video className="w-4 h-4 text-red-600" />}
                      {activity.type === 'message' && <MessageCircle className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-green-600" />}
                      {activity.type === 'document' && <FileText className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    {activity.viewers && (
                      <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">{activity.viewers} viewers</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Ferramentas de Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Camera className="w-5 h-5" />
                  <span className="text-xs">Enviar Vídeo</span>
                </Button>
                
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Mic className="w-5 h-5" />
                  <span className="text-xs">Enviar Áudio</span>
                </Button>
                
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">Documentos</span>
                </Button>
                
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agenda Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Próximos Compromissos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Consultoria Individual - João Silva</p>
                  <p className="text-sm text-gray-600">Hoje às 15:00</p>
                </div>
                <Button size="sm">Entrar</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Live: Marketing Digital para Iniciantes</p>
                  <p className="text-sm text-gray-600">Amanhã às 19:00</p>
                </div>
                <Button size="sm" variant="outline">Preparar</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium">Reunião de Planejamento</p>
                  <p className="text-sm text-gray-600">Sexta às 10:00</p>
                </div>
                <Button size="sm" variant="outline">Ver Detalhes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}