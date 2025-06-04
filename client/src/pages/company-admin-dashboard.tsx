import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Building2, 
  Plus, 
  MessageSquare, 
  User, 
  Calendar, 
  Clock,
  Shield,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

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
  phone?: string;
  speciality?: string;
  permissions?: string[];
}

interface NewUserForm {
  name: string;
  email: string;
  role: "specialist" | "user";
  phone: string;
  speciality: string;
}

export default function CompanyAdminDashboard() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddSpecialistOpen, setIsAddSpecialistOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "specialist" | "user">("all");
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: "",
    email: "",
    role: "user",
    phone: "",
    speciality: ""
  });

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
        name: "Dra. Clarissa Vargas",
        email: "clarissa@clarissavargas.com",
        role: "specialist",
        status: "active",
        joinDate: "2024-01-15",
        lastActivity: "2 horas atrás",
        phone: "+55 11 99999-1111",
        speciality: "Podologia",
        permissions: ["create_posts", "manage_events", "moderate_chat"]
      },
      {
        id: 2,
        name: "Dr. Rafael Santos",
        email: "rafael@clarissavargas.com",
        role: "specialist",
        status: "active",
        joinDate: "2024-02-10",
        lastActivity: "1 hora atrás",
        phone: "+55 11 99999-2222",
        speciality: "Fisioterapia",
        permissions: ["create_posts", "manage_events"]
      },
      {
        id: 3,
        name: "Ana Silva",
        email: "ana.silva@email.com",
        role: "user",
        status: "active",
        joinDate: "2024-02-20",
        lastActivity: "1 dia atrás",
        phone: "+55 11 98888-3333"
      },
      {
        id: 4,
        name: "João Santos",
        email: "joao.santos@email.com",
        role: "user",
        status: "active",
        joinDate: "2024-03-10",
        lastActivity: "3 horas atrás",
        phone: "+55 11 97777-4444"
      },
      {
        id: 5,
        name: "Maria Oliveira",
        email: "maria.oliveira@email.com",
        role: "user",
        status: "inactive",
        joinDate: "2024-01-05",
        lastActivity: "1 semana atrás",
        phone: "+55 11 96666-5555"
      }
    ]);
  }, [companySlug]);

  const handleAddUser = () => {
    if (!newUserForm.name || !newUserForm.email) return;
    
    const newMember: TeamMember = {
      id: Date.now(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: "active",
      joinDate: new Date().toISOString().split('T')[0],
      lastActivity: "Agora",
      phone: newUserForm.phone,
      speciality: newUserForm.role === "specialist" ? newUserForm.speciality : undefined,
      permissions: newUserForm.role === "specialist" ? ["create_posts"] : undefined
    };
    
    setTeamMembers([...teamMembers, newMember]);
    setNewUserForm({
      name: "",
      email: "",
      role: "user",
      phone: "",
      speciality: ""
    });
    setIsAddUserOpen(false);
    setIsAddSpecialistOpen(false);

    toast({
      title: newUserForm.role === "specialist" ? "Especialista adicionado" : "Usuário adicionado",
      description: `${newUserForm.name} foi adicionado à equipe com sucesso`,
    });
  };

  const handleToggleStatus = (memberId: number) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId 
        ? { ...member, status: member.status === "active" ? "inactive" : "active" }
        : member
    ));

    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      toast({
        title: "Status atualizado",
        description: `${member.name} foi ${member.status === "active" ? "desativado" : "ativado"}`,
      });
    }
  };

  const handleDeleteMember = (memberId: number) => {
    const member = teamMembers.find(m => m.id === memberId);
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    
    if (member) {
      toast({
        title: "Membro removido",
        description: `${member.name} foi removido da equipe`,
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setLocation(`/company/${companySlug}`);
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!user || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const specialists = filteredMembers.filter(member => member.role === "specialist");
  const users = filteredMembers.filter(member => member.role === "user");
  const activeMembers = teamMembers.filter(member => member.status === "active").length;
  const totalMembers = teamMembers.length;

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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Membros</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Membros Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{activeMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Especialistas</p>
                  <p className="text-2xl font-bold text-gray-900">{specialists.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Panel */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Gerenciamento de Equipe</CardTitle>
                <CardDescription>
                  Administre especialistas e usuários da sua empresa
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog open={isAddSpecialistOpen} onOpenChange={setIsAddSpecialistOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setNewUserForm({...newUserForm, role: "specialist"})}>
                      <Plus className="w-4 h-4 mr-2" />
                      Especialista
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Especialista</DialogTitle>
                      <DialogDescription>
                        Adicione um novo especialista à sua equipe
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="specialist-name">Nome Completo</Label>
                        <Input
                          id="specialist-name"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                          placeholder="Ex: Dr. João Silva"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialist-email">Email</Label>
                        <Input
                          id="specialist-email"
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                          placeholder="joao@exemplo.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialist-phone">Telefone</Label>
                        <Input
                          id="specialist-phone"
                          value={newUserForm.phone}
                          onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                          placeholder="+55 11 99999-9999"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialist-speciality">Especialidade</Label>
                        <Input
                          id="specialist-speciality"
                          value={newUserForm.speciality}
                          onChange={(e) => setNewUserForm({...newUserForm, speciality: e.target.value})}
                          placeholder="Ex: Podologia, Fisioterapia"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddSpecialistOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddUser}>
                          Adicionar Especialista
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setNewUserForm({...newUserForm, role: "user"})}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Usuário</DialogTitle>
                      <DialogDescription>
                        Adicione um novo usuário à sua comunidade
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="user-name">Nome Completo</Label>
                        <Input
                          id="user-name"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                          placeholder="Ex: Maria Silva"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-email">Email</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                          placeholder="maria@exemplo.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-phone">Telefone</Label>
                        <Input
                          id="user-phone"
                          value={newUserForm.phone}
                          onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                          placeholder="+55 11 99999-9999"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddUser}>
                          Adicionar Usuário
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={(value: "all" | "specialist" | "user") => setFilterRole(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="specialist">Especialistas</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Members Table */}
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <Badge variant={member.role === "specialist" ? "default" : "secondary"}>
                          {member.role === "specialist" ? "Especialista" : "Usuário"}
                        </Badge>
                        <Badge variant={member.status === "active" ? "default" : "secondary"}>
                          {member.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </span>
                        {member.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </span>
                        )}
                        {member.speciality && (
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {member.speciality}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Último acesso: {member.lastActivity} • Membro desde: {new Date(member.joinDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingMember(member)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(member.id)}>
                        {member.status === "active" ? (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum membro encontrado</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterRole !== "all" 
                      ? "Tente ajustar os filtros de busca" 
                      : "Adicione especialistas e usuários à sua equipe"
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}