import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { 
  User, 
  UserPlus,
  Settings,
  LogOut,
  UserCircle,
  Save,
  Edit,
  Trash2,
  Phone,
  Mail,
  Crown,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import metaSyncIcon from "@assets/icone_matasync.png";

interface UserData {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  role: "admin" | "specialist" | "member";
  speciality?: string;
  bio?: string;
  isActive: boolean;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddingSpecialist, setIsAddingSpecialist] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  
  // Formulário para novo usuário
  const [newUser, setNewUser] = useState<UserData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "member",
    speciality: "",
    bio: "",
    isActive: true
  });

  // Formulário para novo especialista
  const [newSpecialist, setNewSpecialist] = useState<UserData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "specialist",
    speciality: "",
    bio: "",
    isActive: true
  });

  // Lista de usuários cadastrados (exemplo)
  const [users, setUsers] = useState<UserData[]>([
    {
      id: 1,
      firstName: "Alexandre",
      lastName: "Nunes",
      username: "alexandre.nunes",
      email: "alexandre@metasyncdigital.com.br",
      password: "admin123",
      role: "admin",
      isActive: true
    }
  ]);

  const adminInfo = {
    name: "Alexandre Nunes",
    email: "alexandre@metasyncdigital.com.br",
    role: "Administrador"
  };

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Redirecionando para a tela de login...",
    });
    setTimeout(() => {
      setLocation("/login");
    }, 1000);
  };

  const handleSaveUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.username || !newUser.email || !newUser.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const userToSave = {
      ...newUser,
      id: users.length + 1
    };

    setUsers([...users, userToSave]);
    setNewUser({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      role: "member",
      speciality: "",
      bio: "",
      isActive: true
    });
    setIsAddingUser(false);

    toast({
      title: "Usuário cadastrado",
      description: `${userToSave.firstName} ${userToSave.lastName} foi adicionado com sucesso!`,
    });
  };

  const handleSaveSpecialist = () => {
    if (!newSpecialist.firstName || !newSpecialist.lastName || !newSpecialist.username || !newSpecialist.email || !newSpecialist.password || !newSpecialist.speciality) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios para o especialista",
        variant: "destructive"
      });
      return;
    }

    const specialistToSave = {
      ...newSpecialist,
      id: users.length + 1
    };

    setUsers([...users, specialistToSave]);
    setNewSpecialist({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      role: "specialist",
      speciality: "",
      bio: "",
      isActive: true
    });
    setIsAddingSpecialist(false);

    toast({
      title: "Especialista cadastrado",
      description: `${specialistToSave.firstName} ${specialistToSave.lastName} foi adicionado como especialista!`,
    });
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "Usuário removido",
      description: "Usuário foi removido do sistema",
    });
  };

  const quickAddClarissa = () => {
    setNewUser({
      firstName: "Clarissa",
      lastName: "Vaz",
      username: "clarissa.vaz",
      email: "clarissa@metasyncdigital.com.br",
      password: "MetaSync2025!",
      phone: "17997337322",
      role: "specialist",
      speciality: "Consultoria em Negócios Digitais",
      bio: "Especialista em transformação digital e crescimento de negócios online. Consultora certificada em marketing digital e estratégias de vendas.",
      isActive: true
    });
    setIsAddingUser(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={metaSyncIcon} 
              alt="MetaSync" 
              className="h-16 w-16"
            />
            <div className="border-l border-gray-300 pl-3">
              <h1 className="text-xl font-bold text-gray-900">
                Gerenciamento de Usuários
              </h1>
              <p className="text-sm text-gray-600">
                Administração de Especialistas e Membros
              </p>
            </div>
          </div>

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
              <div className="px-2 py-1.5 text-sm font-medium">{adminInfo.name}</div>
              <div className="px-2 py-1 text-xs text-gray-500">{adminInfo.email}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/admin")}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
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

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Botões de ação */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Usuários do Sistema</h2>
            <p className="text-gray-600">Gerencie especialistas, administradores e membros</p>
          </div>
          <div className="space-x-2">
            <Button
              onClick={quickAddClarissa}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Adicionar Clarissa Vaz (Especialista)
            </Button>
            <Button
              onClick={() => setIsAddingUser(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </div>

        {/* Formulário de novo usuário */}
        {isAddingUser && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Cadastrar Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    placeholder="Nome"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    placeholder="Sobrenome"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="username.unico"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Senha segura"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="17999999999"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Tipo de Usuário *</Label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="specialist">Especialista</SelectItem>
                    <SelectItem value="member">Membro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newUser.role === "specialist" && (
                <>
                  <div>
                    <Label htmlFor="speciality">Especialidade</Label>
                    <Input
                      id="speciality"
                      value={newUser.speciality}
                      onChange={(e) => setNewUser({...newUser, speciality: e.target.value})}
                      placeholder="Área de atuação do especialista"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      value={newUser.bio}
                      onChange={(e) => setNewUser({...newUser, bio: e.target.value})}
                      placeholder="Descrição profissional do especialista"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleSaveUser} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Usuário
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingUser(false);
                    setNewUser({
                      firstName: "",
                      lastName: "",
                      username: "",
                      email: "",
                      password: "",
                      phone: "",
                      role: "member",
                      speciality: "",
                      bio: "",
                      isActive: true
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Usuários Cadastrados ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className={
                        user.role === "admin" ? "bg-gradient-to-r from-red-600 to-red-700 text-white" :
                        user.role === "specialist" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" :
                        "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      }>
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                        <Badge variant={
                          user.role === "admin" ? "destructive" :
                          user.role === "specialist" ? "default" :
                          "secondary"
                        }>
                          {user.role === "admin" ? "Admin" : user.role === "specialist" ? "Especialista" : "Membro"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                      {user.speciality && (
                        <p className="text-xs text-blue-600 mt-1">{user.speciality}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {user.role !== "admin" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => handleDeleteUser(user.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}