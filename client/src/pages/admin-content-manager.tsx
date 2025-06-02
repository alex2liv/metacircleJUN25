import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, MessageSquare, Award, Eye, Save, Clock, Target, BookOpen, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminContentManager() {
  const { toast } = useToast();
  
  // Content Modules Configuration
  const [contentConfig, setContentConfig] = useState({
    // Guarantee Section
    guaranteeSection: {
      enabled: true,
      title: "Garantia Total de Satisfação",
      description: "Se nos primeiros 30 dias você não ver resultados concretos na sua prática profissional, devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.",
      guaranteeDays: 30,
      features: ["30 dias de garantia", "Reembolso total", "Sem burocracia"]
    },
    
    // Benefits Section
    benefitsSection: {
      enabled: true,
      title: "Veja o que acontece quando você vira Premium",
      benefits: [
        {
          icon: "MessageSquare",
          title: "Fala direto com a Dra. Clarissa",
          description: "WhatsApp direto para tirar suas dúvidas na hora",
          enabled: true
        },
        {
          icon: "Video",
          title: "Videochamadas quando quiser",
          description: "Consultas personalizadas para seus casos",
          enabled: true
        },
        {
          icon: "Award",
          title: "Certificados que valem",
          description: "Reconhecidos no mercado para valorizar seu currículo",
          enabled: true
        }
      ]
    },
    
    // CTA Section
    ctaSection: {
      enabled: true,
      title: "Que tal testar sem pagar nada?",
      subtitle: "7 dias completos no Premium. Se não gostar, é só cancelar.",
      buttonText: "SIM, QUERO TESTAR GRÁTIS!",
      disclaimer: "Sem cartão de crédito • Cancele quando quiser"
    },
    
    // Professional Area Settings
    professionalArea: {
      name: "Podologia",
      specialist: "Dra. Clarissa Vaz",
      focus: "pés",
      industry: "saúde"
    }
  });

  // Pricing Configuration
  const [pricingConfig, setPricingConfig] = useState({
    basicPlan: {
      enabled: true,
      name: "Básico",
      price: 29.90,
      features: ["Acesso à comunidade"]
    },
    premiumPlan: {
      enabled: true,
      name: "Premium VIP",
      originalPrice: 149.90,
      currentPrice: 99.90,
      features: [
        "Tudo do plano básico",
        "WhatsApp direto com especialista",
        "Videochamadas ilimitadas",
        "Conteúdos premium exclusivos",
        "Certificados reconhecidos",
        "Networking VIP"
      ]
    }
  });

  // Course Integration Settings
  const [courseConfig, setCourseConfig] = useState({
    enabled: true,
    platform: "PerfectPAY",
    courses: [
      {
        id: 1,
        title: "Curso Avançado de Podologia",
        price: 497.00,
        link: "https://perfectpay.com.br/curso-podologia-avancado",
        enabled: true
      },
      {
        id: 2,
        title: "Especialização em Pé Diabético",
        price: 697.00,
        link: "https://perfectpay.com.br/especializacao-pe-diabetico",
        enabled: true
      }
    ]
  });

  const handleSaveContent = () => {
    toast({
      title: "Conteúdo Atualizado!",
      description: "As configurações foram salvas e estão ativas na comunidade.",
    });
  };

  const handleSavePricing = () => {
    toast({
      title: "Preços Atualizados!",
      description: "Os planos foram atualizados com sucesso.",
    });
  };

  const areaPresets = {
    podologia: {
      name: "Podologia",
      specialist: "Dra. Clarissa Vaz",
      focus: "pés",
      industry: "saúde",
      guaranteeText: "Se nos primeiros 30 dias você não ver melhorias significativas na sua prática podológica, devolvemos 100% do seu investimento."
    },
    psicologia: {
      name: "Psicologia",
      specialist: "Dr. João Silva",
      focus: "mente",
      industry: "saúde mental",
      guaranteeText: "Se nos primeiros 30 dias você não desenvolver novas habilidades terapêuticas, devolvemos 100% do seu investimento."
    },
    odontologia: {
      name: "Odontologia",
      specialist: "Dra. Maria Santos",
      focus: "sorriso",
      industry: "odontológica",
      guaranteeText: "Se nos primeiros 30 dias você não aprimorar suas técnicas clínicas, devolvemos 100% do seu investimento."
    },
    fisioterapia: {
      name: "Fisioterapia",
      specialist: "Dr. Carlos Lima",
      focus: "movimento",
      industry: "reabilitação",
      guaranteeText: "Se nos primeiros 30 dias você não expandir seu conhecimento em reabilitação, devolvemos 100% do seu investimento."
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciador de Conteúdo
          </h1>
          <p className="text-gray-600">
            Configure todos os elementos da sua comunidade profissional
          </p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Preços
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="area" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Área Profissional
            </TabsTrigger>
          </TabsList>

          {/* Content Configuration Tab */}
          <TabsContent value="content" className="space-y-6">
            
            {/* Guarantee Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      Seção de Garantia
                    </CardTitle>
                    <CardDescription>
                      Configure se e como a garantia aparece na página
                    </CardDescription>
                  </div>
                  <Switch
                    checked={contentConfig.guaranteeSection.enabled}
                    onCheckedChange={(checked) => 
                      setContentConfig(prev => ({
                        ...prev,
                        guaranteeSection: { ...prev.guaranteeSection, enabled: checked }
                      }))
                    }
                  />
                </div>
              </CardHeader>
              {contentConfig.guaranteeSection.enabled && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="guarantee-title">Título da Garantia</Label>
                    <Input
                      id="guarantee-title"
                      value={contentConfig.guaranteeSection.title}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        guaranteeSection: { ...prev.guaranteeSection, title: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guarantee-description">Descrição</Label>
                    <Textarea
                      id="guarantee-description"
                      value={contentConfig.guaranteeSection.description}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        guaranteeSection: { ...prev.guaranteeSection, description: e.target.value }
                      }))}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guarantee-days">Dias de Garantia</Label>
                    <Input
                      id="guarantee-days"
                      type="number"
                      value={contentConfig.guaranteeSection.guaranteeDays}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        guaranteeSection: { ...prev.guaranteeSection, guaranteeDays: parseInt(e.target.value) || 30 }
                      }))}
                      min="1"
                      max="365"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Benefits Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-500" />
                      Seção de Benefícios Premium
                    </CardTitle>
                    <CardDescription>
                      Configure os benefícios mostrados na comparação
                    </CardDescription>
                  </div>
                  <Switch
                    checked={contentConfig.benefitsSection.enabled}
                    onCheckedChange={(checked) => 
                      setContentConfig(prev => ({
                        ...prev,
                        benefitsSection: { ...prev.benefitsSection, enabled: checked }
                      }))
                    }
                  />
                </div>
              </CardHeader>
              {contentConfig.benefitsSection.enabled && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="benefits-title">Título da Seção</Label>
                    <Input
                      id="benefits-title"
                      value={contentConfig.benefitsSection.title}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        benefitsSection: { ...prev.benefitsSection, title: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Benefícios (Ative/Desative conforme necessário)</Label>
                    {contentConfig.benefitsSection.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Switch
                              checked={benefit.enabled}
                              onCheckedChange={(checked) => {
                                const newBenefits = [...contentConfig.benefitsSection.benefits];
                                newBenefits[index].enabled = checked;
                                setContentConfig(prev => ({
                                  ...prev,
                                  benefitsSection: { ...prev.benefitsSection, benefits: newBenefits }
                                }));
                              }}
                            />
                            <Input
                              value={benefit.title}
                              onChange={(e) => {
                                const newBenefits = [...contentConfig.benefitsSection.benefits];
                                newBenefits[index].title = e.target.value;
                                setContentConfig(prev => ({
                                  ...prev,
                                  benefitsSection: { ...prev.benefitsSection, benefits: newBenefits }
                                }));
                              }}
                              className="font-medium"
                            />
                          </div>
                          <Input
                            value={benefit.description}
                            onChange={(e) => {
                              const newBenefits = [...contentConfig.benefitsSection.benefits];
                              newBenefits[index].description = e.target.value;
                              setContentConfig(prev => ({
                                ...prev,
                                benefitsSection: { ...prev.benefitsSection, benefits: newBenefits }
                              }));
                            }}
                            placeholder="Descrição do benefício..."
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* CTA Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      Chamada para Ação (CTA)
                    </CardTitle>
                    <CardDescription>
                      Configure o botão principal de conversão
                    </CardDescription>
                  </div>
                  <Switch
                    checked={contentConfig.ctaSection.enabled}
                    onCheckedChange={(checked) => 
                      setContentConfig(prev => ({
                        ...prev,
                        ctaSection: { ...prev.ctaSection, enabled: checked }
                      }))
                    }
                  />
                </div>
              </CardHeader>
              {contentConfig.ctaSection.enabled && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cta-title">Título Principal</Label>
                    <Input
                      id="cta-title"
                      value={contentConfig.ctaSection.title}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        ctaSection: { ...prev.ctaSection, title: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cta-subtitle">Subtítulo</Label>
                    <Input
                      id="cta-subtitle"
                      value={contentConfig.ctaSection.subtitle}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        ctaSection: { ...prev.ctaSection, subtitle: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cta-button">Texto do Botão</Label>
                    <Input
                      id="cta-button"
                      value={contentConfig.ctaSection.buttonText}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        ctaSection: { ...prev.ctaSection, buttonText: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cta-disclaimer">Texto Legal (pequeno)</Label>
                    <Input
                      id="cta-disclaimer"
                      value={contentConfig.ctaSection.disclaimer}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        ctaSection: { ...prev.ctaSection, disclaimer: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            <div className="pt-6">
              <Button onClick={handleSaveContent} className="w-full" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações de Conteúdo
              </Button>
            </div>

          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Basic Plan */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Plano Básico</CardTitle>
                    <Switch
                      checked={pricingConfig.basicPlan.enabled}
                      onCheckedChange={(checked) => 
                        setPricingConfig(prev => ({
                          ...prev,
                          basicPlan: { ...prev.basicPlan, enabled: checked }
                        }))
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nome do Plano</Label>
                    <Input
                      value={pricingConfig.basicPlan.name}
                      onChange={(e) => setPricingConfig(prev => ({
                        ...prev,
                        basicPlan: { ...prev.basicPlan, name: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pricingConfig.basicPlan.price}
                      onChange={(e) => setPricingConfig(prev => ({
                        ...prev,
                        basicPlan: { ...prev.basicPlan, price: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Plano Premium</CardTitle>
                    <Switch
                      checked={pricingConfig.premiumPlan.enabled}
                      onCheckedChange={(checked) => 
                        setPricingConfig(prev => ({
                          ...prev,
                          premiumPlan: { ...prev.premiumPlan, enabled: checked }
                        }))
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nome do Plano</Label>
                    <Input
                      value={pricingConfig.premiumPlan.name}
                      onChange={(e) => setPricingConfig(prev => ({
                        ...prev,
                        premiumPlan: { ...prev.premiumPlan, name: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Preço Original (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={pricingConfig.premiumPlan.originalPrice}
                        onChange={(e) => setPricingConfig(prev => ({
                          ...prev,
                          premiumPlan: { ...prev.premiumPlan, originalPrice: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Preço Atual (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={pricingConfig.premiumPlan.currentPrice}
                        onChange={(e) => setPricingConfig(prev => ({
                          ...prev,
                          premiumPlan: { ...prev.premiumPlan, currentPrice: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="pt-6">
              <Button onClick={handleSavePricing} className="w-full" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações de Preços
              </Button>
            </div>

          </TabsContent>

          {/* Professional Area Tab */}
          <TabsContent value="area" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle>Configuração da Área Profissional</CardTitle>
                <CardDescription>
                  Configure os detalhes específicos da sua área de atuação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Quick Presets */}
                <div>
                  <Label>Modelos Prontos por Área</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {Object.entries(areaPresets).map(([key, preset]) => (
                      <Button
                        key={key}
                        variant="outline"
                        onClick={() => {
                          setContentConfig(prev => ({
                            ...prev,
                            professionalArea: preset,
                            guaranteeSection: {
                              ...prev.guaranteeSection,
                              description: preset.guaranteeText
                            }
                          }));
                          toast({
                            title: "Área Configurada",
                            description: `Configurações para ${preset.name} aplicadas.`,
                          });
                        }}
                        className="h-auto p-4 text-left"
                      >
                        <div>
                          <div className="font-semibold">{preset.name}</div>
                          <div className="text-xs text-gray-500">{preset.specialist}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="area-name">Nome da Área</Label>
                    <Input
                      id="area-name"
                      value={contentConfig.professionalArea.name}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        professionalArea: { ...prev.professionalArea, name: e.target.value }
                      }))}
                      placeholder="Ex: Podologia, Psicologia, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialist-name">Nome do Especialista</Label>
                    <Input
                      id="specialist-name"
                      value={contentConfig.professionalArea.specialist}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        professionalArea: { ...prev.professionalArea, specialist: e.target.value }
                      }))}
                      placeholder="Ex: Dra. Clarissa Vaz"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="focus-area">Foco Principal</Label>
                    <Input
                      id="focus-area"
                      value={contentConfig.professionalArea.focus}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        professionalArea: { ...prev.professionalArea, focus: e.target.value }
                      }))}
                      placeholder="Ex: pés, mente, sorriso, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Setor/Indústria</Label>
                    <Input
                      id="industry"
                      value={contentConfig.professionalArea.industry}
                      onChange={(e) => setContentConfig(prev => ({
                        ...prev,
                        professionalArea: { ...prev.professionalArea, industry: e.target.value }
                      }))}
                      placeholder="Ex: saúde, educação, etc."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Integração com Cursos</CardTitle>
                    <CardDescription>
                      Configure os cursos vendidos via PerfectPAY
                    </CardDescription>
                  </div>
                  <Switch
                    checked={courseConfig.enabled}
                    onCheckedChange={(checked) => 
                      setCourseConfig(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>
              </CardHeader>
              {courseConfig.enabled && (
                <CardContent className="space-y-6">
                  
                  <div>
                    <Label htmlFor="platform">Plataforma de Vendas</Label>
                    <Select value={courseConfig.platform} onValueChange={(value) => 
                      setCourseConfig(prev => ({ ...prev, platform: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PerfectPAY">PerfectPAY</SelectItem>
                        <SelectItem value="Hotmart">Hotmart</SelectItem>
                        <SelectItem value="Eduzz">Eduzz</SelectItem>
                        <SelectItem value="Kiwify">Kiwify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Cursos Disponíveis</Label>
                    {courseConfig.courses.map((course, index) => (
                      <div key={course.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Curso #{course.id}</h4>
                          <Switch
                            checked={course.enabled}
                            onCheckedChange={(checked) => {
                              const newCourses = [...courseConfig.courses];
                              newCourses[index].enabled = checked;
                              setCourseConfig(prev => ({ ...prev, courses: newCourses }));
                            }}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Título do Curso</Label>
                            <Input
                              value={course.title}
                              onChange={(e) => {
                                const newCourses = [...courseConfig.courses];
                                newCourses[index].title = e.target.value;
                                setCourseConfig(prev => ({ ...prev, courses: newCourses }));
                              }}
                            />
                          </div>
                          
                          <div>
                            <Label>Preço (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={course.price}
                              onChange={(e) => {
                                const newCourses = [...courseConfig.courses];
                                newCourses[index].price = parseFloat(e.target.value) || 0;
                                setCourseConfig(prev => ({ ...prev, courses: newCourses }));
                              }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Link de Vendas</Label>
                          <Input
                            value={course.link}
                            onChange={(e) => {
                              const newCourses = [...courseConfig.courses];
                              newCourses[index].link = e.target.value;
                              setCourseConfig(prev => ({ ...prev, courses: newCourses }));
                            }}
                            placeholder="https://perfectpay.com.br/seu-curso"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      const newCourse = {
                        id: courseConfig.courses.length + 1,
                        title: "Novo Curso",
                        price: 497.00,
                        link: "",
                        enabled: true
                      };
                      setCourseConfig(prev => ({
                        ...prev,
                        courses: [...prev.courses, newCourse]
                      }));
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    + Adicionar Novo Curso
                  </Button>
                </CardContent>
              )}
            </Card>

          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}