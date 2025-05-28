import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageSquare, Share2, Plus, Send, Clock, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Spaces() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [replyContent, setReplyContent] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Buscar posts da comunidade
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/communities/3/posts'],
  });

  // Buscar espaços da comunidade
  const { data: spaces } = useQuery({
    queryKey: ['/api/communities/3/spaces'],
  });

  // Criar novo post
  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string }) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postData,
          authorId: user?.id || 1,
          spaceId: 4, // ID do espaço "Geral"
          communityId: 3
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communities/3/posts'] });
      setNewPost({ title: '', content: '' });
      toast({
        title: "Post publicado!",
        description: "Sua mensagem foi compartilhada com a comunidade.",
      });
    },
  });

  // Curtir post
  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communities/3/posts'] });
    },
  });

  const handleCreatePost = () => {
    if (newPost.content) {
      createPostMutation.mutate({
        title: newPost.title || "Conversa da comunidade",
        content: newPost.content
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">💬 Espaço Livre da Comunidade</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Compartilhar Algo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Conversa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Assunto (opcional)..."
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="O que você quer compartilhar hoje? Ideias, fotos, vídeos, perguntas... Este é nosso espaço livre de conversa! 💬✨"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="h-32"
              />
              <Button 
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending || !newPost.content}
                className="w-full"
              >
                {createPostMutation.isPending ? "Publicando..." : "Compartilhar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Espaços da Comunidade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {spaces?.map((space: any) => (
          <Card 
            key={space.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              // Aqui você pode navegar para a página específica do espaço
              console.log(`Abrindo espaço: ${space.name}`);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{space.name}</h3>
                  <p className="text-sm text-gray-600">{space.description || 'Espaço livre para discussões'}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <MessageSquare className="w-3 h-3" />
                <span>Clique para entrar</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feed de Posts */}
      <div className="space-y-4">
        {posts?.map((post: any) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Cabeçalho do Post */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {post.author?.firstName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{post.author?.firstName} {post.author?.lastName}</h4>
                    <Badge variant="outline" className="text-xs">
                      {post.author?.role === 'owner' ? 'Criador' : 'Membro'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    {format(new Date(post.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                  </div>
                </div>
              </div>

              {/* Conteúdo do Post */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Ações do Post */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likePostMutation.mutate(post.id)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  {post.likesCount || 0}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPost(post)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {post.commentsCount || 0} respostas
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-green-600"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {posts?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma conversa ainda
              </h3>
              <p className="text-gray-600 mb-4">
                Seja o primeiro a iniciar uma conversa na comunidade!
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Iniciar Primeira Conversa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Nova Conversa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Título da conversa..."
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Compartilhe algo interessante com a comunidade..."
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      className="h-32"
                    />
                    <Button 
                      onClick={handleCreatePost}
                      disabled={createPostMutation.isPending || !newPost.title || !newPost.content}
                      className="w-full"
                    >
                      {createPostMutation.isPending ? "Publicando..." : "Publicar Conversa"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Detalhes do Post */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {selectedPost.author?.firstName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedPost.author?.firstName} {selectedPost.author?.lastName}</h4>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedPost.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Comentários</h4>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Adicione um comentário..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="h-20"
                  />
                  <Button 
                    size="sm"
                    disabled={!replyContent.trim()}
                    onClick={() => {
                      // Implementar comentário
                      setReplyContent('');
                      toast({
                        title: "Comentário adicionado!",
                        description: "Sua resposta foi publicada.",
                      });
                    }}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Comentar
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
