import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield, User, UserCheck, Mail, ArrowLeft, Key } from "lucide-react";
import { Link, useLocation } from "wouter";
import metaSyncIcon from "@assets/icone_matasync.png";

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const recoverySchema = z.object({
  email: z.string().email("Email inválido"),
  recoveryCode: z.string().min(6, "Código deve ter 6 dígitos").max(6, "Código deve ter 6 dígitos"),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

const backDoorSchema = z.object({
  masterKey: z.string().min(1, "Chave mestra é obrigatória"),
  newAdminPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RecoveryForm = z.infer<typeof recoverySchema>;
type BackDoorForm = z.infer<typeof backDoorSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");
  const [recoveryStep, setRecoveryStep] = useState<"email" | "code" | "backdoor">("email");
  const [recoveryEmail, setRecoveryEmail] = useState("");

  // Formulários
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const recoveryForm = useForm<RecoveryForm>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: "", recoveryCode: "", newPassword: "", confirmPassword: "" },
  });

  const backDoorForm = useForm<BackDoorForm>({
    resolver: zodResolver(backDoorSchema),
    defaultValues: { masterKey: "", newAdminPassword: "" },
  });

  // Handlers de login por tipo de usuário
  const handleAdminLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Validar credenciais admin
      if (data.email === "admin@metasyncdigital.com.br" && data.password === "MetaSync2025!") {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", data.email);
        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao painel administrativo.",
        });
        setLocation("/dashboard");
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecialistLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Validar credenciais especialista
      if (data.email === "clarissa@metasyncdigital.com.br" && data.password === "Clarissa2025!") {
        localStorage.setItem("userRole", "specialist");
        localStorage.setItem("userEmail", data.email);
        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao painel do especialista.",
        });
        setLocation("/specialist-dashboard");
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Verificar se usuário está na lista de emails importados
      const importedEmails = JSON.parse(localStorage.getItem("importedEmails") || "[]");
      const userExists = importedEmails.includes(data.email);
      
      if (userExists) {
        localStorage.setItem("userRole", "member");
        localStorage.setItem("userEmail", data.email);
        toast({
          title: "Login realizado!",
          description: "Bem-vindo à comunidade MetaCircle.",
        });
        setLocation("/client-view");
      } else {
        throw new Error("Usuário não encontrado na lista de membros");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Usuário não autorizado ou credenciais incorretas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler de recuperação de senha
  const handlePasswordRecovery = async (email: string) => {
    setIsLoading(true);
    try {
      // Simular envio de código por email
      const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("recoveryCode", recoveryCode);
      localStorage.setItem("recoveryEmail", email);
      
      toast({
        title: "Código enviado!",
        description: `Código de recuperação: ${recoveryCode} (Em produção seria enviado por email)`,
      });
      
      setRecoveryEmail(email);
      setRecoveryStep("code");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o código de recuperação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler de backdoor para admins
  const handleBackDoorAccess = async (data: BackDoorForm) => {
    setIsLoading(true);
    try {
      // Chave mestra de emergência (em produção seria mais segura)
      if (data.masterKey === "METASYNC_EMERGENCY_2025_MASTER_KEY") {
        // Atualizar senha do admin
        localStorage.setItem("adminPassword", data.newAdminPassword);
        
        toast({
          title: "Acesso de emergência ativado!",
          description: "Senha administrativa redefinida com sucesso.",
        });
        
        // Login automático como admin
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", "admin@metasyncdigital.com.br");
        setLocation("/dashboard");
      } else {
        throw new Error("Chave mestra inválida");
      }
    } catch (error) {
      toast({
        title: "Acesso negado",
        description: "Chave mestra incorreta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-lg bg-white shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-start mb-6">
            <img 
              src={metaSyncIcon} 
              alt="MetaSync" 
              className="h-8 w-8 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Comunidade Clarissa Vaz de Desenvolvimento Pessoal
          </h1>
          <p className="text-gray-500 text-sm">
            Sistema de Autenticação Multiníveis
          </p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="admin" className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="specialist" className="flex items-center gap-1">
                <UserCheck className="w-4 h-4" />
                Especialista
              </TabsTrigger>
              <TabsTrigger value="user" className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Usuário
              </TabsTrigger>
            </TabsList>

            {/* Login Administrativo */}
            <TabsContent value="admin">
              <form onSubmit={loginForm.handleSubmit(handleAdminLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Administrativo</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@metasyncdigital.com.br"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha de administrador"
                      {...loginForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar como Admin"}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setRecoveryStep("email")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Esqueci minha senha
                  </Button>
                  <span className="mx-2 text-gray-400">|</span>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setRecoveryStep("backdoor")}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Acesso de Emergência
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Login Especialista */}
            <TabsContent value="specialist">
              <form onSubmit={loginForm.handleSubmit(handleSpecialistLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialist-email">Email do Especialista</Label>
                  <Input
                    id="specialist-email"
                    type="email"
                    placeholder="clarissa@metasyncdigital.com.br"
                    {...loginForm.register("email")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialist-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="specialist-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha de especialista"
                      {...loginForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar como Especialista"}
                </Button>
              </form>
            </TabsContent>

            {/* Login Usuário */}
            <TabsContent value="user">
              <form onSubmit={loginForm.handleSubmit(handleUserLogin)} className="space-y-4">
                <Alert>
                  <Mail className="w-4 h-4" />
                  <AlertDescription>
                    Acesso liberado apenas para emails na lista de membros importada pelo administrador.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="seu@email.com"
                    {...loginForm.register("email")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-password">Senha Inicial</Label>
                  <div className="relative">
                    <Input
                      id="user-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="123456 (senha padrão inicial)"
                      {...loginForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar na Comunidade"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Modal de Recuperação de Senha */}
          {recoveryStep !== "email" && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              {recoveryStep === "code" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <Button
                      variant="link"
                      onClick={() => setRecoveryStep("email")}
                      className="text-sm p-0"
                    >
                      Voltar
                    </Button>
                  </div>
                  
                  <h3 className="font-medium">Recuperação de Senha</h3>
                  <p className="text-sm text-gray-600">
                    Digite o código enviado para {recoveryEmail}
                  </p>

                  <form onSubmit={recoveryForm.handleSubmit((data) => {
                    const storedCode = localStorage.getItem("recoveryCode");
                    if (data.recoveryCode === storedCode) {
                      toast({
                        title: "Senha redefinida!",
                        description: "Sua senha foi atualizada com sucesso.",
                      });
                      setRecoveryStep("email");
                    } else {
                      toast({
                        title: "Código inválido",
                        description: "Verifique o código e tente novamente.",
                        variant: "destructive",
                      });
                    }
                  })} className="space-y-3">
                    <Input
                      placeholder="Código de 6 dígitos"
                      {...recoveryForm.register("recoveryCode")}
                    />
                    <Input
                      type="password"
                      placeholder="Nova senha"
                      {...recoveryForm.register("newPassword")}
                    />
                    <Input
                      type="password"
                      placeholder="Confirmar nova senha"
                      {...recoveryForm.register("confirmPassword")}
                    />
                    <Button type="submit" className="w-full" size="sm">
                      Redefinir Senha
                    </Button>
                  </form>
                </div>
              )}

              {recoveryStep === "backdoor" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <Button
                      variant="link"
                      onClick={() => setRecoveryStep("email")}
                      className="text-sm p-0"
                    >
                      Voltar
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-red-600">
                    <Key className="w-4 h-4" />
                    <h3 className="font-medium">Acesso de Emergência</h3>
                  </div>
                  
                  <Alert variant="destructive">
                    <AlertDescription>
                      Este é um backdoor para situações de emergência. Use apenas quando absolutamente necessário.
                    </AlertDescription>
                  </Alert>

                  <form onSubmit={backDoorForm.handleSubmit(handleBackDoorAccess)} className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Chave mestra de emergência"
                      {...backDoorForm.register("masterKey")}
                    />
                    <Input
                      type="password"
                      placeholder="Nova senha para administrador"
                      {...backDoorForm.register("newAdminPassword")}
                    />
                    <Button type="submit" variant="destructive" className="w-full" size="sm">
                      Ativar Acesso de Emergência
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}