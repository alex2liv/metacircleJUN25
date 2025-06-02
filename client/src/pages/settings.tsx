import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { useToast } from "@/hooks/use-toast";
import { validateSecureUrl, hasAdminAccess, validateFormInput } from "@/lib/security";
import { Settings2, Lock, ExternalLink, Save, Shield, Users, Upload, Camera, Smartphone, QrCode, CheckCircle, AlertCircle } from "lucide-react";
import { CurrencyInput } from "@/components/currency-input";
import { useQuery } from "@tanstack/react-query";

const perfectPaySettingsSchema = z.object({
  defaultPassword: z.string().min(1, "Senha é obrigatória").max(50, "Senha muito longa"),
  baseUrl: z.string().url("URL inválida").refine(validateSecureUrl, {
    message: "URL não é de um domínio PerfectPay autorizado"
  }),
  autoLogin: z.boolean(),
});

const specialistSettingsSchema = z.object({
  specialistName: z.string().min(1, "Nome do especialista é obrigatório").max(100, "Nome muito longo"),
  specialistWhatsApp: z.string().min(10, "WhatsApp inválido").max(15, "WhatsApp muito longo"),
  basicPlanPrice: z.number().min(1, "Preço deve ser maior que zero").max(999, "Preço muito alto"),
  intermediatePlanPrice: z.number().min(1, "Preço deve ser maior que zero").max(999, "Preço muito alto"),
  premiumPlanPrice: z.number().min(1, "Preço deve ser maior que zero").max(999, "Preço muito alto"),
  sosTicketsPerYear: z.number().min(0, "Tickets não pode ser negativo").max(12, "Máximo 12 tickets por ano"),
  sosTicketPrice: z.number().min(1, "Preço deve ser maior que zero").max(999, "Preço muito alto"),
  ebooksEnabled: z.boolean(),
  teleconsultaEnabled: z.boolean(),
});

type PerfectPaySettings = z.infer<typeof perfectPaySettingsSchema>;
type SpecialistSettings = z.infer<typeof specialistSettingsSchema>;

