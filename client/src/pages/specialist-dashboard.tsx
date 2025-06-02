import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MessageCircle, Users, Bell, Settings, LogOut, Clock, Video, FileText, TrendingUp } from "lucide-react";
import { useParams, useLocation } from "wouter";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  type: string;
  companySlug: string;
}

interface Company {
  name: string;
  hasWhiteLabel: boolean;
}

export default function SpecialistDashboard() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  
  const companySlug = params.slug;

  useEffect(() => {
    // In real app, get user data from authentication state
    setUser({
      id: 124,
      name: "Dr. Silva",
      email: "especialista@clarissavargas.com",
      role: "specialist",
      type: "specialist",
      companySlug: companySlug || ""
    });

    setCompany({
      name: "Clarissa Vargas",
      hasWhiteLabel: false
    });
  }, [companySlug]);

  const handleLogout = () => {
    setLocation(`/company/${companySlug}`);
  };

  if (!user || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/attached_assets/logo metasync fundo transparente.png" 
                alt="MetaSync" 
                className="w-8 h-8"
              />
              <h1 className="text-xl font-semibold text-gray-900">{company.name}</h1>
              <Badge variant="secondary">Especialista</Badge>
              {!company.hasWhiteLabel && (
                <Badge variant="outline" className="text-xs">Powered by MetaSync</Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Painel do Especialista</h2>
          <p className="text-gray-600 mt-1">Gerencie seus clientes e sessões</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                3 concluídas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                3 não lidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">
                Média de satisfação
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Próximas Sessões */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Sessões</CardTitle>
              <CardDescription>Seus atendimentos agendados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <Avatar>
                  <AvatarFallback>JC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">João Cliente</p>
                  <p className="text-sm text-gray-600">Consulta Psicológica</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    14:00 - 15:00
                  </div>
                </div>
                <Button size="sm">
                  <Video className="w-3 h-3 mr-1" />
                  Iniciar
                </Button>
              </div>

              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <Avatar>
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Maria Santos</p>
                  <p className="text-sm text-gray-600">Acompanhamento</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    15:30 - 16:30
                  </div>
                </div>
                <Button variant="outline" size="sm">Ver Perfil</Button>
              </div>

              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <Avatar>
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Ana Beatriz</p>
                  <p className="text-sm text-gray-600">Primeira Consulta</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    17:00 - 18:00
                  </div>
                </div>
                <Button variant="outline" size="sm">Preparar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Clientes Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas interações com clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>JC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">João Cliente enviou uma mensagem</p>
                  <p className="text-xs text-gray-500">Há 5 minutos</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sessão concluída com Maria Santos</p>
                  <p className="text-xs text-gray-500">Há 2 horas</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ana Beatriz agendou consulta</p>
                  <p className="text-xs text-gray-500">Há 3 horas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation("/specialist-agenda")}>
            <CardContent className="flex items-center space-x-4 p-6">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-medium">Gerenciar Agenda</h3>
                <p className="text-sm text-gray-600">Configure horários e disponibilidade</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation("/specialist-clients")}>
            <CardContent className="flex items-center space-x-4 p-6">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-medium">Meus Clientes</h3>
                <p className="text-sm text-gray-600">Visualizar perfis e histórico</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation("/specialist-messages")}>
            <CardContent className="flex items-center space-x-4 p-6">
              <MessageCircle className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-medium">Enviar Mensagens</h3>
                <p className="text-sm text-gray-600">Comunicar com salas e usuários</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation("/settings")}>
            <CardContent className="flex items-center space-x-4 p-6">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-medium">Configurações</h3>
                <p className="text-sm text-gray-600">WhatsApp e outras configurações</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {!company.hasWhiteLabel && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Powered by <span className="font-semibold text-primary">MetaSync</span> - 
              Sua plataforma de comunidades digitais
            </p>
          </div>
        )}
      </div>
    </div>
  );
}