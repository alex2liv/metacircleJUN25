import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  UserPlus,
  Settings,
  BarChart3,
  MessageSquare,
  Calendar,
  Crown,
  Shield,
  LogOut,
  UserCircle,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import metaSyncIcon from "@assets/icone_matasync.png";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  lastLogin: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Dados do administrador
  const [adminInfo] = useState({
    name: "Alexandre Nunes",
    email: "alexandre@metasyncdigital.com.br",
    role: "Administrador"
  });

  // Dados de exemplo de usuários
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "Clarissa Vaz",
      email: "clarissa@metasyncdigital.com.br",
      role: "Especialista",
      isActive: true,
      lastLogin: "Hoje às 14:30"
    },
    {
      id: 2,
      name: "João Silva",
      email: "joao@example.com",
      role: "Membro",
      isActive: true,
      lastLogin: "Ontem às 09:15"
    }
  ]);

  // Estatísticas gerais
  const [stats] = useState({
    totalUsers: 245,
    activeUsers: 189,
    specialists: 3,
    newUsersToday: 12
  });

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Redirecionando para a tela de login...",
    });
    setTimeout(() => {
      setLocation("/login");
    }, 1000);
  };

  const menuItems = [
    { icon: Users, label: "Usuários", path: "/admin/users", description: "Gerenciar usuários e especialistas" },
    { icon: MessageSquare, label: "Comunidades", path: "/admin/communities", description: "Administrar comunidades ativas" },
    { icon: Calendar, label: "Eventos", path: "/admin/events", description: "Supervisionar eventos e agendamentos" },
    { icon: BarChart3, label: "Analytics", path: "/analytics-dashboard", description: "Métricas e relatórios" },
    { icon: Settings, label: "Configurações", path: "/specialist-admin", description: "Configurações do sistema" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header com logo e menu do usuário */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo MetaSync */}
          <div className="flex items-center gap-3">
            <img 
              src={metaSyncIcon} 
              alt="MetaSync" 
              className="h-16 w-16"
            />
            <div className="border-l border-gray-300 pl-3">
              <h1 className="text-xl font-bold text-gray-900">
                Administração
              </h1>
              <p className="text-sm text-gray-600">
                Painel de Controle MetaCircle
              </p>
            </div>
          </div>

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {adminInfo.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">{adminInfo.name}</p>
                  <p className="text-xs text-gray-500">{adminInfo.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">
                {adminInfo.name}
              </div>
              <div className="px-2 py-1 text-xs text-gray-500">
                {adminInfo.email}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/admin/profile")}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Crown className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Especialistas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.specialists}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Novos Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newUsersToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de administração */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comunidades
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumo do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => setLocation(item.path)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="h-6 w-6 text-blue-600" />
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Usuários do Sistema
                  </CardTitle>
                  <Button
                    onClick={() => setLocation("/admin/users")}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Último login: {user.lastLogin}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.role === "Especialista" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communities Tab */}
          <TabsContent value="communities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comunidades Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Gerencie todas as comunidades da plataforma.</p>
                <Button 
                  onClick={() => setLocation("/admin/communities")}
                  className="mt-4"
                >
                  Acessar Gerenciador de Comunidades
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Eventos e Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Supervisione todos os eventos e agendamentos do sistema.</p>
                <Button 
                  onClick={() => setLocation("/admin/events")}
                  className="mt-4"
                >
                  Acessar Gerenciador de Eventos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configure parâmetros gerais do sistema e especialistas.</p>
                <Button 
                  onClick={() => setLocation("/specialist-admin")}
                  className="mt-4"
                >
                  Acessar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}