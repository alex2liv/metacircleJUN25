import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Calendar, BookOpen, Heart, Eye, Play, Check, DollarSign, ExternalLink, Phone, MessageCircle } from "lucide-react";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function ClientView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

        <Card>
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

        <Card>
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
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {post.likesCount} curtidas
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {post.commentsCount} comentários
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Ver Todas as Discussões
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

      {/* Ranking da Comunidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Membros da Comunidade
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