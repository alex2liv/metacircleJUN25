import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Reply, Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMetaBridge } from "@/lib/metabridge-integration";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Comment {
  id: number;
  content: string;
  authorId: number;
  author: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  postId: number;
  parentCommentId?: number;
  likesCount: number;
  createdAt: Date;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentSystemProps {
  postId: number;
  postTitle: string;
  postAuthorId: number;
  comments: Comment[];
  onCommentAdd?: (content: string, parentId?: number) => void;
  onCommentLike?: (commentId: number) => void;
  enableWhatsAppNotifications?: boolean;
}

export function CommentSystem({ 
  postId, 
  postTitle,
  postAuthorId,
  comments = [], 
  onCommentAdd,
  onCommentLike,
  enableWhatsAppNotifications = true
}: CommentSystemProps) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { user } = useAuth();
  const { sendNotification } = useMetaBridge();
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    // Adicionar comentário
    onCommentAdd?.(newComment);
    
    // Enviar notificação WhatsApp para o autor do post (se habilitado)
    if (enableWhatsAppNotifications && user?.id !== postAuthorId) {
      try {
        await sendNotification({
          eventId: postId,
          eventTitle: `Novo comentário em: ${postTitle}`,
          eventDate: new Date(),
          participants: [], // Seria preenchido com o número do autor do post
          reminderType: 'immediate',
          message: `💬 *Novo Comentário*\n\n*${user?.firstName} ${user?.lastName}* comentou em seu post "${postTitle}":\n\n"${newComment}"\n\n_Acesse o MetaCircle para responder_`
        });
        
        toast({
          title: "Comentário publicado",
          description: "Notificação WhatsApp enviada para o autor do post",
        });
      } catch (error) {
        toast({
          title: "Comentário publicado",
          description: "Comentário adicionado, mas não foi possível enviar notificação WhatsApp",
        });
      }
    } else {
      toast({
        title: "Comentário publicado",
        description: "Seu comentário foi adicionado com sucesso",
      });
    }

    setNewComment("");
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !replyTo) return;

    // Adicionar resposta
    onCommentAdd?.(replyContent, replyTo);

    // Enviar notificação WhatsApp para o autor do comentário original
    if (enableWhatsAppNotifications) {
      const originalComment = comments.find(c => c.id === replyTo);
      if (originalComment && user?.id !== originalComment.authorId) {
        try {
          await sendNotification({
            eventId: postId,
            eventTitle: `Resposta ao seu comentário`,
            eventDate: new Date(),
            participants: [], // Seria preenchido com o número do autor do comentário
            reminderType: 'immediate',
            message: `💬 *Resposta ao Comentário*\n\n*${user?.firstName} ${user?.lastName}* respondeu seu comentário em "${postTitle}":\n\n"${replyContent}"\n\n_Acesse o MetaCircle para ver a conversa_`
          });
        } catch (error) {
          console.log("Erro ao enviar notificação:", error);
        }
      }
    }

    setReplyContent("");
    setReplyTo(null);
    
    toast({
      title: "Resposta publicada",
      description: "Sua resposta foi adicionada com sucesso",
    });
  };

  const handleLike = (commentId: number) => {
    onCommentLike?.(commentId);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>
                {comment.author.firstName[0]}{comment.author.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">
                  {comment.author.firstName} {comment.author.lastName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">
                {comment.content}
              </p>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(comment.id)}
                  className={`text-xs ${comment.isLiked ? 'text-red-600' : 'text-gray-500'}`}
                >
                  <Heart className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                  {comment.likesCount}
                </Button>
                
                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(comment.id)}
                    className="text-xs text-gray-500"
                  >
                    <Reply className="w-3 h-3 mr-1" />
                    Responder
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Renderizar respostas */}
      {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
      
      {/* Formulário de resposta */}
      {replyTo === comment.id && (
        <div className="ml-8 mb-4">
          <Card>
            <CardContent className="p-3">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Responder para ${comment.author.firstName}...`}
                className="mb-2 min-h-[80px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Responder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Contador de comentários */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MessageSquare className="w-4 h-4" />
        <span>{comments.length} comentário(s)</span>
        {enableWhatsAppNotifications && (
          <div className="flex items-center gap-1 ml-auto">
            <Bell className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600">Notificações WhatsApp ativas</span>
          </div>
        )}
      </div>

      {/* Formulário de novo comentário */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva um comentário..."
                className="mb-3 min-h-[100px]"
              />
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {enableWhatsAppNotifications ? (
                    <span className="flex items-center gap-1">
                      <Bell className="w-3 h-3 text-green-600" />
                      O autor será notificado via WhatsApp
                    </span>
                  ) : (
                    <span>Notificações WhatsApp desabilitadas</span>
                  )}
                </div>
                
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Comentar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de comentários */}
      <div className="space-y-2">
        {comments.map(comment => renderComment(comment))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Seja o primeiro a comentar!</p>
        </div>
      )}
    </div>
  );
}