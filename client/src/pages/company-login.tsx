import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Building2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link, useParams, useLocation } from "wouter";

interface Company {
  id: number;
  name: string;
  slug: string;
  planType: string;
  databaseType: string;
  isActive: boolean;
  hasWhiteLabel: boolean;
}

export default function CompanyLogin() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  const companySlug = params.slug;

  useEffect(() => {
    if (companySlug) {
      loadCompany();
    }
  }, [companySlug]);

  const loadCompany = async () => {
    try {
      const response = await apiRequest("GET", `/api/company/${companySlug}`);
      const companyData = await response.json();
      
      if (!companyData.isActive) {
        toast({
          title: "Empresa Inativa",
          description: "Esta empresa não está ativa no momento.",
          variant: "destructive",
        });
        return;
      }
      
      setCompany(companyData);
    } catch (error) {
      // For demo, create a sample company
      setCompany({
        id: 1,
        name: "Clarissa Vargas",
        slug: companySlug || "",
        planType: "premium",
        databaseType: "supabase",
        isActive: true,
        hasWhiteLabel: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await apiRequest("POST", `/api/company/${companySlug}/auth/login`, loginData);
      const result = await response.json();

      if (result.success) {
        toast({
          title: "Login Realizado",
          description: `Bem-vindo à ${company?.name}!`,
        });
        
        // Redirect based on user type
        const userData = result.user;
        if (userData.type === "admin") {
          setLocation(`/company-admin/${companySlug}`);
        } else if (userData.type === "specialist") {
          setLocation(`/specialist/${companySlug}`);
        } else {
          setLocation(`/user-dashboard/${companySlug}`);
        }
      } else {
        toast({
          title: "Erro no Login",
          description: result.message || "Credenciais inválidas.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível realizar o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Empresa Não Encontrada</CardTitle>
            <CardDescription>
              A empresa "{companySlug}" não foi encontrada ou não está ativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const backgroundClass = company.hasWhiteLabel 
    ? "bg-gradient-to-br from-gray-50 to-gray-100" 
    : "bg-gradient-to-br from-blue-50 to-indigo-100";

  return (
    <div className={`min-h-screen ${backgroundClass} flex items-center justify-center p-4`}>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{company.name}</CardTitle>
            <CardDescription className="mt-2">
              {company.hasWhiteLabel 
                ? "Painel Administrativo" 
                : "Painel Administrativo - MetaSync"}
            </CardDescription>
          </div>
          
          {!company.hasWhiteLabel && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-700">
                Esta comunidade é powered by <strong>MetaSync</strong> - 
                a plataforma líder em gestão de comunidades digitais.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Sua senha"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-center text-sm">
            <div className="bg-gray-50 p-3 rounded-md text-left">
              <p className="font-medium text-gray-700 mb-2">Credencial de Admin:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <div><strong>Admin da Empresa:</strong> admin@clarissavargas.com / 123456</div>
              </div>
            </div>
            <Link href={`/company/${companySlug}/register`} className="text-primary hover:underline">
              Não tem conta? Criar conta
            </Link>
            <div>
              <Link href={`/company/${companySlug}/forgot-password`} className="text-gray-600 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          {!company.hasWhiteLabel && (
            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-xs text-gray-500">
                Powered by <span className="font-semibold text-primary">MetaSync</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Sua plataforma de comunidades digitais
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}