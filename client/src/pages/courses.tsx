import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Search, BookOpen, Users, Clock, Star } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/hooks/use-auth";
import { usePerfectPayIntegration } from "@/lib/perfectpay-integration";

// Mock de cursos - na implementação real viria da API PerfectPay
const mockCourses = [
  {
    id: 1,
    title: "Fundamentos do Marketing Digital",
    description: "Aprenda os conceitos essenciais do marketing digital e como aplicá-los no seu negócio.",
    instructor: "Clarissa Vaz",
    price: "R$ 297,00",
    originalPrice: "R$ 497,00",
    students: 1847,
    duration: "8 horas",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    perfectPayUrl: "https://clarissavaz.academy.perfectpay.com.br/curso/marketing-digital-fundamentos",
    tags: ["Marketing", "Digital", "Iniciante"],
    level: "Iniciante"
  },
  {
    id: 2,
    title: "Estratégias Avançadas de Vendas",
    description: "Técnicas comprovadas para aumentar suas vendas e construir relacionamentos duradouros.",
    instructor: "Clarissa Vaz",
    price: "R$ 497,00",
    originalPrice: "R$ 797,00",
    students: 923,
    duration: "12 horas",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    perfectPayUrl: "https://clarissavaz.academy.perfectpay.com.br/curso/vendas-avancadas",
    tags: ["Vendas", "Estratégia", "Avançado"],
    level: "Avançado"
  },
  {
    id: 3,
    title: "Criação de Conteúdo para Redes Sociais",
    description: "Como criar conteúdo envolvente que gera engajamento e converte seguidores em clientes.",
    instructor: "Clarissa Vaz",
    price: "R$ 197,00",
    originalPrice: "R$ 297,00",
    students: 2156,
    duration: "6 horas",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    perfectPayUrl: "https://clarissavaz.academy.perfectpay.com.br/curso/conteudo-redes-sociais",
    tags: ["Conteúdo", "Redes Sociais", "Criatividade"],
    level: "Intermediário"
  }
];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { hasPermission } = useUserRole();
  const { user } = useAuth();
  const { openPerfectPay } = usePerfectPayIntegration();

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleCourseAccess = (course: any) => {
    // Abrir em nova aba para manter o usuário na comunidade
    window.open(course.perfectPayUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-600 mt-2">
            Desenvolva suas habilidades com nossos cursos especializados
          </p>
        </div>
        
        {hasPermission("canCreateEvent") && (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <BookOpen className="w-4 h-4 mr-2" />
            Criar Curso
          </Button>
        )}
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os níveis</option>
          <option value="Iniciante">Iniciante</option>
          <option value="Intermediário">Intermediário</option>
          <option value="Avançado">Avançado</option>
        </select>
      </div>

      {/* Grid de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {course.level}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 bg-white/90 rounded px-2 py-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">{course.rating}</span>
                </div>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {course.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="font-medium">Instrutor: {course.instructor}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()} alunos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                  {course.originalPrice !== course.price && (
                    <span className="text-sm text-gray-500 line-through">{course.originalPrice}</span>
                  )}
                </div>
              </div>

              <Button
                onClick={() => handleCourseAccess(course)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Acessar Curso
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
        </div>
      )}

      {/* Integração com PerfectPay */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Plataforma Powered by PerfectPay
          </h3>
          <p className="text-gray-600 mb-4">
            Nossos cursos são hospedados na plataforma PerfectPay, garantindo a melhor experiência de aprendizado
            com pagamentos seguros e acesso vitalício ao conteúdo.
          </p>
          <Button 
            variant="outline"
            onClick={() => window.open("https://clarissavaz.academy.perfectpay.com.br/login/", '_blank')}
          >
            Acessar Plataforma Completa
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}