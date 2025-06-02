import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, ArrowLeft, Users } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

const resetPasswordSchema = z.object({
  resetCode: z.string().min(6, "Código deve ter 6 dígitos").max(6, "Código deve ter 6 dígitos"),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetStep, setResetStep] = useState<"email" | "code">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");

  // Lista de especialistas disponíveis (normalmente viria do backend)
  const availableSpecialists = [
    {
      id: "clarissa-vaz",
      name: "Dra. Clarissa Vaz",
      email: "clarissa@metasyncdigital.com.br",
      specialty: "Podologia",
      active: true
    },
    {
      id: "maria-silva",
      name: "Dra. Maria Silva",
      email: "maria@metasyncdigital.com.br", 
      specialty: "Dermatologia",
      active: true
    },
    {
      id: "joao-santos",
      name: "Dr. João Santos",
      email: "joao@metasyncdigital.com.br",
      specialty: "Ortopedia", 
      active: false
    }
  ];

  // Formulários
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const forgotPasswordForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { resetCode: "", newPassword: "", confirmPassword: "" },
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
      const response = await apiRequest("POST", "/api/auth/login", {
        email: data.email,
        password: data.password
      });
      
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("userRole", result.user.role);
        localStorage.setItem("userEmail", result.user.email);
        localStorage.setItem("userName", result.user.firstName + " " + result.user.lastName);
        
        // Redirecionar baseado no tipo de usuário
        if (result.user.role === "specialist") {
          toast({
            title: "Login realizado!",
            description: "Bem-vindo ao painel do especialista.",
          });
          setLocation("/specialist-dashboard");
        } else {
          toast({
            title: "Login realizado!",
            description: "Bem-vindo à comunidade.",
          });
          setLocation("/community-member");
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || "Credenciais inválidas");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Usuário não autorizado ou credenciais incorretas.",
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

  // Recuperação de senha - Enviar email
  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/forgot-password", { email: data.email });
      
      if (response.ok) {
        const result = await response.json();
        setResetEmail(data.email);
        setResetStep("code");
        toast({
          title: "Email enviado!",
          description: "Código de recuperação enviado para seu email.",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Erro ao enviar email");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao enviar email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Recuperação de senha - Redefinir com código
  const handleResetPassword = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/reset-password", {
        email: resetEmail,
        resetCode: data.resetCode,
        newPassword: data.newPassword
      });
      
      if (response.ok) {
        toast({
          title: "Senha redefinida!",
          description: "Sua senha foi atualizada com sucesso.",
        });
        setForgotPasswordOpen(false);
        setResetStep("email");
        setResetEmail("");
        resetPasswordForm.reset();
        forgotPasswordForm.reset();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Erro ao redefinir senha");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao redefinir senha",
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
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Seja bem-vindo
          </h1>
          <p className="text-gray-600 text-sm">
            Especialistas
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={loginForm.handleSubmit(handleUserLogin)} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="specialist-select">Selecionar Especialista</Label>
              <Select 
                value={selectedSpecialist} 
                onValueChange={(value) => {
                  setSelectedSpecialist(value);
                  const specialist = availableSpecialists.find(s => s.id === value);
                  if (specialist) {
                    loginForm.setValue("email", specialist.email);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha seu perfil de especialista" />
                </SelectTrigger>
                <SelectContent>
                  {availableSpecialists
                    .filter(specialist => specialist.active)
                    .map((specialist) => (
                    <SelectItem key={specialist.id} value={specialist.id}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{specialist.name}</div>
                          <div className="text-xs text-gray-500">{specialist.specialty}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="Selecione um especialista acima"
                {...loginForm.register("email")}
                readOnly={!!selectedSpecialist}
                className={selectedSpecialist ? "bg-gray-50" : ""}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-password">Senha</Label>
              <div className="relative">
                <Input
                  id="user-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
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
              {isLoading ? "Entrando..." : "Entrar na Comunidade"}
            </Button>

            <div className="text-center">
              <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Esqueci minha senha
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {resetStep === "email" ? "Recuperar Senha" : "Digite o Código"}
                    </DialogTitle>
                    <DialogDescription>
                      {resetStep === "email" 
                        ? "Digite seu email para receber o código de recuperação"
                        : `Digite o código enviado para ${resetEmail}`
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  {resetStep === "email" ? (
                    <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="seu.email@exemplo.com"
                          {...forgotPasswordForm.register("email")}
                        />
                        {forgotPasswordForm.formState.errors.email && (
                          <p className="text-sm text-red-500">
                            {forgotPasswordForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setForgotPasswordOpen(false)}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                          {isLoading ? "Enviando..." : "Enviar Código"}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-code">Código de 6 dígitos</Label>
                        <Input
                          id="reset-code"
                          placeholder="123456"
                          maxLength={6}
                          {...resetPasswordForm.register("resetCode")}
                        />
                        {resetPasswordForm.formState.errors.resetCode && (
                          <p className="text-sm text-red-500">
                            {resetPasswordForm.formState.errors.resetCode.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Digite sua nova senha"
                          {...resetPasswordForm.register("newPassword")}
                        />
                        {resetPasswordForm.formState.errors.newPassword && (
                          <p className="text-sm text-red-500">
                            {resetPasswordForm.formState.errors.newPassword.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Senha</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirme sua nova senha"
                          {...resetPasswordForm.register("confirmPassword")}
                        />
                        {resetPasswordForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-500">
                            {resetPasswordForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setResetStep("email");
                            setResetEmail("");
                            resetPasswordForm.reset();
                          }}
                          className="flex-1"
                        >
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Voltar
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                          {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}