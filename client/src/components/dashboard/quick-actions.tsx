import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, CalendarPlus, UserPlus, Mail, MessageCircle, Plus, Calendar, MessageSquare, Upload, QrCode, Clock, Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const { toast } = useToast();
  const [inviteMethod, setInviteMethod] = useState<string>("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [showEndTime, setShowEndTime] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string>("");
  const [delayType, setDelayType] = useState<string>("intelligent");
  const [customDelay, setCustomDelay] = useState<string>("5");
  const [isLoading, setIsLoading] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [showFormatExample, setShowFormatExample] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const calculateEndTime = (startTime: string) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(':');
    const startHour = parseInt(hours);
    const endHour = (startHour + 1) % 24;
    return `${endHour.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleStartTimeChange = (value: string) => {
    setEventStartTime(value);
    setEventEndTime(calculateEndTime(value));
  };

  const handleSendInvites = async () => {
    if (!inviteMethod) {
      toast({
        title: "Erro",
        description: "Selecione um método de convite",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const numbers = phoneNumbers.split(',').map(n => n.trim()).filter(n => n);
      
      toast({
        title: "Convites enviados!",
        description: `${numbers.length} convites enviados via ${inviteMethod === 'email' ? 'Email' : 'WhatsApp'}`,
      });
      
      // Resetar formulário
      setPhoneNumbers("");
      setInviteMethod("");
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar convites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    
    try {
      const response = await fetch('/api/whatsapp/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success && data.qrCode) {
        setQrCode(data.qrCode);
        
        toast({
          title: "QR Code Gerado",
          description: "Escaneie com seu WhatsApp para conectar",
        });
      } else {
        throw new Error(data.error || 'Falha ao gerar QR Code');
      }
      
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao gerar QR Code",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const connectWhatsApp = () => {
    setWhatsappConnected(true);
    toast({
      title: "WhatsApp Conectado!",
      description: "Sua conta está agora conectada ao sistema",
    });
  };

  const validateListFormat = (content: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      errors.push("Lista está vazia");
      return { isValid: false, errors };
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split(',').map(p => p.trim());
      
      if (parts.length !== 3) {
        errors.push(`Linha ${i + 1}: Deve conter exatamente 3 campos (Nome, Sobrenome, Telefone)`);
        continue;
      }

      const [firstName, lastName, phone] = parts;
      
      if (!firstName || firstName.length < 2) {
        errors.push(`Linha ${i + 1}: Nome deve ter pelo menos 2 caracteres`);
      }
      
      if (!lastName || lastName.length < 2) {
        errors.push(`Linha ${i + 1}: Sobrenome deve ter pelo menos 2 caracteres`);
      }
      
      const phoneRegex = /^\+55\d{10,11}$/;
      if (!phone || !phoneRegex.test(phone)) {
        errors.push(`Linha ${i + 1}: Telefone deve estar no formato +5517981466889`);
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        
        // Validar formato da lista
        const validation = validateListFormat(text);
        
        if (!validation.isValid) {
          setUploadError(validation.errors.join('\n'));
          toast({
            title: "Formato Inválido",
            description: `${validation.errors.length} erro(s) encontrado(s). Verifique o formato da lista.`,
            variant: "destructive",
          });
          return;
        }

        // Se válido, processar a lista
        const lines = text.split('\n').filter(line => line.trim());
        const numbers = lines.map(line => {
          const parts = line.split(',').map(p => p.trim());
          return parts[2]; // Telefone é a terceira coluna
        });
        
        setPhoneNumbers(numbers.join(', '));
        setUploadError("");
        
        toast({
          title: "Lista Importada",
          description: `${numbers.length} contatos carregados com sucesso`,
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="border-gray-100 dark:border-gray-700">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        
        {/* Criar Post */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Criar Post
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Post</DialogTitle>
              <DialogDescription>Compartilhe algo interessante com a comunidade</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="post-community">Selecionar Comunidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma comunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌐 Todas as Comunidades</SelectItem>
                    <SelectItem value="community-1">📚 Discussões Gerais</SelectItem>
                    <SelectItem value="community-2">💡 Ideias e Sugestões</SelectItem>
                    <SelectItem value="community-3">🎯 Metas e Objetivos</SelectItem>
                    <SelectItem value="community-4">🤝 Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="post-title">Título do Post</Label>
                <Input id="post-title" placeholder="Digite o título..." />
              </div>
              <div>
                <Label htmlFor="post-content">Conteúdo</Label>
                <Textarea id="post-content" placeholder="Escreva seu post..." className="h-32" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Publicar Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Agendar Evento */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-3">
                <CalendarPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Agendar Evento
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Novo Evento</DialogTitle>
              <DialogDescription>Configure um evento para sua comunidade</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-community">Selecionar Comunidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma comunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌐 Todas as Comunidades</SelectItem>
                    <SelectItem value="community-1">📚 Discussões Gerais</SelectItem>
                    <SelectItem value="community-2">💡 Ideias e Sugestões</SelectItem>
                    <SelectItem value="community-3">🎯 Metas e Objetivos</SelectItem>
                    <SelectItem value="community-4">🤝 Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event-title">Título do Evento</Label>
                <Input id="event-title" placeholder="Digite o título..." />
              </div>
              <div>
                <Label htmlFor="event-description">Descrição</Label>
                <Textarea id="event-description" placeholder="Descreva o evento..." className="h-20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="event-date">Data</Label>
                  <Input id="event-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="event-start-time">Horário de Início</Label>
                  <Input 
                    id="event-start-time" 
                    type="time" 
                    value={eventStartTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="event-location">Local/Link</Label>
                <Input id="event-location" placeholder="Presencial ou link online..." />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Criar Evento
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Convidar Membros */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Convidar Membros
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novos Membros</DialogTitle>
              <DialogDescription>Envie convites por email ou WhatsApp</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invite-method">Método de Convite</Label>
                <Select value={inviteMethod} onValueChange={setInviteMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como deseja enviar o convite?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">📧 Por Email</SelectItem>
                    <SelectItem value="whatsapp">📱 Por WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {inviteMethod === "email" && (
                <div>
                  <Label htmlFor="email-addresses">Endereços de Email</Label>
                  <Textarea 
                    id="email-addresses" 
                    placeholder="Digite os emails separados por vírgula&#10;exemplo: joao@email.com, maria@email.com" 
                    className="h-20"
                  />
                </div>
              )}
              
              {inviteMethod === "whatsapp" && (
                <div className="space-y-4">
                  {/* Status da Conexão WhatsApp */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${whatsappConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm">
                        WhatsApp {whatsappConnected ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                    {!whatsappConnected && !qrCode && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={generateQRCode}
                        disabled={isGeneratingQR}
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        {isGeneratingQR ? "Gerando..." : "Gerar QR Code"}
                      </Button>
                    )}
                    {qrCode && !whatsappConnected && (
                      <Button 
                        size="sm"
                        onClick={connectWhatsApp}
                      >
                        Simular Conexão
                      </Button>
                    )}
                  </div>

                  {/* QR Code Display */}
                  {qrCode && !whatsappConnected && (
                    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 border rounded-lg">
                      <h4 className="text-sm font-medium mb-3">Escaneie com WhatsApp</h4>
                      <img 
                        src={qrCode} 
                        alt="QR Code WhatsApp" 
                        className="w-48 h-48 border border-gray-200 dark:border-gray-600 rounded"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        1. Abra o WhatsApp no seu celular<br/>
                        2. Toque em Menu ou Configurações<br/>
                        3. Toque em "WhatsApp Web"<br/>
                        4. Escaneie este código
                      </p>
                    </div>
                  )}

                  {/* Upload de Lista ou Entrada Manual */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="phone-numbers">Números de WhatsApp</Label>
                      <div className="flex space-x-2">
                        <input
                          type="file"
                          accept=".csv,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Lista
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFormatExample(true)}
                        >
                          📋 Exemplo
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      id="phone-numbers" 
                      value={phoneNumbers}
                      onChange={(e) => setPhoneNumbers(e.target.value)}
                      placeholder="Digite os números separados por vírgula ou carregue uma lista&#10;exemplo: 11999999999, 11888888888" 
                      className="h-20"
                    />
                  </div>

                  {/* Configurações de Atraso */}
                  <div>
                    <Label>Atraso entre Envios</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name="delay" 
                            value="intelligent"
                            checked={delayType === "intelligent"}
                            onChange={(e) => setDelayType(e.target.value)}
                            className="text-blue-600"
                          />
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span>Atraso inteligente</span>
                          </div>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name="delay" 
                            value="manual"
                            checked={delayType === "manual"}
                            onChange={(e) => setDelayType(e.target.value)}
                            className="text-purple-600"
                          />
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span>Atraso manual</span>
                          </div>
                        </label>
                      </div>
                      
                      {delayType === "intelligent" && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                          Define o atraso automaticamente com base no número de mensagens. 
                          Quanto maior o atraso, menor a probabilidade de spam.
                        </div>
                      )}
                      
                      {delayType === "manual" && (
                        <div className="flex space-x-3">
                          <div className="flex-1">
                            <Label htmlFor="custom-delay" className="text-sm">Segundos entre envios</Label>
                            <Select value={customDelay} onValueChange={setCustomDelay}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Muito curto (1-5s)</SelectItem>
                                <SelectItem value="5">Curto (5-20s)</SelectItem>
                                <SelectItem value="15">Médio (15-45s)</SelectItem>
                                <SelectItem value="30">Longo (30-60s)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="invite-message">Mensagem Personalizada</Label>
                <Textarea 
                  id="invite-message" 
                  placeholder="Olá! Você foi convidado(a) para participar da nossa comunidade..." 
                  className="h-24"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleSendInvites}
                  disabled={isLoading}
                >
                  {inviteMethod === "email" ? (
                    <Mail className="w-4 h-4 mr-2" />
                  ) : (
                    <MessageCircle className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Enviando..." : "Enviar Convites"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
      </CardContent>
    </Card>
  );
}
