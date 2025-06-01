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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, user: UserData | null}>({show: false, user: null});
  const [userCountryCode, setUserCountryCode] = useState("+55");
  const [specialistCountryCode, setSpecialistCountryCode] = useState("+55");

  const countryCodes = [
    { code: "+55", country: "Brasil", flag: "🇧🇷" },
    { code: "+1", country: "Estados Unidos", flag: "🇺🇸" },
    { code: "+44", country: "Reino Unido", flag: "🇬🇧" },
    { code: "+33", country: "França", flag: "🇫🇷" },
    { code: "+49", country: "Alemanha", flag: "🇩🇪" },
    { code: "+34", country: "Espanha", flag: "🇪🇸" },
    { code: "+39", country: "Itália", flag: "🇮🇹" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+52", country: "México", flag: "🇲🇽" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+57", country: "Colômbia", flag: "🇨🇴" },
    { code: "+81", country: "Japão", flag: "🇯🇵" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+91", country: "Índia", flag: "🇮🇳" },
  ];
  
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

  // Lista de usuários cadastrados (inicia vazia para produção)
  const [users, setUsers] = useState<UserData[]>([]);

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
    const errors = [];
    if (!newUser.firstName) errors.push("firstName");
    if (!newUser.lastName) errors.push("lastName");
    if (!newUser.username) errors.push("username");
    if (!newUser.email) errors.push("email");
    if (!newUser.password) errors.push("password");

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos destacados em vermelho",
        variant: "destructive"
      });
      return;
    }

    setValidationErrors([]);
    const userToSave = {
      ...newUser,
      id: Date.now(),
      phone: newUser.phone ? `${userCountryCode} ${newUser.phone}` : ""
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
    const errors = [];
    if (!newSpecialist.firstName) errors.push("specialistFirstName");
    if (!newSpecialist.lastName) errors.push("specialistLastName");
    if (!newSpecialist.username) errors.push("specialistUsername");
    if (!newSpecialist.email) errors.push("specialistEmail");
    if (!newSpecialist.password) errors.push("specialistPassword");
    if (!newSpecialist.speciality) errors.push("specialistSpeciality");

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos destacados em vermelho",
        variant: "destructive"
      });
      return;
    }

    setValidationErrors([]);
    const specialistToSave = {
      ...newSpecialist,
      id: Date.now(),
      phone: newSpecialist.phone ? `${specialistCountryCode} ${newSpecialist.phone}` : ""
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

  const handleDeleteUser = (user: UserData) => {
    setDeleteConfirm({show: true, user});
  };

  const confirmDelete = () => {
    if (deleteConfirm.user) {
      setUsers(users.filter(u => u.id !== deleteConfirm.user!.id));
      toast({
        title: "Usuário removido",
        description: `${deleteConfirm.user.firstName} ${deleteConfirm.user.lastName} foi removido do sistema`,
      });
    }
    setDeleteConfirm({show: false, user: null});
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
    const user = users.find(u => u.id === userId);
    toast({
      title: "Status atualizado",
      description: `${user?.firstName} ${user?.lastName} ${user?.isActive ? 'desativado' : 'ativado'}`,
    });
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                  <Crown className="h-4 w-4" />
                  Especialistas ({users.filter(u => u.role === 'specialist').length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => setIsAddingSpecialist(true)}>
                  <Crown className="h-4 w-4 mr-2" />
                  Novo Especialista
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {users.filter(u => u.role === 'specialist').length === 0 ? (
                  <DropdownMenuItem disabled>
                    <User className="h-4 w-4 mr-2" />
                    Nenhum especialista cadastrado
                  </DropdownMenuItem>
                ) : (
                  users.filter(u => u.role === 'specialist').map(specialist => (
                    <DropdownMenuItem key={specialist.id}>
                      <User className="h-4 w-4 mr-2" />
                      {specialist.firstName} {specialist.lastName}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => setIsAddingUser(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </div>

        {/* Formulário de novo especialista */}
        {isAddingSpecialist && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Cadastrar Novo Especialista
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialistFirstName">Nome *</Label>
                  <Input
                    id="specialistFirstName"
                    value={newSpecialist.firstName}
                    onChange={(e) => setNewSpecialist({...newSpecialist, firstName: e.target.value})}
                    placeholder="Nome"
                    className={validationErrors.includes("specialistFirstName") ? "border-red-500 focus:border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="specialistLastName">Sobrenome *</Label>
                  <Input
                    id="specialistLastName"
                    value={newSpecialist.lastName}
                    onChange={(e) => setNewSpecialist({...newSpecialist, lastName: e.target.value})}
                    placeholder="Sobrenome"
                    className={validationErrors.includes("specialistLastName") ? "border-red-500 focus:border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="specialistUsername">Username *</Label>
                  <Input
                    id="specialistUsername"
                    value={newSpecialist.username}
                    onChange={(e) => setNewSpecialist({...newSpecialist, username: e.target.value})}
                    placeholder="username.especialista"
                    className={validationErrors.includes("specialistUsername") ? "border-red-500 focus:border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="specialistEmail">Email *</Label>
                  <Input
                    id="specialistEmail"
                    type="email"
                    value={newSpecialist.email}
                    onChange={(e) => setNewSpecialist({...newSpecialist, email: e.target.value})}
                    placeholder="email@metasyncdigital.com.br"
                    className={validationErrors.includes("specialistEmail") ? "border-red-500 focus:border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="specialistPassword">Senha *</Label>
                  <Input
                    id="specialistPassword"
                    type="password"
                    value={newSpecialist.password}
                    onChange={(e) => setNewSpecialist({...newSpecialist, password: e.target.value})}
                    placeholder="Senha segura"
                    className={validationErrors.includes("specialistPassword") ? "border-red-500 focus:border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="specialistPhone">Telefone *</Label>
                  <div className="flex gap-2">
                    <Select value={specialistCountryCode} onValueChange={setSpecialistCountryCode}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              {country.flag} {country.code}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="specialistPhone"
                      value={newSpecialist.phone}
                      onChange={(e) => {
                        const cleanNumber = e.target.value.replace(/[^\d]/g, '');
                        setNewSpecialist({...newSpecialist, phone: cleanNumber});
                      }}
                      placeholder="999999999"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formato final: {specialistCountryCode} {newSpecialist.phone}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="specialistSpeciality">Especialidade *</Label>
                <Input
                  id="specialistSpeciality"
                  value={newSpecialist.speciality}
                  onChange={(e) => setNewSpecialist({...newSpecialist, speciality: e.target.value})}
                  placeholder="Área de atuação do especialista"
                  className={validationErrors.includes("specialistSpeciality") ? "border-red-500 focus:border-red-500" : ""}
                />
              </div>

              <div>
                <Label htmlFor="specialistBio">Biografia</Label>
                <Textarea
                  id="specialistBio"
                  value={newSpecialist.bio}
                  onChange={(e) => setNewSpecialist({...newSpecialist, bio: e.target.value})}
                  placeholder="Descrição profissional do especialista"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveSpecialist} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Especialista
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingSpecialist(false);
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
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                    className={validationErrors.includes("firstName") ? "border-red-500 focus:border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    placeholder="Sobrenome"
                    className={validationErrors.includes("lastName") ? "border-red-500 focus:border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="username.unico"
                    className={validationErrors.includes("username") ? "border-red-500 focus:border-red-500" : ""}
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
                    className={validationErrors.includes("email") ? "border-red-500 focus:border-red-500" : ""}
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
                    className={validationErrors.includes("password") ? "border-red-500 focus:border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="flex gap-2">
                    <Select value={userCountryCode} onValueChange={setUserCountryCode}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              {country.flag} {country.code}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => {
                        // Remove caracteres não numéricos
                        const cleanNumber = e.target.value.replace(/[^\d]/g, '');
                        setNewUser({...newUser, phone: cleanNumber});
                      }}
                      placeholder="999999999"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formato final: {userCountryCode} {newUser.phone}
                  </p>
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
            {users.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Nenhum usuário cadastrado ainda.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Use os botões acima para adicionar usuários ao sistema.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {users
                  .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
                  .map((user) => (
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
                    <Button 
                      variant={user.isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleUserStatus(user.id!)}
                      className={user.isActive ? "bg-green-600 hover:bg-green-700" : "text-gray-600"}
                    >
                      {user.isActive ? "Ativo" : "Inativo"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      title="Configurações do usuário"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    {user.role !== "admin" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                        onClick={() => handleDeleteUser(user)}
                        title="Excluir usuário"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteConfirm.show} onOpenChange={(open) => !open && setDeleteConfirm({show: false, user: null})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{deleteConfirm.user?.firstName} {deleteConfirm.user?.lastName}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirm({show: false, user: null})}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}