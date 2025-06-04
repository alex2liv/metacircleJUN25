import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserCheck, MessageCircle, Calendar, Video, Users } from "lucide-react";
import metaSyncLogo from "@assets/logo metasync fundo transparente.png";
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
      <div className="w-full max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Lado Esquerdo - Logo e Funcionalidades */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <img 
                src={metaSyncLogo} 
                alt="MetaSync Digital" 
                className="h-48 mx-auto lg:mx-0 mb-6 brightness-200 contrast-150"
                style={{
                  filter: 'brightness(1.5) contrast(1.2) saturate(0.8)'
                }}
              />
              <h1 className="text-3xl font-bold text-white mb-3">
                Área do Especialista
              </h1>
              <p className="text-blue-200 text-lg">
                Plataforma completa para profissionais
              </p>
            </div>

            {/* Cards de Funcionalidades */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm">Chat Groups</h3>
                  <p className="text-blue-200 text-xs">Conversas organizadas</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm">Agendas</h3>
                  <p className="text-blue-200 text-xs">Gestão de horários</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Video className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm">Lives</h3>
                  <p className="text-blue-200 text-xs">Transmissões ao vivo</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm">Moderation</h3>
                  <p className="text-blue-200 text-xs">Controle de comunidade</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Lado Direito - Formulário de Login */}
          <div>
            <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                  Login Especialista
                </CardTitle>
                <p className="text-gray-600 text-sm">Acesse sua área profissional</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="username" className="text-gray-700 font-medium">Usuário</Label>
                    <Input
                      id="username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      placeholder="Digite seu usuário"
                      disabled={isLoading}
                      className="mt-1 h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        placeholder="Digite sua senha"
                        disabled={isLoading}
                        className="h-11 pr-10"
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
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
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
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Credenciais de Teste
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">Usuário:</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">clarissa</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">Senha:</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">specialist123</Badge>
                    </div>
                  </div>
                </div>

                {/* Link de ajuda */}
                <div className="mt-4 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => setLocation("/")}
                  >
                    ← Voltar ao MetaCircle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}