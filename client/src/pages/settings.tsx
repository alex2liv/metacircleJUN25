import { useState } from "react";
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
import { Settings2, Lock, ExternalLink, Save, Shield, Users } from "lucide-react";

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
  premiumPlanPrice: z.number().min(1, "Preço deve ser maior que zero").max(999, "Preço muito alto"),
  premiumPlanName: z.string().min(1, "Nome do plano é obrigatório").max(50, "Nome muito longo"),
});

type PerfectPaySettings = z.infer<typeof perfectPaySettingsSchema>;
type SpecialistSettings = z.infer<typeof specialistSettingsSchema>;

export default function Settings() {
  const { user } = useAuth();
  const { isOwner, isAdmin } = useUserRole();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      premiumPlanPrice: 99,
      premiumPlanName: "Plano Premium Total",
    },
  });

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
        title: "Configurações salvas!",
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

  // Só admins e owners podem acessar configurações
  if (!isAdmin && !isOwner) {
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

      <Tabs defaultValue="perfectpay" className="space-y-6">
        <TabsList>
          <TabsTrigger value="perfectpay">PerfectPay</TabsTrigger>
          <TabsTrigger value="specialist">Especialista</TabsTrigger>
          <TabsTrigger value="community">Comunidade</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
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
                    <Label htmlFor="premiumPlanName">Nome do Plano Premium</Label>
                    <Input
                      id="premiumPlanName"
                      placeholder="Ex: Plano Premium Total"
                      {...specialistForm.register("premiumPlanName")}
                    />
                    {specialistForm.formState.errors.premiumPlanName && (
                      <p className="text-sm text-red-500">
                        {specialistForm.formState.errors.premiumPlanName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premiumPlanPrice">Preço Mensal (R$)</Label>
                    <Input
                      id="premiumPlanPrice"
                      type="number"
                      placeholder="99"
                      {...specialistForm.register("premiumPlanPrice", { valueAsNumber: true })}
                    />
                    {specialistForm.formState.errors.premiumPlanPrice && (
                      <p className="text-sm text-red-500">
                        {specialistForm.formState.errors.premiumPlanPrice.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">O que inclui o Plano Premium:</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>✨ Acesso a todos os cursos da plataforma</li>
                    <li>🎥 Lives exclusivas com o especialista</li>
                    <li>💬 Contato direto via WhatsApp com o especialista</li>
                    <li>🏆 Prioridade no ranking da comunidade</li>
                    <li>📚 Materiais complementares exclusivos</li>
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