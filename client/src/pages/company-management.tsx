import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Database, Settings, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Company {
  id: number;
  name: string;
  slug: string;
  planType: string;
  databaseType: string;
  isActive: boolean;
  createdAt: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceKey?: string;
  connectionStatus?: 'connected' | 'error' | 'testing' | 'unknown';
}

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    slug: "",
    planType: "basic",
    databaseType: "postgresql",
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseServiceKey: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load companies when component mounts
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/companies");
      const data = await response.json();
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
      // For demo, use some sample data
      setCompanies([
        {
          id: 1,
          name: "Empresa Demo",
          slug: "empresa-demo",
          planType: "premium",
          databaseType: "supabase",
          isActive: true,
          createdAt: new Date().toISOString(),
          supabaseUrl: "",
          supabaseAnonKey: "",
          supabaseServiceKey: "",
          connectionStatus: 'unknown'
        }
      ]);
    }
  };

  const createCompany = async () => {
    try {
      const response = await apiRequest("POST", "/api/admin/companies", newCompany);
      const company = await response.json();
      
      setCompanies([...companies, company]);
      setNewCompany({
        name: "",
        slug: "",
        planType: "basic",
        databaseType: "postgresql",
        supabaseUrl: "",
        supabaseAnonKey: "",
        supabaseServiceKey: ""
      });
      
      toast({
        title: "Empresa criada",
        description: "Nova empresa cliente foi criada com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar empresa cliente.",
        variant: "destructive"
      });
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const testSupabaseConnection = async (company: Company) => {
    if (!company.supabaseUrl || !company.supabaseAnonKey || !company.supabaseServiceKey) {
      toast({
        title: "Credenciais Incompletas",
        description: "Por favor, configure todas as credenciais do Supabase primeiro.",
        variant: "destructive",
      });
      return;
    }

    // Update status to testing
    setCompanies(prev => prev.map(c => 
      c.id === company.id 
        ? { ...c, connectionStatus: 'testing' }
        : c
    ));

    try {
      const response = await apiRequest("POST", "/api/admin/companies/test-supabase", {
        supabaseUrl: company.supabaseUrl,
        supabaseAnonKey: company.supabaseAnonKey,
        supabaseServiceKey: company.supabaseServiceKey
      });

      const result = await response.json();

      if (result.success) {
        setCompanies(prev => prev.map(c => 
          c.id === company.id 
            ? { ...c, connectionStatus: 'connected' }
            : c
        ));
        
        toast({
          title: "Conexão Bem-sucedida!",
          description: "As credenciais do Supabase estão funcionando corretamente.",
        });
      } else {
        setCompanies(prev => prev.map(c => 
          c.id === company.id 
            ? { ...c, connectionStatus: 'error' }
            : c
        ));
        
        toast({
          title: "Erro de Conexão",
          description: result.error || "Não foi possível conectar ao Supabase.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setCompanies(prev => prev.map(c => 
        c.id === company.id 
          ? { ...c, connectionStatus: 'error' }
          : c
      ));
      
      toast({
        title: "Erro de Teste",
        description: "Erro ao testar conexão com Supabase.",
        variant: "destructive",
      });
    }
  };

  const updateCompanyCredentials = async (companyId: number, credentials: { supabaseUrl: string; supabaseAnonKey: string; supabaseServiceKey: string }) => {
    try {
      const response = await apiRequest("PUT", `/api/admin/companies/${companyId}`, credentials);
      const updatedCompany = await response.json();
      
      setCompanies(prev => prev.map(c => 
        c.id === companyId 
          ? { ...c, ...updatedCompany }
          : c
      ));
      
      toast({
        title: "Credenciais Atualizadas",
        description: "As credenciais do Supabase foram salvas com sucesso.",
      });
      
      setIsConfiguring(false);
      setSelectedCompany(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar credenciais.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gerenciamento de Empresas</h1>
        <p className="text-gray-600 mt-2">
          Gerencie empresas clientes e suas configurações de banco de dados
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">
            <Plus className="w-4 h-4 mr-2" />
            Nova Empresa
          </TabsTrigger>
          <TabsTrigger value="list">
            <Building2 className="w-4 h-4 mr-2" />
            Empresas Ativas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Empresa Cliente</CardTitle>
              <CardDescription>
                Configure uma nova empresa com suas preferências de banco de dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input
                    id="name"
                    value={newCompany.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setNewCompany({
                        ...newCompany,
                        name,
                        slug: generateSlug(name)
                      });
                    }}
                    placeholder="Ex: Clínica Dr. Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug/URL</Label>
                  <Input
                    id="slug"
                    value={newCompany.slug}
                    onChange={(e) => setNewCompany({...newCompany, slug: e.target.value})}
                    placeholder="clinica-dr-silva"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="planType">Tipo de Plano</Label>
                  <Select 
                    value={newCompany.planType} 
                    onValueChange={(value) => setNewCompany({...newCompany, planType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="databaseType">Tipo de Banco de Dados</Label>
                  <Select 
                    value={newCompany.databaseType} 
                    onValueChange={(value) => setNewCompany({...newCompany, databaseType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgresql">PostgreSQL (Padrão)</SelectItem>
                      <SelectItem value="supabase">Supabase (Cliente)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newCompany.databaseType === "supabase" && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Configurações do Supabase
                    </CardTitle>
                    <CardDescription className="text-orange-700">
                      O cliente deve fornecer as credenciais do seu projeto Supabase
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="supabaseUrl">URL do Supabase</Label>
                      <Input
                        id="supabaseUrl"
                        value={newCompany.supabaseUrl}
                        onChange={(e) => setNewCompany({...newCompany, supabaseUrl: e.target.value})}
                        placeholder="https://xxxxx.supabase.co"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supabaseAnonKey">Chave Pública (anon)</Label>
                      <Input
                        id="supabaseAnonKey"
                        value={newCompany.supabaseAnonKey}
                        onChange={(e) => setNewCompany({...newCompany, supabaseAnonKey: e.target.value})}
                        placeholder="eyJhbGciOiJIUzI1NiIsI..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="supabaseServiceKey">Chave de Serviço</Label>
                      <Input
                        id="supabaseServiceKey"
                        type="password"
                        value={newCompany.supabaseServiceKey}
                        onChange={(e) => setNewCompany({...newCompany, supabaseServiceKey: e.target.value})}
                        placeholder="eyJhbGciOiJIUzI1NiIsI..."
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button onClick={createCompany} className="w-full">
                Criar Empresa Cliente
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Empresas Ativas</CardTitle>
              <CardDescription>
                Lista de todas as empresas clientes cadastradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {companies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma empresa cadastrada ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {companies.map((company) => (
                    <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{company.name}</h3>
                          {company.databaseType === 'supabase' && (
                            <Badge variant={
                              company.connectionStatus === 'connected' ? 'default' : 
                              company.connectionStatus === 'error' ? 'destructive' :
                              company.connectionStatus === 'testing' ? 'secondary' : 'outline'
                            }>
                              {company.connectionStatus === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {company.connectionStatus === 'error' && <XCircle className="w-3 h-3 mr-1" />}
                              {company.connectionStatus === 'testing' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {company.connectionStatus === 'connected' ? 'Conectado' :
                               company.connectionStatus === 'error' ? 'Erro' :
                               company.connectionStatus === 'testing' ? 'Testando...' : 'Não configurado'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {company.slug} • {company.planType} • {company.databaseType}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {company.databaseType === 'supabase' && company.supabaseUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => testSupabaseConnection(company)}
                            disabled={company.connectionStatus === 'testing'}
                          >
                            <Database className="w-4 h-4 mr-2" />
                            {company.connectionStatus === 'testing' ? 'Testando...' : 'Testar Conexão'}
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedCompany(company)}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Configurar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Configurar {company.name}</DialogTitle>
                              <DialogDescription>
                                {company.databaseType === 'supabase' 
                                  ? 'Configure as credenciais do Supabase para esta empresa'
                                  : 'Esta empresa usa PostgreSQL do MetaSync'}
                              </DialogDescription>
                            </DialogHeader>
                            {company.databaseType === 'supabase' && (
                              <CompanyConfigurationForm 
                                company={company} 
                                onSave={updateCompanyCredentials}
                              />
                            )}
                            {company.databaseType === 'postgresql' && (
                              <div className="text-center py-4 text-gray-600">
                                <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Esta empresa usa o PostgreSQL compartilhado do MetaSync.</p>
                                <p className="text-sm">Nenhuma configuração adicional necessária.</p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para configurar credenciais da empresa
function CompanyConfigurationForm({ company, onSave }: { 
  company: Company; 
  onSave: (companyId: number, credentials: { supabaseUrl: string; supabaseAnonKey: string; supabaseServiceKey: string }) => void 
}) {
  const [credentials, setCredentials] = useState({
    supabaseUrl: company.supabaseUrl || "",
    supabaseAnonKey: company.supabaseAnonKey || "",
    supabaseServiceKey: company.supabaseServiceKey || ""
  });

  const handleSave = () => {
    onSave(company.id, credentials);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="config-supabaseUrl">URL do Supabase</Label>
        <Input
          id="config-supabaseUrl"
          value={credentials.supabaseUrl}
          onChange={(e) => setCredentials({...credentials, supabaseUrl: e.target.value})}
          placeholder="https://xxxxx.supabase.co"
        />
      </div>
      <div>
        <Label htmlFor="config-supabaseAnonKey">Chave Pública (anon)</Label>
        <Input
          id="config-supabaseAnonKey"
          value={credentials.supabaseAnonKey}
          onChange={(e) => setCredentials({...credentials, supabaseAnonKey: e.target.value})}
          placeholder="eyJhbGciOiJIUzI1NiIsI..."
        />
      </div>
      <div>
        <Label htmlFor="config-supabaseServiceKey">Chave de Serviço</Label>
        <Input
          id="config-supabaseServiceKey"
          type="password"
          value={credentials.supabaseServiceKey}
          onChange={(e) => setCredentials({...credentials, supabaseServiceKey: e.target.value})}
          placeholder="eyJhbGciOiJIUzI1NiIsI..."
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} className="flex-1">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}