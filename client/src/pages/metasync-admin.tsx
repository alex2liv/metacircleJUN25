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
  Shield
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
      createdAt: new Date("2024-01-15")
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
      createdAt: new Date("2024-03-10")
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
      createdAt: new Date("2024-02-20")
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
    hasWhiteLabel: false
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
      hasWhiteLabel: false
    });
    setIsAddingCompany(false);
    toast({
      title: "Empresa adicionada",
      description: `${company.name} foi criada com sucesso`,
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
              <Button onClick={() => setIsAddingCompany(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
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
                      <div className="text-xs text-gray-500 mt-1">
                        {company.maxUsers} usuários • {company.maxSpecialists} especialistas
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                placeholder="Nome da empresa"
              />
            </div>
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