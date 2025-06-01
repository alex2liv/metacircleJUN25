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

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Nossa Comunidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Membros Ativos</span>
                <span className="font-semibold">150+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conteúdos</span>
                <span className="font-semibold">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Eventos Mensais</span>
                <span className="font-semibold">8</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
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