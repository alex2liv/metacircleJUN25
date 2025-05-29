import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Clock, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";
import { useLocation } from "wouter";

export default function EmailVerification() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [userEmail] = useState("alexandre@metasync.com.br"); // Viria do contexto de cadastro

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "❌ Código inválido",
        description: "Por favor, digite o código de 6 dígitos",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simular verificação
    setTimeout(() => {
      setIsLoading(false);
      
      // Código de teste: 123456
      if (verificationCode === "123456") {
        toast({
          title: "✅ Email verificado!",
          description: "Sua conta foi ativada com sucesso!",
        });
        
        setTimeout(() => {
          setLocation("/dashboard");
        }, 1000);
      } else {
        toast({
          title: "❌ Código incorreto",
          description: "Verifique o código e tente novamente",
          variant: "destructive"
        });
        setVerificationCode("");
      }
    }, 1500);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    setTimeout(() => {
      setIsResending(false);
      setTimeLeft(300); // Reset timer
      toast({
        title: "📧 Código reenviado!",
        description: "Verifique sua caixa de entrada e spam",
      });
    }, 2000);
  };

  const handleGoBack = () => {
    setLocation("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <img 
            src={metaSyncLogo} 
            alt="MetaSync" 
            className="h-32 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-2">
            📧 Verificação de Email
          </h1>
          <p className="text-blue-200">
            Confirme seu email para ativar sua conta
          </p>
        </div>

        {/* Card Principal */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Código de Verificação
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Informações do Email */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800 mb-1">
                Enviamos um código de 6 dígitos para:
              </p>
              <p className="font-medium text-blue-900">{userEmail}</p>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Código expira em: 
              </span>
              <Badge variant={timeLeft < 60 ? "destructive" : "secondary"}>
                {formatTime(timeLeft)}
              </Badge>
            </div>

            {/* Formulário */}
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">🔢 Código de Verificação</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest font-mono"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Digite apenas números
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Email
                  </>
                )}
              </Button>
            </form>

            {/* Código de Teste */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">🧪 Código de Teste:</h4>
              <p className="text-sm text-green-800">
                Use <Badge variant="outline" className="font-mono">123456</Badge> para demonstração
              </p>
            </div>

            {/* Ações Secundárias */}
            <div className="space-y-3">
              <Button 
                onClick={handleResendCode}
                variant="outline" 
                className="w-full"
                disabled={isResending || timeLeft > 240} // Só permite reenvio após 1 minuto
              >
                {isResending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2" />
                    Reenviando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {timeLeft > 240 ? `Reenviar em ${formatTime(timeLeft - 240)}` : "Reenviar Código"}
                  </>
                )}
              </Button>

              <Button 
                onClick={handleGoBack}
                variant="ghost" 
                className="w-full text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Cadastro
              </Button>
            </div>

            {/* Dicas */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">💡 Não recebeu o código?</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Verifique a pasta de spam/lixo eletrônico</li>
                <li>• Aguarde alguns minutos</li>
                <li>• Certifique-se que o email está correto</li>
                <li>• Tente reenviar o código</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="mt-6 text-center">
          <p className="text-blue-200 text-sm">
            Precisa de ajuda? Entre em contato conosco
          </p>
        </div>
      </div>
    </div>
  );
}