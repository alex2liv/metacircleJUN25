import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Calendar, BookOpen, Heart, Eye, Play, Check, DollarSign, ExternalLink, Phone, MessageCircle, Crown, LogOut } from "lucide-react";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function CommunityMember() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setLocation("/login");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado da comunidade.",
    });
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Olá! Sou membro da Comunidade de Podólogos e gostaria de conversar com a especialista Clarissa Vaz.");
    window.open(`https://wa.me/5511910018833?text=${message}`, '_blank');
  };

  const handleVideoCall = () => {
    toast({
      title: "Videochamada Premium",
      description: "Esta funcionalidade está disponível para membros premium. Entre em contato via WhatsApp para mais informações.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={metaSyncLogo} alt="MetaSync" className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Comunidade de Podólogos
                </h1>
                <p className="text-sm text-gray-600">
                  Administrada pela Dra. Clarissa Vaz
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Welcome Section */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
              <CardHeader className="text-center py-12">
                <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                  Olá! Você está na melhor comunidade de podologia do Brasil 👋
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg max-w-2xl mx-auto">
                  Aqui você aprende com a Dra. Clarissa Vaz e se conecta com outros profissionais incríveis
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Contact Specialist */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Contato com a Especialista
              </CardTitle>
              <CardDescription>
                Converse diretamente com a Dra. Clarissa Vaz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={handleWhatsAppContact}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button 
                  onClick={handleVideoCall}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Videochamada
                  <Badge variant="secondary" className="ml-2">Premium</Badge>
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                <p>• WhatsApp: Disponível para todos os membros</p>
                <p>• Videochamada: Exclusivo para membros premium</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Plan and Upgrade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Seu Plano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900">Plano Básico</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">R$ 29,90/mês</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Ativo</Badge>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => {
                  const element = document.getElementById('plans-comparison');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Crown className="w-4 h-4 mr-2" />
                Comparar Planos
              </Button>
            </CardContent>
          </Card>

          {/* Courses Available */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Cursos Disponíveis
              </CardTitle>
              <CardDescription>
                Aprenda com nossos cursos exclusivos e aprimore suas práticas de mercado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course 1 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900">React Avançado para Desenvolvedores</h3>
                      <p className="text-sm text-blue-700 mt-2">
                        Domine React, Redux, TypeScript e as melhores práticas do mercado
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-600">Nível:</span>
                        <Badge variant="secondary" className="bg-blue-200 text-blue-800">Avançado</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-600">Duração:</span>
                        <span className="text-sm text-blue-800 font-medium">8 semanas</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-2xl font-bold text-blue-900">R$ 297</span>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open('https://perfectpay.com.br/curso-react-avancado', '_blank')}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Comprar Agora
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Course 2 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-green-900">JavaScript do Zero ao Profissional</h3>
                      <p className="text-sm text-green-700 mt-2">
                        Aprenda JavaScript moderno, ES6+ e desenvolvimento full-stack
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">Nível:</span>
                        <Badge variant="secondary" className="bg-green-200 text-green-800">Iniciante</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">Duração:</span>
                        <span className="text-sm text-green-800 font-medium">12 semanas</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-2xl font-bold text-green-900">R$ 197</span>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => window.open('https://perfectpay.com.br/curso-javascript-zero', '_blank')}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Comprar Agora
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Course 3 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-purple-900">Node.js e Banco de Dados</h3>
                      <p className="text-sm text-purple-700 mt-2">
                        Backend profissional com Node.js, Express, MongoDB e PostgreSQL
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-600">Nível:</span>
                        <Badge variant="secondary" className="bg-purple-200 text-purple-800">Intermediário</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-600">Duração:</span>
                        <span className="text-sm text-purple-800 font-medium">6 semanas</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-2xl font-bold text-purple-900">R$ 247</span>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => window.open('https://perfectpay.com.br/curso-nodejs-database', '_blank')}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Comprar Agora
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conteúdos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Técnicas Avançadas de Podologia</h4>
                  <p className="text-sm text-gray-600">Publicado há 2 dias pela Dra. Clarissa</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">Prevenção de Lesões nos Pés</h4>
                  <p className="text-sm text-gray-600">Publicado há 5 dias</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">Workshop: Diagnóstico Digital</h4>
                  <p className="text-sm text-gray-600">Evento realizado na semana passada</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm">Live: Cuidados com Diabetes</h4>
                  <p className="text-xs text-gray-600">15 de Junho, 19h</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm">Workshop Prático</h4>
                  <p className="text-xs text-gray-600">22 de Junho, 14h</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm">Q&A com Especialista</h4>
                  <p className="text-xs text-gray-600">30 de Junho, 20h</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Simple Upgrade Section */}
        <div id="plans-comparison" className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quer acelerar seus resultados? 🚀
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Veja o que você ganha se fizer o upgrade para Premium
            </p>
          </div>
          
          <Card className="lg:col-span-3 overflow-hidden shadow-2xl border-0">
            <CardContent>
              {/* Simple Visual Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Current Plan */}
                <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-gray-200">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">B</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Seu Plano Atual</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-4">R$ 29,90/mês</div>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✅</span>
                      <span>Acesso à comunidade</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500">❌</span>
                      <span className="text-gray-500">WhatsApp com Dra. Clarissa</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500">❌</span>
                      <span className="text-gray-500">Videochamadas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500">❌</span>
                      <span className="text-gray-500">Conteúdos exclusivos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500">❌</span>
                      <span className="text-gray-500">Certificados</span>
                    </div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-4 border-yellow-400 relative transform hover:scale-105 transition-transform">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-white px-4 py-2 text-lg font-bold">
                      MAIS POPULAR
                    </Badge>
                  </div>
                  
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium VIP</h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-lg text-gray-400 line-through">R$ 149,90</span>
                    <div className="text-3xl font-bold text-yellow-600">R$ 99,90/mês</div>
                  </div>
                  
                  <div className="space-y-3 text-left mb-8">
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✅</span>
                      <span>Tudo do plano básico</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✅</span>
                      <span className="font-semibold">WhatsApp direto com Dra. Clarissa</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✅</span>
                      <span className="font-semibold">Videochamadas ilimitadas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✅</span>
                      <span className="font-semibold">Conteúdos premium exclusivos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✅</span>
                      <span className="font-semibold">Certificados reconhecidos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✅</span>
                      <span className="font-semibold">Networking VIP</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      size="lg"
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 text-lg shadow-lg"
                      onClick={() => {
                        toast({
                          title: "Teste Premium Ativado!",
                          description: "Você terá 7 dias de acesso completo ao plano premium.",
                        });
                      }}
                    >
                      TESTAR 7 DIAS GRÁTIS
                    </Button>
                    <p className="text-sm text-gray-600">
                      Sem cobrança • Cancele quando quiser
                    </p>
                  </div>
                </div>
              </div>

              {/* Simple Benefits Section */}
              <div className="mt-12 space-y-6">
                
                {/* What You Get with Premium */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Veja o que acontece quando você vira Premium 🌟
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Fala direto com a Dra. Clarissa</h4>
                      <p className="text-gray-600">WhatsApp direto para tirar suas dúvidas na hora</p>
                    </div>
                    
                    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Videochamadas quando quiser</h4>
                      <p className="text-gray-600">Consultas personalizadas para seus casos</p>
                    </div>
                    
                    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Certificados que valem</h4>
                      <p className="text-gray-600">Reconhecidos no mercado para valorizar seu currículo</p>
                    </div>
                  </div>
                </div>

                {/* Simple Call to Action */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl text-center text-white shadow-xl">
                  <h3 className="text-3xl font-bold mb-4">
                    Que tal testar sem pagar nada?
                  </h3>
                  <p className="text-xl mb-8 text-white/90">
                    7 dias completos no Premium. Se não gostar, é só cancelar.
                  </p>
                  
                  <Button 
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-12 py-6 text-xl rounded-xl shadow-lg transform hover:scale-105 transition-all"
                    onClick={() => {
                      toast({
                        title: "Teste Premium Ativado!",
                        description: "Você terá 7 dias de acesso completo ao plano premium.",
                      });
                    }}
                  >
                    SIM, QUERO TESTAR GRÁTIS!
                  </Button>
                  <p className="text-white/80 text-sm mt-4">
                    Sem cartão de crédito • Cancele quando quiser
                  </p>
                </div>

                {/* Simple Guarantee */}
                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200 text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Check className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-green-900 text-lg">Garantia de 30 dias</span>
                  </div>
                  <p className="text-green-800">
                    Não gostou? Devolvemos seu dinheiro sem perguntas
                  </p>
                </div>

              </div>

            </CardContent>
          </Card>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center text-sm text-gray-500">
            <p>Powered by <span className="font-semibold text-blue-600">MetaSync</span> - Sua plataforma de comunidades digitais</p>
          </div>
        </div>
      </footer>
    </div>
  );
}