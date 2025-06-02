import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Search, MessageSquare, Phone, Mail, Calendar, Star } from "lucide-react";
import { useLocation } from "wouter";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "active" | "inactive" | "premium";
  lastConsultation: string;
  totalConsultations: number;
  rating: number;
  specialty: string;
}

export default function SpecialistClients() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [clients] = useState<Client[]>([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria.silva@email.com",
      phone: "(11) 99999-0001",
      status: "premium",
      lastConsultation: "2025-05-30",
      totalConsultations: 12,
      rating: 5,
      specialty: "Podologia Geral"
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao.santos@email.com",
      phone: "(11) 99999-0002",
      status: "active",
      lastConsultation: "2025-05-28",
      totalConsultations: 8,
      rating: 4,
      specialty: "Tratamento de Unhas"
    },
    {
      id: 3,
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(11) 99999-0003",
      status: "active",
      lastConsultation: "2025-05-25",
      totalConsultations: 15,
      rating: 5,
      specialty: "Podologia Esportiva"
    },
    {
      id: 4,
      name: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      phone: "(11) 99999-0004",
      status: "inactive",
      lastConsultation: "2025-04-15",
      totalConsultations: 3,
      rating: 3,
      specialty: "Consulta Inicial"
    }
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "premium": return "bg-yellow-100 text-yellow-800";
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "premium": return "Premium";
      case "active": return "Ativo";
      case "inactive": return "Inativo";
      default: return "Desconhecido";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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
              <h1 className="text-xl font-bold text-gray-900">Meus Clientes</h1>
              <p className="text-sm text-gray-600">Gerencie seus clientes e consultorias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar clientes por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
            <p className="text-sm text-gray-600">Total de Clientes</p>
          </div>
        </div>

        {/* Client Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.status === 'active').length}
              </div>
              <p className="text-sm text-gray-600">Clientes Ativos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {clients.filter(c => c.status === 'premium').length}
              </div>
              <p className="text-sm text-gray-600">Clientes Premium</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {clients.reduce((sum, c) => sum + c.totalConsultations, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Consultorias</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{client.name}</h3>
                      <Badge className={getStatusColor(client.status)}>
                        {getStatusLabel(client.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {client.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {client.phone}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Especialidade: {client.specialty}</span>
                      <span>Consultorias: {client.totalConsultations}</span>
                      <span>Última: {new Date(client.lastConsultation).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(client.rating)}
                      <span className="text-xs text-gray-500 ml-1">({client.rating}/5)</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation('/specialist-messages')}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Mensagem
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation('/specialist-agenda')}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Agendar
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredClients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum cliente encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}