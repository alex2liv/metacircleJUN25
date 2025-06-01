import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserPlus, Settings, LogOut, Bell, Search, Filter, MoreVertical, Edit, Trash2, Building2 } from "lucide-react";
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

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "specialist" | "user";
  status: "active" | "inactive";
  joinDate: string;
  lastActivity: string;
}

export default function CompanyAdminDashboard() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  
  const companySlug = params.slug;

  useEffect(() => {
    // In real app, get user data from authentication state
    setUser({
      id: 125,
      name: "Clarissa Vargas",
      email: "admin@clarissavargas.com",
      role: "company_admin",
      type: "admin",
      companySlug: companySlug || ""
    });

    setCompany({
      name: "Clarissa Vargas",
      hasWhiteLabel: false
    });

    // Load team members
    setTeamMembers([
      {
        id: 1,
        name: "Dr. Silva",
        email: "dr.silva@clarissavargas.com",
        role: "specialist",
        status: "active",
        joinDate: "2024-01-15",
        lastActivity: "2 horas atrás"
      },
      {
        id: 2,
        name: "João Cliente",
        email: "joao@email.com",
        role: "user",
        status: "active",
        joinDate: "2024-02-20",
        lastActivity: "1 dia atrás"
      },
      {
        id: 3,
        name: "Maria Santos",
        email: "maria@email.com",
        role: "user",
        status: "active",
        joinDate: "2024-03-10",
        lastActivity: "3 horas atrás"
      }
    ]);
  }, [companySlug]);

  const handleLogout = () => {
    setLocation(`/company/${companySlug}`);
  };

  const handleAddUser = () => {
    // In real app, would add user to database
    setIsAddUserOpen(false);
  };

  if (!user || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const specialists = teamMembers.filter(member => member.role === "specialist");
  const users = teamMembers.filter(member => member.role === "user");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900">{company.name}</h1>
              <Badge variant="default">Admin</Badge>
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
          <h2 className="text-2xl font-bold text-gray-900">Painel Administrativo</h2>
          <p className="text-gray-600 mt-1">Gerencie especialistas e usuários da sua empresa</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Especialistas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{specialists.length}</div>
              <p className="text-xs text-muted-foreground">
                {specialists.filter(s => s.status === 'active').length} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter(u => u.status === 'active').length} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                membros cadastrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gerenciar Equipe</CardTitle>
                <CardDescription>Adicione e gerencie especialistas e usuários</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Adicionar Especialista
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Especialista</DialogTitle>
                      <DialogDescription>
                        Adicione um especialista à sua empresa
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" placeholder="Digite o nome completo" />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="Digite o e-mail" />
                      </div>
                      <div>
                        <Label htmlFor="specialty">Especialidade</Label>
                        <Input id="specialty" placeholder="Ex: Psicólogo, Nutricionista, etc." />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddUser}>
                          Adicionar Especialista
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar membros..." className="pl-8 w-64" />
                </div>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filtrar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="specialist">Especialistas</SelectItem>
                    <SelectItem value="user">Usuários</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Team Members Table */}
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={member.role === "specialist" ? "default" : "secondary"}>
                      {member.role === "specialist" ? "Especialista" : "Usuário"}
                    </Badge>
                    <Badge variant={member.status === "active" ? "default" : "destructive"}>
                      {member.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      <p>Último acesso</p>
                      <p>{member.lastActivity}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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