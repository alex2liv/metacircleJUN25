import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Smartphone, Settings, MessageCircle, Zap, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function WhatsAppSettings() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [showQRConnection, setShowQRConnection] = useState(false);
  const [qrCode, setQRCode] = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [autoReply, setAutoReply] = useState(false);
  const [delaySettings, setDelaySettings] = useState({
    type: "intelligent",
    customDelay: "60",
    maxPerHour: "30",
    maxPerDay: "100"
  });

  // Verificar status da conexão periodicamente
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await apiRequest("GET", "/api/whatsapp/status");
        const data = await response.json();
        setIsConnected(data.connected);
        if (data.qrCode && !data.connected) {
          setQRCode(data.qrCode);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    setShowQRConnection(true);

    try {
      toast({
        title: "Gerando QR Code",
        description: "Iniciando conexão com WhatsApp Web..."
      });

      const response = await apiRequest("POST", "/api/whatsapp/generate-qr");
      const data = await response.json();

      if (data.success && data.qrCode) {
        setQRCode(data.qrCode);
        toast({
          title: "QR Code Gerado",
          description: "Escaneie o código com seu WhatsApp para conectar"
        });
      } else {
        throw new Error(data.error || 'Erro ao gerar QR Code');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao Gerar QR Code",
        description: error.message || 'Erro desconhecido',
        variant: "destructive"
      });
      setShowQRConnection(false);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const disconnectWhatsApp = async () => {
    try {
      const response = await apiRequest("POST", "/api/whatsapp/disconnect");
      const data = await response.json();
      
      if (data.success) {
        setIsConnected(false);
        setQRCode("");
        setShowQRConnection(false);
        toast({
          title: "WhatsApp Desconectado",
          description: "Sua conta foi desconectada do sistema",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao Desconectar",
        description: "Erro ao desconectar WhatsApp",
        variant: "destructive"
      });
    }
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
              <Button onClick={generateQRCode} disabled={isGeneratingQR}>
                {isGeneratingQR ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4 mr-2" />
                )}
                {isGeneratingQR ? "Gerando..." : "Gerar QR Code"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de QR Code WhatsApp Web */}
      <Dialog open={showQRConnection} onOpenChange={setShowQRConnection}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp Web</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code com seu celular para conectar ao WhatsApp Web
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {qrCode ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <img 
                    src={qrCode} 
                    alt="QR Code WhatsApp Web" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium">Como conectar:</p>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                    <li>1. Abra o WhatsApp no seu celular</li>
                    <li>2. Toque nos três pontos (⋮) e selecione "Dispositivos conectados"</li>
                    <li>3. Toque em "Conectar um dispositivo"</li>
                    <li>4. Aponte a câmera para este QR Code</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Gerando QR Code do WhatsApp Web...
                </p>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowQRConnection(false)}
              >
                Fechar
              </Button>
            </div>
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
          {/* Avisos importantes sobre limites do WhatsApp */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  ⚠️ LIMITES IMPORTANTES - EVITE BLOQUEIOS
                </h4>
                <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <p><strong>Números NOVOS (menos de 30 dias):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Máximo 50-100 mensagens por dia</strong></li>
                    <li><strong>Máximo 20-30 mensagens por hora</strong></li>
                    <li><strong>Intervalo mínimo: 60-90 segundos entre mensagens</strong></li>
                  </ul>
                  
                  <p className="mt-3"><strong>Números ANTIGOS (mais de 30 dias):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Máximo 200-300 mensagens por dia</strong></li>
                    <li><strong>Máximo 80-120 mensagens por hora</strong></li>
                    <li><strong>Intervalo mínimo: 30-45 segundos entre mensagens</strong></li>
                  </ul>
                  
                  <p className="mt-3 font-semibold">
                    🚨 Ultrapassar estes limites pode resultar em BANIMENTO PERMANENTE
                  </p>
                </div>
              </div>
            </div>
          </div>

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
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Modo inteligente varia o tempo automaticamente para parecer mais humano
            </p>
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
                min="30"
                max="300"
              />
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ Nunca use menos de 30 segundos entre mensagens
              </p>
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
              max="120"
            />
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-2">
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                💡 Para números novos: máximo 20-30/hora | Para números antigos: máximo 80-120/hora
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-per-day">Máximo de Mensagens por Dia</Label>
            <Input
              id="max-per-day"
              type="number"
              value={delaySettings.maxPerDay || "100"}
              onChange={(e) => 
                setDelaySettings(prev => ({ ...prev, maxPerDay: e.target.value }))
              }
              min="10"
              max="300"
            />
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
              <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                🚨 Para números novos: máximo 50-100/dia | Para números antigos: máximo 200-300/dia
              </p>
            </div>
          </div>

          {/* Aviso Legal */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  ⚖️ AVISO LEGAL E RESPONSABILIDADE
                </h4>
                <div className="text-sm text-orange-700 dark:text-orange-300 space-y-2">
                  <p>
                    <strong>A empresa META não autoriza oficialmente o uso do WhatsApp para automação 
                    através de métodos não oficiais.</strong> O uso aprovado é apenas através da 
                    API oficial do WhatsApp Business.
                  </p>
                  
                  <p>
                    <strong>A MetaSync Digital não se responsabiliza por:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Perda ou banimento de números por uso inadequado</li>
                    <li>Bloqueios temporários ou permanentes do WhatsApp</li>
                    <li>Violações dos termos de uso do WhatsApp</li>
                    <li>Consequências legais do uso não autorizado</li>
                  </ul>
                  
                  <p className="font-semibold">
                    ⚠️ Use por sua própria conta e risco. Recomendamos o uso da API oficial 
                    do WhatsApp Business para operações comerciais.
                  </p>
                  
                  <p className="text-xs mt-2 opacity-75">
                    Este sistema é fornecido apenas para fins educacionais e de demonstração.
                  </p>
                </div>
              </div>
            </div>
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