import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, MessageSquare, Settings, ExternalLink, Clock, Users, Video, FileText, Mic, PaperclipIcon, Send, Crown, LogOut, Heart, AlertTriangle, Phone, Zap, X, Check } from "lucide-react";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";
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
  const [userPlan] = useState("premium"); // basic, premium
  
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
              <img src={metaSyncLogo} alt="MetaSync" className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Comunidade de Podologia
                </h1>
                <p className="text-sm text-gray-500">com Dra. Clarissa Vaz</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* SOS Clarissa Button */}
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold animate-pulse"
                onClick={() => setShowSOSPopup(true)}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                SOS Clarissa
              </Button>
              
              {userPlan === "premium" && (
                <Badge className="bg-yellow-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Featured Course */}
              <Card className="lg:col-span-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-white/20 text-white mb-4">
                        Mais Popular
                      </Badge>
                      <h3 className="text-2xl font-bold mb-2">Curso Completo de Podologia Clínica</h3>
                      <p className="text-purple-100 mb-4">
                        Do básico ao avançado: anatomia, patologias, tratamentos e casos práticos
                      </p>
                      <div className="flex items-center gap-6 text-sm text-purple-100 mb-6">
                        <span>• 80 horas de conteúdo</span>
                        <span>• Certificado reconhecido</span>
                        <span>• Suporte da especialista</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">R$ 897</div>
                      <div className="text-purple-200 text-sm">ou 12x R$ 74,75</div>
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                    onClick={() => {
                      window.open('https://perfectpay.com.br/curso-podologia-completo', '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Acessar Curso
                  </Button>
                </CardContent>
              </Card>

              {/* Course 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Técnicas Avançadas de Podologia</CardTitle>
                  <CardDescription>
                    Procedimentos especializados para casos complexos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">R$ 497</div>
                      <Badge variant="outline">40h de conteúdo</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Cirurgias de unhas encravadas</p>
                      <p>• Tratamento de verrugas plantares</p>
                      <p>• Órteses digitais personalizadas</p>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        window.open('https://perfectpay.com.br/tecnicas-avancadas-podologia', '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver Curso
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Course 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pé Diabético: Protocolo Completo</CardTitle>
                  <CardDescription>
                    Cuidados especializados para pacientes diabéticos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-600">R$ 697</div>
                      <Badge variant="outline">60h de conteúdo</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Avaliação e classificação de riscos</p>
                      <p>• Protocolos de prevenção</p>
                      <p>• Tratamento de úlceras</p>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        window.open('https://perfectpay.com.br/pe-diabetico-protocolo', '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver Curso
                    </Button>
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

              {/* Plan Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Seu Plano</CardTitle>
                  <CardDescription>
                    Informações sobre sua assinatura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                    {userPlan === "premium" ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-900">Plano Premium</span>
                        </div>
                        <p className="text-sm text-yellow-800 mb-3">
                          Você tem acesso completo a todos os recursos
                        </p>
                        <div className="text-sm text-yellow-700 space-y-1">
                          <p>• Mensagens diretas com especialista</p>
                          <p>• Agendamentos prioritários</p>
                          <p>• Comunicação com outros membros</p>
                          <p>• Upload de arquivos e mídia</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold">Plano Básico</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Acesso aos cursos e agendamentos básicos
                        </p>
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                          Fazer Upgrade para Premium
                        </Button>
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