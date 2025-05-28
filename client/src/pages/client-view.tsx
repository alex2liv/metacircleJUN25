import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Calendar, BookOpen, Heart, Eye, Play, Check, DollarSign, ExternalLink, Phone, MessageCircle, Crown } from "lucide-react";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function ClientView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [joinedEvents, setJoinedEvents] = useState<Set<number>>(new Set());

  const { data: stats } = useQuery({
    queryKey: ['/api/communities/3/stats'],
  });

  const { data: recentPosts } = useQuery({
    queryKey: ['/api/communities/3/posts'],
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['/api/communities/3/events'],
  });

  const { data: topMembers } = useQuery({
    queryKey: ['/api/communities/3/members/top'],
  });

  // Mutation para participar do evento
  const joinEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao participar do evento');
      }
      
      const data = await response.json();
      return data;
    },
    onSuccess: (data, eventId) => {
      setJoinedEvents(prev => new Set([...prev, eventId]));
      queryClient.invalidateQueries({ queryKey: ['/api/communities/3/events'] });
      
      toast({
        title: "🎉 Inscrição confirmada!",
        description: `Você foi inscrito no evento "${data.event.title}". Uma notificação WhatsApp foi enviada com os detalhes.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro na inscrição",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleJoinEvent = (eventId: number, eventTitle: string) => {
    joinEventMutation.mutate(eventId);
  };

  return (
    <div className="space-y-6">
      {/* Banner Trial Premium - Cartão Obrigatório */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-lg border-2 border-amber-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">🔥 Trial Premium Gratuito!</h3>
              <p className="text-amber-100 text-sm">Cadastre seu cartão e teste 14 dias GRÁTIS</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg px-3 py-2">
              <p className="text-sm font-medium">⏰ Restam</p>
              <p className="text-2xl font-bold">8 dias</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{width: '43%'}}></div>
          </div>
          <p className="text-sm text-amber-100">6 de 14 dias utilizados</p>
        </div>
        <div className="mt-3 text-center">
          <p className="text-sm text-amber-100 mb-2">
            💳 Cartão cadastrado - cobrança automática apenas após 14 dias
          </p>
          <div className="flex gap-2 justify-center">
            <Button size="sm" className="bg-white text-orange-600 hover:bg-gray-100">
              Confirmar Assinatura
            </Button>
            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/10">
              Gerenciar Cartão
            </Button>
          </div>
        </div>
        
        {/* Estratégia de upgrade */}
        <div className="mt-3 p-2 bg-white/10 rounded-lg text-center text-xs">
          <p className="text-amber-100">
            💡 <strong>Dica:</strong> Assinantes Básico ganham 24h Premium | Intermediário ganham 48h Premium
          </p>
        </div>
      </div>

      {/* Cabeçalho Cliente */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={metaSyncLogo} 
              alt="MetaSync Logo" 
              className="h-16 w-auto filter brightness-0 invert"
            />
            <div>
              <h2 className="text-xl font-bold">MetaCircle</h2>
              <p className="text-blue-100 text-sm">Powered by MetaSync</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Eye className="w-4 h-4 mr-1" />
            VISÃO DO CLIENTE
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100">
          Aqui está tudo que está acontecendo na sua comunidade
        </p>
      </div>

      {/* Stats simplificadas para cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Membros Ativos</p>
                <p className="text-2xl font-bold">{stats?.activeMembers || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Posts Hoje</p>
                <p className="text-2xl font-bold">{stats?.postsToday || 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation('/events')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximos Eventos</p>
                <p className="text-2xl font-bold">{stats?.upcomingEvents || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
          window.open('https://clarissavaz.academy.perfectpay.com.br', '_blank');
          toast({
            title: "Redirecionando para PerfectPay",
            description: "Você será direcionado para os cursos disponíveis",
          });
        }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cursos Disponíveis</p>
                <p className="text-2xl font-bold">{stats?.activeCourses || 0}</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts Recentes - Visão Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Discussões Recentes
            </CardTitle>
            <CardDescription>
              Participe das conversas da comunidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts?.slice(0, 3).map((post: any) => (
              <div key={post.id} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <button 
                    className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
                    onClick={() => {
                      toast({
                        title: "Post curtido!",
                        description: "Você curtiu este post",
                      });
                    }}
                  >
                    <Heart className="w-3 h-3" />
                    {post.likesCount} curtidas
                  </button>
                  <button 
                    className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer"
                    onClick={() => {
                      setLocation('/spaces');
                      toast({
                        title: "Abrindo comentários",
                        description: "Redirecionando para ver todos os comentários",
                      });
                    }}
                  >
                    <MessageSquare className="w-3 h-3" />
                    {post.commentsCount} comentários
                  </button>
                  <button 
                    className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer"
                    onClick={() => {
                      navigator.share?.({
                        title: post.title,
                        text: post.content,
                        url: window.location.href
                      }) || toast({
                        title: "Link copiado!",
                        description: "Post pronto para compartilhar",
                      });
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    compartilhar
                  </button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => setLocation('/spaces')}>
              💬 Entrar no Grupo Geral
            </Button>
          </CardContent>
        </Card>

        {/* Próximos Eventos - Visão Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>
              Não perca nenhum evento importante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents?.slice(0, 3).map((event: any) => (
              <div key={event.id} className="border rounded-lg p-3 bg-gradient-to-r from-purple-50 to-blue-50">
                <h4 className="font-medium text-gray-900 mb-1">
                  {event.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(event.startDate), "dd 'de' MMM", { locale: ptBR })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.attendeesCount} participantes
                  </div>
                </div>
                {joinedEvents.has(event.id) ? (
                  <Button size="sm" variant="outline" disabled className="bg-green-50 text-green-700 border-green-200">
                    <Check className="w-4 h-4 mr-1" />
                    Inscrito
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => handleJoinEvent(event.id, event.title)}
                    disabled={joinEventMutation.isPending}
                  >
                    {joinEventMutation.isPending ? "Inscrevendo..." : "Participar"}
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Ver Calendário Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Cursos - Destaque para Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Cursos Disponíveis
          </CardTitle>
          <CardDescription>
            Aprenda com nossos cursos exclusivos e acelere seu crescimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 1,
                title: "React Avançado para Desenvolvedores",
                description: "Domine React, Next.js, TypeScript e as melhores práticas do mercado",
                price: "R$ 297",
                level: "Avançado",
                duration: "8 semanas",
                perfectPayUrl: "https://pay.perfectpay.com.br/checkout/react-avancado"
              },
              {
                id: 2,
                title: "JavaScript do Zero ao Profissional",
                description: "Aprenda JavaScript moderno, ES6+, APIs e desenvolvimento full-stack",
                price: "R$ 197",
                level: "Iniciante",
                duration: "12 semanas",
                perfectPayUrl: "https://pay.perfectpay.com.br/checkout/javascript-completo"
              },
              {
                id: 3,
                title: "Node.js e Banco de Dados",
                description: "Backend profissional com Node.js, Express, MongoDB e PostgreSQL",
                price: "R$ 247",
                level: "Intermediário",
                duration: "6 semanas",
                perfectPayUrl: "https://pay.perfectpay.com.br/checkout/nodejs-backend"
              }
            ].map((course) => (
              <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-blue-50">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg mb-3">
                  <Play className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-medium mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {course.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Nível:</span>
                    <Badge variant="outline" className={
                      course.level === "Iniciante" ? "bg-green-50 text-green-700" :
                      course.level === "Intermediário" ? "bg-yellow-50 text-yellow-700" :
                      "bg-red-50 text-red-700"
                    }>
                      {course.level}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duração:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-blue-600">
                    {course.price}
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => {
                      window.open(course.perfectPayUrl, '_blank');
                      toast({
                        title: "Redirecionando para pagamento",
                        description: "Você será direcionado para o checkout seguro do PerfectPAY",
                      });
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Comprar Agora
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Pagamento Seguro via PerfectPAY</h4>
            </div>
            <p className="text-sm text-blue-700">
              Processamento seguro, acesso imediato após aprovação do pagamento. 
              Aceita PIX, cartão de crédito e boleto bancário.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Planos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Escolha seu Plano
          </CardTitle>
          <CardDescription>
            Encontre o plano ideal para sua jornada na comunidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Plano Básico */}
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">Básico</h3>
                <div className="text-2xl font-bold text-blue-600 mt-2">R$ 10/mês</div>
                <p className="text-sm text-gray-600">Ideal para começar</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Acesso à comunidade</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Eventos gratuitos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Ranking da comunidade</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Botão cursos MetaSync</span>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Escolher Básico
              </Button>
            </div>

            {/* Plano Intermediário */}
            <div className="border-2 border-blue-500 rounded-lg p-4 hover:shadow-md transition-shadow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500">Mais Popular</Badge>
              </div>
              
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">Intermediário</h3>
                <div className="text-2xl font-bold text-blue-600 mt-2">R$ 39/mês</div>
                <p className="text-sm text-gray-600">Para quem quer mais</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Tudo do Básico +</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>3 cursos por mês</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>1 live mensal</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>2 podcasts por mês</span>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Escolher Intermediário
              </Button>
            </div>

            {/* Plano Premium */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-500 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-purple-700 flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5" />
                  Premium
                </h3>
                <div className="text-2xl font-bold text-purple-600 mt-2">R$ 99/mês</div>
                <p className="text-sm text-gray-600">Acesso completo</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Tudo do Intermediário +</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Cursos ilimitados</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>2 lives mensais exclusivas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Podcast semanal</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>3 tickets SOS por ano (R$ 357)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>E-books da especialista</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>WhatsApp direto Clarissa Vaz</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Escolher Premium
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                  onClick={() => {
                    const specialistSettings = JSON.parse(localStorage.getItem('specialistSettings') || '{}');
                    const whatsapp = specialistSettings.specialistWhatsApp || '11910018833';
                    const name = specialistSettings.specialistName || 'Clarissa Vaz';
                    
                    window.open(`https://wa.me/55${whatsapp}?text=Olá ${name}! Vim do MetaCircle e tenho interesse no Plano Premium. Pode me ajudar?`, '_blank');
                    toast({
                      title: "Redirecionando para WhatsApp",
                      description: `Você será direcionado para conversar com ${name}`,
                    });
                  }}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Falar com Clarissa
                </Button>
                
                {/* Status Premium - apenas para membros Premium */}
                <div className="mt-3 p-2 bg-purple-100 rounded-lg">
                  <div className="text-center mb-2">
                    <p className="text-xs text-purple-700 font-medium">
                      🎫 Tickets SOS 2024: 1/3 utilizados
                    </p>
                    <p className="text-xs text-purple-600">
                      Próxima renovação: Janeiro 2025
                    </p>
                  </div>
                  
                  {/* Termômetro de progresso para ganhar ticket bônus */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-purple-700 mb-1">
                      <span>🔥 Ticket Bônus</span>
                      <span>450/500 pts</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                    <p className="text-xs text-purple-600 mt-1 text-center">
                      🎯 Mais 50 pontos para ganhar 1 ticket SOS extra!
                    </p>
                    
                    {/* Como ganhar pontos */}
                    <div className="mt-2 text-xs text-purple-700">
                      <p className="font-medium mb-1">Como ganhar pontos:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <span>💬 Postar: +20pts</span>
                        <span>❤️ Curtir: +5pts</span>
                        <span>🎯 Evento: +30pts</span>
                        <span>📚 Curso: +50pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking da Comunidade */}
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation('/ranking')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Membros da Comunidade
            <ExternalLink className="w-4 h-4 ml-auto text-blue-600" />
          </CardTitle>
          <CardDescription>
            Veja quem está mais ativo na comunidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topMembers?.slice(0, 5).map((member: any, index: number) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{member.user.firstName} {member.user.lastName}</p>
                    <p className="text-sm text-gray-600">Nível {member.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{member.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fale com a Especialista */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">
                Precisa de Ajuda Personalizada?
              </h3>
              <p className="text-purple-100 mb-4">
                Fale diretamente com nossa especialista e acelere seus resultados
              </p>
              <div className="flex gap-3">
                <Button 
                  className="bg-white text-purple-600 hover:bg-purple-50"
                  onClick={() => {
                    window.open('https://wa.me/5511910018833?text=Olá! Vim do MetaCircle e gostaria de conversar com a especialista sobre minha comunidade', '_blank');
                    toast({
                      title: "Redirecionando para WhatsApp",
                      description: "Você será direcionado para conversar com nossa especialista",
                    });
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar com Especialista
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aviso sobre notificações WhatsApp */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-green-900">
                Notificações WhatsApp Ativas
              </p>
              <p className="text-sm text-green-700">
                Você receberá lembretes de eventos e notificações de comentários diretamente no seu WhatsApp
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}