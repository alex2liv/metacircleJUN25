import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare,
  Send,
  ThumbsUp,
  Star,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Crown,
  Mic,
  ArrowLeft,
  Users,
  Clock,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LiveQuestion {
  id: number;
  content: string;
  author: {
    name: string;
    avatar?: string;
    isPremium: boolean;
  };
  timestamp: Date;
  likes: number;
  status: 'pending' | 'approved' | 'answered' | 'rejected';
  isHighlighted: boolean;
  moderatorNote?: string;
}

interface HandRaised {
  id: number;
  userId: number;
  userName: string;
  isPremium: boolean;
  timestamp: Date;
  reason?: string;
}

export default function LiveModeration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [newQuestion, setNewQuestion] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'answered'>('all');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [handRaiseReason, setHandRaiseReason] = useState("");

  // Mãos levantadas
  const [raisedHands, setRaisedHands] = useState<HandRaised[]>([
    {
      id: 1,
      userId: 2,
      userName: "Maria Silva",
      isPremium: true,
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      reason: "Quero compartilhar minha experiência com funis"
    },
    {
      id: 2,
      userId: 3,
      userName: "João Santos",
      isPremium: true,
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      reason: "Tenho uma dúvida sobre anúncios"
    },
    {
      id: 3,
      userId: 4,
      userName: "Ana Costa",
      isPremium: false,
      timestamp: new Date(Date.now() - 30 * 1000)
    }
  ]);

  // Perguntas da live
  const [questions, setQuestions] = useState<LiveQuestion[]>([
    {
      id: 1,
      content: "Clarissa, qual a melhor estratégia para captar leads qualificados no Instagram?",
      author: { name: "Maria Silva", isPremium: true },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      likes: 12,
      status: 'approved',
      isHighlighted: true
    },
    {
      id: 2,
      content: "Como fazer anúncios que realmente convertem? Tenho gastado muito e vendendo pouco.",
      author: { name: "João Santos", isPremium: true },
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      likes: 8,
      status: 'pending',
      isHighlighted: false
    },
    {
      id: 3,
      content: "Qual funil você recomenda para produtos digitais de alto ticket?",
      author: { name: "Ana Costa", isPremium: false },
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      likes: 15,
      status: 'pending',
      isHighlighted: false
    },
    {
      id: 4,
      content: "Clarissa, você pode falar sobre copy persuasiva para e-mail marketing?",
      author: { name: "Pedro Lima", isPremium: true },
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      likes: 6,
      status: 'answered',
      isHighlighted: false
    }
  ]);

  const [isLiveQA, setIsLiveQA] = useState(true);
  const [liveStats] = useState({
    viewers: 47,
    totalQuestions: 23,
    answeredQuestions: 8,
    duration: "32 min",
    raisedHands: 3
  });

  const handleRaiseHand = () => {
    if (isHandRaised) {
      // Baixar a mão
      setIsHandRaised(false);
      setHandRaiseReason("");
      setRaisedHands(raisedHands.filter(h => h.userId !== user?.id));
      
      toast({
        title: "🤚 Mão baixada",
        description: "Você saiu da fila para falar",
      });
    } else {
      // Levantar a mão
      const newHand: HandRaised = {
        id: Date.now(),
        userId: user?.id || 0,
        userName: `${user?.firstName} ${user?.lastName}`,
        isPremium: true,
        timestamp: new Date(),
        reason: handRaiseReason
      };

      setRaisedHands([...raisedHands, newHand]);
      setIsHandRaised(true);
      
      toast({
        title: "🙋‍♀️ Mão levantada!",
        description: "Você entrou na fila para falar com a Clarissa",
      });
    }
  };

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) {
      toast({
        title: "Pergunta vazia",
        description: "Digite sua pergunta antes de enviar",
        variant: "destructive",
      });
      return;
    }

    const question: LiveQuestion = {
      id: Date.now(),
      content: newQuestion,
      author: { 
        name: `${user?.firstName} ${user?.lastName}`, 
        isPremium: true 
      },
      timestamp: new Date(),
      likes: 0,
      status: 'pending',
      isHighlighted: false
    };

    setQuestions([question, ...questions]);
    setNewQuestion("");

    toast({
      title: "✅ Pergunta enviada!",
      description: "Sua pergunta foi enviada para moderação",
    });
  };

  const handleLikeQuestion = (questionId: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, likes: q.likes + 1 }
        : q
    ));

    toast({
      title: "👍 Pergunta curtida!",
      description: "Perguntas com mais curtidas têm prioridade",
    });
  };

  const handleModerateQuestion = (questionId: number, action: 'approve' | 'reject' | 'highlight' | 'answer') => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        switch (action) {
          case 'approve':
            return { ...q, status: 'approved' };
          case 'reject':
            return { ...q, status: 'rejected' };
          case 'highlight':
            return { ...q, isHighlighted: !q.isHighlighted };
          case 'answer':
            return { ...q, status: 'answered' };
          default:
            return q;
        }
      }
      return q;
    }));

    const actionMessages = {
      approve: "✅ Pergunta aprovada",
      reject: "❌ Pergunta rejeitada",
      highlight: "⭐ Pergunta destacada",
      answer: "💬 Marcada como respondida"
    };

    toast({
      title: actionMessages[action],
      description: "Ação de moderação aplicada",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      answered: 'bg-blue-100 text-blue-800 border-blue-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      answered: <MessageSquare className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />
    };
    return icons[status as keyof typeof icons];
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const isUserModerator = user?.role === 'admin' || user?.username === 'clarissa.vaz';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da Live */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setLocation('/live-rooms')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div>
              <h1 className="text-xl font-bold">Live: Marketing Digital com Clarissa</h1>
              <div className="flex items-center gap-4 text-sm text-pink-100">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  AO VIVO
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {liveStats.viewers} assistindo
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {liveStats.duration}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-white text-purple-600">
              <Crown className="w-3 h-3 mr-1" />
              PREMIUM LIVE
            </Badge>
            
            {isUserModerator && (
              <Button
                onClick={() => setIsLiveQA(!isLiveQA)}
                className={`${isLiveQA ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isLiveQA ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                Q&A {isLiveQA ? 'Ativo' : 'Pausado'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Estatísticas da Live */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">{liveStats.viewers}</div>
                <p className="text-sm text-gray-600">Assistindo agora</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{liveStats.totalQuestions}</div>
                <p className="text-sm text-gray-600">Perguntas enviadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{liveStats.answeredQuestions}</div>
                <p className="text-sm text-gray-600">Respondidas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {questions.filter(q => q.status === 'pending').length}
                </div>
                <p className="text-sm text-gray-600">Aguardando</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{raisedHands.length}</div>
                <p className="text-sm text-gray-600">🙋‍♀️ Mãos levantadas</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Painel de Perguntas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Perguntas da Live
                  </CardTitle>
                  <CardDescription>
                    {isLiveQA ? "Envie suas perguntas para a Clarissa" : "Q&A pausado temporariamente"}
                  </CardDescription>
                </div>
                
                {isUserModerator && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    MODERADOR
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Botão Levantar a Mão */}
              {isLiveQA && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🙋‍♀️</span>
                      <span className="font-medium text-orange-900">Quer falar com a Clarissa?</span>
                    </div>
                    {raisedHands.length > 0 && (
                      <Badge className="bg-orange-600 text-white">
                        {raisedHands.length} na fila
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      placeholder="Motivo (opcional): Ex: Quero compartilhar minha experiência..."
                      value={handRaiseReason}
                      onChange={(e) => setHandRaiseReason(e.target.value)}
                      disabled={isHandRaised}
                    />
                    
                    <Button 
                      onClick={handleRaiseHand}
                      className={`w-full ${
                        isHandRaised 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700'
                      }`}
                    >
                      {isHandRaised ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Baixar a Mão
                        </>
                      ) : (
                        <>
                          <span className="text-lg mr-2">🙋‍♀️</span>
                          Levantar a Mão
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Formulário para nova pergunta */}
              {isLiveQA && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Mic className="w-4 h-4 text-pink-600" />
                    <span className="font-medium text-pink-900">Faça sua pergunta por escrito</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Digite sua pergunta aqui..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <Button 
                      onClick={handleSubmitQuestion}
                      className="bg-gradient-to-r from-pink-600 to-purple-600"
                      disabled={!newQuestion.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Filtros */}
              <div className="flex gap-2">
                {(['all', 'pending', 'approved', 'answered'] as const).map((filterType) => (
                  <Button
                    key={filterType}
                    variant={filter === filterType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(filterType)}
                  >
                    {filterType === 'all' ? 'Todas' : 
                     filterType === 'pending' ? 'Pendentes' :
                     filterType === 'approved' ? 'Aprovadas' : 'Respondidas'}
                  </Button>
                ))}
              </div>

              {/* Lista de perguntas */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <div 
                    key={question.id} 
                    className={`border rounded-lg p-4 ${
                      question.isHighlighted ? 'bg-yellow-50 border-yellow-300' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                            {question.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{question.author.name}</span>
                            {question.author.isPremium && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                <Crown className="w-2 h-2 mr-1" />
                                PREMIUM
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(question.timestamp, 'HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(question.status)}`}>
                          {getStatusIcon(question.status)}
                          <span className="ml-1">
                            {question.status === 'pending' ? 'Pendente' :
                             question.status === 'approved' ? 'Aprovada' :
                             question.status === 'answered' ? 'Respondida' : 'Rejeitada'}
                          </span>
                        </Badge>
                        
                        {question.isHighlighted && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>

                    <p className="text-gray-900 mb-3">{question.content}</p>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeQuestion(question.id)}
                        className="text-gray-600 hover:text-pink-600"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {question.likes}
                      </Button>

                      {isUserModerator && (
                        <div className="flex gap-1">
                          {question.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleModerateQuestion(question.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700 text-xs"
                              >
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleModerateQuestion(question.id, 'reject')}
                                className="text-xs"
                              >
                                Rejeitar
                              </Button>
                            </>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleModerateQuestion(question.id, 'highlight')}
                            className="text-xs"
                          >
                            {question.isHighlighted ? 'Remover destaque' : 'Destacar'}
                          </Button>
                          
                          {question.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => handleModerateQuestion(question.id, 'answer')}
                              className="bg-blue-600 hover:bg-blue-700 text-xs"
                            >
                              Marcar respondida
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel de Controle do Moderador */}
        {isUserModerator && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Controle de Moderação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Próximas Perguntas</h4>
                  <div className="space-y-2">
                    {questions.filter(q => q.status === 'approved' && !q.isHighlighted).slice(0, 3).map(q => (
                      <div key={q.id} className="text-sm text-purple-800 bg-white p-2 rounded">
                        <strong>{q.author.name}:</strong> {q.content.substring(0, 60)}...
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Perguntas Destacadas</h4>
                  <div className="space-y-2">
                    {questions.filter(q => q.isHighlighted).map(q => (
                      <div key={q.id} className="text-sm text-yellow-800 bg-white p-2 rounded">
                        <strong>{q.author.name}:</strong> {q.content.substring(0, 60)}...
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">🙋‍♀️ Mãos Levantadas ({raisedHands.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {raisedHands.map((hand, index) => (
                      <div key={hand.id} className="bg-white p-3 rounded border border-orange-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-orange-600 text-white text-xs">
                              #{index + 1}
                            </Badge>
                            <span className="font-medium text-sm">{hand.userName}</span>
                            {hand.isPremium && (
                              <Crown className="w-3 h-3 text-purple-600" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(hand.timestamp, 'HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                        {hand.reason && (
                          <p className="text-xs text-gray-700 mt-1">
                            💬 {hand.reason}
                          </p>
                        )}
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                            Chamar para falar
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Pular
                          </Button>
                        </div>
                      </div>
                    ))}
                    {raisedHands.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        Nenhuma mão levantada
                      </p>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600"
                  onClick={() => setLocation('/video-call')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Voltar para Live
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}