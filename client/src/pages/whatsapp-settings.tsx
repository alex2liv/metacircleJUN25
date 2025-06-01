import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Smartphone, Settings, MessageCircle, Zap, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WhatsAppSettings() {
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [autoReply, setAutoReply] = useState(false);
  const [delaySettings, setDelaySettings] = useState({
    type: "intelligent",
    customDelay: "5",
    maxPerHour: "100"
  });

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    
    try {
      // Simular geração de QR Code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // QR Code simulado para demonstração
      const simulatedQR = "data:image/svg+xml;base64," + btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="10" y="10" width="20" height="20" fill="black"/>
          <rect x="50" y="10" width="20" height="20" fill="black"/>
          <rect x="90" y="10" width="20" height="20" fill="black"/>
          <rect x="130" y="10" width="20" height="20" fill="black"/>
          <rect x="170" y="10" width="20" height="20" fill="black"/>
          <rect x="10" y="50" width="20" height="20" fill="black"/>
          <rect x="170" y="50" width="20" height="20" fill="black"/>
          <rect x="10" y="90" width="20" height="20" fill="black"/>
          <rect x="50" y="90" width="20" height="20" fill="black"/>
          <rect x="90" y="90" width="20" height="20" fill="black"/>
          <rect x="130" y="90" width="20" height="20" fill="black"/>
          <rect x="170" y="90" width="20" height="20" fill="black"/>
          <rect x="10" y="130" width="20" height="20" fill="black"/>
          <rect x="170" y="130" width="20" height="20" fill="black"/>
          <rect x="10" y="170" width="20" height="20" fill="black"/>
          <rect x="50" y="170" width="20" height="20" fill="black"/>
          <rect x="90" y="170" width="20" height="20" fill="black"/>
          <rect x="130" y="170" width="20" height="20" fill="black"/>
          <rect x="170" y="170" width="20" height="20" fill="black"/>
          <text x="100" y="195" text-anchor="middle" font-size="8" fill="gray">QR Code AB7</text>
        </svg>
      `);
      
      setQrCode(simulatedQR);
      
      toast({
        title: "QR Code Gerado",
        description: "Escaneie com seu WhatsApp para conectar",
      });
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar QR Code",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const connectWhatsApp = () => {
    setIsConnected(true);
    toast({
      title: "WhatsApp Conectado!",
      description: "Sua conta está agora conectada ao sistema",
    });
  };

  const disconnectWhatsApp = () => {
    setIsConnected(false);
    setQrCode("");
    toast({
      title: "WhatsApp Desconectado",
      description: "Conexão encerrada com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configurações WhatsApp - AB7
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure sua integração com WhatsApp Business
            </p>
          </div>
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
                <div className="space-x-2">
                  <Button 
                    onClick={generateQRCode}
                    disabled={isGeneratingQR}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    {isGeneratingQR ? "Gerando..." : "Gerar QR Code"}
                  </Button>
                  {qrCode && (
                    <Button onClick={connectWhatsApp}>
                      Conectar
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        {qrCode && !isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Escaneie o QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                <img src={qrCode} alt="QR Code WhatsApp" className="border rounded" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  1. Abra o WhatsApp no seu telefone
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  2. Toque em Configurações {'>'} Aparelhos conectados
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  3. Toque em "Conectar um aparelho" e escaneie este código
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configurações de Envio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configurações de Envio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Tipo de Atraso */}
            <div>
              <Label className="text-base font-medium">Atraso entre Mensagens</Label>
              <div className="mt-3 space-y-3">
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="delayType" 
                      value="intelligent"
                      checked={delaySettings.type === "intelligent"}
                      onChange={(e) => setDelaySettings({...delaySettings, type: e.target.value})}
                      className="text-blue-600"
                    />
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>Atraso Inteligente</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="delayType" 
                      value="manual"
                      checked={delaySettings.type === "manual"}
                      onChange={(e) => setDelaySettings({...delaySettings, type: e.target.value})}
                      className="text-purple-600"
                    />
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>Atraso Manual</span>
                    </div>
                  </label>
                </div>
                
                {delaySettings.type === "intelligent" && (
                  <div className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    O sistema ajusta automaticamente o atraso baseado na quantidade de mensagens e horário para evitar bloqueios.
                  </div>
                )}
                
                {delaySettings.type === "manual" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="custom-delay">Intervalo (segundos)</Label>
                      <Select 
                        value={delaySettings.customDelay} 
                        onValueChange={(value) => setDelaySettings({...delaySettings, customDelay: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1-5 segundos (Rápido)</SelectItem>
                          <SelectItem value="5">5-20 segundos (Médio)</SelectItem>
                          <SelectItem value="15">15-45 segundos (Seguro)</SelectItem>
                          <SelectItem value="30">30-60 segundos (Muito Seguro)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="max-per-hour">Máximo por Hora</Label>
                      <Input 
                        id="max-per-hour"
                        type="number"
                        value={delaySettings.maxPerHour}
                        onChange={(e) => setDelaySettings({...delaySettings, maxPerHour: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resposta Automática */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Resposta Automática</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Responder automaticamente mensagens recebidas
                </p>
              </div>
              <Switch checked={autoReply} onCheckedChange={setAutoReply} />
            </div>

            {autoReply && (
              <div>
                <Label htmlFor="auto-reply-message">Mensagem de Resposta Automática</Label>
                <Textarea 
                  id="auto-reply-message"
                  placeholder="Olá! Recebemos sua mensagem e retornaremos em breve."
                  className="mt-2"
                />
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline">Cancelar</Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Configurações salvas!",
                    description: "Suas preferências foram atualizadas",
                  });
                }}
              >
                Salvar Configurações
              </Button>
            </div>
            
          </CardContent>
        </Card>

      </div>
    </div>
  );
}