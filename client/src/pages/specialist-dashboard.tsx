import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, MessageSquare, DollarSign, Clock, Video, Phone, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface Appointment {
  id: number;
  clientName: string;
  date: string;
  time: string;
  type: "video" | "phone" | "presencial";
  status: "confirmado" | "pendente" | "concluido";
  planType: "basic" | "intermediate" | "premium";
}

interface SpecialistStats {
  totalAppointments: number;
  todayAppointments: number;
  monthlyEarnings: number;
  activeClients: number;
  completedSessions: number;
  avgRating: number;
}

export default function SpecialistDashboard() {
  const [, setLocation] = useLocation();
  
  // Simulando dados do especialista logado
  const specialistData = {
    name: "Clarissa Vaz",
    speciality: "Coaching de Carreira",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256",
    phone: "11910018833",
    email: "clarissa@metasyncdigital.com.br"
  };

  const stats: SpecialistStats = {
    totalAppointments: 156,
    todayAppointments: 3,
    monthlyEarnings: 4850.00,
    activeClients: 42,
    completedSessions: 134,
    avgRating: 4.8
  };

  const todayAppointments: Appointment[] = [
    {
      id: 1,
      clientName: "Ana Silva",
      date: "2025-06-01",
      time: "09:00",
      type: "video",
      status: "confirmado",
      planType: "premium"
    },
    {
      id: 2,
      clientName: "Carlos Santos",
      date: "2025-06-01", 
      time: "14:30",
      type: "phone",
      status: "pendente",
      planType: "intermediate"
    },
    {
      id: 3,
      clientName: "Maria Costa",
      date: "2025-06-01",
      time: "16:00",
      type: "video",
      status: "confirmado",
      planType: "basic"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmado":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "concluido":
        return <Badge className="bg-blue-100 text-blue-800">Concluído</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case "premium":
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
      case "intermediate":
        return <Badge className="bg-blue-100 text-blue-800">Intermediário</Badge>;
      case "basic":
        return <Badge className="bg-gray-100 text-gray-800">Básico</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "phone":
        return <Phone className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Especialista */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-4 border-white/20">
            <AvatarImage src={specialistData.avatar} />
            <AvatarFallback className="bg-white/20 text-white text-lg">
              {specialistData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{specialistData.name}</h1>
            <p className="text-purple-100">{specialistData.speciality}</p>
            <p className="text-purple-200 text-sm">WhatsApp: {specialistData.phone}</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Hoje</p>
                <p className="text-2xl font-bold">{stats.todayAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold">R$ {stats.monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold">{stats.activeClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Sessões Completas</p>
                <p className="text-2xl font-bold">{stats.completedSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agenda do Dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Agenda de Hoje - {new Date().toLocaleDateString('pt-BR')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum agendamento para hoje</p>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(appointment.type)}
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                    <div>
                      <p className="font-medium">{appointment.clientName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(appointment.status)}
                        {getPlanBadge(appointment.planType)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {appointment.type === "video" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Iniciar Video
                      </Button>
                    )}
                    {appointment.type === "phone" && (
                      <Button size="sm" variant="outline">
                        Ligar
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gerenciar Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Configure horários disponíveis e bloqueie datas</p>
            <Button className="w-full" onClick={() => setLocation("/specialist-agenda")}>Abrir Agenda</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Veja estatísticas detalhadas e ganhos</p>
            <Button variant="outline" className="w-full">Ver Relatórios</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Ajuste preços, perfil e notificações</p>
            <Button variant="outline" className="w-full">Configurar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}