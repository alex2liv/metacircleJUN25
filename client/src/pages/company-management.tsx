import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building2, Database, Settings } from "lucide-react";
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
}

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
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
                      <div>
                        <h3 className="font-semibold">{company.name}</h3>
                        <p className="text-sm text-gray-600">
                          {company.slug} • {company.planType} • {company.databaseType}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
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