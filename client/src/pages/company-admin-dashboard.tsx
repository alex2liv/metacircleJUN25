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
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h2>
                <p className="text-gray-600">Administração de Especialistas e Membros</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Especialistas (0)
              </Button>
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                <Users className="w-4 h-4 mr-2" />
                Importar Usuários
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
              <Button variant="outline" className="text-gray-600 border-gray-300">
                <Settings className="w-4 h-4 mr-2" />
                Configurações do Sistema
              </Button>
            </div>
          </div>
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

        {/* Users Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Usuários do Sistema</h3>
            <p className="text-gray-600 text-sm">Gerencie especialistas, administradores e membros</p>
          </div>
          
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-base font-medium">Usuários Cadastrados (0)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-2">Nenhum usuário cadastrado ainda.</p>
                <p className="text-gray-400 text-sm">Use os botões acima para adicionar usuários ao sistema.</p>
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