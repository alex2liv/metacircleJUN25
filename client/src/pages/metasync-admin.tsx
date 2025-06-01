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
  Building2, 
  UserPlus,
  Settings,
  LogOut,
  Users,
  Save,
  Edit,
  Trash2,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  Calendar,
  Eye,
  EyeOff,
  Crown,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import metaSyncIcon from "@assets/icone_matasync.png";
import metaSyncLogo from "@assets/logo completo metasync.png";
import metaCircleIcon from "@assets/image_1748796101122.png";

interface CompanyData {
  id?: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  telegram?: string;
  facebook?: string;
  email: string;
  address?: string;
  planType: "basic" | "premium" | "enterprise";
  isActive: boolean;
  subscriptionExpiresAt?: Date;
  maxUsers: number;
  maxSpecialists: number;
  customDomain?: string;
  hasWhiteLabel: boolean;
  whiteLabelExpiresAt?: Date;
  brandingColors?: any;
  hideMetaSyncBranding: boolean;
  createdAt?: Date;
}

export default function MetaSyncAdmin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyData | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, company: CompanyData | null}>({show: false, company: null});
  const [showWhiteLabelModal, setShowWhiteLabelModal] = useState(false);
  const [showBrandingModal, setShowBrandingModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

  // Dados simulados das empresas
  const [companies, setCompanies] = useState<CompanyData[]>([
    {
      id: 1,
      name: "MetaCircle",
      slug: "metacircle",
      email: "admin@metacircle.com.br",
      phone: "+55 11 99999-9999",
      whatsapp: "+55 11 99999-9999",
      website: "https://metacircle.com.br",
      planType: "premium",
      isActive: true,
      maxUsers: 248,
      maxSpecialists: 15,
      hasWhiteLabel: true,
      whiteLabelExpiresAt: new Date("2025-12-31"),
      hideMetaSyncBranding: true,
      subscriptionExpiresAt: new Date("2025-12-31"),
      createdAt: new Date("2024-01-15")
    },
    {
      id: 2,
      name: "HealthCare Solutions",
      slug: "healthcare",
      email: "contato@healthcare.com.br",
      phone: "+55 21 88888-8888",
      planType: "enterprise",
      isActive: true,
      maxUsers: 500,
      maxSpecialists: 50,
      hasWhiteLabel: true,
      whiteLabelExpiresAt: new Date("2025-06-30"),
      hideMetaSyncBranding: true,
      subscriptionExpiresAt: new Date("2025-06-30"),
      createdAt: new Date("2024-02-20")
    },
    {
      id: 3,
      name: "StartupHub",
      slug: "startuphub",
      email: "admin@startuphub.com",
      planType: "basic",
      isActive: false,
      maxUsers: 25,
      maxSpecialists: 3,
      hasWhiteLabel: false,
      hideMetaSyncBranding: false,
      subscriptionExpiresAt: new Date("2024-12-01"),
      createdAt: new Date("2024-05-10")
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
    hideMetaSyncBranding: false
  });

  const adminInfo = {
    name: "MetaSync Admin",
    email: "admin@metasync.com.br",
    role: "Administrador do Sistema"
  };

  const handleLogout = () => {
    setLocation("/login");
  };

  const addCompany = () => {
    const errors = [];
    if (!newCompany.name) errors.push("name");
    if (!newCompany.slug) errors.push("slug");
    if (!newCompany.email) errors.push("email");

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos destacados em vermelho",
        variant: "destructive"
      });
      return;
    }

    const company: CompanyData = {
      ...newCompany,
      id: Date.now(),
      createdAt: new Date(),
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 ano
    };

    setCompanies([company, ...companies]);
    setNewCompany({
      name: "",
      slug: "",
      email: "",
      planType: "basic",
      isActive: true,
      maxUsers: 50,
      maxSpecialists: 5,
      hasWhiteLabel: false,
      hideMetaSyncBranding: false
    });
    setIsAddingCompany(false);
    setValidationErrors([]);

    toast({
      title: "Empresa criada",
      description: `${company.name} foi adicionada com sucesso`,
    });
  };

  const handleDeleteCompany = (company: CompanyData) => {
    setDeleteConfirm({show: true, company});
  };

  const confirmDelete = () => {
    if (!deleteConfirm.company) return;
    
    setCompanies(companies.filter(c => c.id !== deleteConfirm.company?.id));
    setDeleteConfirm({show: false, company: null});
    
    toast({
      title: "Empresa excluída",
      description: `${deleteConfirm.company.name} foi removida do sistema`,
    });
  };

  const toggleCompanyStatus = (companyId: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { ...company, isActive: !company.isActive }
        : company
    ));
    
    const company = companies.find(c => c.id === companyId);
    toast({
      title: company?.isActive ? "Empresa desativada" : "Empresa ativada",
      description: `${company?.name} foi ${company?.isActive ? "desativada" : "ativada"}`,
    });
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "basic": return "bg-gray-600 text-white";
      case "premium": return "bg-blue-600 text-white";
      case "enterprise": return "bg-purple-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "basic": return "Básico";
      case "premium": return "Premium";
      case "enterprise": return "Enterprise";
      default: return plan;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const isExpiringSoon = (date?: Date) => {
    if (!date) return false;
    const daysUntilExpiry = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const activateWhiteLabel = (company: CompanyData) => {
    setSelectedCompany(company);
    setShowWhiteLabelModal(true);
  };

  const deactivateWhiteLabel = (companyId: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { 
            ...company, 
            hasWhiteLabel: false, 
            whiteLabelExpiresAt: undefined,
            hideMetaSyncBranding: false 
          }
        : company
    ));
    
    const company = companies.find(c => c.id === companyId);
    toast({
      title: "White Label desativado",
      description: `${company?.name} voltará a exibir a marca MetaSync`,
    });
  };

  const processWhiteLabelPayment = () => {
    if (!selectedCompany) return;

    // Simular processamento de pagamento
    const updatedCompany = {
      ...selectedCompany,
      hasWhiteLabel: true,
      hideMetaSyncBranding: true,
      whiteLabelExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 ano
    };

    setCompanies(companies.map(c => 
      c.id === selectedCompany.id ? updatedCompany : c
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
            hideMetaSyncBranding: false,
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
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    MS
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
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Empresas</p>
                  <p className="text-2xl font-bold">{companies.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Empresas Ativas</p>
                  <p className="text-2xl font-bold">{companies.filter(c => c.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Crown className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Planos Premium+</p>
                  <p className="text-2xl font-bold">
                    {companies.filter(c => c.planType !== "basic").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Expirando em 30 dias</p>
                  <p className="text-2xl font-bold">
                    {companies.filter(c => c.subscriptionExpiresAt && isExpiringSoon(c.subscriptionExpiresAt)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Empresas Clientes</h2>
            <p className="text-gray-600">Gerencie suas empresas clientes e suas configurações</p>
          </div>
          <Button
            onClick={() => setIsAddingCompany(true)}
            className="flex items-center gap-2"
          >
            <Building2 className="h-4 w-4" />
            Nova Empresa
          </Button>
        </div>

        {/* Lista de empresas */}
        <Card>
          <CardContent className="p-6">
            {companies.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma empresa</h3>
                <p className="mt-1 text-sm text-gray-500">Comece criando sua primeira empresa cliente.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {companies
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((company) => (
                <div key={company.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {company.name === "MetaCircle" ? (
                        <AvatarImage src={metaCircleIcon} alt="MetaCircle" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                          {company.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      )}
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
                        {company.hasWhiteLabel ? (
                          <Badge className="bg-green-600 text-white">White Label</Badge>
                        ) : (
                          <Badge className="bg-blue-600 text-white">MetaSync Branding</Badge>
                        )}
                        {company.subscriptionExpiresAt && isExpiringSoon(company.subscriptionExpiresAt) && (
                          <Badge className="bg-orange-600 text-white">Expirando</Badge>
                        )}
                        {company.whiteLabelExpiresAt && isExpiringSoon(company.whiteLabelExpiresAt) && (
                          <Badge className="bg-red-600 text-white">White Label Expirando</Badge>
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
                      <div className="text-xs text-gray-500 mt-1">
                        {company.maxUsers} usuários • {company.maxSpecialists} especialistas
                        {company.subscriptionExpiresAt && (
                          <span> • Expira em {formatDate(company.subscriptionExpiresAt)}</span>
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
                        // Simula redirecionamento para o painel da empresa
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
                          Editar
                        </DropdownMenuItem>
                        {company.hasWhiteLabel ? (
                          <DropdownMenuItem onClick={() => deactivateWhiteLabel(company.id!)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Desativar White Label
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => activateWhiteLabel(company)}>
                            <Crown className="h-4 w-4 mr-2" />
                            Ativar White Label
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => toggleCompanyStatus(company.id!)}>
                          {company.isActive ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteCompany(company)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Nova Empresa */}
      <Dialog open={isAddingCompany} onOpenChange={setIsAddingCompany}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Empresa Cliente</DialogTitle>
            <DialogDescription>
              Adicione uma nova empresa ao sistema MetaSync
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                value={newCompany.name}
                onChange={(e) => {
                  setNewCompany({...newCompany, name: e.target.value});
                  // Auto-gerar slug
                  const slug = e.target.value.toLowerCase()
                    .replace(/[^a-z0-9\s]/g, '')
                    .replace(/\s+/g, '-')
                    .trim();
                  setNewCompany(prev => ({...prev, slug}));
                }}
                className={validationErrors.includes("name") ? "border-red-500" : ""}
                placeholder="TechCorp Consultoria"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL/Slug *</Label>
              <Input
                id="slug"
                value={newCompany.slug}
                onChange={(e) => setNewCompany({...newCompany, slug: e.target.value})}
                className={validationErrors.includes("slug") ? "border-red-500" : ""}
                placeholder="techcorp"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Principal *</Label>
              <Input
                id="email"
                type="email"
                value={newCompany.email}
                onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                className={validationErrors.includes("email") ? "border-red-500" : ""}
                placeholder="admin@empresa.com.br"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newCompany.phone || ""}
                onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                placeholder="+55 11 99999-9999"
              />
            </div>
            
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
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={newCompany.website || ""}
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

      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteConfirm.show} onOpenChange={(open) => !open && setDeleteConfirm({show: false, company: null})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a empresa <strong>{deleteConfirm.company?.name}</strong>?
              Esta ação não pode ser desfeita e todos os dados da empresa serão perdidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirm({show: false, company: null})}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Excluir Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ativação White Label */}
      <Dialog open={showWhiteLabelModal} onOpenChange={setShowWhiteLabelModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Ativar White Label
            </DialogTitle>
            <DialogDescription>
              Permita que {selectedCompany?.name} use sua própria marca
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
              <h3 className="font-medium text-lg mb-2">Plano White Label</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span>Logo personalizada da empresa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Remoção completa da marca MetaSync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span>Cores e temas personalizados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-600" />
                  <span>Domínio personalizado opcional</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Informações do Plano</span>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Valor:</strong> R$ 299,90/mês</p>
                <p><strong>Duração:</strong> 12 meses</p>
                <p><strong>Renovação:</strong> Automática</p>
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

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Com White Label</span>
              </div>
              <p className="text-sm text-green-700">
                A empresa usa 100% sua própria marca. Nenhuma referência ao MetaSync
                será exibida para os usuários finais. Experiência totalmente personalizada.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowWhiteLabelModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={processWhiteLabelPayment}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
            >
              <Crown className="h-4 w-4 mr-2" />
              Processar Pagamento - R$ 299,90
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}