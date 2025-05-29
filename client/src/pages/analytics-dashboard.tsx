import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Clock,
  Target
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  // Dados de exemplo - em produção viriam da API
  const analyticsData = {
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      newUsersToday: 23,
      totalMessages: 8456,
      messagesToday: 127,
      totalEvents: 45,
      upcomingEvents: 8,
      conversionRate: 12.5
    },
    userGrowth: [
      { month: "Jan", users: 450 },
      { month: "Fev", users: 623 },
      { month: "Mar", users: 789 },
      { month: "Abr", users: 945 },
      { month: "Mai", users: 1247 }
    ],
    engagement: [
      { day: "Seg", messages: 156, events: 3 },
      { day: "Ter", messages: 234, events: 5 },
      { day: "Qua", messages: 189, events: 2 },
      { day: "Qui", messages: 267, events: 4 },
      { day: "Sex", messages: 298, events: 6 },
      { day: "Sab", messages: 145, events: 2 },
      { day: "Dom", messages: 98, events: 1 }
    ],
    topPages: [
      { page: "/dashboard", views: 4521, time: "3m 24s" },
      { page: "/spaces", views: 3247, time: "5m 12s" },
      { page: "/events", views: 2156, time: "2m 45s" },
      { page: "/courses", views: 1876, time: "4m 33s" },
      { page: "/members", views: 1234, time: "1m 58s" }
    ]
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleExportReport = () => {
    // Simular export
    console.log("Exportando relatório...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Métricas e insights da sua comunidade</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefreshData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Atualizar
              </Button>
              
              <Button onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Cards de Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +{analyticsData.overview.newUsersToday} hoje
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.activeUsers.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {((analyticsData.overview.activeUsers / analyticsData.overview.totalUsers) * 100).toFixed(1)}% ativo
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mensagens</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalMessages.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  +{analyticsData.overview.messagesToday} hoje
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.conversionRate}%</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Meta: 15%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes seções */}
        <Tabs defaultValue="growth" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="growth">📈 Crescimento</TabsTrigger>
            <TabsTrigger value="engagement">💬 Engajamento</TabsTrigger>
            <TabsTrigger value="pages">👁️ Páginas</TabsTrigger>
            <TabsTrigger value="reports">📋 Relatórios</TabsTrigger>
          </TabsList>

          {/* Tab Crescimento */}
          <TabsContent value="growth">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📈 Crescimento de Usuários
                  <Badge variant="outline">Últimos 5 meses</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.userGrowth.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">{month.month}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{month.users} usuários</span>
                        {index > 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            +{((month.users - analyticsData.userGrowth[index-1].users) / analyticsData.userGrowth[index-1].users * 100).toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Engajamento */}
          <TabsContent value="engagement">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>💬 Mensagens por Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.engagement.map((day) => (
                      <div key={day.day} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{day.day}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(day.messages / 300) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{day.messages}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📅 Eventos por Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.engagement.map((day) => (
                      <div key={day.day} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{day.day}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(day.events / 6) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{day.events}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Páginas */}
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👁️ Páginas Mais Visitadas
                  <Badge variant="outline">Últimos 7 dias</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{page.page}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {page.views.toLocaleString()} visualizações
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {page.time}
                        </p>
                        <p className="text-xs text-gray-500">tempo médio</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Relatórios */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📋 Relatórios Automáticos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">📊 Relatório Semanal</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Resumo de atividades da semana
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar PDF
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">📈 Relatório Mensal</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Análise completa do mês
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>⚙️ Configurações de Relatório</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">📧 Envio Automático</h3>
                      <p className="text-sm text-blue-800 mb-3">
                        Receba relatórios por email automaticamente
                      </p>
                      <Button size="sm" className="w-full">
                        Configurar Envio
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2">🎯 Metas Personalizadas</h3>
                      <p className="text-sm text-green-800 mb-3">
                        Defina metas para acompanhar progresso
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Definir Metas
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}