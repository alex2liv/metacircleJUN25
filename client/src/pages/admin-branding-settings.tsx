import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, Eye, Palette, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminBrandingSettings() {
  const { toast } = useToast();
  
  // Branding configuration
  const [brandingConfig, setBrandingConfig] = useState({
    // Specialist Information
    specialistName: "Dra. Clarissa Vaz",
    specialistTitle: "Especialista em Podologia",
    specialistArea: "Podologia",
    
    // Community Branding
    communityName: "Comunidade de Podologia",
    communityTagline: "com Dra. Clarissa Vaz",
    
    // Course Section
    courseCallToActionTitle: "Transforme sua Carreira em Podologia",
    courseCallToActionDescription: "Aprenda com a Dra. Clarissa Vaz e torne-se referência no mercado. Mais de 500 profissionais já transformaram suas práticas com nossos cursos.",
    courseSuccessCount: "500",
    
    // SOS Service
    sosServiceName: "SOS Clarissa",
    sosServiceDescription: "Suporte especializado de urgência",
    
    // General Messaging
    welcomeMessage: "Bem-vindo à nossa comunidade exclusiva!",
    upgradeMessage: "Faça upgrade e tenha acesso completo a todos os recursos",
    
    // Contact Info
    whatsappNumber: "+55 11 99999-9999",
    email: "contato@podologia.com.br",
    
    // Colors and Style
    primaryColor: "#3B82F6",
    secondaryColor: "#EF4444",
    accentColor: "#10B981"
  });

  const handleSave = () => {
    // In a real app, this would save to the database
    toast({
      title: "Configurações Salvas!",
      description: "Todas as alterações de marca foram aplicadas com sucesso.",
    });
  };

  const handlePreview = () => {
    // In a real app, this would open a preview of the community
    toast({
      title: "Visualização",
      description: "Abrindo visualização com as novas configurações...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configurações de Marca
          </h1>
          <p className="text-gray-600">
            Personalize a aparência e textos da sua comunidade white-label
          </p>
        </div>

        <Tabs defaultValue="specialist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specialist" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Especialista
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comunidade
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Visual
            </TabsTrigger>
          </TabsList>

          {/* Specialist Settings */}
          <TabsContent value="specialist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Especialista</CardTitle>
                <CardDescription>
                  Configure o nome e informações do especialista que aparecerão em toda a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specialistName">Nome do Especialista</Label>
                    <Input
                      id="specialistName"
                      value={brandingConfig.specialistName}
                      onChange={(e) => setBrandingConfig(prev => ({ 
                        ...prev, 
                        specialistName: e.target.value 
                      }))}
                      placeholder="Ex: Dra. Maria Silva"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialistTitle">Título/Especialização</Label>
                    <Input
                      id="specialistTitle"
                      value={brandingConfig.specialistTitle}
                      onChange={(e) => setBrandingConfig(prev => ({ 
                        ...prev, 
                        specialistTitle: e.target.value 
                      }))}
                      placeholder="Ex: Especialista em Podologia"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialistArea">Área de Atuação</Label>
                  <Input
                    id="specialistArea"
                    value={brandingConfig.specialistArea}
                    onChange={(e) => setBrandingConfig(prev => ({ 
                      ...prev, 
                      specialistArea: e.target.value 
                    }))}
                    placeholder="Ex: Podologia, Dermatologia, Nutrição"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp</Label>
                    <Input
                      id="whatsappNumber"
                      value={brandingConfig.whatsappNumber}
                      onChange={(e) => setBrandingConfig(prev => ({ 
                        ...prev, 
                        whatsappNumber: e.target.value 
                      }))}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      value={brandingConfig.email}
                      onChange={(e) => setBrandingConfig(prev => ({ 
                        ...prev, 
                        email: e.target.value 
                      }))}
                      placeholder="contato@especialista.com.br"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Settings */}
          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding da Comunidade</CardTitle>
                <CardDescription>
                  Configure os textos e mensagens que aparecerão na comunidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="communityName">Nome da Comunidade</Label>
                    <Input
                      id="communityName"
                      value={brandingConfig.communityName}
                      onChange={(e) => setBrandingConfig(prev => ({ 
                        ...prev, 
                        communityName: e.target.value 
                      }))}
                      placeholder="Ex: Comunidade de Podologia"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="communityTagline">Tagline da Comunidade</Label>
                    <Input
                      id="communityTagline"
                      value={brandingConfig.communityTagline}
                      onChange={(e) => setBrandingConfig(prev => ({ 
                        ...prev, 
                        communityTagline: e.target.value 
                      }))}
                      placeholder="Ex: com Dra. Maria Silva"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sosServiceName">Nome do Serviço de Urgência</Label>
                  <Input
                    id="sosServiceName"
                    value={brandingConfig.sosServiceName}
                    onChange={(e) => setBrandingConfig(prev => ({ 
                      ...prev, 
                      sosServiceName: e.target.value 
                    }))}
                    placeholder="Ex: SOS Clarissa, Urgência Médica"
                  />
                </div>

                <div>
                  <Label htmlFor="sosServiceDescription">Descrição do Serviço SOS</Label>
                  <Input
                    id="sosServiceDescription"
                    value={brandingConfig.sosServiceDescription}
                    onChange={(e) => setBrandingConfig(prev => ({ 
                      ...prev, 
                      sosServiceDescription: e.target.value 
                    }))}
                    placeholder="Ex: Suporte especializado de urgência"
                  />
                </div>

                <div>
                  <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={brandingConfig.welcomeMessage}
                    onChange={(e) => setBrandingConfig(prev => ({ 
                      ...prev, 
                      welcomeMessage: e.target.value 
                    }))}
                    placeholder="Mensagem que aparecerá para novos membros"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="upgradeMessage">Mensagem de Upgrade</Label>
                  <Textarea
                    id="upgradeMessage"
                    value={brandingConfig.upgradeMessage}
                    onChange={(e) => setBrandingConfig(prev => ({ 
                      ...prev, 
                      upgradeMessage: e.target.value 
                    }))}
                    placeholder="Mensagem para incentivar upgrades de plano"
                    rows={3}
                  />
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Settings */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seção de Cursos</CardTitle>
                <CardDescription>
                  Configure os textos que aparecem na área de cursos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div>
                  <Label htmlFor="courseCallToActionTitle">Título da Seção de Cursos</Label>
                  <Input
                    id="courseCallToActionTitle"
                    value={brandingConfig.courseCallToActionTitle}
                    onChange={(e) => setBrandingConfig(prev => ({ 
                      ...prev, 
                      courseCallToActionTitle: e.target.value 
                    }))}
                    placeholder="Ex: Transforme sua Carreira em Podologia"
                  />
                </div>

                <div>
                  <Label htmlFor="courseCallToActionDescription">Descrição da Seção de Cursos</Label>
                  <Textarea
                    id="courseCallToActionDescription"
                    value={brandingConfig.courseCallToActionDescription}
                    onChange={(e) => setBrandingConfig(prev => ({ 
                      ...prev, 
                      courseCallToActionDescription: e.target.value 
                    }))}
                    placeholder="Descrição que aparece na seção de cursos"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="courseSuccessCount">Número de Profissionais Capacitados</Label>
                  <Input
                    id="courseSuccessCount"
                    value={brandingConfig.courseSuccessCount}
                    onChange={(e) => setBrandingConfig(prev => ({ 
                      ...prev, 
                      courseSuccessCount: e.target.value 
                    }))}
                    placeholder="Ex: 500, 1000, 2500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Será exibido como: "Mais de {brandingConfig.courseSuccessCount} profissionais já transformaram..."
                  </p>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Settings */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cores e Estilo</CardTitle>
                <CardDescription>
                  Personalize as cores da sua comunidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={brandingConfig.primaryColor}
                        onChange={(e) => setBrandingConfig(prev => ({ 
                          ...prev, 
                          primaryColor: e.target.value 
                        }))}
                        className="w-16 h-10 rounded border"
                      />
                      <Input
                        value={brandingConfig.primaryColor}
                        onChange={(e) => setBrandingConfig(prev => ({ 
                          ...prev, 
                          primaryColor: e.target.value 
                        }))}
                        placeholder="#3B82F6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={brandingConfig.secondaryColor}
                        onChange={(e) => setBrandingConfig(prev => ({ 
                          ...prev, 
                          secondaryColor: e.target.value 
                        }))}
                        className="w-16 h-10 rounded border"
                      />
                      <Input
                        value={brandingConfig.secondaryColor}
                        onChange={(e) => setBrandingConfig(prev => ({ 
                          ...prev, 
                          secondaryColor: e.target.value 
                        }))}
                        placeholder="#EF4444"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accentColor">Cor de Destaque</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={brandingConfig.accentColor}
                        onChange={(e) => setBrandingConfig(prev => ({ 
                          ...prev, 
                          accentColor: e.target.value 
                        }))}
                        className="w-16 h-10 rounded border"
                      />
                      <Input
                        value={brandingConfig.accentColor}
                        onChange={(e) => setBrandingConfig(prev => ({ 
                          ...prev, 
                          accentColor: e.target.value 
                        }))}
                        placeholder="#10B981"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button onClick={handleSave} className="flex-1 max-w-xs">
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Visualizar Mudanças
          </Button>
        </div>

      </div>
    </div>
  );
}