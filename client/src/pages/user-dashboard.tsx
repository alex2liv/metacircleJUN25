import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, MessageSquare, Settings, ExternalLink, Clock, Users, Video, FileText, Mic, PaperclipIcon, Send, Crown, LogOut, Heart, AlertTriangle, Phone, Zap, X, Check } from "lucide-react";
import metaSyncIcon from "@assets/icone_matasync.png";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import NotificationPopup from "@/components/notification-popup";

export default function UserDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [messageText, setMessageText] = useState("");
  
  // User subscription status
  const [userPlan] = useState("basic"); // basic, intermediate, premium
  
  // Upgrade links (normally configured by client admin)
  const [upgradeLinks] = useState({
    intermediate: "https://perfectpay.com.br/upgrade-intermediario-podologia",
    premium: "https://perfectpay.com.br/upgrade-premium-podologia"
  });
  
  // Branding configuration (would be loaded from client admin settings)
  const [brandingConfig] = useState({
    specialistName: "Dra. Clarissa Vaz",
    specialistArea: "Podologia",
    communityName: "Comunidade de Podologia",
    communityTagline: "com Dra. Clarissa Vaz",
    courseCallToActionTitle: "Transforme sua Carreira em Podologia",
    courseCallToActionDescription: "Aprenda com a Dra. Clarissa Vaz e torne-se referência no mercado. Mais de 500 profissionais já transformaram suas práticas com nossos cursos.",
    courseSuccessCount: "500",
    sosServiceName: "SOS Clarissa",
    sosServiceDescription: "Suporte especializado de urgência"
  });

  // Course promotions (configured by client admin)
  const [coursePromotions] = useState([
    {
      id: 1,
      title: "🔥 LANÇAMENTO: Curso Completo de Podologia Clínica 2025",
      subtitle: "Seja um especialista reconhecido no mercado",
      description: "Aprenda as técnicas mais modernas e eficazes da podologia com a Dra. Clarissa Vaz. Mais de 100 horas de conteúdo prático, casos reais e certificação reconhecida pelo mercado.",
      image: null, // Will be configured by admin
      price: "R$ 897,00",
      installments: "12x R$ 74,75",
      highlights: [
        "✅ 100+ horas de vídeo aulas",
        "✅ 50 casos clínicos reais",
        "✅ Certificado reconhecido",
        "✅ Grupo VIP no WhatsApp",
        "✅ Acesso vitalício",
        "✅ Garantia de 30 dias"
      ],
      badge: "NOVO",
      badgeColor: "bg-red-500",
      link: "https://perfectpay.com.br/curso-podologia-clinica-2025",
      featured: true
    },
    {
      id: 2,
      title: "Especialização em Pé Diabético",
      subtitle: "Torne-se referência em cuidados com pacientes diabéticos",
      description: "Protocolo completo para avaliação, prevenção e tratamento de complicações em pés diabéticos. Aprenda a salvar membros e transformar vidas.",
      image: null,
      price: "R$ 697,00",
      installments: "12x R$ 58,08",
      highlights: [
        "✅ 60 horas de conteúdo",
        "✅ Protocolos atualizados",
        "✅ Casos práticos",
        "✅ Mentoria inclusa"
      ],
      badge: "POPULAR",
      badgeColor: "bg-blue-500",
      link: "https://perfectpay.com.br/especializacao-pe-diabetico",
      featured: false
    },
    {
      id: 3,
      title: "Workshop: Técnicas Avançadas de Onicocriptose",
      subtitle: "Domine os procedimentos mais eficazes",
      description: "Técnicas cirúrgicas e conservadoras para tratamento definitivo de unhas encravadas. Aumente sua receita com procedimentos especializados.",
      image: null,
      price: "R$ 297,00",
      installments: "6x R$ 49,50",
      highlights: [
        "✅ 20 horas de conteúdo",
        "✅ Técnicas cirúrgicas",
        "✅ Material didático",
        "✅ Suporte direto"
      ],
      badge: "LIMITADO",
      badgeColor: "bg-purple-500",
      link: "https://perfectpay.com.br/workshop-onicocriptose",
      featured: false
    }
  ]);
  
  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // SOS Clarissa popup state
  const [showSOSPopup, setShowSOSPopup] = useState(false);
  
  // Simulate real-time notifications from Dra. Clarissa
  useEffect(() => {
    const simulateNotifications = () => {
      // Simulate live session notification
      const liveNotification = {
        id: `live_${Date.now()}`,
        type: "live",
        title: "Dra. Clarissa iniciou uma sessão ao vivo",
        message: "Casos Clínicos Complexos - Entre agora para participar da discussão",
        timestamp: new Date(),
        action: {
          text: "Entrar",
          onClick: () => {
            toast({
              title: "Entrando na sessão...",
              description: "Redirecionando para a sala ao vivo",
            });
          }
        }
      };

      // Simulate schedule notification
      const scheduleNotification = {
        id: `schedule_${Date.now() + 1000}`,
        type: "schedule",
        title: "Nova sessão agendada",
        message: "Workshop sobre Pé Diabético marcado para amanhã às 15:00",
        timestamp: new Date(),
        action: {
          text: "Ver agenda",
          onClick: () => {
            toast({
              title: "Agenda atualizada",
              description: "Workshop adicionado à sua agenda",
            });
          }
        }
      };

      setNotifications([liveNotification, scheduleNotification]);
    };

    // Simulate notification after 3 seconds
    const timer = setTimeout(simulateNotifications, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
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

  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    toast({
      title: "Mensagem enviada!",
      description: "Sua mensagem foi enviada para a Dra. Clarissa Vaz.",
    });
    setMessageText("");
  };

  const scheduleConsultation = (topic: string) => {
    toast({
      title: "Agendamento solicitado",
      description: `Consulta sobre "${topic}" foi solicitada. Você receberá a confirmação em breve.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={metaSyncIcon} alt="MetaSync" className="h-16 w-16" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {brandingConfig.communityName}
                </h1>
                <p className="text-sm text-gray-500">{brandingConfig.communityTagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* SOS Clarissa Button */}
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold animate-pulse"
                onClick={() => setShowSOSPopup(true)}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {brandingConfig.sosServiceName}
              </Button>
              
              {/* Plan Badge */}
              {userPlan === "premium" && (
                <Badge className="bg-yellow-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              {userPlan === "intermediate" && (
                <Badge className="bg-purple-500 text-white">
                  Intermediário
                </Badge>
              )}
              {userPlan === "basic" && (
                <Badge variant="outline" className="border-gray-400 text-gray-600">
                  Básico
                </Badge>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Tabs defaultValue="community" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Comunidade
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Salas
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Conta
            </TabsTrigger>
          </TabsList>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Ask the Community */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Perguntar à Comunidade</CardTitle>
                  <CardDescription>
                    Faça suas perguntas e receba ajuda de outros podólogos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Ex: Como vocês tratam unha encravada recorrente? Preciso de sugestões..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button onClick={sendMessage} className="flex-1">
                        <Send className="w-4 h-4 mr-2" />
                        Publicar Pergunta
                      </Button>
                      <Button variant="outline">
                        <PaperclipIcon className="w-4 h-4 mr-2" />
                        Imagem
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Comunidade Ativa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">147 membros online</span>
                    </div>
                    <div className="text-2xl font-bold">324</div>
                    <div className="text-sm text-gray-600">podólogos na comunidade</div>
                    <div className="text-sm text-gray-600">
                      23 perguntas respondidas hoje
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Community Questions */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Discussões Recentes</CardTitle>
                  <CardDescription>
                    Últimas perguntas da comunidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                    {/* Question 1 */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-600 text-white">MS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">Maria Silva</span>
                            <span className="text-sm text-gray-500">• há 2 horas</span>
                            <Badge variant="outline" className="text-xs">Técnicas</Badge>
                          </div>
                          <p className="mb-3">
                            Alguém já testou laser terapia para onicomicose? 
                            Estou considerando investir no equipamento mas gostaria de opiniões de quem já usa.
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <button className="flex items-center gap-1 hover:text-blue-600">
                              <MessageSquare className="w-4 h-4" />
                              12 respostas
                            </button>
                            <button className="flex items-center gap-1 hover:text-red-600">
                              <Heart className="w-4 h-4" />
                              8 úteis
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-green-600 text-white">JC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">João Costa</span>
                            <span className="text-sm text-gray-500">• há 4 horas</span>
                            <Badge variant="outline" className="text-xs">Casos Clínicos</Badge>
                          </div>
                          <p className="mb-3">
                            Paciente diabético com úlcera plantar há 3 semanas. 
                            Já tentei várias abordagens. Alguém tem protocolo específico que funciona bem?
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <button className="flex items-center gap-1 hover:text-blue-600">
                              <MessageSquare className="w-4 h-4" />
                              18 respostas
                            </button>
                            <button className="flex items-center gap-1 hover:text-red-600">
                              <Heart className="w-4 h-4" />
                              15 úteis
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-purple-600 text-white">AL</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">Ana Lima</span>
                            <span className="text-sm text-gray-500">• ontem</span>
                            <Badge variant="outline" className="text-xs">Negócios</Badge>
                          </div>
                          <p className="mb-3">
                            Como vocês precificam procedimentos de onicocriptose? 
                            Estou montando tabela de preços e quero estar alinhada com o mercado.
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <button className="flex items-center gap-1 hover:text-blue-600">
                              <MessageSquare className="w-4 h-4" />
                              25 respostas
                            </button>
                            <button className="flex items-center gap-1 hover:text-red-600">
                              <Heart className="w-4 h-4" />
                              22 úteis
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>

            </div>

          </TabsContent>

          {/* Video Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Active Rooms */}
              <Card>
                <CardHeader>
                  <CardTitle>Salas Ativas Agora</CardTitle>
                  <CardDescription>
                    Entre em salas de videoconferência sobre temas específicos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-green-900">Casos Clínicos Complexos</h4>
                          <p className="text-sm text-green-700">com Dra. Clarissa Vaz</p>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">AO VIVO</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-green-800 mb-3">
                        <span>• 12 participantes</span>
                        <span>• Iniciou há 15 min</span>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Video className="w-4 h-4 mr-2" />
                        Entrar na Sala
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-blue-900">Networking Livre</h4>
                          <p className="text-sm text-blue-700">Conversa aberta entre membros</p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">AO VIVO</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-blue-800 mb-3">
                        <span>• 8 participantes</span>
                        <span>• Iniciou há 32 min</span>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Video className="w-4 h-4 mr-2" />
                        Entrar na Sala
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Estudos de Caso: Pé Diabético</h4>
                          <p className="text-sm text-gray-600">Agendada para 15:00</p>
                        </div>
                        <Badge variant="outline">Em breve</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>• 0 participantes</span>
                        <span>• Inicia em 2h 30min</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Clock className="w-4 h-4 mr-2" />
                        Lembrar-me
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Create Room */}
              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Sala</CardTitle>
                  <CardDescription>
                    Inicie uma videoconferência sobre um tema específico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                    <div>
                      <label className="text-sm font-medium">Tema da Sala</label>
                      <Input placeholder="Ex: Dúvidas sobre Onicomicose" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Descrição (opcional)</label>
                      <Textarea 
                        placeholder="Descreva sobre o que vocês vão conversar..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Tipo</label>
                        <select className="w-full p-2 border rounded-lg">
                          <option>Discussão Aberta</option>
                          <option>Apresentação</option>
                          <option>Caso Clínico</option>
                          <option>Networking</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Máx. Participantes</label>
                        <Input type="number" defaultValue="20" min="2" max="50" />
                      </div>
                    </div>

                    <Button className="w-full" disabled={userPlan !== "premium"}>
                      <Video className="w-4 h-4 mr-2" />
                      {userPlan === "premium" ? "Criar Sala" : "Premium apenas"}
                    </Button>
                    
                    {userPlan !== "premium" && (
                      <p className="text-xs text-center text-gray-500">
                        Criar salas está disponível apenas para membros Premium
                      </p>
                    )}

                  </div>
                </CardContent>
              </Card>

            </div>

          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            
            {/* Course Promotions */}
            <div className="space-y-8">
              
              {/* Featured Course */}
              {coursePromotions.filter(course => course.featured).map(course => (
                <Card key={course.id} className="bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-2xl border-0">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <Badge className={`${course.badgeColor} text-white mb-4 animate-pulse`}>
                          {course.badge}
                        </Badge>
                        <h2 className="text-3xl font-bold mb-3">{course.title}</h2>
                        <h3 className="text-xl text-red-100 mb-4">{course.subtitle}</h3>
                        <p className="text-red-100 mb-6 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-4xl font-bold mb-2">{course.price}</div>
                        <div className="text-red-200 text-lg">ou {course.installments}</div>
                        <div className="text-red-200 text-sm">sem juros</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-2">
                        {course.highlights.slice(0, 3).map((highlight, index) => (
                          <div key={index} className="text-white flex items-center gap-2">
                            <span className="text-lg">{highlight}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {course.highlights.slice(3).map((highlight, index) => (
                          <div key={index} className="text-white flex items-center gap-2">
                            <span className="text-lg">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg"
                        className="flex-1 bg-white text-red-600 hover:bg-gray-100 font-bold py-4 text-lg shadow-lg"
                        onClick={() => {
                          window.open(course.link, '_blank');
                          toast({
                            title: "Redirecionando...",
                            description: `Você será direcionado para ${course.title}`,
                          });
                        }}
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        QUERO ESTE CURSO
                      </Button>
                      <div className="text-center text-white/90 text-sm pt-2">
                        ⭐ Garantia de 30 dias • Acesso vitalício
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Other Courses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {coursePromotions.filter(course => !course.featured).map(course => (
                  <Card key={course.id} className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${course.badgeColor} text-white`}>
                          {course.badge}
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{course.price}</div>
                          <div className="text-sm text-gray-600">ou {course.installments}</div>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-gray-700">
                        {course.subtitle}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {course.description}
                      </p>
                      
                      <div className="space-y-2 mb-6">
                        {course.highlights.map((highlight, index) => (
                          <div key={index} className="text-sm text-gray-700">
                            {highlight}
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full font-semibold"
                        onClick={() => {
                          window.open(course.link, '_blank');
                          toast({
                            title: "Redirecionando...",
                            description: `Você será direcionado para ${course.title}`,
                          });
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Curso Completo
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    {brandingConfig.courseCallToActionTitle}
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    {brandingConfig.courseCallToActionDescription}
                  </p>
                  <div className="flex items-center justify-center gap-8 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Certificação reconhecida</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Suporte especializado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Acesso vitalício</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Available Times */}
              <Card>
                <CardHeader>
                  <CardTitle>Horários Disponíveis - Dra. Clarissa Vaz</CardTitle>
                  <CardDescription>
                    Agende sua consulta ou sessão de dúvidas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Consulta Individual</h4>
                          <p className="text-sm text-gray-600">30 minutos • Online</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">Hoje, 14:30</div>
                          <div className="text-sm text-gray-500">Disponível</div>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => scheduleConsultation("Consulta Individual")}
                        disabled={userPlan !== "premium"}
                      >
                        {userPlan === "premium" ? "Agendar" : "Premium apenas"}
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Sessão sobre Casos Complexos</h4>
                          <p className="text-sm text-gray-600">60 minutos • Online</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">Amanhã, 10:00</div>
                          <div className="text-sm text-gray-500">3 vagas</div>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => scheduleConsultation("Casos Complexos")}
                      >
                        Participar
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Workshop: Órteses Digitais</h4>
                          <p className="text-sm text-gray-600">90 minutos • Online</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">Sex, 15:00</div>
                          <div className="text-sm text-gray-500">8 vagas</div>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => scheduleConsultation("Workshop Órteses")}
                      >
                        Inscrever-se
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* My Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Meus Agendamentos</CardTitle>
                  <CardDescription>
                    Próximas consultas e sessões agendadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-900">Hoje, 16:30</span>
                      </div>
                      <h4 className="font-semibold mb-1">Dúvidas sobre Onicomicose</h4>
                      <p className="text-sm text-blue-700 mb-3">Consulta individual com Dra. Clarissa</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Video className="w-4 h-4 mr-2" />
                          Entrar
                        </Button>
                        <Button size="sm" variant="outline">
                          Reagendar
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="font-semibold">Amanhã, 10:00</span>
                      </div>
                      <h4 className="font-semibold mb-1">Casos Complexos</h4>
                      <p className="text-sm text-gray-600 mb-3">Sessão em grupo</p>
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>

            </div>

          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Message with Specialist */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">CV</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Dra. Clarissa Vaz</CardTitle>
                      <CardDescription>Especialista em Podologia</CardDescription>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Online</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  
                  {userPlan !== "premium" ? (
                    <div className="text-center py-8">
                      <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-600 mb-2">Mensagens Premium</h3>
                      <p className="text-gray-500 mb-4">
                        Faça upgrade para Premium e converse diretamente com a especialista
                      </p>
                      <Button className="bg-yellow-600 hover:bg-yellow-700">
                        Fazer Upgrade
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Message History */}
                      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                        
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">CV</AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                            <p className="text-sm">Olá! Como posso ajudar hoje?</p>
                            <span className="text-xs text-gray-500">10:30</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 justify-end">
                          <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                            <p className="text-sm">Tenho dúvidas sobre o tratamento de unha encravada</p>
                            <span className="text-xs text-blue-200">10:32</span>
                          </div>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-600 text-white text-xs">EU</AvatarFallback>
                          </Avatar>
                        </div>

                      </div>

                      {/* Message Input */}
                      <div className="border-t pt-4">
                        <div className="flex gap-2 mb-3">
                          <Button size="sm" variant="outline">
                            <PaperclipIcon className="w-4 h-4 mr-2" />
                            Arquivo
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mic className="w-4 h-4 mr-2" />
                            Áudio
                          </Button>
                          <Button size="sm" variant="outline">
                            <Video className="w-4 h-4 mr-2" />
                            Vídeo
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Textarea 
                            placeholder="Digite sua mensagem..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="resize-none"
                            rows={2}
                          />
                          <Button onClick={sendMessage}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                </CardContent>
              </Card>

              {/* Other Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Outros Membros</CardTitle>
                  <CardDescription>
                    Conecte-se com outros profissionais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-green-600 text-white text-xs">MS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Maria Silva</p>
                        <p className="text-xs text-gray-500">Podóloga • SP</p>
                      </div>
                      {userPlan === "premium" && (
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">JC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">João Costa</p>
                        <p className="text-xs text-gray-500">Podólogo • RJ</p>
                      </div>
                      {userPlan === "premium" && (
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    {userPlan !== "premium" && (
                      <div className="text-center py-4">
                        <p className="text-xs text-gray-500 mb-2">
                          Mensagens entre membros disponíveis no Premium
                        </p>
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                          Upgrade
                        </Button>
                      </div>
                    )}

                  </div>
                </CardContent>
              </Card>

            </div>

          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            
            {/* Upgrade Section for Non-Premium Users */}
            {userPlan !== "premium" && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-600" />
                    Desbloqueie Todo o Potencial da Comunidade
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Veja o que você está perdendo e acelere seu crescimento profissional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  
                  {/* Plans Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Current Plan */}
                    <div className={`p-6 rounded-xl border-2 ${userPlan === "basic" ? "border-gray-300 bg-gray-50" : "border-purple-300 bg-purple-50"}`}>
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-lg">
                          {userPlan === "basic" ? "Seu Plano Atual" : "Seu Plano Atual"}
                        </h3>
                        <div className="text-2xl font-bold mt-2">
                          {userPlan === "basic" ? "Básico" : "Intermediário"}
                        </div>
                        <div className="text-lg font-semibold text-gray-600">
                          {userPlan === "basic" ? "R$ 29,90/mês" : "R$ 59,90/mês"}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✅</span>
                          <span>Acesso à comunidade</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✅</span>
                          <span>Visualizar discussões</span>
                        </div>
                        {userPlan === "intermediate" && (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✅</span>
                              <span>Participar de salas</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✅</span>
                              <span>Mensagens limitadas</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">❌</span>
                          <span className="text-gray-500">Mensagens diretas com Dra. Clarissa</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">❌</span>
                          <span className="text-gray-500">Criar salas de vídeo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">❌</span>
                          <span className="text-gray-500">Upload de arquivos/vídeos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">❌</span>
                          <span className="text-gray-500">Networking premium</span>
                        </div>
                      </div>
                    </div>

                    {/* Intermediate Plan (if user is basic) */}
                    {userPlan === "basic" && (
                      <div className="p-6 rounded-xl border-2 border-purple-300 bg-purple-50">
                        <div className="text-center mb-4">
                          <Badge className="bg-purple-600 text-white mb-2">Próximo Nível</Badge>
                          <h3 className="font-bold text-lg text-purple-900">Intermediário</h3>
                          <div className="text-2xl font-bold text-purple-600 mt-2">R$ 59,90</div>
                          <div className="text-sm text-purple-700">/mês</div>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-6">
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">✅</span>
                            <span>Tudo do Básico</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">✅</span>
                            <span className="font-semibold">Participar de salas ao vivo</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">✅</span>
                            <span className="font-semibold">Mensagens entre membros</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">✅</span>
                            <span className="font-semibold">Publicar perguntas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-red-500">❌</span>
                            <span className="text-gray-500">Acesso direto à especialista</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            window.open(upgradeLinks.intermediate, '_blank');
                            toast({
                              title: "Redirecionando...",
                              description: "Você será direcionado para o upgrade Intermediário",
                            });
                          }}
                        >
                          Fazer Upgrade
                        </Button>
                      </div>
                    )}

                    {/* Premium Plan */}
                    <div className="p-6 rounded-xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 relative transform hover:scale-105 transition-transform">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 font-bold">
                          🚀 RECOMENDADO
                        </Badge>
                      </div>
                      
                      <div className="text-center mb-4 mt-2">
                        <h3 className="font-bold text-lg text-yellow-900">Premium VIP</h3>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <span className="text-lg text-gray-500 line-through">R$ 149,90</span>
                          <div className="text-2xl font-bold text-yellow-600">R$ 99,90</div>
                        </div>
                        <div className="text-sm text-yellow-700">/mês</div>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-6">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✅</span>
                          <span>Tudo dos outros planos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✅</span>
                          <span className="font-semibold">WhatsApp direto com Dra. Clarissa</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✅</span>
                          <span className="font-semibold">Criar salas de vídeo ilimitadas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✅</span>
                          <span className="font-semibold">Upload de vídeos/arquivos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✅</span>
                          <span className="font-semibold">Networking VIP exclusivo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✅</span>
                          <span className="font-semibold">Certificados reconhecidos</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold"
                        onClick={() => {
                          window.open(upgradeLinks.premium, '_blank');
                          toast({
                            title: "Redirecionando...",
                            description: "Você será direcionado para o upgrade Premium",
                          });
                        }}
                      >
                        🔥 QUERO SER PREMIUM
                      </Button>
                    </div>

                  </div>

                  {/* Success Stories */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
                    <h4 className="font-bold text-lg mb-4 text-center">
                      Veja o que membros Premium estão conseguindo:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-900">"Aumentei minha receita em 200%"</div>
                        <div className="text-green-700">- Dra. Maria, Premium há 4 meses</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-900">"Resolvo casos complexos mais rápido"</div>
                        <div className="text-blue-700">- Dr. João, Premium há 6 meses</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-purple-900">"Minha clínica virou referência"</div>
                        <div className="text-purple-700">- Dra. Ana, Premium há 1 ano</div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Password Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>
                    Mantenha sua conta segura
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Senha Atual</label>
                    <Input type="password" placeholder="Digite sua senha atual" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nova Senha</label>
                    <Input type="password" placeholder="Digite sua nova senha" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Confirmar Nova Senha</label>
                    <Input type="password" placeholder="Confirme sua nova senha" />
                  </div>
                  <Button className="w-full">
                    Atualizar Senha
                  </Button>
                </CardContent>
              </Card>

              {/* Current Plan Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Plano Atual</CardTitle>
                  <CardDescription>
                    Informações da sua assinatura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                    {userPlan === "premium" ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-900">Plano Premium VIP</span>
                        </div>
                        <p className="text-sm text-yellow-800 mb-3">
                          Você tem acesso completo a todos os recursos premium
                        </p>
                        <div className="text-sm text-yellow-700 space-y-1">
                          <p>• Mensagens diretas com especialista</p>
                          <p>• Salas de vídeo ilimitadas</p>
                          <p>• Networking premium</p>
                          <p>• Upload de arquivos e mídia</p>
                        </div>
                      </div>
                    ) : userPlan === "intermediate" ? (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-900">Plano Intermediário</span>
                        </div>
                        <p className="text-sm text-purple-800 mb-3">
                          Acesso às salas de vídeo e comunicação entre membros
                        </p>
                        <div className="text-sm text-purple-700 space-y-1">
                          <p>• Participação em salas ao vivo</p>
                          <p>• Mensagens entre membros</p>
                          <p>• Publicar perguntas na comunidade</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">Plano Básico</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Acesso básico à comunidade e visualização de conteúdos
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• Visualizar discussões</p>
                          <p>• Acesso aos cursos</p>
                          <p>• Participar como observador</p>
                        </div>
                      </div>
                    )}

                  </div>
                </CardContent>
              </Card>

            </div>

          </TabsContent>
        </Tabs>

      </main>
      
      {/* Notification Popups */}
      <NotificationPopup 
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* SOS Clarissa Popup */}
      {showSOSPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white relative">
              <button
                onClick={() => setShowSOSPopup(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">SOS Clarissa</CardTitle>
                  <CardDescription className="text-red-100">
                    Teleconsulta de Urgência com Dra. Clarissa Vaz
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              
              {/* Urgency Notice */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Atendimento Prioritário</span>
                </div>
                <p className="text-red-700 text-sm">
                  Para casos urgentes, a Dra. Clarissa se disponibiliza o mais rápido possível.
                  Resposta garantida em até 30 minutos durante horário comercial.
                </p>
              </div>

              {/* Service Description */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    O que é o SOS Clarissa?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    O SOS Clarissa é um serviço de teleconsulta especializado onde você pode obter 
                    ajuda imediata da Dra. Clarissa Vaz para casos urgentes ou complexos.
                  </p>
                </div>

                {/* Service Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Video className="w-6 h-6 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Teleconsulta ao Vivo</h4>
                    </div>
                    <p className="text-blue-800 text-sm mb-3">
                      Envie vídeos do paciente em tempo real durante o atendimento. 
                      A Dra. Clarissa te orienta sobre procedimentos e diagnósticos.
                    </p>
                    <div className="text-lg font-bold text-blue-600">R$ 150</div>
                    <div className="text-xs text-blue-600">por consulta</div>
                  </div>

                  <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                      <h4 className="font-semibold text-green-900">Discussão de Casos</h4>
                    </div>
                    <p className="text-green-800 text-sm mb-3">
                      Apresente casos complexos com fotos e histórico. 
                      Receba orientação detalhada sobre o melhor tratamento.
                    </p>
                    <div className="text-lg font-bold text-green-600">R$ 80</div>
                    <div className="text-xs text-green-600">por caso</div>
                  </div>

                  <div className="border rounded-lg p-4 bg-purple-50 border-purple-200 md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-6 h-6 text-purple-600" />
                      <h4 className="font-semibold text-purple-900">Aula Particular 1:1</h4>
                    </div>
                    <p className="text-purple-800 text-sm mb-3">
                      Uma hora completa com a Dra. Clarissa 100% focada em você. 
                      Tire todas as dúvidas, aprenda técnicas específicas ou discuta estratégias para sua clínica.
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-lg font-bold text-purple-600">R$ 300</div>
                        <div className="text-xs text-purple-600">60 minutos</div>
                      </div>
                      <Badge className="bg-purple-600 text-white">Mais Procurado</Badge>
                    </div>
                  </div>

                </div>

                {/* Benefits */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Incluído em todos os serviços:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Gravação da consulta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Relatório por escrito</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Follow-up por WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Protocolo personalizado</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Notice */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-2">Casos de Emergência</h4>
                      <p className="text-orange-800 text-sm">
                        Se você está com um paciente agora e precisa de orientação imediata, 
                        a Dra. Clarissa priorizará seu atendimento. Resposta em até 15 minutos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    size="lg"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                    onClick={() => {
                      window.open('https://perfectpay.com.br/sos-clarissa-teleconsulta', '_blank');
                      setShowSOSPopup(false);
                      toast({
                        title: "Redirecionando...",
                        description: "Você será direcionado para a página de agendamento do SOS Clarissa",
                      });
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Solicitar SOS Agora
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setShowSOSPopup(false)}
                  >
                    Fechar
                  </Button>
                </div>

              </div>

            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}