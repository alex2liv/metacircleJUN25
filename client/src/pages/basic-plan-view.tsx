import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Calendar, BookOpen, Heart, Eye, Play, Check, DollarSign, ExternalLink, Phone, MessageCircle, Crown, Lock } from "lucide-react";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function BasicPlanView() {
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

  // Simulação de plano básico
  const userPlan = "basic"; // "basic", "intermediate", "premium"

  const showPremiumUpgrade = (featureName: string, upgradeHours: number) => {
    toast({
      title: `🔒 Funcionalidade ${featureName} Premium`,
      description: `Upgrade para Intermediário e ganhe ${upgradeHours}h de acesso Premium!`,
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner Upgrade - Plano Básico */}
      <div className="bg-gradient-to-r from-gray-500 to-slate-600 text-white p-4 rounded-lg border-2 border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">📦 Plano Básico Ativo</h3>
              <p className="text-gray-100 text-sm">Upgrade para desbloquear todas as funcionalidades</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg px-3 py-2">
              <p className="text-sm font-medium">💰</p>
              <p className="text-xl font-bold">R$ 10</p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-100 mb-2">
            🚀 Upgrade para Intermediário e ganhe 48h de acesso Premium!
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              size="sm" 
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                toast({
                  title: "🚀 Upgrade para Intermediário!",
                  description: "Redirecionando para pagamento - 48h Premium grátis",
                  duration: 3000,
                });
                setTimeout(() => {
                  window.open('https://clarissavaz.academy.perfectpay.com.br', '_blank');
                }, 1000);
              }}
            >
              Upgrade → Intermediário (48h Premium)
            </Button>
            <Button 
              size="sm" 
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => {
                toast({
                  title: "👑 Upgrade para Premium!",
                  description: "Redirecionando para assinatura Premium",
                  duration: 3000,
                });
                setTimeout(() => {
                  window.open('https://clarissavaz.academy.perfectpay.com.br', '_blank');
                }, 1000);
              }}
            >
              Ir Direto ao Premium
            </Button>
          </div>
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
          <div className="text-right">
            <Badge variant="secondary" className="bg-gray-500 text-white">
              <Lock className="w-4 h-4 mr-1" />
              PLANO BÁSICO
            </Badge>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100">
          Você está no plano básico - faça upgrade para desbloquear mais recursos
        </p>
      </div>

      {/* Stats limitadas para plano básico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="opacity-60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Membros Ativos</p>
                <p className="text-2xl font-bold text-gray-400">🔒</p>
              </div>
              <Lock className="w-8 h-8 text-gray-400" />
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

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow opacity-60"
          onClick={() => showPremiumUpgrade("Eventos", 48)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximos Eventos</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-400">🔒</p>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow opacity-60"
          onClick={() => showPremiumUpgrade("Cursos", 24)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cursos Premium</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-400">🔒</p>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts Recentes - Limitado no Básico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Discussões Recentes
            </CardTitle>
            <CardDescription>
              Participe das conversas básicas da comunidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts?.slice(0, 2).map((post: any) => (
              <div key={post.id} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <button 
                    className="flex items-center gap-1 text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <Heart className="w-3 h-3" />
                    🔒 Premium
                  </button>
                  <button 
                    className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer"
                    onClick={() => setLocation('/spaces')}
                  >
                    <MessageSquare className="w-3 h-3" />
                    {post.commentsCount} comentários
                  </button>
                  <button 
                    className="flex items-center gap-1 text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <Lock className="w-3 h-3" />
                    🔒 Premium
                  </button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => setLocation('/spaces')}>
              💬 Entrar no Grupo Geral (Básico)
            </Button>
          </CardContent>
        </Card>

        {/* Eventos Bloqueados */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              Eventos Premium
              <Lock className="w-4 h-4 text-gray-400 ml-auto" />
            </CardTitle>
            <CardDescription>
              Upgrade para acessar eventos exclusivos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">Eventos disponíveis apenas no Premium</p>
              <Button 
                onClick={() => showPremiumUpgrade("Eventos", 48)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Desbloquear Eventos (48h grátis)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Limitado */}
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            Ranking Premium
            <Lock className="w-4 h-4 text-gray-400 ml-auto" />
          </CardTitle>
          <CardDescription>
            Ranking completo disponível apenas no Premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Crown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">Veja sua posição no ranking da comunidade</p>
            <Button 
              onClick={() => showPremiumUpgrade("Ranking", 48)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Desbloquear Ranking (48h Premium grátis)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}