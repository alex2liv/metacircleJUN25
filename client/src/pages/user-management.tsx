import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, Key, Mail, Trash2, Edit, Eye, EyeOff, UserCheck, UserX, Search, Filter } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: "admin" | "specialist" | "member";
  status: "active" | "inactive" | "pending";
  lastLogin?: Date;
  hasChangedPassword: boolean;
  createdAt: Date;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newPassword, setNewPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  // Carregar usuários do localStorage
  useEffect(() => {
    const importedEmails = JSON.parse(localStorage.getItem("importedEmails") || "[]");
    const loadedUsers: User[] = [
      {
        id: "1",
        email: "admin@metasyncdigital.com.br",
        role: "admin",
        status: "active",
        hasChangedPassword: true,
        createdAt: new Date("2025-01-01"),
        lastLogin: new Date()
      },
      {
        id: "2", 
        email: "clarissa@metasyncdigital.com.br",
        role: "specialist",
        status: "active", 
        hasChangedPassword: true,
        createdAt: new Date("2025-01-01"),
        lastLogin: new Date()
      },
      ...importedEmails.map((email: string, index: number) => ({
        id: `user_${index + 3}`,
        email,
        role: "member" as const,
        status: "pending" as const,
        hasChangedPassword: false,
        createdAt: new Date(),
      }))
    ];
    setUsers(loadedUsers);
  }, []);

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Reset de senha
  const handlePasswordReset = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newTempPassword = Math.random().toString(36).slice(-8);
    
    toast({
      title: "Senha redefinida",
      description: `Nova senha temporária para ${user.email}: ${newTempPassword}`,
    });

    // Atualizar usuário
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, hasChangedPassword: false }
        : u
    ));
  };

  // Alternar status do usuário
  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === "active" ? "inactive" : "active" }
        : u
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: "Status alterado",
      description: `Usuário ${user?.email} ${user?.status === "active" ? "desativado" : "ativado"}`,
    });
  };

  // Remover usuário
  const removeUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === "admin") {
      toast({
        title: "Operação negada",
        description: "Não é possível remover usuários administradores",
        variant: "destructive",
      });
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    toast({
      title: "Usuário removido",
      description: `${user?.email} foi removido do sistema`,
    });
  };

  // Alterar role do usuário
  const changeUserRole = (userId: string, newRole: "admin" | "specialist" | "member") => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, role: newRole }
        : u
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: "Função alterada",
      description: `${user?.email} agora é ${newRole}`,
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case "specialist":
        return <Badge className="bg-blue-100 text-blue-800">Especialista</Badge>;
      case "member":
        return <Badge className="bg-green-100 text-green-800">Membro</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-8 h-8" />
          Gestão de Usuários
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie todos os usuários do sistema com controle completo de acesso
        </p>
      </div>

      {/* Alertas de Segurança */}
      <Alert>
        <Shield className="w-4 h-4" />
        <AlertDescription>
          <strong>Sistema de Recuperação de Emergência Ativo:</strong> Chave mestra configurada para acesso de backdoor em situações críticas.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="backup">Backup de Acesso</TabsTrigger>
        </TabsList>

        {/* Lista de Usuários */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Usuários do Sistema</CardTitle>
              <CardDescription>
                Total: {users.length} usuários | Ativos: {users.filter(u => u.status === "active").length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar usuário</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Digite o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="role-filter">Função</Label>
                  <select
                    id="role-filter"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Todas</option>
                    <option value="admin">Admin</option>
                    <option value="specialist">Especialista</option>
                    <option value="member">Membro</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="pending">Pendente</option>
                  </select>
                </div>
              </div>

              {/* Tabela de Usuários */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Senha Alterada</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          {user.hasChangedPassword ? (
                            <Badge className="bg-green-100 text-green-800">Sim</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Não</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.lastLogin 
                            ? user.lastLogin.toLocaleDateString("pt-BR")
                            : "Nunca"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePasswordReset(user.id)}
                              disabled={user.role === "admin"}
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleUserStatus(user.id)}
                              disabled={user.role === "admin"}
                            >
                              {user.status === "active" ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeUser(user.id)}
                              disabled={user.role === "admin"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Políticas de Senha</CardTitle>
                <CardDescription>
                  Configure as regras de segurança para senhas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Senha Padrão para Novos Usuários</Label>
                    <Input value="123456" readOnly className="bg-gray-100" />
                    <p className="text-xs text-gray-500">
                      Usuários devem alterar na primeira conexão
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Validade da Senha (dias)</Label>
                    <Input type="number" placeholder="90" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="force-change" defaultChecked />
                  <Label htmlFor="force-change">
                    Forçar alteração da senha no primeiro login
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="two-factor" />
                  <Label htmlFor="two-factor">
                    Autenticação de dois fatores (em desenvolvimento)
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Email</CardTitle>
                <CardDescription>
                  Configure o sistema de recuperação por email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Mail className="w-4 h-4" />
                  <AlertDescription>
                    Para ativar a recuperação de senha por email, configure o SMTP nas configurações principais do sistema.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email de Recuperação Admin</Label>
                    <Input placeholder="admin@metasyncdigital.com.br" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Validade do Código (minutos)</Label>
                    <Input type="number" placeholder="15" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sistema de Backup de Acesso */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Sistema de Recuperação de Emergência
              </CardTitle>
              <CardDescription>
                Backdoor seguro para situações críticas onde o acesso admin foi perdido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  <strong>ATENÇÃO:</strong> Este sistema deve ser usado apenas em emergências. 
                  Todas as ações de backdoor são registradas e auditadas.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Chave Mestra Atual</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type={showPasswords ? "text" : "password"}
                      value="METASYNC_EMERGENCY_2025_MASTER_KEY"
                      readOnly 
                      className="bg-gray-100"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">Como usar o sistema de emergência:</h4>
                  <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                    <li>Acesse a página de login</li>
                    <li>Clique em "Acesso de Emergência" na aba Admin</li>
                    <li>Digite a chave mestra acima</li>
                    <li>Defina uma nova senha para o administrador</li>
                    <li>O sistema fará login automático como admin</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Label>Gerar Nova Chave Mestra</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Nova chave será gerada automaticamente" readOnly />
                    <Button variant="destructive">
                      Regenerar Chave
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Atenção: Regenerar a chave invalidará a chave atual
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Emails de Backup Administrativo</h4>
                <div className="space-y-2">
                  <Input 
                    placeholder="email-backup-1@metasyncdigital.com.br" 
                    defaultValue="admin@metasyncdigital.com.br"
                  />
                  <Input 
                    placeholder="email-backup-2@metasyncdigital.com.br"
                    defaultValue="suporte@metasyncdigital.com.br"
                  />
                  <p className="text-xs text-gray-500">
                    Estes emails receberão códigos de recuperação em emergências
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}