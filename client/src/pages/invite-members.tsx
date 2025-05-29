import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Mail, 
  Upload, 
  Send, 
  Check, 
  X, 
  Download,
  UserPlus,
  FileText,
  Zap
} from "lucide-react";

export default function InviteMembers() {
  const { toast } = useToast();
  const [bulkEmails, setBulkEmails] = useState("");
  const [singleEmail, setSingleEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState(
    "🎉 Você foi convidado para participar do MetaCircle Beta!\n\nSomos uma comunidade digital moderna com recursos avançados de chat, eventos e cursos.\n\nClique no link abaixo para aceitar o convite e fazer parte da nossa comunidade:"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedEmails, setProcessedEmails] = useState<Array<{email: string, status: 'success' | 'error', message: string}>>([]);

  // Estado para arquivo CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleBulkInvite = async () => {
    if (!bulkEmails.trim()) {
      toast({
        title: "❌ Erro",
        description: "Por favor, digite pelo menos um email",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const emails = bulkEmails
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));

    const results: Array<{email: string, status: 'success' | 'error', message: string}> = [];

    // Simular processamento de emails
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        results.push({
          email,
          status: 'error',
          message: 'Email inválido'
        });
        continue;
      }

      // Simular sucesso (em produção faria a API call real)
      results.push({
        email,
        status: 'success', 
        message: 'Convite enviado com sucesso'
      });
    }

    setProcessedEmails(results);
    setIsProcessing(false);

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    toast({
      title: "📧 Convites Processados!",
      description: `${successCount} enviados, ${errorCount} com erro`,
    });
  };

  const handleSingleInvite = async () => {
    if (!singleEmail.trim()) {
      toast({
        title: "❌ Erro",
        description: "Por favor, digite um email",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsProcessing(false);
    setSingleEmail("");
    
    toast({
      title: "✅ Convite Enviado!",
      description: `Convite enviado para ${singleEmail}`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      
      // Ler arquivo CSV
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const emails = lines
          .map(line => {
            // Extrair email da linha (pode estar em qualquer coluna)
            const emailMatch = line.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
            return emailMatch ? emailMatch[0] : '';
          })
          .filter(email => email)
          .join('\n');
        
        setBulkEmails(emails);
        
        toast({
          title: "📁 Arquivo Carregado!",
          description: `${emails.split('\n').length} emails encontrados`,
        });
      };
      reader.readAsText(file);
    }
  };

  const generateSampleCSV = () => {
    const csv = `nome,email,telefone
João Silva,joao@email.com,(11) 99999-9999
Maria Santos,maria@email.com,(11) 88888-8888
Pedro Oliveira,pedro@email.com,(11) 77777-7777`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exemplo-convites.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const emailCount = bulkEmails ? bulkEmails.split(/[\n,;]/).filter(email => email.trim() && email.includes('@')).length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">📧 Convites MetaCircle Beta</h1>
          <p className="text-gray-600 mt-1">Adicione membros em massa para testar a plataforma</p>
        </div>

        <Tabs defaultValue="bulk" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bulk">📋 Lista de Emails</TabsTrigger>
            <TabsTrigger value="single">👤 Convite Individual</TabsTrigger>
            <TabsTrigger value="results">📊 Resultados</TabsTrigger>
          </TabsList>

          {/* Tab Convite em Massa */}
          <TabsContent value="bulk">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📋 Lista de Emails (800 pessoas)
                    {emailCount > 0 && (
                      <Badge variant="secondary">{emailCount} emails</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Upload de arquivo CSV */}
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Carregar arquivo CSV/TXT com emails
                        </p>
                        <Input
                          type="file"
                          accept=".csv,.txt"
                          onChange={handleFileUpload}
                          className="mb-2"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={generateSampleCSV}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Exemplo CSV
                        </Button>
                      </div>
                    </div>

                    <div className="text-center text-gray-500">ou</div>

                    {/* Input manual */}
                    <div>
                      <Label htmlFor="bulkEmails">
                        Cole sua lista de emails (um por linha, ou separados por vírgula)
                      </Label>
                      <Textarea
                        id="bulkEmails"
                        value={bulkEmails}
                        onChange={(e) => setBulkEmails(e.target.value)}
                        placeholder="email1@exemplo.com&#10;email2@exemplo.com&#10;email3@exemplo.com"
                        className="h-40 mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos aceitos: um por linha, separados por vírgula ou ponto e vírgula
                      </p>
                    </div>

                    <Button 
                      onClick={handleBulkInvite} 
                      disabled={isProcessing || emailCount === 0}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <Zap className="w-4 h-4 mr-2" />
                      )}
                      {isProcessing ? 'Enviando...' : `Enviar ${emailCount} Convites`}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>✉️ Mensagem do Convite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="inviteMessage">Personalizar mensagem</Label>
                      <Textarea
                        id="inviteMessage"
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        className="h-32 mt-2"
                      />
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">🔗 Como funciona</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Cada pessoa recebe um link único</li>
                        <li>• Link expira em 7 dias</li>
                        <li>• Cadastro automático na primeira visita</li>
                        <li>• Notificação por email e WhatsApp</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2">🎯 Beta Testers</h3>
                      <p className="text-sm text-green-800">
                        Acesso completo por 30 dias para testar todas as funcionalidades
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Convite Individual */}
          <TabsContent value="single">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👤 Convite Individual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="singleEmail">Email do convidado</Label>
                    <Input
                      id="singleEmail"
                      type="email"
                      value={singleEmail}
                      onChange={(e) => setSingleEmail(e.target.value)}
                      placeholder="pessoa@email.com"
                    />
                  </div>

                  <Button 
                    onClick={handleSingleInvite}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isProcessing ? 'Enviando...' : 'Enviar Convite'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Resultados */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Resultados dos Convites
                  {processedEmails.length > 0 && (
                    <Badge variant="secondary">{processedEmails.length} processados</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {processedEmails.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum convite processado ainda</p>
                    <p className="text-sm text-gray-500">Use as abas acima para enviar convites</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {processedEmails.map((result, index) => (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          result.status === 'success' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {result.status === 'success' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                          <span className="font-mono text-sm">{result.email}</span>
                        </div>
                        <span className={`text-xs ${
                          result.status === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}