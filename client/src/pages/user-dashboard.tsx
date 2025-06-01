import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MessageCircle, User, Bell, Settings, LogOut, Star, Clock, BookOpen } from "lucide-react";
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

export default function UserDashboard() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  
  const companySlug = params.slug;

  useEffect(() => {
    // In real app, get user data from authentication state
    // For demo, simulate logged in user
    setUser({
      id: 123,
      name: "João Cliente",
      email: "usuario@clarissavargas.com",
      role: "user",
      type: "user",
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
              <h1 className="text-xl font-semibold text-gray-900">{company.name}</h1>
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
          <h2 className="text-2xl font-bold text-gray-900">Bem-vindo, {user.name}!</h2>
          <p className="text-gray-600 mt-1">Acesse seus serviços e acompanhe seu progresso</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Agendadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +1 desde a semana passada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                2 não lidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                Do plano atual
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Sessões */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Sessões</CardTitle>
              <CardDescription>Seus agendamentos com especialistas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <Avatar>
                  <AvatarFallback>CV</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Clarissa Vargas</p>
                  <p className="text-sm text-gray-600">Consulta Psicológica</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Hoje, 14:00
                  </div>
                </div>
                <Button size="sm">Entrar</Button>
              </div>

              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <Avatar>
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Dr. Silva</p>
                  <p className="text-sm text-gray-600">Acompanhamento</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Amanhã, 10:00
                  </div>
                </div>
                <Button variant="outline" size="sm">Ver Detalhes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recursos Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos Disponíveis</CardTitle>
              <CardDescription>Ferramentas e materiais para seu desenvolvimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat com Especialistas
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Materiais de Estudo
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Nova Sessão
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Meu Perfil
              </Button>
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