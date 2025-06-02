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
import { BookOpen, Plus, Edit, Trash2, Eye, Save, ExternalLink, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCourseManager() {
  const { toast } = useToast();
  
  // Course promotions management
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "🔥 LANÇAMENTO: Curso Completo de Podologia Clínica 2025",
      subtitle: "Seja um especialista reconhecido no mercado",
      description: "Aprenda as técnicas mais modernas e eficazes da podologia com a Dra. Clarissa Vaz. Mais de 100 horas de conteúdo prático, casos reais e certificação reconhecida pelo mercado.",
      price: "897.00",
      installments: "12x R$ 74,75",
      highlights: [
        "✅ 100+ horas de vídeo aulas",
        "✅ 50 casos clínicos reais", 
        "✅ Certificado reconhecido",
        "✅ Grupo VIP no WhatsApp",
        "✅ Acesso vitalício",
        "✅ Garantia de 30 dias"
      ],
      badge: "NOVO",
      badgeColor: "bg-red-500",
      link: "https://perfectpay.com.br/curso-podologia-clinica-2025",
      featured: true,
      active: true,
      image: null
    },
    {
      id: 2,
      title: "Especialização em Pé Diabético",
      subtitle: "Torne-se referência em cuidados com pacientes diabéticos",
      description: "Protocolo completo para avaliação, prevenção e tratamento de complicações em pés diabéticos.",
      price: "697.00",
      installments: "12x R$ 58,08",
      highlights: [
        "✅ 60 horas de conteúdo",
        "✅ Protocolos atualizados",
        "✅ Casos práticos",
        "✅ Mentoria inclusa"
      ],
      badge: "POPULAR",
      badgeColor: "bg-blue-500",
      link: "https://perfectpay.com.br/especializacao-pe-diabetico",
      featured: false,
      active: true,
      image: null
    }
  ]);

  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    subtitle: "",
    description: "",
    price: "",
    installments: "",
    highlights: ["", "", "", ""],
    badge: "NOVO",
    badgeColor: "bg-red-500",
    link: "",
    featured: false,
    active: true,
    image: null
  });

  const badgeOptions = [
    { label: "NOVO", value: "NOVO", color: "bg-red-500" },
    { label: "POPULAR", value: "POPULAR", color: "bg-blue-500" },
    { label: "LIMITADO", value: "LIMITADO", color: "bg-purple-500" },
    { label: "OFERTA", value: "OFERTA", color: "bg-green-500" },
    { label: "DESTAQUE", value: "DESTAQUE", color: "bg-yellow-500" }
  ];

  const handleSaveCourse = () => {
    if (editingCourse) {
      setCourses(prev => prev.map(course => 
        course.id === editingCourse.id ? { ...editingCourse } : course
      ));
      setEditingCourse(null);
      toast({
        title: "Curso Atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      const newId = Math.max(...courses.map(c => c.id), 0) + 1;
      setCourses(prev => [...prev, { ...newCourse, id: newId }]);
      setNewCourse({
        title: "",
        subtitle: "",
        description: "",
        price: "",
        installments: "",
        highlights: ["", "", "", ""],
        badge: "NOVO",
        badgeColor: "bg-red-500",
        link: "",
        featured: false,
        active: true,
        image: null
      });
      toast({
        title: "Curso Criado!",
        description: "Novo curso adicionado com sucesso.",
      });
    }
  };

  const handleDeleteCourse = (id) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    toast({
      title: "Curso Removido",
      description: "O curso foi removido da lista.",
    });
  };

  const toggleCourseActive = (id) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, active: !course.active } : course
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciamento de Cursos
          </h1>
          <p className="text-gray-600">
            Configure os cursos que aparecerão na comunidade dos seus membros
          </p>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Cursos Ativos
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Criar Novo
            </TabsTrigger>
          </TabsList>

          {/* Active Courses */}
          <TabsContent value="courses" className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6">
              {courses.map(course => (
                <Card key={course.id} className={`${!course.active ? 'opacity-50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${course.badgeColor} text-white`}>
                          {course.badge}
                        </Badge>
                        {course.featured && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                            Destaque
                          </Badge>
                        )}
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={course.active}
                          onCheckedChange={() => toggleCourseActive(course.id)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCourse({ ...course })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(course.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      {course.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <p className="text-gray-600 mb-4">{course.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {course.highlights.map((highlight, index) => (
                            <div key={index} className="text-gray-700">{highlight}</div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-2xl font-bold text-green-600">R$ {course.price}</div>
                          <div className="text-sm text-gray-600">ou {course.installments}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Link:</strong> {course.link}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </TabsContent>

          {/* Create/Edit Course */}
          <TabsContent value="create" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingCourse ? "Editar Curso" : "Criar Novo Curso"}
                </CardTitle>
                <CardDescription>
                  Configure todas as informações do curso que aparecerão para os membros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column */}
                  <div className="space-y-4">
                    
                    <div>
                      <Label htmlFor="title">Título do Curso</Label>
                      <Input
                        id="title"
                        value={editingCourse ? editingCourse.title : newCourse.title}
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({ ...prev, title: e.target.value }));
                          } else {
                            setNewCourse(prev => ({ ...prev, title: e.target.value }));
                          }
                        }}
                        placeholder="Ex: Curso Completo de Podologia Clínica"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle">Subtítulo</Label>
                      <Input
                        id="subtitle"
                        value={editingCourse ? editingCourse.subtitle : newCourse.subtitle}
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({ ...prev, subtitle: e.target.value }));
                          } else {
                            setNewCourse(prev => ({ ...prev, subtitle: e.target.value }));
                          }
                        }}
                        placeholder="Ex: Seja um especialista reconhecido no mercado"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={editingCourse ? editingCourse.description : newCourse.description}
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({ ...prev, description: e.target.value }));
                          } else {
                            setNewCourse(prev => ({ ...prev, description: e.target.value }));
                          }
                        }}
                        placeholder="Descrição detalhada do curso..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="link">Link de Compra (PerfectPAY)</Label>
                      <Input
                        id="link"
                        value={editingCourse ? editingCourse.link : newCourse.link}
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({ ...prev, link: e.target.value }));
                          } else {
                            setNewCourse(prev => ({ ...prev, link: e.target.value }));
                          }
                        }}
                        placeholder="https://perfectpay.com.br/seu-curso"
                      />
                    </div>

                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Preço (R$)</Label>
                        <Input
                          id="price"
                          value={editingCourse ? editingCourse.price : newCourse.price}
                          onChange={(e) => {
                            if (editingCourse) {
                              setEditingCourse(prev => ({ ...prev, price: e.target.value }));
                            } else {
                              setNewCourse(prev => ({ ...prev, price: e.target.value }));
                            }
                          }}
                          placeholder="897.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="installments">Parcelamento</Label>
                        <Input
                          id="installments"
                          value={editingCourse ? editingCourse.installments : newCourse.installments}
                          onChange={(e) => {
                            if (editingCourse) {
                              setEditingCourse(prev => ({ ...prev, installments: e.target.value }));
                            } else {
                              setNewCourse(prev => ({ ...prev, installments: e.target.value }));
                            }
                          }}
                          placeholder="12x R$ 74,75"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="badge">Badge</Label>
                      <Select 
                        value={editingCourse ? editingCourse.badge : newCourse.badge}
                        onValueChange={(value) => {
                          const selectedBadge = badgeOptions.find(b => b.value === value);
                          if (editingCourse) {
                            setEditingCourse(prev => ({ 
                              ...prev, 
                              badge: value, 
                              badgeColor: selectedBadge?.color || "bg-red-500" 
                            }));
                          } else {
                            setNewCourse(prev => ({ 
                              ...prev, 
                              badge: value, 
                              badgeColor: selectedBadge?.color || "bg-red-500" 
                            }));
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {badgeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded ${option.color}`}></div>
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={editingCourse ? editingCourse.featured : newCourse.featured}
                        onCheckedChange={(checked) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({ ...prev, featured: checked }));
                          } else {
                            setNewCourse(prev => ({ ...prev, featured: checked }));
                          }
                        }}
                      />
                      <Label htmlFor="featured">Curso em Destaque</Label>
                    </div>

                    <div>
                      <Label>Benefícios/Destaques</Label>
                      <div className="space-y-2">
                        {(editingCourse ? editingCourse.highlights : newCourse.highlights).map((highlight, index) => (
                          <Input
                            key={index}
                            value={highlight}
                            onChange={(e) => {
                              const newHighlights = [...(editingCourse ? editingCourse.highlights : newCourse.highlights)];
                              newHighlights[index] = e.target.value;
                              if (editingCourse) {
                                setEditingCourse(prev => ({ ...prev, highlights: newHighlights }));
                              } else {
                                setNewCourse(prev => ({ ...prev, highlights: newHighlights }));
                              }
                            }}
                            placeholder={`Benefício ${index + 1}`}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const currentHighlights = editingCourse ? editingCourse.highlights : newCourse.highlights;
                            const newHighlights = [...currentHighlights, ""];
                            if (editingCourse) {
                              setEditingCourse(prev => ({ ...prev, highlights: newHighlights }));
                            } else {
                              setNewCourse(prev => ({ ...prev, highlights: newHighlights }));
                            }
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Benefício
                        </Button>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button onClick={handleSaveCourse} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {editingCourse ? "Salvar Alterações" : "Criar Curso"}
                  </Button>
                  {editingCourse && (
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingCourse(null)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}