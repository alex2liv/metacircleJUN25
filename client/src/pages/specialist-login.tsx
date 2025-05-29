import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserCheck, MessageCircle, Calendar, Video, Users } from "lucide-react";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";
import { useLocation } from "wouter";

export default function SpecialistLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Por favor, preencha usuário e senha",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simular login do especialista
    setTimeout(() => {
      setIsLoading(false);
      
      // Credenciais padrão para demonstração
      if (loginData.username === "clarissa" && loginData.password === "specialist123") {
        toast({
          title: "✅ Login realizado!",
          description: "Bem-vinda, Clarissa! Redirecionando...",
        });
        
        // Redirecionar para área do especialista
        setTimeout(() => {
          setLocation("/specialist-dashboard");
        }, 1000);
      } else {
        toast({
          title: "❌ Credenciais inválidas",
          description: "Usuário ou senha incorretos",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <img 
            src={metaSyncLogo} 
            alt="MetaSync" 
            className="h-32 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-2">
            🔒 Área do Especialista
          </h1>
          <p className="text-blue-200">
            Acesso exclusivo para profissionais
          </p>
        </div>

        {/* Funcionalidades do Especialista */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <MessageCircle className="w-6 h-6 text-blue-300 mx-auto mb-1" />
            <span className="text-xs text-white">Chat Groups</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-6 h-6 text-green-300 mx-auto mb-1" />
            <span className="text-xs text-white">Agendas</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Video className="w-6 h-6 text-purple-300 mx-auto mb-1" />
            <span className="text-xs text-white">Lives</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Users className="w-6 h-6 text-orange-300 mx-auto mb-1" />
            <span className="text-xs text-white">Moderation</span>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Login Especialista
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">👤 Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="Digite seu usuário"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">🔑 Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Digite sua senha"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? 
                      <EyeOff className="w-4 h-4" /> : 
                      <Eye className="w-4 h-4" />
                    }
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Entrar na Área Especialista
                  </>
                )}
              </Button>
            </form>

            {/* Credenciais de demonstração */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🔐 Credenciais de Teste:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Usuário:</span>
                  <Badge variant="outline">clarissa</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Senha:</span>
                  <Badge variant="outline">specialist123</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="mt-6 text-center">
          <p className="text-blue-200 text-sm">
            Precisa de ajuda? Entre em contato com o administrador
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-300 hover:text-white mt-2"
            onClick={() => setLocation("/")}
          >
            ← Voltar ao MetaCircle
          </Button>
        </div>
      </div>
    </div>
  );
}