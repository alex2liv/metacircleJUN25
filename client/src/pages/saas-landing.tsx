import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Star, Users, Zap, Shield, MessageCircle, Calendar, BookOpen, BarChart, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function SaasLanding() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    communityName: '',
    niche: '',
    message: ''
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Enviar para WhatsApp ou email
      const message = `Nova solicitação MetaCircle SaaS:
      
Nome: ${data.name}
Email: ${data.email}
Nome da Comunidade: ${data.communityName}
Nicho: ${data.niche}
Mensagem: ${data.message}`;

      window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Solicitação enviada!",
        description: "Entraremos em contato em até 24 horas para configurar sua comunidade.",
      });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', communityName: '', niche: '', message: '' });
    }
  });

  const plans = [
    {
      name: "Starter",
      price: "R$ 297",
      period: "/mês",
      description: "Para comunidades iniciantes",
      features: [
        "Até 100 membros",
        "Posts e discussões ilimitadas",
        "1 espaço de comunidade",
        "Calendário de eventos",
        "Notificações WhatsApp básicas",
        "Suporte por email"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "R$ 497",
      period: "/mês", 
      description: "Para comunidades em crescimento",
      features: [
        "Até 500 membros",
        "Posts e discussões ilimitadas",
        "5 espaços de comunidade",
        "Calendário de eventos avançado",
        "Integração PerfectPAY completa",
        "Notificações WhatsApp avançadas",
        "Analytics detalhados",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "R$ 997",
      period: "/mês",
      description: "Para comunidades de alto volume",
      features: [
        "Membros ilimitados",
        "Posts e discussões ilimitadas",
        "Espaços ilimitados",
        "Todos os recursos avançados",
        "Integração completa MetaBridge",
        "White-label completo",
        "API personalizada",
        "Gerente de conta dedicado"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MetaCircle</h1>
                <p className="text-sm text-gray-600">Plataforma de Comunidades</p>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => setIsModalOpen(true)}
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800">
            Revolucione sua Comunidade Online
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Crie, Monetize e Escale<br />Sua Comunidade Digital
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma mais completa do Brasil para criar comunidades engajadas, 
            com integração WhatsApp, sistema de cursos e pagamentos automatizados.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8"
              onClick={() => setIsModalOpen(true)}
            >
              Criar Minha Comunidade
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tudo que você precisa para uma comunidade de sucesso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "Integração WhatsApp",
                description: "Notificações automáticas e engajamento direto via WhatsApp"
              },
              {
                icon: BookOpen,
                title: "Sistema de Cursos",
                description: "Venda cursos integrado com PerfectPAY e acesso automatizado"
              },
              {
                icon: Calendar,
                title: "Eventos Inteligentes",
                description: "Calendário avançado com lembretes e confirmações automáticas"
              },
              {
                icon: BarChart,
                title: "Analytics Poderosos",
                description: "Dados em tempo real sobre engajamento e crescimento"
              },
              {
                icon: Shield,
                title: "Segurança Máxima",
                description: "Proteção avançada de dados e sistema antispam integrado"
              },
              {
                icon: Smartphone,
                title: "100% Responsivo",
                description: "Experiência perfeita em qualquer dispositivo"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Planos que crescem com sua comunidade
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Sem taxa de setup. Cancele quando quiser. Suporte em português.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}<span className="text-lg text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Começar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para revolucionar sua comunidade?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se a centenas de criadores que já estão monetizando suas comunidades com o MetaCircle
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8"
            onClick={() => setIsModalOpen(true)}
          >
            Criar Minha Comunidade Agora
          </Button>
        </div>
      </section>

      {/* Contact Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vamos criar sua comunidade!</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo e nossa equipe entrará em contato para configurar tudo para você.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Como podemos te chamar?"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label htmlFor="communityName">Nome da comunidade</Label>
              <Input
                id="communityName"
                value={formData.communityName}
                onChange={(e) => setFormData(prev => ({ ...prev, communityName: e.target.value }))}
                placeholder="Qual será o nome da sua comunidade?"
              />
            </div>
            <div>
              <Label htmlFor="niche">Nicho/Área</Label>
              <Input
                id="niche"
                value={formData.niche}
                onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                placeholder="Ex: Marketing Digital, Fitness, Programação"
              />
            </div>
            <div>
              <Label htmlFor="message">Conte mais sobre seu projeto</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Quantos membros espera ter? Que tipo de conteúdo vai oferecer?"
                className="h-20"
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => contactMutation.mutate(formData)}
              disabled={contactMutation.isPending || !formData.name || !formData.email}
            >
              {contactMutation.isPending ? "Enviando..." : "Solicitar Demonstração"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}