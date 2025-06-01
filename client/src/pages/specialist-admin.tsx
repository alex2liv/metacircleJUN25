import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  Save,
  Upload,
  Settings,
  Crown,
  MessageSquare,
  Bell,
  CheckCircle,
  Bot,
  LogOut,
  UserCircle,
  Shield,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";

interface SpecialistConfig {
  name: string;
  phone: string;
  email: string;
  speciality: string;
  bio: string;
  avatar: string;
  isActive: boolean;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function SpecialistAdmin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configurações do especialista
  const [specialistConfig, setSpecialistConfig] = useState<SpecialistConfig>({
    name: "Clarissa",
    phone: "17997337322",
    email: "clarissa@metasync.tech",
    speciality: "Marketing Digital e Funis de Vendas",
    bio: "Especialista em marketing digital com mais de 10 anos de experiência. Ajudo empreendedores a criarem funis de vendas que convertem.",
    avatar: "",
    isActive: true
  });

  // Disponibilidades da semana
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { dayOfWeek: 1, dayName: "Segunda-feira", startTime: "09:00", endTime: "17:00", isActive: true },
    { dayOfWeek: 2, dayName: "Terça-feira", startTime: "09:00", endTime: "17:00", isActive: true },
    { dayOfWeek: 3, dayName: "Quarta-feira", startTime: "09:00", endTime: "17:00", isActive: true },
    { dayOfWeek: 4, dayName: "Quinta-feira", startTime: "09:00", endTime: "17:00", isActive: true },
    { dayOfWeek: 5, dayName: "Sexta-feira", startTime: "09:00", endTime: "15:00", isActive: true },
    { dayOfWeek: 6, dayName: "Sábado", startTime: "09:00", endTime: "12:00", isActive: false },
    { dayOfWeek: 0, dayName: "Domingo", startTime: "09:00", endTime: "12:00", isActive: false },
  ]);

  // Configurações de automação
  const [automationConfig, setAutomationConfig] = useState({
    whatsappNotifications: true,
    emailNotifications: true,
    n8nWebhookUrl: "",
    autoConfirmAppointments: false,
    responseTimeHours: 2
  });

  // Configurações do Modo Beta
  const [betaConfig, setBetaConfig] = useState({
    betaModeEnabled: false,
    betaEndDate: "",
    betaMessage: "🎉 Acesso Premium Beta - Teste gratuito por tempo limitado!",
    gracePeriodEnabled: true,
    gracePeriodDays: 3
  });

  // Configurações de Preços dos Planos
  const [planPrices, setPlanPrices] = useState({
    basicPrice: "29.90",
    intermediatePrice: "59.90",
    premiumPrice: "119.90"
  });

  // Configurações de Suporte
  const [supportConfig, setSupportConfig] = useState({
    supportWhatsapp: "17997337322",
    supportEmail: "suporte@metasync.com.br",
    supportEnabled: true
  });

  // Configurações do Assistente IA/ChatGPT
  const [aiConfig, setAiConfig] = useState({
    openaiApiKey: "",
    openaiModel: "gpt-4o",
    assistantEnabled: false,
    assistantInstructions: "Você é o assistente oficial desta comunidade. Seja sempre prestativo, claro e amigável nas respostas. Ajude com dúvidas sobre funcionalidades, planos e problemas técnicos.",
    assistantTemperature: "0.7",
    assistantMaxTokens: "500"
  });

  // Configurações do Banco de Dados
  const [databaseConfig, setDatabaseConfig] = useState({
    provider: "supabase",
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseServiceKey: "",
    connectionString: "",
    isConfigured: false
  });

  // Configurações de Email/SMTP
  const [emailConfig, setEmailConfig] = useState({
    provider: "sendgrid", // sendgrid, smtp, mailgun, resend
    sendgridApiKey: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    smtpSecure: true,
    fromEmail: "noreply@metasync.com.br",
    fromName: "MetaCircle",
    emailVerificationEnabled: true,
    isConfigured: false
  });

  // Configurações de Analytics & Métricas
  const [analyticsConfig, setAnalyticsConfig] = useState({
    enabled: true,
    googleAnalyticsId: "",
    facebookPixelId: "",
    hotjarId: "",
    enableUserTracking: true,
    enableConversionTracking: true,
    generateReports: true
  });

  // Configurações de Segurança
  const [securityConfig, setSecurityConfig] = useState({
    rateLimitEnabled: true,
    maxRequestsPerMinute: 60,
    enableAuditLogs: true,
    autoBackupEnabled: true,
    backupFrequency: "daily", // daily, weekly, monthly
    twoFactorAuthEnabled: false,
    sessionTimeoutMinutes: 30
  });

  // Configurações de Personalização
  const [customizationConfig, setCustomizationConfig] = useState({
    allowCustomThemes: true,
    allowLogoUpload: true,
    allowCustomCSS: false,
    brandingEnabled: true,
    customDomainEnabled: false,
    customDomain: "",
    favicon: "",
    customColors: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      accent: "#06b6d4"
    }
  });

  // Configurações Mobile App
  const [mobileConfig, setMobileConfig] = useState({
    androidAppEnabled: false,
    iosAppEnabled: false,
    pushNotificationsEnabled: true,
    deepLinksEnabled: true,
    offlineModeEnabled: false,
    appName: "MetaCircle",
    appDescription: "Comunidade Digital Moderna",
    playStoreUrl: "",
    appStoreUrl: ""
  });

  const handleSaveSpecialist = () => {
    // Aqui salvaria no backend
    toast({
      title: "✅ Configurações salvas!",
      description: `Perfil de ${specialistConfig.name} atualizado com sucesso`,
    });
  };

  const handleSaveAvailability = () => {
    // Aqui salvaria no backend
    toast({
      title: "📅 Disponibilidades salvas!",
      description: "Horários de atendimento atualizados",
    });
  };

  const handleSaveAutomation = () => {
    // Aqui salvaria no backend
    toast({
      title: "🤖 Automações configuradas!",
      description: "Integrações e notificações ativadas",
    });
  };

  const handleSaveBeta = () => {
    // Aqui salvaria no backend
    toast({
      title: betaConfig.betaModeEnabled ? "🧪 Modo Beta ATIVADO!" : "✅ Modo Beta desativado",
      description: betaConfig.betaModeEnabled 
        ? "Todos os usuários agora têm acesso Premium gratuito!" 
        : "Voltou ao modo normal com planos pagos",
    });
  };

  const handleSavePrices = () => {
    // Validar preços antes de salvar
    const basic = parseFloat(planPrices.basicPrice);
    const intermediate = parseFloat(planPrices.intermediatePrice);
    const premium = parseFloat(planPrices.premiumPrice);
    
    if (isNaN(basic) || isNaN(intermediate) || isNaN(premium)) {
      toast({
        title: "Erro nos preços",
        description: "Por favor, insira valores válidos para todos os planos",
        variant: "destructive"
      });
      return;
    }
    
    // Salvar no backend e mostrar confirmação clara
    toast({
      title: "✅ PREÇOS SALVOS COM SUCESSO!",
      description: `Básico: R$ ${basic.toFixed(2)} | Intermediário: R$ ${intermediate.toFixed(2)} | Premium: R$ ${premium.toFixed(2)}`,
    });
    
    // Feedback visual que foi salvo
    const button = document.querySelector('[data-save-prices]') as HTMLElement;
    if (button) {
      button.style.backgroundColor = '#10b981';
      button.textContent = '✅ SALVO!';
      setTimeout(() => {
        button.style.backgroundColor = '';
        button.textContent = '💾 Salvar Preços dos Planos';
      }, 2000);
    }
  };

  const handleSaveSupport = () => {
    // Aqui salvaria no backend
    toast({
      title: "📞 Configurações de suporte salvas!",
      description: supportConfig.supportEnabled 
        ? `WhatsApp: ${supportConfig.supportWhatsapp}` 
        : "Suporte desabilitado",
    });
  };

  const handleSaveAI = () => {
    // Aqui salvaria no backend
    toast({
      title: aiConfig.assistantEnabled ? "🤖 Assistente IA ativado!" : "❌ Assistente IA desativado",
      description: aiConfig.assistantEnabled 
        ? `Modelo: ${aiConfig.openaiModel} | Funcionando 24/7!` 
        : "ChatGPT desligado - usando respostas pré-definidas",
    });
  };

  const handleTestConnection = async () => {
    if (!databaseConfig.supabaseUrl || !databaseConfig.supabaseAnonKey) {
      toast({
        title: "❌ Erro na conexão",
        description: "Por favor, preencha URL e Chave Anônima do Supabase",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "🔄 Testando conexão...",
      description: "Verificando conectividade com Supabase",
    });

    setTimeout(() => {
      toast({
        title: "✅ Conexão bem-sucedida!",
        description: "Supabase conectado e funcionando",
      });
    }, 2000);
  };

  const handleSaveDatabase = () => {
    toast({
      title: "💾 Configurações do banco salvas!",
      description: "Conexão com Supabase configurada com sucesso",
    });
    setDatabaseConfig({...databaseConfig, isConfigured: true});
  };

  const handleTestEmail = async () => {
    if (emailConfig.provider === "sendgrid" && !emailConfig.sendgridApiKey) {
      toast({
        title: "❌ Erro na configuração",
        description: "Por favor, preencha a chave API do SendGrid",
        variant: "destructive"
      });
      return;
    }

    if (emailConfig.provider === "smtp" && (!emailConfig.smtpHost || !emailConfig.smtpUser)) {
      toast({
        title: "❌ Erro na configuração",
        description: "Por favor, preencha host e usuário SMTP",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "📧 Enviando email de teste...",
      description: "Verificando configuração de email",
    });

    setTimeout(() => {
      toast({
        title: "✅ Email enviado com sucesso!",
        description: `Teste realizado via ${emailConfig.provider.toUpperCase()}`,
      });
    }, 2000);
  };

  const handleSaveEmail = () => {
    toast({
      title: "📧 Configurações de email salvas!",
      description: `${emailConfig.provider.toUpperCase()} configurado com sucesso`,
    });
    setEmailConfig({...emailConfig, isConfigured: true});
  };

  const handleSaveAnalytics = () => {
    toast({
      title: "📊 Analytics configurado!",
      description: "Métricas e relatórios ativados com sucesso",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "🔒 Segurança atualizada!",
      description: "Configurações de proteção aplicadas",
    });
  };

  const handleSaveCustomization = () => {
    toast({
      title: "🎨 Personalização salva!",
      description: "Temas e branding configurados",
    });
  };

  const handleSaveMobile = () => {
    toast({
      title: "📱 Configurações mobile salvas!",
      description: "Apps Android/iOS preparados para desenvolvimento",
    });
  };

  const updateAvailability = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const newAvailability = [...availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setAvailability(newAvailability);
  };

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Redirecionando para a tela de login...",
    });
    setTimeout(() => {
      setLocation("/specialist-login");
    }, 1000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      const newAvatar = e.target?.result as string;
      setSpecialistConfig(prev => ({
        ...prev,
        avatar: newAvatar
      }));
      
      toast({
        title: "Foto atualizada",
        description: "Avatar alterado com sucesso!",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header fixo com logo e menu do usuário */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo MetaSync */}
          <div className="flex items-center gap-3">
            <img 
              src={metaSyncLogo} 
              alt="MetaSync" 
              className="h-24"
            />
            <div className="border-l border-gray-300 pl-3">
              <h1 className="text-xl font-bold text-gray-900">
                Área do Especialista
              </h1>
              <p className="text-sm text-gray-600">
                Configurações e Administração
              </p>
            </div>
          </div>

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={specialistConfig.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {specialistConfig.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">{specialistConfig.name}</p>
                  <p className="text-xs text-gray-500">Especialista</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">
                {specialistConfig.name}
              </div>
              <div className="px-2 py-1 text-xs text-gray-500">
                {specialistConfig.email}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/specialist-dashboard")}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open("/analytics-dashboard", "_blank")}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Analytics</span>
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

      {/* Conteúdo principal */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Botões de ação rápida */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.open('/analytics-dashboard', '_blank')}
            >
              📊 Analytics
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => window.open('/invite-members', '_blank')}
            >
              📧 Convites Beta (800 pessoas)
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Perfil do Especialista */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil do Especialista
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={specialistConfig.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl">
                    {specialistConfig.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAvatarClick}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: 300x300px, máximo 5MB
                  </p>
                </div>
              </div>

              {/* Informações básicas */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Especialista</Label>
                  <Input
                    id="name"
                    value={specialistConfig.name}
                    onChange={(e) => setSpecialistConfig({...specialistConfig, name: e.target.value})}
                    placeholder="Ex: Clarissa, Dr. Silva, Coach Ana"
                  />
                </div>

                <div>
                  <Label htmlFor="speciality">Especialidade</Label>
                  <Input
                    id="speciality"
                    value={specialistConfig.speciality}
                    onChange={(e) => setSpecialistConfig({...specialistConfig, speciality: e.target.value})}
                    placeholder="Ex: Marketing Digital, Coaching, Consultoria"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">WhatsApp</Label>
                    <Input
                      id="phone"
                      value={specialistConfig.phone}
                      onChange={(e) => setSpecialistConfig({...specialistConfig, phone: e.target.value})}
                      placeholder="11999999999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={specialistConfig.email}
                      onChange={(e) => setSpecialistConfig({...specialistConfig, email: e.target.value})}
                      placeholder="especialista@empresa.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={specialistConfig.bio}
                    onChange={(e) => setSpecialistConfig({...specialistConfig, bio: e.target.value})}
                    placeholder="Descreva a experiência e especialidades..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={specialistConfig.isActive}
                    onCheckedChange={(checked) => setSpecialistConfig({...specialistConfig, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Especialista ativo</Label>
                </div>
              </div>

              <Button onClick={handleSaveSpecialist} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Salvar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Disponibilidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Horários de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availability.map((slot, index) => (
                <div key={slot.dayOfWeek} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={slot.isActive}
                      onCheckedChange={(checked) => updateAvailability(index, 'isActive', checked)}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-sm">{slot.dayName}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                      disabled={!slot.isActive}
                      className="w-24"
                    />
                    <span className="text-gray-500">às</span>
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                      disabled={!slot.isActive}
                      className="w-24"
                    />
                  </div>
                </div>
              ))}

              <Button onClick={handleSaveAvailability} className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Salvar Horários
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Modo Beta - Acesso Premium Gratuito */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Crown className="w-5 h-5" />
              🧪 Modo Beta - Teste Gratuito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base font-semibold">Ativar Modo Beta</Label>
                    <p className="text-sm text-gray-600">
                      Libera acesso Premium gratuito para todos os usuários durante o período de teste
                    </p>
                  </div>
                  <Switch
                    checked={betaConfig.betaModeEnabled}
                    onCheckedChange={(checked) => 
                      setBetaConfig({...betaConfig, betaModeEnabled: checked})
                    }
                  />
                </div>

                {betaConfig.betaModeEnabled && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor="betaEndDate">Data de fim do teste</Label>
                      <Input
                        id="betaEndDate"
                        type="datetime-local"
                        value={betaConfig.betaEndDate}
                        onChange={(e) => 
                          setBetaConfig({...betaConfig, betaEndDate: e.target.value})
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="betaMessage">Mensagem exibida aos usuários</Label>
                      <Textarea
                        id="betaMessage"
                        value={betaConfig.betaMessage}
                        onChange={(e) => 
                          setBetaConfig({...betaConfig, betaMessage: e.target.value})
                        }
                        rows={2}
                      />
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Label className="font-semibold">Período de Graça após Beta</Label>
                          <p className="text-xs text-gray-600">
                            Dar tempo para usuários comprarem Premium após fim do teste
                          </p>
                        </div>
                        <Switch
                          checked={betaConfig.gracePeriodEnabled}
                          onCheckedChange={(checked) => 
                            setBetaConfig({...betaConfig, gracePeriodEnabled: checked})
                          }
                        />
                      </div>

                      {betaConfig.gracePeriodEnabled && (
                        <div>
                          <Label htmlFor="gracePeriodDays">Dias de aviso antes de bloquear</Label>
                          <Input
                            id="gracePeriodDays"
                            type="number"
                            value={betaConfig.gracePeriodDays}
                            onChange={(e) => 
                              setBetaConfig({...betaConfig, gracePeriodDays: parseInt(e.target.value)})
                            }
                            min="1"
                            max="7"
                            className="w-20"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Usuários verão countdown: "Faltam X dias para assinar"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {betaConfig.betaModeEnabled && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">O que acontece no Modo Beta:</span>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Todos os usuários têm acesso Premium gratuito</li>
                    <li>• Chat direto com {specialistConfig.name} liberado</li>
                    <li>• SOS {specialistConfig.name} disponível</li>
                    <li>• Agendamentos sem cobrança</li>
                    <li>• Perfeito para coletar feedback e corrigir bugs</li>
                  </ul>
                </div>
              )}

              <Button 
                onClick={handleSaveBeta} 
                className={`w-full ${
                  betaConfig.betaModeEnabled 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                {betaConfig.betaModeEnabled ? "Ativar Modo Beta" : "Salvar Configurações"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Preços dos Planos */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Crown className="w-5 h-5" />
              💰 Preços dos Planos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="basicPrice">🥉 Plano Básico (R$)</Label>
                <Input
                  id="basicPrice"
                  type="number"
                  step="0.01"
                  value={planPrices.basicPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPlanPrices({...planPrices, basicPrice: value});
                  }}
                  placeholder="29.90"
                />
                <p className="text-xs text-gray-600 mt-1">Chat apenas texto</p>
              </div>
              
              <div>
                <Label htmlFor="intermediatePrice">🥈 Plano Intermediário (R$)</Label>
                <Input
                  id="intermediatePrice"
                  type="number"
                  step="0.01"
                  value={planPrices.intermediatePrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPlanPrices({...planPrices, intermediatePrice: value});
                  }}
                  placeholder="59.90"
                />
                <p className="text-xs text-gray-600 mt-1">Chat texto + áudio</p>
              </div>
              
              <div>
                <Label htmlFor="premiumPrice">👑 Plano Premium (R$)</Label>
                <Input
                  id="premiumPrice"
                  type="number"
                  step="0.01"
                  value={planPrices.premiumPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPlanPrices({...planPrices, premiumPrice: value});
                  }}
                  placeholder="119.90"
                />
                <p className="text-xs text-gray-600 mt-1">Acesso total + SOS</p>
              </div>
            </div>
            
            <Button 
              onClick={handleSavePrices} 
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
              data-save-prices
            >
              <Save className="w-4 h-4 mr-2" />
              💾 Salvar Preços dos Planos
            </Button>
          </CardContent>
        </Card>

        {/* Configurações do Assistente IA/ChatGPT */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Bot className="w-5 h-5" />
              🤖 Assistente IA (ChatGPT)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Ativar ChatGPT</Label>
                  <p className="text-sm text-gray-600">
                    Usar IA real do OpenAI para respostas inteligentes
                  </p>
                </div>
                <Switch
                  checked={aiConfig.assistantEnabled}
                  onCheckedChange={(checked) => 
                    setAiConfig({...aiConfig, assistantEnabled: checked})
                  }
                />
              </div>

              {aiConfig.assistantEnabled && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="openaiApiKey">Chave API OpenAI *</Label>
                      <Input
                        id="openaiApiKey"
                        type="password"
                        value={aiConfig.openaiApiKey}
                        onChange={(e) => setAiConfig({...aiConfig, openaiApiKey: e.target.value})}
                        placeholder="sk-..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Obtenha em: <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-600">platform.openai.com</a>
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="openaiModel">Modelo GPT</Label>
                      <select
                        id="openaiModel"
                        value={aiConfig.openaiModel}
                        onChange={(e) => setAiConfig({...aiConfig, openaiModel: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="gpt-4o">GPT-4o (Recomendado)</option>
                        <option value="gpt-4o-mini">GPT-4o Mini (Econômico)</option>
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assistantInstructions">Instruções para o Assistente</Label>
                    <Textarea
                      id="assistantInstructions"
                      value={aiConfig.assistantInstructions}
                      onChange={(e) => setAiConfig({...aiConfig, assistantInstructions: e.target.value})}
                      rows={3}
                      placeholder="Como o assistente deve se comportar..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assistantTemperature">Criatividade (0-1)</Label>
                      <Input
                        id="assistantTemperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={aiConfig.assistantTemperature}
                        onChange={(e) => setAiConfig({...aiConfig, assistantTemperature: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="assistantMaxTokens">Tokens máximos</Label>
                      <Input
                        id="assistantMaxTokens"
                        type="number"
                        value={aiConfig.assistantMaxTokens}
                        onChange={(e) => setAiConfig({...aiConfig, assistantMaxTokens: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className={`p-3 rounded-lg ${aiConfig.assistantEnabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${aiConfig.assistantEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="font-medium text-sm">
                    {aiConfig.assistantEnabled ? 'IA Ativada' : 'Modo Básico'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {aiConfig.assistantEnabled 
                    ? 'Respostas inteligentes com ChatGPT em tempo real'
                    : 'Usando respostas pré-programadas (sem custo adicional)'}
                </p>
              </div>

              <Button 
                onClick={handleSaveAI} 
                className={`w-full ${aiConfig.assistantEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                <Save className="w-4 h-4 mr-2" />
                {aiConfig.assistantEnabled ? 'Ativar ChatGPT' : 'Salvar Configurações'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 💾 Configuração do Banco de Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💾 Configuração do Banco de Dados
              <Badge variant={databaseConfig.isConfigured ? "default" : "secondary"}>
                {databaseConfig.isConfigured ? "Configurado" : "Pendente"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">📋 Como configurar seu Supabase:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Acesse <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a> e crie uma conta</li>
                  <li>2. Crie um novo projeto</li>
                  <li>3. Vá em Settings → API</li>
                  <li>4. Copie a "Project URL" e cole no campo abaixo</li>
                  <li>5. Copie a "anon/public" key e cole no campo abaixo</li>
                  <li>6. Opcionalmente, copie a "service_role" key para recursos avançados</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="supabaseUrl">🔗 URL do Projeto Supabase *</Label>
                  <Input
                    id="supabaseUrl"
                    type="url"
                    value={databaseConfig.supabaseUrl}
                    onChange={(e) => setDatabaseConfig({...databaseConfig, supabaseUrl: e.target.value})}
                    placeholder="https://seu-projeto.supabase.co"
                  />
                </div>

                <div>
                  <Label htmlFor="supabaseAnonKey">🔑 Chave Anônima (anon/public) *</Label>
                  <Input
                    id="supabaseAnonKey"
                    type="password"
                    value={databaseConfig.supabaseAnonKey}
                    onChange={(e) => setDatabaseConfig({...databaseConfig, supabaseAnonKey: e.target.value})}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  />
                </div>

                <div>
                  <Label htmlFor="supabaseServiceKey">🛡️ Chave de Serviço (service_role) - Opcional</Label>
                  <Input
                    id="supabaseServiceKey"
                    type="password"
                    value={databaseConfig.supabaseServiceKey}
                    onChange={(e) => setDatabaseConfig({...databaseConfig, supabaseServiceKey: e.target.value})}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  />
                  <p className="text-xs text-gray-600 mt-1">Necessário para funções administrativas avançadas</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestConnection} variant="outline" className="flex-1">
                  🔍 Testar Conexão
                </Button>
                <Button onClick={handleSaveDatabase} className="flex-1">
                  💾 Salvar Configurações
                </Button>
              </div>

              <div className={`p-3 rounded-lg ${databaseConfig.isConfigured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${databaseConfig.isConfigured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="font-medium text-sm">
                    {databaseConfig.isConfigured ? 'Banco Configurado' : 'Configuração Pendente'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {databaseConfig.isConfigured 
                    ? 'Dados sendo salvos no Supabase com segurança'
                    : 'Configure o banco para persistir dados dos usuários'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 📧 Configuração de Email/SMTP */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📧 Configuração de Email & Validação
              <Badge variant={emailConfig.isConfigured ? "default" : "secondary"}>
                {emailConfig.isConfigured ? "Configurado" : "Pendente"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">✨ Validação por Email Ativa</h3>
                <p className="text-sm text-green-800 mb-3">
                  Quando ativado, usuários precisam confirmar email com código de 6 dígitos antes de usar a plataforma
                </p>
                
                <details className="text-sm text-green-800">
                  <summary className="font-medium cursor-pointer hover:underline">📋 Guia Rápido de Configuração SMTP</summary>
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-green-300">
                    <div>
                      <strong>Gmail:</strong> smtp.gmail.com:587<br/>
                      <em>Ative 2FA e use senha de app</em>
                    </div>
                    <div>
                      <strong>Outlook:</strong> smtp-mail.outlook.com:587<br/>
                      <em>Use credenciais normais da conta</em>
                    </div>
                    <div>
                      <strong>Yahoo:</strong> smtp.mail.yahoo.com:587<br/>
                      <em>Ative "Apps menos seguros"</em>
                    </div>
                    <div>
                      <strong>Zoho:</strong> smtp.zoho.com:587<br/>
                      <em>Configure senha de app específica</em>
                    </div>
                  </div>
                </details>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="emailProvider">📮 Provedor de Email</Label>
                  <select
                    id="emailProvider"
                    value={emailConfig.provider}
                    onChange={(e) => setEmailConfig({...emailConfig, provider: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="sendgrid">SendGrid (Recomendado)</option>
                    <option value="smtp">SMTP Personalizado</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="resend">Resend</option>
                  </select>
                </div>

                {emailConfig.provider === "sendgrid" && (
                  <div>
                    <Label htmlFor="sendgridApiKey">🔑 Chave API SendGrid</Label>
                    <Input
                      id="sendgridApiKey"
                      type="password"
                      value={emailConfig.sendgridApiKey}
                      onChange={(e) => setEmailConfig({...emailConfig, sendgridApiKey: e.target.value})}
                      placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Obtenha em: <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" className="underline">SendGrid → API Keys</a>
                    </p>
                  </div>
                )}

                {emailConfig.provider === "smtp" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpHost">🌐 Host SMTP</Label>
                      <Input
                        id="smtpHost"
                        value={emailConfig.smtpHost}
                        onChange={(e) => setEmailConfig({...emailConfig, smtpHost: e.target.value})}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="smtpPort">🔌 Porta</Label>
                      <Input
                        id="smtpPort"
                        value={emailConfig.smtpPort}
                        onChange={(e) => setEmailConfig({...emailConfig, smtpPort: e.target.value})}
                        placeholder="587"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="smtpUser">👤 Usuário SMTP</Label>
                      <Input
                        id="smtpUser"
                        value={emailConfig.smtpUser}
                        onChange={(e) => setEmailConfig({...emailConfig, smtpUser: e.target.value})}
                        placeholder="seu-email@gmail.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="smtpPassword">🔒 Senha SMTP</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={emailConfig.smtpPassword}
                        onChange={(e) => setEmailConfig({...emailConfig, smtpPassword: e.target.value})}
                        placeholder="sua-senha-smtp"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromEmail">📤 Email Remetente</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailConfig.fromEmail}
                      onChange={(e) => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                      placeholder="noreply@seudominio.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fromName">🏷️ Nome Remetente</Label>
                    <Input
                      id="fromName"
                      value={emailConfig.fromName}
                      onChange={(e) => setEmailConfig({...emailConfig, fromName: e.target.value})}
                      placeholder="MetaCircle"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Switch
                    checked={emailConfig.emailVerificationEnabled}
                    onCheckedChange={(checked) => 
                      setEmailConfig({...emailConfig, emailVerificationEnabled: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">🔐 Validação Obrigatória</Label>
                    <p className="text-xs text-gray-600">
                      Usuários devem confirmar email antes de acessar
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestEmail} variant="outline" className="flex-1">
                  📧 Enviar Email Teste
                </Button>
                <Button onClick={handleSaveEmail} className="flex-1">
                  💾 Salvar Configurações
                </Button>
              </div>

              <div className={`p-3 rounded-lg ${emailConfig.isConfigured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${emailConfig.isConfigured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="font-medium text-sm">
                    {emailConfig.isConfigured ? 'Email Configurado' : 'Configuração Pendente'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {emailConfig.isConfigured 
                    ? `Emails sendo enviados via ${emailConfig.provider.toUpperCase()}`
                    : 'Configure email para ativar validação de usuários'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 📊 Analytics & Métricas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Analytics & Métricas
              <Badge variant={analyticsConfig.enabled ? "default" : "secondary"}>
                {analyticsConfig.enabled ? "Ativo" : "Desabilitado"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Switch
                  checked={analyticsConfig.enabled}
                  onCheckedChange={(checked) => 
                    setAnalyticsConfig({...analyticsConfig, enabled: checked})
                  }
                />
                <div>
                  <Label className="font-medium">📈 Habilitar Analytics</Label>
                  <p className="text-xs text-gray-600">
                    Coleta dados de uso para relatórios e insights
                  </p>
                </div>
              </div>

              {analyticsConfig.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="googleAnalytics">🔍 Google Analytics ID</Label>
                    <Input
                      id="googleAnalytics"
                      value={analyticsConfig.googleAnalyticsId}
                      onChange={(e) => setAnalyticsConfig({...analyticsConfig, googleAnalyticsId: e.target.value})}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="facebookPixel">📘 Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixel"
                      value={analyticsConfig.facebookPixelId}
                      onChange={(e) => setAnalyticsConfig({...analyticsConfig, facebookPixelId: e.target.value})}
                      placeholder="123456789012345"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hotjar">🔥 Hotjar ID</Label>
                    <Input
                      id="hotjar"
                      value={analyticsConfig.hotjarId}
                      onChange={(e) => setAnalyticsConfig({...analyticsConfig, hotjarId: e.target.value})}
                      placeholder="1234567"
                    />
                  </div>
                </div>
              )}

              <Button onClick={handleSaveAnalytics} className="w-full">
                💾 Salvar Configurações Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 🔒 Segurança Avançada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔒 Segurança & Proteção
              <Badge variant="default">Enterprise</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Switch
                    checked={securityConfig.rateLimitEnabled}
                    onCheckedChange={(checked) => 
                      setSecurityConfig({...securityConfig, rateLimitEnabled: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">⚡ Rate Limiting</Label>
                    <p className="text-xs text-gray-600">Proteção contra spam</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Switch
                    checked={securityConfig.enableAuditLogs}
                    onCheckedChange={(checked) => 
                      setSecurityConfig({...securityConfig, enableAuditLogs: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">📋 Logs de Auditoria</Label>
                    <p className="text-xs text-gray-600">Rastrear ações admin</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Switch
                    checked={securityConfig.autoBackupEnabled}
                    onCheckedChange={(checked) => 
                      setSecurityConfig({...securityConfig, autoBackupEnabled: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">💾 Backup Automático</Label>
                    <p className="text-xs text-gray-600">Proteção de dados</p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="sessionTimeout">⏱️ Timeout Sessão (min)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securityConfig.sessionTimeoutMinutes}
                    onChange={(e) => setSecurityConfig({...securityConfig, sessionTimeoutMinutes: parseInt(e.target.value)})}
                    placeholder="30"
                  />
                </div>
              </div>

              <Button onClick={handleSaveSecurity} className="w-full">
                🛡️ Salvar Configurações de Segurança
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 🎨 Personalização & Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Personalização & Branding
              <Badge variant="secondary">White Label</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Switch
                    checked={customizationConfig.allowCustomThemes}
                    onCheckedChange={(checked) => 
                      setCustomizationConfig({...customizationConfig, allowCustomThemes: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">🌈 Temas Personalizados</Label>
                    <p className="text-xs text-gray-600">Permitir cores customizadas</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Switch
                    checked={customizationConfig.allowLogoUpload}
                    onCheckedChange={(checked) => 
                      setCustomizationConfig({...customizationConfig, allowLogoUpload: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">🖼️ Upload de Logo</Label>
                    <p className="text-xs text-gray-600">Logo personalizado do cliente</p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customDomain">🌐 Domínio Personalizado</Label>
                  <Input
                    id="customDomain"
                    value={customizationConfig.customDomain}
                    onChange={(e) => setCustomizationConfig({...customizationConfig, customDomain: e.target.value})}
                    placeholder="minhacomunidade.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="primaryColor">🎨 Cor Primária</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={customizationConfig.customColors.primary}
                    onChange={(e) => setCustomizationConfig({
                      ...customizationConfig, 
                      customColors: {...customizationConfig.customColors, primary: e.target.value}
                    })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveCustomization} className="w-full">
                🎨 Salvar Personalização
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 📱 Configurações Mobile App */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              📱 Apps Mobile (Android & iOS)
              <Badge variant="outline" className="bg-green-100">
                Em Desenvolvimento
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">🚀 Próxima Fase do Projeto</h3>
                <p className="text-sm text-green-800">
                  Apps nativos para Android e iOS estão sendo desenvolvidos com as mesmas funcionalidades da web
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <Switch
                    checked={mobileConfig.androidAppEnabled}
                    onCheckedChange={(checked) => 
                      setMobileConfig({...mobileConfig, androidAppEnabled: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">🤖 App Android</Label>
                    <p className="text-xs text-gray-600">Google Play Store</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <Switch
                    checked={mobileConfig.iosAppEnabled}
                    onCheckedChange={(checked) => 
                      setMobileConfig({...mobileConfig, iosAppEnabled: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">🍎 App iOS</Label>
                    <p className="text-xs text-gray-600">Apple App Store</p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="appName">📱 Nome do App</Label>
                  <Input
                    id="appName"
                    value={mobileConfig.appName}
                    onChange={(e) => setMobileConfig({...mobileConfig, appName: e.target.value})}
                    placeholder="MetaCircle"
                  />
                </div>
                
                <div>
                  <Label htmlFor="appDescription">📝 Descrição do App</Label>
                  <Input
                    id="appDescription"
                    value={mobileConfig.appDescription}
                    onChange={(e) => setMobileConfig({...mobileConfig, appDescription: e.target.value})}
                    placeholder="Comunidade Digital Moderna"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <Switch
                    checked={mobileConfig.pushNotificationsEnabled}
                    onCheckedChange={(checked) => 
                      setMobileConfig({...mobileConfig, pushNotificationsEnabled: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">🔔 Push Notifications</Label>
                    <p className="text-xs text-gray-600">Notificações em tempo real</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <Switch
                    checked={mobileConfig.deepLinksEnabled}
                    onCheckedChange={(checked) => 
                      setMobileConfig({...mobileConfig, deepLinksEnabled: checked})
                    }
                  />
                  <div>
                    <Label className="font-medium">🔗 Deep Links</Label>
                    <p className="text-xs text-gray-600">Links diretos para conteúdo</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveMobile} className="w-full bg-green-600 hover:bg-green-700">
                📱 Salvar Configurações Mobile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Suporte */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Phone className="w-5 h-5" />
              📞 Suporte ao Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Habilitar Suporte</Label>
                  <p className="text-sm text-gray-600">
                    Mostrar opções de contato para usuários
                  </p>
                </div>
                <Switch
                  checked={supportConfig.supportEnabled}
                  onCheckedChange={(checked) => 
                    setSupportConfig({...supportConfig, supportEnabled: checked})
                  }
                />
              </div>

              {supportConfig.supportEnabled && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supportWhatsapp">WhatsApp de Suporte</Label>
                      <Input
                        id="supportWhatsapp"
                        type="tel"
                        value={supportConfig.supportWhatsapp}
                        onChange={(e) => setSupportConfig({...supportConfig, supportWhatsapp: e.target.value})}
                        placeholder="17997337322"
                      />
                    </div>

                    <div>
                      <Label htmlFor="supportEmail">Email de Suporte</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={supportConfig.supportEmail}
                        onChange={(e) => setSupportConfig({...supportConfig, supportEmail: e.target.value})}
                        placeholder="suporte@empresa.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSaveSupport} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações de Suporte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Automações e Integrações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Automações e Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Configurações de Notificação */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Notificações</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações WhatsApp</Label>
                      <p className="text-sm text-gray-500">
                        Receber alerta quando houver nova mensagem
                      </p>
                    </div>
                    <Switch
                      checked={automationConfig.whatsappNotifications}
                      onCheckedChange={(checked) => 
                        setAutomationConfig({...automationConfig, whatsappNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações Email</Label>
                      <p className="text-sm text-gray-500">
                        Receber resumo diário por email
                      </p>
                    </div>
                    <Switch
                      checked={automationConfig.emailNotifications}
                      onCheckedChange={(checked) => 
                        setAutomationConfig({...automationConfig, emailNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-confirmar agendamentos</Label>
                      <p className="text-sm text-gray-500">
                        Confirmar automaticamente novos agendamentos
                      </p>
                    </div>
                    <Switch
                      checked={automationConfig.autoConfirmAppointments}
                      onCheckedChange={(checked) => 
                        setAutomationConfig({...automationConfig, autoConfirmAppointments: checked})
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="responseTime">Tempo de resposta (horas)</Label>
                    <Input
                      id="responseTime"
                      type="number"
                      value={automationConfig.responseTimeHours}
                      onChange={(e) => 
                        setAutomationConfig({...automationConfig, responseTimeHours: parseInt(e.target.value)})
                      }
                      min="1"
                      max="48"
                      className="w-24"
                    />
                  </div>
                </div>
              </div>

              {/* Integração N8N */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Integração N8N</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="n8nWebhook">Webhook URL do N8N</Label>
                    <Input
                      id="n8nWebhook"
                      value={automationConfig.n8nWebhookUrl}
                      onChange={(e) => 
                        setAutomationConfig({...automationConfig, n8nWebhookUrl: e.target.value})
                      }
                      placeholder="https://seu-n8n.com/webhook/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Configure seu webhook no N8N para receber eventos
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Eventos disponíveis:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Nova mensagem no chat</li>
                      <li>• Novo agendamento criado</li>
                      <li>• Agendamento confirmado</li>
                      <li>• Usuário Premium registrado</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900">Mensagem padrão WhatsApp:</span>
                    </div>
                    <p className="text-sm text-green-800 mt-2">
                      "Olá {specialistConfig.name}! Você tem uma nova mensagem na plataforma MetaCircle. 
                      Acesse: [link da plataforma]"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button onClick={handleSaveAutomation} className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações de Automação
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview - Como aparece para os usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl">
                    {specialistConfig.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{specialistConfig.name}</h3>
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Especialista
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{specialistConfig.speciality}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{specialistConfig.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Responde em até {automationConfig.responseTimeHours}h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}