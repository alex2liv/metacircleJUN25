import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { GracePeriodBanner } from "@/components/grace-period-banner";
import StatsGrid from "@/components/dashboard/stats-grid";
import ActivityFeed from "@/components/dashboard/activity-feed";
import TopMembers from "@/components/dashboard/top-members";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import QuickActions from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { lastMessage } = useWebSocket();
  const [showGracePeriod, setShowGracePeriod] = useState(false);
  const [graceDaysLeft, setGraceDaysLeft] = useState(3);
  const { toast } = useToast();

  // Mock community ID - in real app would come from URL or context
  const communityId = 3;

  // Get current user data
  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  // Force admin access mutation
  const forceAdminMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/force-admin"),
    onSuccess: () => {
      refetchUser();
      toast({
        title: "Acesso Administrativo Ativado",
        description: "Agora você tem acesso completo ao painel administrativo.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível ativar o acesso administrativo.",
        variant: "destructive",
      });
    },
  });

  // Simular verificação do período de graça
  // Em produção, isso viria do backend verificando as configurações
  useEffect(() => {
    // Para demonstração: mostrar período de graça aleatoriamente
    const shouldShowGrace = Math.random() > 0.7; // 30% chance
    if (shouldShowGrace) {
      setShowGracePeriod(true);
      setGraceDaysLeft(Math.floor(Math.random() * 4)); // 0-3 dias
    }
  }, []);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/communities/${communityId}/stats`],
    queryFn: () => api.getCommunityStats(communityId),
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: [`/api/communities/${communityId}/posts`],
    queryFn: () => api.getRecentPosts(communityId, 10),
  });

  const { data: topMembers, isLoading: membersLoading } = useQuery({
    queryKey: [`/api/communities/${communityId}/members/top`],
    queryFn: () => api.getTopMembers(communityId, 3),
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: [`/api/communities/${communityId}/events`],
    queryFn: () => api.getUpcomingEvents(communityId, 3),
  });

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'new_post':
          queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/posts`] });
          queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/stats`] });
          break;
        case 'new_event':
          queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/events`] });
          queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/stats`] });
          break;
        case 'points_updated':
          queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/members/top`] });
          break;
      }
    }
  }, [lastMessage, communityId]);

  const handleUpgrade = () => {
    // Redirecionar para página de upgrade/pagamento
    window.open('/upgrade', '_blank');
  };

  const handleDismissGrace = () => {
    setShowGracePeriod(false);
  };

  return (
    <div className="space-y-8">
      {/* Admin Access Button */}
      {user && user.role !== "admin" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Acesso Administrativo</h3>
              <p className="text-sm text-blue-700">Ativar painel completo para gerenciar especialistas</p>
            </div>
            <Button 
              onClick={() => forceAdminMutation.mutate()}
              disabled={forceAdminMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              {forceAdminMutation.isPending ? "Ativando..." : "Ativar Admin"}
            </Button>
          </div>
        </div>
      )}

      {/* Banner de Período de Graça */}
      {showGracePeriod && (
        <GracePeriodBanner 
          daysLeft={graceDaysLeft}
          onUpgrade={handleUpgrade}
          onDismiss={handleDismissGrace}
        />
      )}

      {/* Dashboard Stats */}
      <StatsGrid stats={stats} isLoading={statsLoading} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed posts={posts} isLoading={postsLoading} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <TopMembers members={topMembers} isLoading={membersLoading} />
          <UpcomingEvents events={upcomingEvents} isLoading={eventsLoading} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
