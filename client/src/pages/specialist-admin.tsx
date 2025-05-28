import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    // Aqui salvaria no backend
    toast({
      title: "💰 Preços atualizados!",
      description: `Básico: R$ ${planPrices.basicPrice} | Intermediário: R$ ${planPrices.intermediatePrice} | Premium: R$ ${planPrices.premiumPrice}`,
    });
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

  const updateAvailability = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const newAvailability = [...availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setAvailability(newAvailability);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Configurações do Especialista
              </h1>
              <p className="text-gray-600">
                Gerencie o perfil, disponibilidades e automações
              </p>
            </div>
          </div>
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
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: 300x300px
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
  );
}