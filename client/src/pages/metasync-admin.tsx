import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Building2, 
  UserPlus,
  Settings,
  LogOut,
  Users,
  Edit,
  Trash2,
  Phone,
  Globe,
  Eye,
  EyeOff,
  Crown,
  Shield,
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Mail,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import metaSyncLogo from "@assets/logo completo metasync.png";
import metaSyncIcon from "@assets/icone_matasync.png";

interface CompanyData {
  id?: number;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  website?: string;
  planType: "basic" | "premium" | "enterprise";
  isActive: boolean;
  maxUsers: number;
  maxSpecialists: number;
  hasWhiteLabel: boolean;
  whiteLabelExpiresAt?: Date;
  subscriptionExpiresAt?: Date;
  createdAt?: Date;
  // Novos campos para pessoa jurídica/física
  clientType: "juridica" | "fisica";
  cnpj?: string;
  cpf?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  responsavel?: string;
  // Campos para controle de pagamento
  subscriptionStatus: "active" | "warning" | "suspended" | "cancelled";
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  warningsSent: number;
  suspensionReason?: string;
  monthlyFee: number;
}

export default function MetaSyncAdmin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyData | null>(null);
  const [showWhiteLabelModal, setShowWhiteLabelModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

  const [companies, setCompanies] = useState<CompanyData[]>([
    {
      id: 1,
      name: "MetaCircle",
      slug: "metacircle",
      email: "admin@metacircle.com.br",
      phone: "+55 11 99999-9999",
      website: "https://metacircle.com.br",
      planType: "premium",
      isActive: true,
      maxUsers: 248,
      maxSpecialists: 15,
      hasWhiteLabel: true,
      whiteLabelExpiresAt: new Date("2025-12-31"),
      subscriptionExpiresAt: new Date("2025-12-31"),
      createdAt: new Date("2024-01-15"),
      clientType: "juridica",
      cnpj: "12.345.678/0001-90",
      razaoSocial: "MetaCircle Tecnologia Ltda",
      nomeFantasia: "MetaCircle",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      responsavel: "João Silva",
      subscriptionStatus: "active",
      lastPaymentDate: new Date("2024-05-01"),
      nextPaymentDate: new Date("2024-06-01"),
      warningsSent: 0,
      monthlyFee: 299.90
    },
    {
      id: 2,
      name: "HealthCare Solutions",
      slug: "healthcare",
      email: "admin@healthcare.com.br",
      phone: "+55 21 88888-8888",
      planType: "basic",
      isActive: true,
      maxUsers: 50,
      maxSpecialists: 5,
      hasWhiteLabel: false,
      subscriptionExpiresAt: new Date("2025-06-30"),
      createdAt: new Date("2024-03-10"),
      clientType: "fisica",
      cpf: "123.456.789-00",
      endereco: "Av. Copacabana, 456",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22070-001",
      responsavel: "Maria Santos",
      subscriptionStatus: "warning",
      lastPaymentDate: new Date("2024-04-15"),
      nextPaymentDate: new Date("2024-05-15"),
      warningsSent: 2,
      monthlyFee: 299.90,
      suspensionReason: "Pagamento em atraso há 3 dias"
    },
    {
      id: 3,
      name: "StartupHub",
      slug: "startuphub",
      email: "admin@startuphub.com.br",
      planType: "enterprise",
      isActive: false,
      maxUsers: 200,
      maxSpecialists: 20,
      hasWhiteLabel: false,
      subscriptionExpiresAt: new Date("2025-08-15"),
      createdAt: new Date("2024-02-20"),
      clientType: "juridica",
      cnpj: "98.765.432/0001-10",
      razaoSocial: "StartupHub Inovação S.A.",
      nomeFantasia: "StartupHub",
      endereco: "Rua da Inovação, 789",
      cidade: "Belo Horizonte",
      estado: "MG",
      cep: "30112-000",
      responsavel: "Carlos Oliveira",
      subscriptionStatus: "suspended",
      lastPaymentDate: new Date("2024-03-01"),
      nextPaymentDate: new Date("2024-04-01"),
      warningsSent: 5,
      monthlyFee: 299.90,
      suspensionReason: "Inadimplência superior a 15 dias"
    }
  ]);

  const [newCompany, setNewCompany] = useState<CompanyData>({
    name: "",
    slug: "",
    email: "",
    planType: "basic",
    isActive: true,
    maxUsers: 50,
    maxSpecialists: 5,
    hasWhiteLabel: false,
    clientType: "juridica",
    cnpj: "",
    cpf: "",
    razaoSocial: "",
    nomeFantasia: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    responsavel: "",
    subscriptionStatus: "active",
    warningsSent: 0,
    monthlyFee: 299.90,
    lastPaymentDate: new Date(),
    nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
  });

  const activateWhiteLabel = (company: CompanyData) => {
    setSelectedCompany(company);
    setShowWhiteLabelModal(true);
  };

  const processWhiteLabelPayment = () => {
    if (!selectedCompany) return;

    setCompanies(companies.map(company => 
      company.id === selectedCompany.id 
        ? { 
            ...company, 
            hasWhiteLabel: true,
            whiteLabelExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          }
        : company
    ));
    
    setShowWhiteLabelModal(false);
    setSelectedCompany(null);
    
    toast({
      title: "White Label Ativado",
      description: `${selectedCompany.name} agora pode usar sua própria marca`,
    });
  };

  const deactivateWhiteLabel = (companyId: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { 
            ...company, 
            hasWhiteLabel: false,
            whiteLabelExpiresAt: undefined
          }
        : company
    ));
    
    const company = companies.find(c => c.id === companyId);
    toast({
      title: "White Label Desativado",
      description: `${company?.name} agora exibirá a marca MetaSync`,
    });
  };

  const toggleCompanyStatus = (companyId: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { ...company, isActive: !company.isActive }
        : company
    ));
  };

  const suspendCompany = (companyId: number, reason: string) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { 
            ...company, 
            subscriptionStatus: "suspended" as const,
            isActive: false,
            suspensionReason: reason
          }
        : company
    ));
    
    const company = companies.find(c => c.id === companyId);
    toast({
      title: "Empresa Suspensa",
      description: `${company?.name} foi suspensa por: ${reason}`,
      variant: "destructive"
    });
  };

  const reactivateCompany = (companyId: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { 
            ...company, 
            subscriptionStatus: "active" as const,
            isActive: true,
            suspensionReason: undefined,
            warningsSent: 0,
            lastPaymentDate: new Date(),
            nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
          }
        : company
    ));
    
    const company = companies.find(c => c.id === companyId);
    toast({
      title: "Empresa Reativada",
      description: `${company?.name} foi reativada com sucesso`,
    });
  };

  const sendPaymentWarning = (companyId: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { 
            ...company, 
            subscriptionStatus: "warning" as const,
            warningsSent: company.warningsSent + 1
          }
        : company
    ));
    
    const company = companies.find(c => c.id === companyId);
    toast({
      title: "Aviso Enviado",
      description: `Notificação de pagamento enviada para ${company?.name}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>;
      case "warning":
        return <Badge className="bg-yellow-600 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Aviso</Badge>;
      case "suspended":
        return <Badge className="bg-red-600 text-white"><Ban className="w-3 h-3 mr-1" />Suspenso</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-600 text-white"><Ban className="w-3 h-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getDaysUntilPayment = (nextPaymentDate?: Date) => {
    if (!nextPaymentDate) return null;
    const today = new Date();
    const diffTime = nextPaymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPlanBadgeColor = (planType: string) => {
    switch (planType) {
      case "basic":
        return "bg-blue-600 text-white";
      case "premium":
        return "bg-purple-600 text-white";
      case "enterprise":
        return "bg-orange-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case "basic":
        return "Básico";
      case "premium":
        return "Premium";
      case "enterprise":
        return "Enterprise";
      default:
        return "Desconhecido";
    }
  };

  const addCompany = () => {
    const company: CompanyData = {
      ...newCompany,
      id: Date.now()
    };
    setCompanies([...companies, company]);
    setNewCompany({
      name: "",
      slug: "",
      email: "",
      planType: "basic",
      isActive: true,
      maxUsers: 50,
      maxSpecialists: 5,
      hasWhiteLabel: false,
      clientType: "juridica",
      cnpj: "",
      cpf: "",
      razaoSocial: "",
      nomeFantasia: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      responsavel: "",
      subscriptionStatus: "active",
      warningsSent: 0,
      monthlyFee: 299.90,
      lastPaymentDate: new Date(),
      nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });
    setIsAddingCompany(false);
    toast({
      title: "Empresa adicionada",
      description: `${company.name} foi criada com sucesso`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <img src={metaSyncLogo} alt="MetaSync Digital" className="h-12" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-sm text-gray-600">
                Gestão de Empresas e Clientes
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2">
                <Users className="h-5 w-5" />
                <span>Admin MetaSync</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocation('/metasync-admin')}>
                <Settings className="h-4 w-4 mr-2" />
                Painel MetaSync
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation('/admin/users')}>
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Usuários
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
              <p className="text-xs text-muted-foreground">
                {companies.filter(c => c.isActive).length} ativas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">White Label</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.filter(c => c.hasWhiteLabel).length}</div>
              <p className="text-xs text-muted-foreground">
                R$ {companies.filter(c => c.hasWhiteLabel).length * 299.90}/mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {companies.reduce((acc, c) => acc + c.maxUsers, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Capacidade total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propaganda MetaSync</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.filter(c => !c.hasWhiteLabel).length}</div>
              <p className="text-xs text-muted-foreground">
                Empresas exibindo nossa marca
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Companies List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Empresas Cliente</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/company-management')}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Gerenciar BD
                </Button>
                <Button onClick={() => setIsAddingCompany(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={metaSyncIcon} alt={company.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        {company.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{company.name}</h3>
                        <Badge className={getPlanBadgeColor(company.planType)}>
                          {getPlanName(company.planType)}
                        </Badge>
                        {!company.isActive && (
                          <Badge variant="secondary">Inativa</Badge>
                        )}
                        {getStatusBadge(company.subscriptionStatus)}
                        {company.hasWhiteLabel ? (
                          <Badge className="bg-green-600 text-white">White Label</Badge>
                        ) : (
                          <Badge className="bg-blue-600 text-white">MetaSync Branding</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{company.email}</span>
                        {company.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {company.phone}
                          </span>
                        )}
                        {company.website && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Site
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        <div>
                          {company.clientType === "juridica" ? (
                            <span>CNPJ: {company.cnpj} • {company.razaoSocial}</span>
                          ) : (
                            <span>CPF: {company.cpf}</span>
                          )}
                        </div>
                        <div>
                          Responsável: {company.responsavel} • {company.maxUsers} usuários • {company.maxSpecialists} especialistas
                        </div>
                        <div className="flex items-center gap-4">
                          <span>R$ {company.monthlyFee.toFixed(2)}/mês</span>
                          {company.nextPaymentDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {(() => {
                                const days = getDaysUntilPayment(company.nextPaymentDate);
                                if (days === null) return "Data indefinida";
                                if (days < 0) return `${Math.abs(days)} dias em atraso`;
                                if (days === 0) return "Vence hoje";
                                return `${days} dias para vencimento`;
                              })()}
                            </span>
                          )}
                          {company.warningsSent > 0 && (
                            <span className="text-orange-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {company.warningsSent} avisos enviados
                            </span>
                          )}
                        </div>
                        {company.endereco && (
                          <div>
                            {company.endereco}, {company.cidade}/{company.estado} - {company.cep}
                          </div>
                        )}
                        {company.suspensionReason && (
                          <div className="text-red-600 font-medium">
                            Motivo da suspensão: {company.suspensionReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Acessando empresa",
                          description: `Redirecionando para painel da ${company.name}...`,
                        });
                        setLocation('/admin/users');
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Gerenciar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingCompany(company)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Dados
                        </DropdownMenuItem>
                        
                        {/* Controles de Pagamento */}
                        {company.subscriptionStatus === "active" && (
                          <DropdownMenuItem onClick={() => sendPaymentWarning(company.id!)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Aviso de Pagamento
                          </DropdownMenuItem>
                        )}
                        
                        {company.subscriptionStatus === "warning" && (
                          <DropdownMenuItem 
                            onClick={() => suspendCompany(company.id!, "Inadimplência - Pagamento em atraso")}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspender por Inadimplência
                          </DropdownMenuItem>
                        )}
                        
                        {company.subscriptionStatus === "suspended" && (
                          <DropdownMenuItem onClick={() => reactivateCompany(company.id!)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Reativar Serviços
                          </DropdownMenuItem>
                        )}
                        
                        {/* White Label */}
                        {company.hasWhiteLabel ? (
                          <DropdownMenuItem onClick={() => deactivateWhiteLabel(company.id!)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Desativar White Label
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => activateWhiteLabel(company)}>
                            <Crown className="h-4 w-4 mr-2" />
                            Ativar White Label (R$ 299,90/mês)
                          </DropdownMenuItem>
                        )}
                        
                        {/* Suspensão Manual */}
                        {company.subscriptionStatus !== "suspended" && (
                          <DropdownMenuItem 
                            onClick={() => suspendCompany(company.id!, "Suspensão administrativa")}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspender Manualmente
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem onClick={() => toggleCompanyStatus(company.id!)}>
                          {company.isActive ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Desativar Temporariamente
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Company Modal */}
      <Dialog open={isAddingCompany} onOpenChange={setIsAddingCompany}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Empresa Cliente</DialogTitle>
            <DialogDescription>
              Adicione uma nova empresa ao sistema MetaSync
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Tipo de Cliente */}
            <div className="space-y-2">
              <Label>Tipo de Cliente *</Label>
              <Select value={newCompany.clientType} onValueChange={(value: "juridica" | "fisica") => setNewCompany({...newCompany, clientType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="juridica">Pessoa Jurídica (CNPJ)</SelectItem>
                  <SelectItem value="fisica">Pessoa Física (CPF)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Documentos - CNPJ ou CPF */}
            {newCompany.clientType === "juridica" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={newCompany.cnpj}
                      onChange={(e) => setNewCompany({...newCompany, cnpj: e.target.value})}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                    <Input
                      id="inscricaoEstadual"
                      value={newCompany.inscricaoEstadual}
                      onChange={(e) => setNewCompany({...newCompany, inscricaoEstadual: e.target.value})}
                      placeholder="000.000.000.000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                    <Input
                      id="razaoSocial"
                      value={newCompany.razaoSocial}
                      onChange={(e) => setNewCompany({...newCompany, razaoSocial: e.target.value})}
                      placeholder="Empresa Ltda"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                    <Input
                      id="nomeFantasia"
                      value={newCompany.nomeFantasia}
                      onChange={(e) => setNewCompany({...newCompany, nomeFantasia: e.target.value})}
                      placeholder="Nome comercial"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={newCompany.cpf}
                  onChange={(e) => setNewCompany({...newCompany, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            )}

            {/* Dados da Empresa */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({...newCompany, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')})}
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={newCompany.slug}
                onChange={(e) => setNewCompany({...newCompany, slug: e.target.value})}
                placeholder="empresa-nome"
              />
              <p className="text-xs text-gray-500">URL será: metasync.com/company/{newCompany.slug}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável *</Label>
              <Input
                id="responsavel"
                value={newCompany.responsavel}
                onChange={(e) => setNewCompany({...newCompany, responsavel: e.target.value})}
                placeholder="Nome do responsável"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Principal *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                  placeholder="admin@empresa.com.br"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newCompany.phone}
                  onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                  placeholder="+55 11 99999-9999"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={newCompany.endereco}
                onChange={(e) => setNewCompany({...newCompany, endereco: e.target.value})}
                placeholder="Rua, Número, Complemento"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={newCompany.cidade}
                  onChange={(e) => setNewCompany({...newCompany, cidade: e.target.value})}
                  placeholder="São Paulo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={newCompany.estado}
                  onChange={(e) => setNewCompany({...newCompany, estado: e.target.value})}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={newCompany.cep}
                  onChange={(e) => setNewCompany({...newCompany, cep: e.target.value})}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
            </div>

            {/* Configurações do Plano */}
            <div className="space-y-2">
              <Label htmlFor="planType">Plano</Label>
              <Select value={newCompany.planType} onValueChange={(value: "basic" | "premium" | "enterprise") => setNewCompany({...newCompany, planType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Básico (até 50 usuários)</SelectItem>
                  <SelectItem value="premium">Premium (até 100 usuários)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (usuários ilimitados)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (opcional)</Label>
              <Input
                id="website"
                value={newCompany.website}
                onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                placeholder="https://empresa.com.br"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCompany(false)}>
              Cancelar
            </Button>
            <Button onClick={addCompany}>
              Criar Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* White Label Modal */}
      <Dialog open={showWhiteLabelModal} onOpenChange={setShowWhiteLabelModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Ativar White Label - {selectedCompany?.name}
            </DialogTitle>
            <DialogDescription>
              Configure o serviço de marca branca para remover a identidade MetaSync
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">White Label Premium</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>R$ 299,90/mês</strong></p>
                <p>✅ Remove 100% da marca MetaSync</p>
                <p>✅ Logo personalizado da empresa</p>
                <p>✅ Cores e tema customizados</p>
                <p>✅ Domínio próprio (opcional)</p>
                <p>✅ Emails com identidade da empresa</p>
                <p><strong>Cancelamento:</strong> A qualquer momento</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <img src={metaSyncLogo} alt="MetaSync Digital" className="h-8" />
                <span className="font-medium text-blue-800">Propaganda MetaSync (Gratuita)</span>
              </div>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>Empresas sem white-label exibem nossa marca em:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Rodapé de todas as páginas</li>
                  <li>Tela de login e cadastro</li>
                  <li>Emails automáticos do sistema</li>
                  <li>Notificações WhatsApp</li>
                  <li>Splash screen do app</li>
                </ul>
                <p className="mt-2 font-medium">
                  ✅ Isso gera <strong>milhares de visualizações mensais</strong> da marca MetaSync
                  através dos usuários da empresa cliente.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWhiteLabelModal(false)}>
              Cancelar
            </Button>
            <Button onClick={processWhiteLabelPayment} className="bg-green-600 hover:bg-green-700">
              <Crown className="h-4 w-4 mr-2" />
              Ativar White Label (R$ 299,90/mês)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}