import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, Smartphone, Settings, MessageCircle, Zap, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WhatsAppSettings() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [showPhoneConnection, setShowPhoneConnection] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [autoReply, setAutoReply] = useState(false);
  const [delaySettings, setDelaySettings] = useState({
    type: "intelligent",
    customDelay: "5",
    maxPerHour: "100"
  });

  const sendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Número Inválido",
        description: "Digite um número de telefone válido.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simular envio do código
    setTimeout(() => {
      setStep('code');
      setIsLoading(false);
      toast({
        title: "Código Enviado",
        description: "Verifique seu WhatsApp e digite o código de 8 dígitos recebido."
      });
    }, 2000);
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 8) {
      toast({
        title: "Código Inválido",
        description: "Digite o código de 8 dígitos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simular verificação
    setTimeout(() => {
      setIsConnected(true);
      setShowPhoneConnection(false);
      setStep('phone');
      setPhoneNumber('');
      setVerificationCode('');
      setIsLoading(false);
      
      toast({
        title: "WhatsApp Conectado!",
        description: "Sua conta foi conectada com sucesso."
      });
    }, 1500);
  };

  const disconnectWhatsApp = () => {
    setIsConnected(false);
    toast({
      title: "WhatsApp Desconectado",
      description: "Sua conta foi desconectada do sistema",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações WhatsApp</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure sua integração com WhatsApp para enviar convites
        </p>
      </div>

      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <span>Status da Conexão</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isConnected ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <div>
                <p className="font-medium">
                  {isConnected ? "WhatsApp Conectado" : "WhatsApp Desconectado"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isConnected 
                    ? "Pronto para enviar mensagens"
                    : "Conecte seu WhatsApp para enviar convites"
                  }
                </p>
              </div>
            </div>
            
            {isConnected ? (
              <Button variant="outline" onClick={disconnectWhatsApp}>
                Desconectar
              </Button>
            ) : (
              <Button onClick={() => setShowPhoneConnection(true)}>
                <Phone className="w-4 h-4 mr-2" />
                Conectar via Telefone
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Conexão via Telefone */}
      <Dialog open={showPhoneConnection} onOpenChange={setShowPhoneConnection}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp</DialogTitle>
            <DialogDescription>
              {step === 'phone' 
                ? 'Digite seu número de telefone para receber o código de verificação'
                : 'Digite o código de 8 dígitos enviado para seu WhatsApp'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {step === 'phone' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="+55 11 99999-9999"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Inclua o código do país (ex: +55 para Brasil)
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowPhoneConnection(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={sendVerificationCode}
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar Código"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="code">Código de Verificação</Label>
                  <Input
                    id="code"
                    placeholder="12345678"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={8}
                  />
                  <p className="text-xs text-gray-500">
                    Código enviado para {phoneNumber}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setStep('phone')}
                  >
                    Voltar
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={verifyCode}
                    disabled={isLoading}
                  >
                    {isLoading ? "Verificando..." : "Verificar"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Configurações de Resposta Automática */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Resposta Automática</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ativar Resposta Automática</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Responda automaticamente quando alguém enviar mensagem
              </p>
            </div>
            <Switch checked={autoReply} onCheckedChange={setAutoReply} />
          </div>
          
          {autoReply && (
            <div className="space-y-2">
              <Label htmlFor="auto-reply-message">Mensagem de Resposta</Label>
              <Textarea
                id="auto-reply-message"
                placeholder="Olá! Obrigado por entrar em contato. Responderemos em breve."
                className="h-20"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Atraso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Controle de Velocidade</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Atraso</Label>
            <Select value={delaySettings.type} onValueChange={(value) => 
              setDelaySettings(prev => ({ ...prev, type: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intelligent">Inteligente (Recomendado)</SelectItem>
                <SelectItem value="fixed">Fixo</SelectItem>
                <SelectItem value="random">Aleatório</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {delaySettings.type === "fixed" && (
            <div className="space-y-2">
              <Label htmlFor="custom-delay">Atraso Personalizado (segundos)</Label>
              <Input
                id="custom-delay"
                type="number"
                value={delaySettings.customDelay}
                onChange={(e) => 
                  setDelaySettings(prev => ({ ...prev, customDelay: e.target.value }))
                }
                min="1"
                max="60"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="max-per-hour">Máximo de Mensagens por Hora</Label>
            <Input
              id="max-per-hour"
              type="number"
              value={delaySettings.maxPerHour}
              onChange={(e) => 
                setDelaySettings(prev => ({ ...prev, maxPerHour: e.target.value }))
              }
              min="10"
              max="500"
            />
            <p className="text-xs text-gray-500">
              Limite recomendado: 100 mensagens por hora para evitar bloqueios
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={() => {
          toast({
            title: "Configurações Salvas",
            description: "Suas configurações do WhatsApp foram atualizadas com sucesso."
          });
        }}>
          <Settings className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}