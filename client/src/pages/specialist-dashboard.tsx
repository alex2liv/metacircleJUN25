import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Calendar, 
  Video, 
  Users, 
  Clock,
  Phone,
  Settings,
  LogOut,
  Play,
  Pause,
  Eye
} from "lucide-react";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";
import { useLocation } from "wouter";

export default function SpecialistDashboard() {
  const [, setLocation] = useLocation();
  const [isLive, setIsLive] = useState(false);

  const chatGroups = [
    { id: 1, name: "💬 Chat Geral", members: 45, unread: 12, active: true },
    { id: 2, name: "📚 Cursos Básicos", members: 28, unread: 5, active: true },
    { id: 3, name: "🚀 Marketing Avançado", members: 15, unread: 0, active: false },
    { id: 4, name: "💡 Dúvidas e Suporte", members: 33, unread: 8, active: true }
  ];

  const upcomingSchedules = [
    { id: 1, title: "Consulta - João Silva", time: "14:00", type: "video", duration: "30min" },
    { id: 2, title: "Workshop - Funis de Vendas", time: "16:00", type: "live", duration: "60min" },
    { id: 3, title: "Mentoria - Maria Santos", time: "18:30", type: "video", duration: "45min" }
  ];

  const liveRooms = [
    { id: 1, name: "🎯 Marketing Digital Hoje", participants: 23, status: "active" },
    { id: 2, name: "📈 Vendas & Conversão", participants: 0, status: "waiting" },
    { id: 3, name: "💰 Monetização Avançada", participants: 8, status: "active" }
  ];

  const handleLogout = () => {
    setLocation("/specialist-login");
  };

  const handleJoinChat = (groupId: number) => {
    // Aqui abriria o chat específico
    console.log("Joining chat group:", groupId);
  };

  const handleJoinVideoCall = (scheduleId: number) => {
    // Aqui iniciaria a videochamada
    console.log("Starting video call:", scheduleId);
  };

  const handleStartLive = () => {
    setIsLive(!isLive);
  };

  const handleJoinLiveRoom = (roomId: number) => {
    // Aqui entraria na sala de live
    console.log("Joining live room:", roomId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-purple-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={metaSyncLogo} alt="MetaSync" className="h-8" />
            <div>
              <h1 className="text-white font-bold text-lg">👩‍💼 Área do Especialista</h1>
              <p className="text-blue-200 text-sm">Clarissa - Marketing Digital</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              🟢 Online
            </Badge>
            <Button variant="ghost" size="sm" className="text-white" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="chats" className="space-y-6">
          <TabsList className="bg-white/20 backdrop-blur-sm border-0">
            <TabsTrigger value="chats" className="data-[state=active]:bg-white/30">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat Groups
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-white/30">
              <Calendar className="w-4 h-4 mr-2" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="lives" className="data-[state=active]:bg-white/30">
              <Video className="w-4 h-4 mr-2" />
              Lives & Vídeos
            </TabsTrigger>
            <TabsTrigger value="moderation" className="data-[state=active]:bg-white/30">
              <Users className="w-4 h-4 mr-2" />
              Moderação
            </TabsTrigger>
          </TabsList>

          {/* Chat Groups Tab */}
          <TabsContent value="chats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatGroups.map((group) => (
                <Card key={group.id} className="bg-white/95 backdrop-blur-sm border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm">
                      {group.name}
                      <Badge variant={group.active ? "default" : "secondary"}>
                        {group.active ? "Ativo" : "Pausado"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">👥 {group.members} membros</span>
                        {group.unread > 0 && (
                          <Badge variant="destructive">{group.unread} novas</Badge>
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => handleJoinChat(group.id)}
                        className="w-full"
                        variant={group.unread > 0 ? "default" : "outline"}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {group.unread > 0 ? "Ver Mensagens" : "Entrar no Chat"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    📅 Agenda de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSchedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">{schedule.time}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{schedule.title}</p>
                            <p className="text-xs text-gray-600">{schedule.duration}</p>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={() => handleJoinVideoCall(schedule.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {schedule.type === "video" ? (
                            <>
                              <Video className="w-4 h-4 mr-1" />
                              Iniciar
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Live
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    ⚡ Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Nova Consulta
                    </Button>
                    
                    <Button className="w-full" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Chamada de Emergência
                    </Button>
                    
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={handleStartLive}
                    >
                      {isLive ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Parar Live
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Iniciar Live Agora
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lives & Videos Tab */}
          <TabsContent value="lives">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveRooms.map((room) => (
                <Card key={room.id} className="bg-white/95 backdrop-blur-sm border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm">
                      {room.name}
                      <Badge variant={room.status === "active" ? "default" : "secondary"}>
                        {room.status === "active" ? "🔴 Ativo" : "⏳ Aguardando"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          👥 {room.participants} participantes
                        </span>
                        {room.status === "active" && (
                          <span className="text-red-600 font-medium">● AO VIVO</span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleJoinLiveRoom(room.id)}
                          className="flex-1"
                          variant={room.status === "active" ? "default" : "outline"}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          {room.status === "active" ? "Entrar" : "Iniciar"}
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation">
            <Card className="bg-white/95 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  🛡️ Painel de Moderação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <h3 className="font-medium text-blue-900">Membros Ativos</h3>
                    <p className="text-2xl font-bold text-blue-600">156</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <h3 className="font-medium text-green-900">Mensagens Hoje</h3>
                    <p className="text-2xl font-bold text-green-600">342</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <h3 className="font-medium text-orange-900">Relatórios</h3>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <Button variant="outline" className="flex-1">
                    <Users className="w-4 h-4 mr-2" />
                    Gerenciar Membros
                  </Button>
                  
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Revisar Mensagens
                  </Button>
                  
                  <Button variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}