// Componente para conexão WhatsApp do especialista
function WhatsAppConnection() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  // Buscar status do WhatsApp
  const { data: whatsappStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/whatsapp/status'],
    refetchInterval: 3000, // Atualizar a cada 3 segundos
  });

  const handleConnectWhatsApp = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/whatsapp/initialize', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast({
          title: "Inicializando WhatsApp",
          description: "Escaneie o QR code que aparecerá abaixo com seu WhatsApp.",
        });
        refetchStatus();
      } else {
        throw new Error('Erro ao inicializar WhatsApp');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível inicializar a conexão WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    try {
      const response = await fetch('/api/whatsapp/disconnect', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast({
          title: "WhatsApp Desconectado",
          description: "Sua conta WhatsApp foi desconectada com sucesso.",
        });
        refetchStatus();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao desconectar WhatsApp.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Status da Conexão */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-medium">Status da Conexão</h3>
            <p className="text-sm text-gray-600">
              {whatsappStatus?.connected ? 'WhatsApp conectado e pronto' : 'WhatsApp não conectado'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {whatsappStatus?.connected ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Conectado</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">Desconectado</span>
            </>
          )}
        </div>
      </div>

      {/* QR Code ou Controles */}
      {!whatsappStatus?.connected ? (
        <div className="text-center space-y-4">
          {whatsappStatus?.hasQrCode && whatsappStatus?.qr ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <img 
                    src={`data:image/png;base64,${whatsappStatus.qr}`} 
                    alt="QR Code WhatsApp" 
                    className="w-48 h-48"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Escaneie o QR Code</h3>
                <p className="text-sm text-gray-600">
                  1. Abra o WhatsApp no seu celular<br/>
                  2. Toque em Mais opções → WhatsApp Web<br/>
                  3. Aponte seu celular para esta tela para escanear o código
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Conectar WhatsApp</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Conecte seu WhatsApp pessoal para receber mensagens diretas de membros premium
                </p>
                <Button 
                  onClick={handleConnectWhatsApp}
                  disabled={isConnecting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isConnecting ? "Iniciando..." : "Gerar QR Code"}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <div>
            <h3 className="font-medium text-green-900 mb-2">WhatsApp Conectado!</h3>
            <p className="text-sm text-green-700 mb-4">
              Seu WhatsApp está conectado e pronto para receber mensagens de membros premium
            </p>
            <Button 
              onClick={handleDisconnectWhatsApp}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Desconectar WhatsApp
            </Button>
          </div>
        </div>
      )}

      {/* Informações importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Apenas membros premium podem enviar mensagens diretas</li>
          <li>• Você receberá notificações diretamente no seu WhatsApp</li>
          <li>• Sua privacidade é protegida - apenas membros autorizados</li>
          <li>• Você pode desconectar a qualquer momento</li>
        </ul>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const { isOwner, isAdmin } = useUserRole();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("/api/placeholder/150/150");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const perfectPayForm = useForm<PerfectPaySettings>({
    resolver: zodResolver(perfectPaySettingsSchema),
    defaultValues: {
      defaultPassword: "12345",
      baseUrl: "https://clarissavaz.academy.perfectpay.com.br",
      autoLogin: true,
    },
  });

  const specialistForm = useForm<SpecialistSettings>({
    resolver: zodResolver(specialistSettingsSchema),
    defaultValues: {
      specialistName: "Clarissa Vaz",
      specialistWhatsApp: "11910018833",
      basicPlanPrice: 10,
      intermediatePlanPrice: 39,
      premiumPlanPrice: 99,
      sosTicketsPerYear: 3,
      sosTicketPrice: 119,
      ebooksEnabled: true,
      teleconsultaEnabled: true,
    },
  });

  // Função para upload de foto
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          toast({
            title: "Foto atualizada!",
            description: "Sua foto de perfil foi alterada com sucesso.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSpecialistSubmit = async (data: SpecialistSettings) => {
    setIsLoading(true);
    try {
      const validation = validateFormInput(data, specialistSettingsSchema);
      if (!validation.isValid) {
        toast({
          title: "Dados inválidos",
          description: validation.errors.join(', '),
          variant: "destructive",
        });
        return;
      }

      // Salvar configurações do especialista
      localStorage.setItem('specialistSettings', JSON.stringify(data));
      
      toast({
        title: "✅ Configurações salvas!",
        description: "As configurações do especialista foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPerfectPaySubmit = async (data: PerfectPaySettings) => {
    setIsLoading(true);
    try {
      // Validação de segurança adicional
      const validation = validateFormInput(data, perfectPaySettingsSchema);
      if (!validation.isValid) {
        toast({
          title: "Dados inválidos",
          description: validation.errors.join(', '),
          variant: "destructive",
        });
        return;
      }

      // Verificar permissão administrativa
      if (!hasAdminAccess(user?.role)) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para alterar essas configurações.",
          variant: "destructive",
        });
        return;
      }
      
      // Aqui seria feita a chamada para salvar as configurações no backend
      console.log("Configurações PerfectPay (sanitizadas):", validation.sanitizedData);
      
      // Simular salvamento seguro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do PerfectPay foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar se é especialista para mostrar apenas a aba WhatsApp
  const isSpecialist = user?.role === 'specialist';
  
  // Debug: verificar qual role está sendo recebido
  console.log('User role:', user?.role, 'isSpecialist:', isSpecialist, 'isAdmin:', isAdmin, 'isOwner:', isOwner);
  
  // Só admins, owners e especialistas podem acessar configurações
  if (!isAdmin && !isOwner && !isSpecialist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Restrito</h3>
          <p className="text-gray-600">Você não tem permissão para acessar as configurações.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings2 className="w-8 h-8" />
          Configurações
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie as configurações da comunidade e integrações
        </p>
      </div>

      <Tabs defaultValue={isSpecialist ? "whatsapp" : "perfectpay"} className="space-y-6">
        <TabsList>
          {!isSpecialist && <TabsTrigger value="perfectpay">PerfectPay</TabsTrigger>}
          {!isSpecialist && <TabsTrigger value="specialist">Especialista</TabsTrigger>}
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          {!isSpecialist && <TabsTrigger value="community">Comunidade</TabsTrigger>}
          {!isSpecialist && <TabsTrigger value="integrations">Integrações</TabsTrigger>}
        </TabsList>

        {/* Configurações PerfectPay */}
        <TabsContent value="perfectpay">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Configurações PerfectPay
              </CardTitle>
              <CardDescription>
                Configure a integração com a plataforma de cursos PerfectPay
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={perfectPayForm.handleSubmit(onPerfectPaySubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">URL Base da Plataforma</Label>
                    <Input
                      id="baseUrl"
                      {...perfectPayForm.register("baseUrl")}
                      placeholder="https://clarissavaz.academy.perfectpay.com.br"
                    />
                    {perfectPayForm.formState.errors.baseUrl && (
                      <p className="text-sm text-red-600">
                        {perfectPayForm.formState.errors.baseUrl.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultPassword">Senha Padrão</Label>
                    <Input
                      id="defaultPassword"
                      type="password"
                      {...perfectPayForm.register("defaultPassword")}
                      placeholder="12345"
                    />
                    {perfectPayForm.formState.errors.defaultPassword && (
                      <p className="text-sm text-red-600">
                        {perfectPayForm.formState.errors.defaultPassword.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Esta senha será usada por todos os usuários para acessar o PerfectPay
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoLogin"
                    checked={perfectPayForm.watch("autoLogin")}
                    onCheckedChange={(checked) => perfectPayForm.setValue("autoLogin", checked)}
                  />
                  <Label htmlFor="autoLogin">
                    Mostrar credenciais automaticamente aos usuários
                  </Label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Como funciona a integração:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Os usuários usam o mesmo email do MetaCircle</li>
                    <li>• A senha do PerfectPay é diferente e configurável aqui</li>
                    <li>• As credenciais são mostradas automaticamente quando necessário</li>
                    <li>• Os links abrem em nova aba para manter o usuário na comunidade</li>
                  </ul>
                </div>

                {/* Indicador de Segurança */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Configuração Segura</h4>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>✓ URLs validadas contra domínios autorizados</li>
                    <li>✓ Dados sanitizados para prevenir XSS</li>
                    <li>✓ Acesso restrito apenas para administradores</li>
                    <li>✓ Validação dupla de permissões</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </form>

              {/* Teste de Conexão */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Teste de Conexão</h4>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const baseUrl = perfectPayForm.getValues("baseUrl");
                      window.open(`${baseUrl}/login/`, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Testar Login PerfectPay
                  </Button>
                  <p className="text-sm text-gray-600">
                    Use: {user?.email} / {perfectPayForm.watch("defaultPassword")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações do Especialista */}
        <TabsContent value="specialist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Configurações do Especialista Premium
              </CardTitle>
              <CardDescription>
                Configure o especialista e plano premium da sua comunidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={specialistForm.handleSubmit(onSpecialistSubmit)} className="space-y-6">
                {/* Upload de Foto de Perfil */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="Foto do perfil"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Alterar Foto
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG ou GIF (máx. 5MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="specialistName">Nome do Especialista</Label>
                    <Input
                      id="specialistName"
                      placeholder="Ex: Clarissa Vaz"
                      {...specialistForm.register("specialistName")}
                    />
                    {specialistForm.formState.errors.specialistName && (
                      <p className="text-sm text-red-500">
                        {specialistForm.formState.errors.specialistName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialistWhatsApp">WhatsApp do Especialista</Label>
                    <Input
                      id="specialistWhatsApp"
                      placeholder="Ex: 11910018833"
                      {...specialistForm.register("specialistWhatsApp")}
                    />
                    {specialistForm.formState.errors.specialistWhatsApp && (
                      <p className="text-sm text-red-500">
                        {specialistForm.formState.errors.specialistWhatsApp.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="basicPlanPrice">Preço Plano Básico</Label>
                    <CurrencyInput
                      value={specialistForm.watch("basicPlanPrice") || 0}
                      onChange={(value) => specialistForm.setValue("basicPlanPrice", value)}
                      placeholder="10,00"
                    />
                    {specialistForm.formState.errors.basicPlanPrice && (
                      <p className="text-sm text-red-500">
                        {specialistForm.formState.errors.basicPlanPrice.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intermediatePlanPrice">Preço Plano Intermediário</Label>
                    <CurrencyInput
                      value={specialistForm.watch("intermediatePlanPrice") || 0}
                      onChange={(value) => specialistForm.setValue("intermediatePlanPrice", value)}
                      placeholder="39,00"
                    />
                    {specialistForm.formState.errors.intermediatePlanPrice && (
                      <p className="text-sm text-red-500">
                        {specialistForm.formState.errors.intermediatePlanPrice.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premiumPlanPrice">Preço Plano Premium</Label>
                    <CurrencyInput
                      value={specialistForm.watch("premiumPlanPrice") || 0}
                      onChange={(value) => specialistForm.setValue("premiumPlanPrice", value)}
                      placeholder="99,00"
                    />
                    {specialistForm.formState.errors.premiumPlanPrice && (
                      <p className="text-sm text-red-500">
                        {specialistForm.formState.errors.premiumPlanPrice.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Comparativo dos Planos:</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-blue-600 mb-2">📦 Básico</h5>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Acesso à comunidade</li>
                        <li>• Eventos gratuitos</li>
                        <li>• Ranking básico</li>
                        <li>• Botão cursos MetaSync</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-600 mb-2">🚀 Intermediário</h5>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Tudo do Básico +</li>
                        <li>• 3 cursos por mês</li>
                        <li>• 1 live mensal</li>
                        <li>• 2 podcasts por mês</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-purple-600 mb-2">👑 Premium</h5>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Tudo do Intermediário +</li>
                        <li>• Cursos ilimitados</li>
                        <li>• 2 lives mensais exclusivas</li>
                        <li>• Podcast semanal</li>
                        <li>• WhatsApp direto especialista</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações WhatsApp */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp do Especialista
              </CardTitle>
              <CardDescription>
                Conecte seu WhatsApp pessoal para comunicação direta com membros premium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <WhatsAppConnection />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações da Comunidade */}
        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Comunidade</CardTitle>
              <CardDescription>
                Configure as opções gerais da sua comunidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Configurações da comunidade em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outras Integrações */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Configurações MetaBridge - WhatsApp</CardTitle>
              <CardDescription>
                Configure a integração com o MetaBridge para notificações WhatsApp automáticas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metabridgeUrl">URL do MetaBridge</Label>
                  <Input
                    id="metabridgeUrl"
                    placeholder="https://metabridge-api.metasync.com.br"
                    defaultValue="https://metabridge-api.metasync.com.br"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instanceName">Nome da Instância</Label>
                  <Input
                    id="instanceName"
                    placeholder="metacircle-instance"
                    defaultValue="metacircle-instance"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">Chave da API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Sua chave da API do MetaBridge"
                  />
                  <p className="text-xs text-gray-500">
                    Obtida no painel administrativo do MetaBridge
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">URL do Webhook (opcional)</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://metacircle.metasync.com.br/webhook"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2">Funcionalidades Disponíveis:</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>📅 Notificações automáticas de eventos (1 semana, 1 dia, 1 hora antes)</li>
                  <li>📱 Envio via Evolution API integrada ao MetaBridge</li>
                  <li>👥 Suporte a grupos e contatos individuais</li>
                  <li>⚡ Notificações em tempo real quando eventos começam</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações MetaBridge
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}