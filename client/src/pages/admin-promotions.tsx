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
import { Settings, Palette, Clock, Target, Eye, Save, Zap, Crown, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPromotions() {
  const { toast } = useToast();
  
  // Promotion Configuration State
  const [promotionConfig, setPromotionConfig] = useState({
    isActive: true,
    title: "Apenas 12 vagas Premium restantes este mês",
    subtitle: "Para manter a qualidade do atendimento, limitamos o acesso Premium.",
    discount: 50,
    timeLimit: 24,
    remainingSpots: 12,
    ctaText: "QUERO GARANTIR MINHA VAGA PREMIUM",
    urgencyBadge: "ÚLTIMAS 24 HORAS",
    colorScheme: "red-orange"
  });

  // Theme Configuration State
  const [themeConfig, setThemeConfig] = useState({
    primaryColor: "#f59e0b", // yellow-500
    secondaryColor: "#ea580c", // orange-600
    accentColor: "#dc2626", // red-600
    backgroundColor: "#fef3c7", // yellow-100
    textColor: "#1f2937" // gray-800
  });

  const handleSavePromotion = () => {
    toast({
      title: "Promoção Atualizada!",
      description: "As configurações foram salvas e estão ativas na comunidade.",
    });
  };

  const handleSaveTheme = () => {
    toast({
      title: "Tema Atualizado!",
      description: "As cores da comunidade foram atualizadas com sucesso.",
    });
  };

  const presetPromotions = [
    {
      name: "Black Friday",
      title: "BLACK FRIDAY: 70% OFF Premium",
      subtitle: "Apenas hoje! A maior promoção do ano.",
      discount: 70,
      timeLimit: 24,
      spots: 50,
      colorScheme: "black-gold"
    },
    {
      name: "Fim de Semana",
      title: "Oferta de Fim de Semana - 40% OFF",
      subtitle: "Upgrade premium com desconto especial até domingo.",
      discount: 40,
      timeLimit: 48,
      spots: 20,
      colorScheme: "blue-purple"
    },
    {
      name: "Última Chance",
      title: "ÚLTIMA CHANCE: 5 vagas restantes",
      subtitle: "As últimas vagas premium do mês acabando agora.",
      discount: 30,
      timeLimit: 6,
      spots: 5,
      colorScheme: "red-orange"
    }
  ];

  const colorSchemes = {
    "red-orange": { primary: "#dc2626", secondary: "#ea580c", bg: "#fef2f2" },
    "blue-purple": { primary: "#2563eb", secondary: "#7c3aed", bg: "#eff6ff" },
    "green-teal": { primary: "#059669", secondary: "#0d9488", bg: "#ecfdf5" },
    "black-gold": { primary: "#000000", secondary: "#f59e0b", bg: "#fffbeb" }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configurações de Promoções
          </h1>
          <p className="text-gray-600">
            Configure ofertas dinâmicas para manter a urgência e conversão sempre alta
          </p>
        </div>

        <Tabs defaultValue="promotions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Promoções
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Cores & Tema
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visualizar
            </TabsTrigger>
          </TabsList>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            
            {/* Current Promotion Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Status da Promoção Atual
                    </CardTitle>
                    <CardDescription>
                      Controle quando as ofertas ficam ativas na comunidade
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="promotion-active" className="text-sm">
                      {promotionConfig.isActive ? "Ativa" : "Inativa"}
                    </Label>
                    <Switch
                      id="promotion-active"
                      checked={promotionConfig.isActive}
                      onCheckedChange={(checked) => 
                        setPromotionConfig(prev => ({ ...prev, isActive: checked }))
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {promotionConfig.isActive && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold">Promoção ativa na comunidade</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Os membros estão vendo: "{promotionConfig.title}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Promotion Presets */}
            <Card>
              <CardHeader>
                <CardTitle>Modelos Prontos</CardTitle>
                <CardDescription>
                  Ative rapidamente promoções pré-configuradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {presetPromotions.map((preset, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <h4 className="font-semibold mb-2">{preset.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{preset.title}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{preset.discount}% OFF</Badge>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setPromotionConfig(prev => ({
                              ...prev,
                              title: preset.title,
                              subtitle: preset.subtitle,
                              discount: preset.discount,
                              timeLimit: preset.timeLimit,
                              remainingSpots: preset.spots,
                              colorScheme: preset.colorScheme
                            }));
                            toast({
                              title: "Modelo Aplicado",
                              description: `Promoção "${preset.name}" configurada.`,
                            });
                          }}
                        >
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Promotion Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuração Personalizada</CardTitle>
                <CardDescription>
                  Crie ofertas customizadas para maximizar conversões
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título Principal</Label>
                      <Input
                        id="title"
                        value={promotionConfig.title}
                        onChange={(e) => setPromotionConfig(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Apenas 12 vagas Premium restantes"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle">Subtítulo</Label>
                      <Textarea
                        id="subtitle"
                        value={promotionConfig.subtitle}
                        onChange={(e) => setPromotionConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="Descrição da oferta..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cta">Texto do Botão</Label>
                      <Input
                        id="cta"
                        value={promotionConfig.ctaText}
                        onChange={(e) => setPromotionConfig(prev => ({ ...prev, ctaText: e.target.value }))}
                        placeholder="Ex: QUERO GARANTIR MINHA VAGA"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="discount">Desconto (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={promotionConfig.discount}
                        onChange={(e) => setPromotionConfig(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeLimit">Tempo Limite (horas)</Label>
                      <Input
                        id="timeLimit"
                        type="number"
                        value={promotionConfig.timeLimit}
                        onChange={(e) => setPromotionConfig(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="168"
                      />
                    </div>

                    <div>
                      <Label htmlFor="spots">Vagas Restantes</Label>
                      <Input
                        id="spots"
                        type="number"
                        value={promotionConfig.remainingSpots}
                        onChange={(e) => setPromotionConfig(prev => ({ ...prev, remainingSpots: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="colorScheme">Esquema de Cores</Label>
                      <Select 
                        value={promotionConfig.colorScheme}
                        onValueChange={(value) => setPromotionConfig(prev => ({ ...prev, colorScheme: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="red-orange">Vermelho/Laranja (Urgência)</SelectItem>
                          <SelectItem value="blue-purple">Azul/Roxo (Confiança)</SelectItem>
                          <SelectItem value="green-teal">Verde/Teal (Sucesso)</SelectItem>
                          <SelectItem value="black-gold">Preto/Dourado (Premium)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button onClick={handleSavePromotion} className="w-full" size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar e Ativar Promoção
                  </Button>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="themes" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle>Personalização de Cores</CardTitle>
                <CardDescription>
                  Customize as cores da sua comunidade para refletir sua marca
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="primary">Cor Primária</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary"
                          type="color"
                          value={themeConfig.primaryColor}
                          onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={themeConfig.primaryColor}
                          onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondary">Cor Secundária</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary"
                          type="color"
                          value={themeConfig.secondaryColor}
                          onChange={(e) => setThemeConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={themeConfig.secondaryColor}
                          onChange={(e) => setThemeConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          placeholder="#ea580c"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accent">Cor de Destaque</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent"
                          type="color"
                          value={themeConfig.accentColor}
                          onChange={(e) => setThemeConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="w-16 h-10"
                        />
                        <Input
                          value={themeConfig.accentColor}
                          onChange={(e) => setThemeConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                          placeholder="#dc2626"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Color Preview */}
                    <div className="border rounded-lg p-4" style={{ backgroundColor: themeConfig.backgroundColor }}>
                      <h4 className="font-semibold mb-2" style={{ color: themeConfig.textColor }}>
                        Preview do Tema
                      </h4>
                      <div 
                        className="inline-block px-4 py-2 rounded-lg text-white font-semibold"
                        style={{ backgroundColor: themeConfig.primaryColor }}
                      >
                        Botão Primário
                      </div>
                      <div 
                        className="inline-block px-4 py-2 rounded-lg text-white font-semibold ml-2"
                        style={{ backgroundColor: themeConfig.secondaryColor }}
                      >
                        Botão Secundário
                      </div>
                      <div 
                        className="inline-block px-2 py-1 rounded text-white text-sm font-medium mt-2"
                        style={{ backgroundColor: themeConfig.accentColor }}
                      >
                        Badge
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button onClick={handleSaveTheme} className="w-full" size="lg">
                    <Palette className="w-4 h-4 mr-2" />
                    Aplicar Novo Tema
                  </Button>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle>Preview da Promoção</CardTitle>
                <CardDescription>
                  Veja como a promoção aparecerá para os membros da comunidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                
                {/* Live Preview */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                  <div 
                    className="p-8 rounded-2xl text-white shadow-2xl"
                    style={{ 
                      background: `linear-gradient(to right, ${colorSchemes[promotionConfig.colorScheme as keyof typeof colorSchemes]?.primary}, ${colorSchemes[promotionConfig.colorScheme as keyof typeof colorSchemes]?.secondary})`
                    }}
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                        <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                        <span className="font-semibold">{promotionConfig.urgencyBadge}</span>
                      </div>
                      
                      <h3 className="text-3xl font-bold mb-4">
                        {promotionConfig.title}
                      </h3>
                      <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                        {promotionConfig.subtitle}
                      </p>
                      
                      <div className="flex justify-center items-center gap-8 mb-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-yellow-300">{promotionConfig.remainingSpots}</div>
                          <div className="text-sm text-white/80">Vagas restantes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-yellow-300">{promotionConfig.timeLimit}h</div>
                          <div className="text-sm text-white/80">Para expirar</div>
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-yellow-300">{promotionConfig.discount}%</div>
                          <div className="text-sm text-white/80">De desconto</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Button 
                          size="lg"
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-12 py-6 text-xl rounded-xl shadow-lg"
                        >
                          {promotionConfig.ctaText}
                        </Button>
                        <p className="text-white/80 text-sm">
                          Teste 7 dias GRÁTIS • Cancele quando quiser • Sem cobrança inicial
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <Eye className="w-5 h-5" />
                    <span className="font-semibold">Dica de Conversão</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Esta promoção usa técnicas de urgência e escassez para maximizar conversões. 
                    Lembre-se de alternar entre diferentes ofertas para manter o senso de novidade.
                  </p>
                </div>

              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}