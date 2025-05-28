import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, MessageSquare, Calendar, Users, Video } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferences {
  receiveWhatsappNotifications: boolean;
  receiveCommentNotifications: boolean;
  receiveEventNotifications: boolean;
  receiveVideoNotifications: boolean;
  receiveMentionNotifications: boolean;
  phoneNumber?: string;
}

export function NotificationSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    receiveWhatsappNotifications: true,
    receiveCommentNotifications: false,
    receiveEventNotifications: true,
    receiveVideoNotifications: true,
    receiveMentionNotifications: true,
    phoneNumber: "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validar número de telefone se notificações WhatsApp estão ativas
      if (preferences.receiveWhatsappNotifications && !preferences.phoneNumber) {
        toast({
          title: "Número obrigatório",
          description: "Informe seu número do WhatsApp para receber notificações",
          variant: "destructive",
        });
        return;
      }

      // Simular salvamento das preferências
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Preferências salvas",
        description: "Suas configurações de notificação foram atualizadas",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara brasileira
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numbers;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Configurações de Notificação
        </CardTitle>
        <CardDescription>
          Configure quando e como você quer receber notificações da comunidade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* WhatsApp */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Notificações WhatsApp</h4>
              <p className="text-sm text-gray-600">
                Receba notificações diretamente no seu WhatsApp
              </p>
            </div>
            <Switch
              checked={preferences.receiveWhatsappNotifications}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, receiveWhatsappNotifications: checked }))
              }
            />
          </div>
          
          {preferences.receiveWhatsappNotifications && (
            <div className="space-y-2 ml-4 pl-4 border-l-2 border-green-200">
              <Label htmlFor="phoneNumber">Número do WhatsApp</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={preferences.phoneNumber}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  phoneNumber: formatPhoneNumber(e.target.value)
                }))}
                placeholder="(11) 99999-9999"
                className="max-w-xs"
              />
              <p className="text-xs text-gray-500">
                Incluir DDD. Exemplo: (11) 99999-9999
              </p>
            </div>
          )}
        </div>

        {/* Comentários */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <div className="space-y-1">
              <h4 className="font-medium">Comentários em seus posts</h4>
              <p className="text-sm text-gray-600">
                Seja notificado quando alguém comentar em seus posts
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.receiveCommentNotifications}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, receiveCommentNotifications: checked }))
            }
          />
        </div>

        {/* Eventos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div className="space-y-1">
              <h4 className="font-medium">Eventos</h4>
              <p className="text-sm text-gray-600">
                Lembretes automáticos de eventos (1 semana, 1 dia, 1 hora antes)
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.receiveEventNotifications}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, receiveEventNotifications: checked }))
            }
          />
        </div>

        {/* Vídeos/Lives */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-red-600" />
            <div className="space-y-1">
              <h4 className="font-medium">Novos vídeos e lives</h4>
              <p className="text-sm text-gray-600">
                Seja avisado quando novos vídeos ou lives forem adicionados
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.receiveVideoNotifications}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, receiveVideoNotifications: checked }))
            }
          />
        </div>

        {/* Menções */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-orange-600" />
            <div className="space-y-1">
              <h4 className="font-medium">Menções</h4>
              <p className="text-sm text-gray-600">
                Quando alguém mencionar você (@{user?.username})
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.receiveMentionNotifications}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, receiveMentionNotifications: checked }))
            }
          />
        </div>

        {/* Resumo das configurações */}
        {preferences.receiveWhatsappNotifications && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">
              Suas notificações WhatsApp estão ativas para:
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              {preferences.receiveCommentNotifications && (
                <li>✓ Comentários em seus posts</li>
              )}
              {preferences.receiveEventNotifications && (
                <li>✓ Lembretes de eventos</li>
              )}
              {preferences.receiveVideoNotifications && (
                <li>✓ Novos vídeos e lives</li>
              )}
              {preferences.receiveMentionNotifications && (
                <li>✓ Quando te mencionarem</li>
              )}
            </ul>
            {preferences.phoneNumber && (
              <p className="text-xs text-green-700 mt-2">
                Número: {preferences.phoneNumber}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Bell className="w-4 h-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar Preferências"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}