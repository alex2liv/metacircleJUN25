import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, Plus, Edit, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

interface Appointment {
  id: number;
  title: string;
  client: string;
  date: string;
  time: string;
  type: "consultation" | "meeting" | "live";
  status: "scheduled" | "confirmed" | "cancelled";
}

export default function SpecialistAgenda() {
  const [, setLocation] = useLocation();
  
  const [appointments] = useState<Appointment[]>([
    {
      id: 1,
      title: "Consultoria Personalizada",
      client: "Maria Silva",
      date: "2025-06-03",
      time: "14:00",
      type: "consultation",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Sessão de Acompanhamento",
      client: "João Santos",
      date: "2025-06-03",
      time: "16:30",
      type: "meeting",
      status: "scheduled"
    },
    {
      id: 3,
      title: "Live sobre Podologia",
      client: "Grupo Geral",
      date: "2025-06-04",
      time: "19:00",
      type: "live",
      status: "scheduled"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "consultation": return <User className="w-4 h-4" />;
      case "meeting": return <Calendar className="w-4 h-4" />;
      case "live": return <Clock className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/specialist-dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gerenciar Agenda</h1>
              <p className="text-sm text-gray-600">Organize seus compromissos e consultorias</p>
            </div>
          </div>
          
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Próximos Compromissos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-full">
                        {getTypeIcon(appointment.type)}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                        <p className="text-sm text-gray-600">Cliente: {appointment.client}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status === 'confirmed' ? 'Confirmado' : 
                           appointment.status === 'scheduled' ? 'Agendado' : 'Cancelado'}
                        </Badge>
                        
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas da Semana</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <p className="text-sm text-gray-600">Consultorias Agendadas</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">6</div>
                  <p className="text-sm text-gray-600">Consultorias Confirmadas</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2</div>
                  <p className="text-sm text-gray-600">Lives Programadas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Agendar Consultoria
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Programar Live
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Ver Histórico
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}