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
            <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Bem-vindo à nossa Comunidade!
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Conecte-se com outros profissionais e acesse conteúdos exclusivos sobre podologia
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

        {/* Plans Comparison */}
        <div id="plans-comparison" className="mt-16">
          <Card className="lg:col-span-3">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Escolha o Plano Ideal para Você</CardTitle>
              <CardDescription>
                Compare os recursos disponíveis em cada plano e escolha o que melhor atende suas necessidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Features Column */}
                <div className="space-y-4">
                  <div className="h-20 flex items-center">
                    <h3 className="font-semibold text-lg">Recursos</h3>
                  </div>
                  <div className="space-y-6 text-sm">
                    <div className="py-4 border-b">Acesso à Comunidade</div>
                    <div className="py-4 border-b">Conteúdos Básicos</div>
                    <div className="py-4 border-b">Participação em Eventos</div>
                    <div className="py-4 border-b">Chat da Comunidade</div>
                    <div className="py-4 border-b">WhatsApp com Especialista</div>
                    <div className="py-4 border-b">Videochamadas Individuais</div>
                    <div className="py-4 border-b">Conteúdos Premium</div>
                    <div className="py-4 border-b">Consultorias Exclusivas</div>
                    <div className="py-4 border-b">Certificados de Participação</div>
                    <div className="py-4 border-b">Suporte Prioritário</div>
                  </div>
                </div>

                {/* Basic Plan */}
                <div className="relative border-2 border-gray-200 rounded-lg p-6">
                  <div className="text-center space-y-2 h-20 flex flex-col justify-center">
                    <h3 className="font-semibold text-lg">Básico</h3>
                    <p className="text-2xl font-bold text-blue-600">R$ 29,90</p>
                    <p className="text-sm text-gray-600">/mês</p>
                  </div>
                  <div className="space-y-6 text-center">
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b">-</div>
                    <div className="py-4 border-b">-</div>
                    <div className="py-4 border-b">-</div>
                    <div className="py-4 border-b">-</div>
                    <div className="py-4 border-b">-</div>
                  </div>
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                    Plano Atual
                  </Button>
                </div>

                {/* Intermediate Plan */}
                <div className="relative border-2 border-purple-300 rounded-lg p-6 bg-purple-50">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">Mais Popular</Badge>
                  </div>
                  <div className="text-center space-y-2 h-20 flex flex-col justify-center">
                    <h3 className="font-semibold text-lg">Intermediário</h3>
                    <p className="text-2xl font-bold text-purple-600">R$ 59,90</p>
                    <p className="text-sm text-gray-600">/mês</p>
                  </div>
                  <div className="space-y-6 text-center">
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b">-</div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b">-</div>
                  </div>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                    Fazer Upgrade
                  </Button>
                </div>

                {/* Premium Plan */}
                <div className="relative border-2 border-yellow-300 rounded-lg p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-600 text-white flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Premium
                    </Badge>
                  </div>
                  <div className="text-center space-y-2 h-20 flex flex-col justify-center">
                    <h3 className="font-semibold text-lg">Premium</h3>
                    <p className="text-2xl font-bold text-yellow-600">R$ 99,90</p>
                    <p className="text-sm text-gray-600">/mês</p>
                  </div>
                  <div className="space-y-6 text-center">
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                    <div className="py-4 border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></div>
                  </div>
                  <Button className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700">
                    Fazer Upgrade
                  </Button>
                </div>

              </div>

              {/* Additional Benefits */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Comunidade Ativa</h4>
                  <p className="text-sm text-blue-700 mt-1">150+ profissionais conectados</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-900">Suporte Direto</h4>
                  <p className="text-sm text-green-700 mt-1">WhatsApp com especialistas</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900">Conteúdo Exclusivo</h4>
                  <p className="text-sm text-purple-700 mt-1">Material didático atualizado</p>
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