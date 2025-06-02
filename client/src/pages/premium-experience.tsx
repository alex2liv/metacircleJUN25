import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, Calendar, BookOpen, Heart, Eye, Play, Check, DollarSign, ExternalLink, Phone, MessageCircle, Crown, LogOut, Star, Zap, Trophy, Target, Sparkles, ChevronRight, Lock, Video, Award } from "lucide-react";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function PremiumExperience() {
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
    const message = encodeURIComponent("Olá! Sou membro Premium da Comunidade de Podólogos e gostaria de uma consultoria personalizada com a Dra. Clarissa Vaz.");
    window.open(`https://wa.me/5511910018833?text=${message}`, '_blank');
  };

  const handleVideoCall = () => {
    toast({
      title: "Videochamada Iniciada",
      description: "Conectando com a Dra. Clarissa Vaz em instantes...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Premium Header */}
      <header className="bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img src={metaSyncLogo} alt="MetaSync" className="h-10 w-10" />
                <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Comunidade Premium VIP
                </h1>
                <p className="text-yellow-100 text-sm">
                  Experiência exclusiva com Dra. Clarissa Vaz
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-white text-yellow-700 font-semibold px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Membro Premium
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Premium Welcome */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bem-vindo ao seu
              <span className="block bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Universo Premium
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Você agora tem acesso exclusivo aos recursos mais avançados, 
              suporte prioritário e contato direto com nossa especialista. 
              Esta é sua experiência VIP.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Acesso Ilimitado
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg">
                <Video className="w-5 h-5 mr-2" />
                Videochamadas VIP
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-lg">
                <Award className="w-5 h-5 mr-2" />
                Certificação Premium
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Premium Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Exclusive Premium Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Direct Specialist Access */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-green-800">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                Acesso Direto VIP
              </CardTitle>
              <CardDescription className="text-green-700 text-lg">
                Linha direta com a Dra. Clarissa Vaz - Somente para membros Premium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={handleWhatsAppContact}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp VIP
                </Button>
                <Button 
                  onClick={handleVideoCall}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg"
                  size="lg"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Videochamada
                </Button>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-800">Status: Disponível Agora</span>
                </div>
                <p className="text-sm text-green-700">
                  ✨ Resposta garantida em até 2 horas<br/>
                  ✨ Consultorias ilimitadas<br/>
                  ✨ Suporte prioritário 24/7
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exclusive Content Library */}
          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-2 border-purple-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-purple-800">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                Biblioteca Premium
              </CardTitle>
              <CardDescription className="text-purple-700 text-lg">
                Conteúdos exclusivos e masterclasses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Masterclass: Técnicas Avançadas</span>
                  </div>
                  <Badge className="bg-purple-600 text-white">NOVO</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Casos Clínicos Exclusivos</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Certificação Profissional</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VIP Stats Dashboard */}
        <Card className="mb-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-4">
              Seu Progresso VIP
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Acompanhe seu desenvolvimento profissional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">Elite</div>
                <div className="text-gray-300">Status Atual</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">24</div>
                <div className="text-gray-300">Consultorias Realizadas</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">4.9</div>
                <div className="text-gray-300">Avaliação Média</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
                <div className="text-gray-300">Certificados Obtidos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Community Network */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Rede Exclusiva de Networking Premium
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Conecte-se com outros profissionais de elite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <Avatar className="w-16 h-16 mx-auto mb-4 border-4 border-blue-300">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback className="bg-blue-600 text-white">DM</AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-blue-900">Dr. Maria Silva</h4>
                <p className="text-sm text-blue-700 mb-3">Especialista Sênior</p>
                <Badge className="bg-blue-600 text-white">Online</Badge>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <Avatar className="w-16 h-16 mx-auto mb-4 border-4 border-green-300">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback className="bg-green-600 text-white">RC</AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-green-900">Dr. Roberto Costa</h4>
                <p className="text-sm text-green-700 mb-3">Mentor Premium</p>
                <Badge className="bg-green-600 text-white">Online</Badge>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <Avatar className="w-16 h-16 mx-auto mb-4 border-4 border-purple-300">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback className="bg-purple-600 text-white">AS</AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-purple-900">Dra. Ana Santos</h4>
                <p className="text-sm text-purple-700 mb-3">Consultora VIP</p>
                <Badge className="bg-purple-600 text-white">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exclusive Benefits Reminder */}
        <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 mx-auto mb-6 text-white" />
              <h2 className="text-3xl font-bold mb-4">
                Você está vivenciando o Premium
              </h2>
              <p className="text-xl mb-6 text-white/90">
                Esta experiência exclusiva está disponível apenas para membros Premium. 
                Continue aproveitando todos os benefícios VIP!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Acesso Ilimitado</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Suporte VIP</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Conteúdo Exclusivo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Crown className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="font-semibold text-yellow-400">Experiência Premium Powered by</span>
              <span className="font-bold text-white ml-2">MetaSync</span>
            </div>
            <p className="text-gray-400">
              Sua plataforma de comunidades digitais de elite
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}