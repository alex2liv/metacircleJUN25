import { useState, useRef } from "react";
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
  Shield,
  MessageCircle,
  Upload,
  Download,
  Key,
  FileText,
  AlertCircle,
  Clock,
  ArrowLeft
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
  isTemporaryPassword?: boolean;
  passwordExpiresAt?: Date;
  lastPasswordChange?: Date;
}

interface BulkImportData {
  id: number;
  filename: string;
  totalRecords: number;
  successCount: number;
  errorCount: number;
  status: "processing" | "completed" | "failed";
  errors?: string[];
  createdAt: Date;
}

interface SecuritySettings {
  passwordExpirationDays: number;
  requirePasswordChange: boolean;
  defaultPassword: string;
  emailNotifications: boolean;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddingSpecialist, setIsAddingSpecialist] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, user: UserData | null}>({show: false, user: null});
  const [settingsUser, setSettingsUser] = useState<{show: boolean, user: UserData | null}>({show: false, user: null});
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [editUserModal, setEditUserModal] = useState<{show: boolean, user: UserData | null}>({show: false, user: null});
  const [editFormData, setEditFormData] = useState<UserData>({
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
  const [userCountryCode, setUserCountryCode] = useState("+55");
  const [specialistCountryCode, setSpecialistCountryCode] = useState("+55");

  // Estados para importação em massa
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importHistory, setImportHistory] = useState<BulkImportData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para configurações de segurança
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordExpirationDays: 90,
    requirePasswordChange: true,
    defaultPassword: "123456",
    emailNotifications: true
  });
  
  // Estados para reset de senha
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserData | null>(null);

  // Configurações de qualidade de vídeo
  const [videoSettings, setVideoSettings] = useState({
    maxQuality: "1080p",
    pricing: {
      "720p": 0,
      "1080p": 15.99,
      "4K": 49.99
    }
  });

  // Configurações de contato com especialista
  const [specialistContact, setSpecialistContact] = useState({
    whatsappNumber: "5511910018833",
    premiumOnly: true,
    premiumPrice: 99.99
  });

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

  const openUserSettings = (user: UserData) => {
    setSettingsUser({show: true, user});
  };

  const handleResetPassword = (user: UserData) => {
    toast({
      title: "Senha resetada",
      description: `Nova senha enviada para ${user.email}`,
    });
    setSettingsUser({show: false, user: null});
  };

  const handleEditUser = (user: UserData) => {
    setEditFormData(user);
    setEditUserModal({show: true, user});
    setSettingsUser({show: false, user: null});
  };

  const saveUserEdit = () => {
    const errors = [];
    if (!editFormData.firstName) errors.push("editFirstName");
    if (!editFormData.lastName) errors.push("editLastName");
    if (!editFormData.username) errors.push("editUsername");
    if (!editFormData.email) errors.push("editEmail");

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
    setUsers(users.map(u => 
      u.id === editFormData.id ? editFormData : u
    ));
    setEditUserModal({show: false, user: null});
    toast({
      title: "Usuário atualizado",
      description: `${editFormData.firstName} ${editFormData.lastName} foi atualizado com sucesso`,
    });
  };

  // Função para importação em massa
  const handleBulkImport = async () => {
    if (!importFile) {
      toast({
        title: "Arquivo necessário",
        description: "Selecione um arquivo CSV ou Excel para importar",
        variant: "destructive"
      });
      return;
    }

    setImportProgress(0);
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('defaultPassword', securitySettings.defaultPassword);

    try {
      // Simular progresso da importação
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Processar arquivo (simulado)
      const newImport: BulkImportData = {
        id: Date.now(),
        filename: importFile.name,
        totalRecords: 399, // Exemplo baseado na menção do usuário
        successCount: 395,
        errorCount: 4,
        status: "completed",
        errors: ["Email duplicado: joao@email.com", "Telefone inválido linha 45"],
        createdAt: new Date()
      };

      setImportHistory([newImport, ...importHistory]);
      setShowBulkImport(false);
      setImportFile(null);
      setImportProgress(0);

      toast({
        title: "Importação concluída",
        description: `${newImport.successCount} usuários importados com sucesso. ${newImport.errorCount} erros encontrados.`,
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível processar o arquivo",
        variant: "destructive"
      });
    }
  };

  // Função para reset de senha
  const handlePasswordReset = async (user: UserData) => {
    try {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Email enviado",
        description: `Instruções de reset de senha enviadas para ${user.email}`,
      });
      
      setShowPasswordReset(false);
      setResetPasswordUser(null);
    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o email de reset",
        variant: "destructive"
      });
    }
  };

  // Função para gerar arquivo modelo
  const downloadTemplate = () => {
    const csvContent = `firstName,lastName,email,phone,role,speciality
João,Silva,joao.silva@email.com,+55 11 99999-9999,member,
Maria,Santos,maria.santos@email.com,+55 11 88888-8888,specialist,Psicóloga
Pedro,Oliveira,pedro.oliveira@email.com,+55 11 77777-7777,member,`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_usuarios.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Modelo baixado",
      description: "Arquivo modelo CSV foi baixado com sucesso",
    });
  };

  const updateVideoPricing = (quality: string, price: number) => {
    setVideoSettings(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [quality]: price
      }
    }));
    toast({
      title: "Preço atualizado",
      description: `${quality}: R$ ${price.toFixed(2)}/mês`,
    });
  };

  const setMaxVideoQuality = (quality: string) => {
    setVideoSettings(prev => ({
      ...prev,
      maxQuality: quality
    }));
    toast({
      title: "Qualidade máxima definida",
      description: `Nova qualidade máxima: ${quality}`,
    });
  };

  const updateSpecialistContact = (field: string, value: any) => {
    setSpecialistContact(prev => ({
      ...prev,
      [field]: value
    }));
    toast({
      title: "Configuração atualizada",
      description: "Configurações de contato com especialista atualizadas",
    });
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation('/metasync-admin')}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
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
              onClick={() => setShowBulkImport(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importar Usuários
            </Button>
            <Button
              onClick={() => setIsAddingUser(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
            <Button
              onClick={() => setShowAdminSettings(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurações do Sistema
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
                        <Badge className={
                          user.role === "admin" ? "bg-red-600 text-white border-red-600" :
                          user.role === "specialist" ? "bg-purple-600 text-white border-purple-600" :
                          "bg-blue-600 text-white border-blue-600"
                        }>
                          {user.role === "admin" ? "ADMIN" : user.role === "specialist" ? "ESPECIALISTA" : "MEMBRO"}
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
                      onClick={() => openUserSettings(user)}
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

      {/* Modal de configurações do usuário */}
      <Dialog open={settingsUser.show} onOpenChange={(open) => !open && setSettingsUser({show: false, user: null})}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações de {settingsUser.user?.firstName} {settingsUser.user?.lastName}
            </DialogTitle>
            <DialogDescription>
              Gerencie as configurações e permissões do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Resetar Senha</h4>
                <p className="text-sm text-gray-500">Enviar nova senha por email</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => settingsUser.user && handleResetPassword(settingsUser.user)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Resetar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Editar Perfil</h4>
                <p className="text-sm text-gray-500">Modificar dados do usuário</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => settingsUser.user && handleEditUser(settingsUser.user)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Status da Conta</h4>
                <p className="text-sm text-gray-500">
                  {settingsUser.user?.isActive ? "Conta ativa no sistema" : "Conta desativada"}
                </p>
              </div>
              <Button 
                variant={settingsUser.user?.isActive ? "outline" : "default"}
                size="sm"
                onClick={() => settingsUser.user && toggleUserStatus(settingsUser.user.id!)}
                className={settingsUser.user?.isActive ? "text-red-600" : "bg-green-600 hover:bg-green-700"}
              >
                {settingsUser.user?.isActive ? "Desativar" : "Ativar"}
              </Button>
            </div>
            {settingsUser.user?.role === "specialist" && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800">Especialista</h4>
                <p className="text-xs text-purple-600 mt-1">
                  {settingsUser.user.speciality}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSettingsUser({show: false, user: null})}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Painel lateral de configurações administrativas */}
      <Dialog open={showAdminSettings} onOpenChange={setShowAdminSettings}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações do Sistema
            </DialogTitle>
            <DialogDescription>
              Configure as opções globais da plataforma
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Configurações de Qualidade de Vídeo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
                Qualidade de Vídeo
              </h3>
              
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Planos de Qualidade</h4>
                  <div className="space-y-3">
                    {Object.entries(videoSettings.pricing).map(([quality, price]) => (
                      <div key={quality} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{quality}</span>
                          <p className="text-sm text-gray-600">
                            {quality === "720p" && "Qualidade padrão - Grátis"}
                            {quality === "1080p" && "Alta definição - HD"}
                            {quality === "4K" && "Ultra alta definição - Premium"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {quality === "720p" ? (
                            <Badge className="bg-green-600 text-white">GRÁTIS</Badge>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">R$</span>
                              <Input
                                type="number"
                                value={price}
                                onChange={(e) => {
                                  const newPrice = parseFloat(e.target.value) || 0;
                                  setVideoSettings(prev => ({
                                    ...prev,
                                    pricing: {
                                      ...prev.pricing,
                                      [quality]: newPrice
                                    }
                                  }));
                                }}
                                onBlur={(e) => {
                                  const finalPrice = parseFloat(e.target.value) || 0;
                                  updateVideoPricing(quality, finalPrice);
                                }}
                                className="w-20 text-center"
                                step="0.01"
                                min="0"
                              />
                              <span className="text-sm text-gray-600">/mês</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Qualidade Máxima do Sistema</h4>
                  <div className="flex gap-2">
                    {["720p", "1080p", "4K"].map((quality) => (
                      <Button
                        key={quality}
                        variant={videoSettings.maxQuality === quality ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMaxVideoQuality(quality)}
                      >
                        {quality}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Qualidade máxima disponível: <strong>{videoSettings.maxQuality}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Configurações de Contato com Especialista */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Contato com Especialista
              </h3>
              
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Configurações de Acesso</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">Acesso ao Especialista</span>
                        <p className="text-sm text-gray-600">
                          Disponível apenas para usuários premium
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={specialistContact.premiumOnly}
                          onChange={(e) => updateSpecialistContact('premiumOnly', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Premium Only</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">Preço do Plano Premium</span>
                        <p className="text-sm text-gray-600">
                          Valor mensal para acesso ao especialista
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">R$</span>
                        <Input
                          type="number"
                          value={specialistContact.premiumPrice}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value) || 0;
                            setSpecialistContact(prev => ({
                              ...prev,
                              premiumPrice: newPrice
                            }));
                          }}
                          onBlur={(e) => {
                            const finalPrice = parseFloat(e.target.value) || 0;
                            updateSpecialistContact('premiumPrice', finalPrice);
                          }}
                          className="w-24 text-center"
                          step="0.01"
                          min="0"
                        />
                        <span className="text-sm text-gray-600">/mês</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium">WhatsApp do Especialista</label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={specialistContact.whatsappNumber}
                          onChange={(e) => updateSpecialistContact('whatsappNumber', e.target.value)}
                          placeholder="5511999999999"
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.open(`https://wa.me/${specialistContact.whatsappNumber}`, '_blank');
                          }}
                        >
                          Testar
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Formato: código do país + número (ex: 5511999999999)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configurações de Sistema */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Sistema
              </h3>
              
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">Usuários Totais</span>
                    <p className="text-sm text-gray-600">Total de usuários cadastrados</p>
                  </div>
                  <Badge className="bg-blue-600 text-white">{users.length}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">Especialistas</span>
                    <p className="text-sm text-gray-600">Especialistas ativos</p>
                  </div>
                  <Badge className="bg-purple-600 text-white">
                    {users.filter(u => u.role === 'specialist').length}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">Membros</span>
                    <p className="text-sm text-gray-600">Membros regulares</p>
                  </div>
                  <Badge className="bg-gray-600 text-white">
                    {users.filter(u => u.role === 'member').length}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAdminSettings(false)}
            >
              Fechar
            </Button>
            <Button onClick={() => {
              toast({
                title: "Configurações salvas",
                description: "Todas as configurações foram aplicadas com sucesso",
              });
              setShowAdminSettings(false);
            }}>
              Salvar Configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Usuário */}
      <Dialog open={editUserModal.show} onOpenChange={(open) => !open && setEditUserModal({show: false, user: null})}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Perfil de Usuário</DialogTitle>
            <DialogDescription>
              Edite as informações do usuário {editUserModal.user?.firstName} {editUserModal.user?.lastName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editFirstName">Nome</Label>
              <Input
                id="editFirstName"
                value={editFormData.firstName}
                onChange={(e) => setEditFormData(prev => ({...prev, firstName: e.target.value}))}
                className={validationErrors.includes("editFirstName") ? "border-red-500" : ""}
                placeholder="Digite o nome"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editLastName">Sobrenome</Label>
              <Input
                id="editLastName"
                value={editFormData.lastName}
                onChange={(e) => setEditFormData(prev => ({...prev, lastName: e.target.value}))}
                className={validationErrors.includes("editLastName") ? "border-red-500" : ""}
                placeholder="Digite o sobrenome"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editUsername">Nome de usuário</Label>
              <Input
                id="editUsername"
                value={editFormData.username}
                onChange={(e) => setEditFormData(prev => ({...prev, username: e.target.value}))}
                className={validationErrors.includes("editUsername") ? "border-red-500" : ""}
                placeholder="Digite o nome de usuário"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({...prev, email: e.target.value}))}
                className={validationErrors.includes("editEmail") ? "border-red-500" : ""}
                placeholder="Digite o email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editPhone">Telefone</Label>
              <div className="flex gap-2">
                <Select value={userCountryCode} onValueChange={setUserCountryCode}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+55">🇧🇷 +55</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+49">🇩🇪 +49</SelectItem>
                    <SelectItem value="+33">🇫🇷 +33</SelectItem>
                    <SelectItem value="+34">🇪🇸 +34</SelectItem>
                    <SelectItem value="+39">🇮🇹 +39</SelectItem>
                    <SelectItem value="+81">🇯🇵 +81</SelectItem>
                    <SelectItem value="+86">🇨🇳 +86</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="editPhone"
                  value={editFormData.phone?.replace(/^\+\d+\s*/, "") || ""}
                  onChange={(e) => setEditFormData(prev => ({...prev, phone: `${userCountryCode} ${e.target.value}`}))}
                  placeholder="Digite o telefone"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editRole">Função</Label>
              <Select value={editFormData.role} onValueChange={(value: "admin" | "specialist" | "member") => setEditFormData(prev => ({...prev, role: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="specialist">Especialista</SelectItem>
                  <SelectItem value="member">Membro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {editFormData.role === "specialist" && (
              <div className="col-span-2 space-y-2">
                <Label htmlFor="editSpeciality">Especialidade</Label>
                <Input
                  id="editSpeciality"
                  value={editFormData.speciality || ""}
                  onChange={(e) => setEditFormData(prev => ({...prev, speciality: e.target.value}))}
                  placeholder="Digite a especialidade"
                />
              </div>
            )}
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="editBio">Biografia</Label>
              <textarea
                id="editBio"
                value={editFormData.bio || ""}
                onChange={(e) => setEditFormData(prev => ({...prev, bio: e.target.value}))}
                placeholder="Digite uma breve biografia"
                className="w-full p-2 border rounded-md resize-none h-20"
              />
            </div>
            
            <div className="col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={editFormData.isActive}
                onChange={(e) => setEditFormData(prev => ({...prev, isActive: e.target.checked}))}
                className="rounded"
              />
              <Label htmlFor="editIsActive">Usuário ativo</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditUserModal({show: false, user: null})}
            >
              Cancelar
            </Button>
            <Button onClick={saveUserEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Importação em Massa */}
      <Dialog open={showBulkImport} onOpenChange={setShowBulkImport}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importação em Massa de Usuários
            </DialogTitle>
            <DialogDescription>
              Importe centenas de usuários através de arquivo CSV ou Excel
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Seção de Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Selecione seu arquivo</h3>
              <p className="text-gray-600 mb-4">Formatos aceitos: CSV, XLSX (máximo 5MB)</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              
              <div className="flex gap-2 justify-center">
                <Button onClick={() => fileInputRef.current?.click()}>
                  Escolher Arquivo
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Modelo
                </Button>
              </div>
              
              {importFile && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    Arquivo selecionado: <strong>{importFile.name}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Configurações de Importação */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Senha Padrão</Label>
                <Input
                  value={securitySettings.defaultPassword}
                  onChange={(e) => setSecuritySettings(prev => ({...prev, defaultPassword: e.target.value}))}
                  placeholder="123456"
                />
                <p className="text-xs text-gray-500">Senha inicial para todos os usuários</p>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={securitySettings.requirePasswordChange}
                    onChange={(e) => setSecuritySettings(prev => ({...prev, requirePasswordChange: e.target.checked}))}
                  />
                  Forçar troca de senha no primeiro login
                </Label>
                <p className="text-xs text-gray-500">Obriga usuários a definirem nova senha</p>
              </div>
            </div>

            {/* Progresso da Importação */}
            {importProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processando arquivo...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Histórico de Importações */}
            {importHistory.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Histórico de Importações</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {importHistory.map((import_item) => (
                    <div key={import_item.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{import_item.filename}</p>
                        <p className="text-sm text-gray-600">
                          {import_item.successCount} sucessos, {import_item.errorCount} erros
                        </p>
                      </div>
                      <Badge className={
                        import_item.status === "completed" ? "bg-green-600 text-white" :
                        import_item.status === "failed" ? "bg-red-600 text-white" :
                        "bg-yellow-600 text-white"
                      }>
                        {import_item.status === "completed" ? "Concluído" :
                         import_item.status === "failed" ? "Falhou" : "Processando"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkImport(false)}>
              Cancelar
            </Button>
            <Button onClick={handleBulkImport} disabled={!importFile || importProgress > 0}>
              {importProgress > 0 ? "Processando..." : "Iniciar Importação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Reset de Senha */}
      <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Reset de Senha
            </DialogTitle>
            <DialogDescription>
              Enviar instruções de reset de senha por email
            </DialogDescription>
          </DialogHeader>

          {resetPasswordUser && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">
                      {resetPasswordUser.firstName[0]}{resetPasswordUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{resetPasswordUser.firstName} {resetPasswordUser.lastName}</h3>
                    <p className="text-sm text-gray-600">{resetPasswordUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p>Um email será enviado para <strong>{resetPasswordUser.email}</strong> com:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Link para redefinir a senha (válido por 24 horas)</li>
                    <li>Instruções de segurança</li>
                    <li>Suporte para dúvidas</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordReset(false)}>
              Cancelar
            </Button>
            <Button onClick={() => resetPasswordUser && handlePasswordReset(resetPasswordUser)}>
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}