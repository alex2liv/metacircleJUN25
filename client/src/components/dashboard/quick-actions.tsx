import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, CalendarPlus, UserPlus, Mail, MessageCircle, Plus, Calendar, MessageSquare, Upload, QrCode, Clock, Zap, Phone } from "lucide-react";
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
  const [showFormatExample, setShowFormatExample] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [showPhoneConnection, setShowPhoneConnection] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [step, setStep] = useState<'phone' | 'code'>('phone');

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



  const connectWhatsApp = () => {
    setWhatsappConnected(true);
    toast({
      title: "WhatsApp Conectado!",
      description: "Sua conta está agora conectada ao sistema",
    });
  };

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
      setWhatsappConnected(true);
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
                    

                    
                    {!whatsappConnected && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowPhoneConnection(true)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Conectar via Telefone
                      </Button>
                    )}
                  </div>

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
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Botão Exemplo clicado');
                            setShowFormatExample(true);
                          }}
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

        {/* Dialog de Exemplo de Formato */}
        {showFormatExample && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full m-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Formato da Lista
                  </h3>
                  <button 
                    onClick={() => setShowFormatExample(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Sua lista deve seguir exatamente este formato:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md font-mono text-sm">
                      João, Silva, +5517981466889<br/>
                      Maria, Santos, +5511987654321<br/>
                      Pedro, Oliveira, +5521999887766
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Regras obrigatórias:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                      <li>Nome, Sobrenome, Telefone (separados por vírgula)</li>
                      <li>Telefone deve iniciar com +55</li>
                      <li>Cada contato em uma linha separada</li>
                      <li>Nome e sobrenome com pelo menos 2 caracteres</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Listas que não seguirem este formato serão rejeitadas pelo sistema
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Botão Entendi clicado');
                      setShowFormatExample(false);
                    }}
                  >
                    Entendi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

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
        
      </CardContent>
    </Card>
  );
}
