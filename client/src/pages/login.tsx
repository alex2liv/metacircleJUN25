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
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Seja bem-vindo à Comunidade de Podólogos
          </h1>
          <p className="text-gray-600 text-sm">
            Administrada pela especialista Clarissa Vaz
          </p>
        </CardHeader>

        <CardContent>
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
                placeholder="seu.email@exemplo.com"
                {...loginForm.register("email")}
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
              <Button
                type="button"
                variant="link"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Esqueci minha senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}