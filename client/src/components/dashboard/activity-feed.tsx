import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

interface ActivityFeedProps {
  posts?: Post[];
  isLoading: boolean;
}

export default function ActivityFeed({ posts, isLoading }: ActivityFeedProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "há poucos minutos";
    if (diffInHours === 1) return "há 1 hora";
    if (diffInHours < 24) return `há ${diffInHours} horas`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "há 1 dia";
    return `há ${diffInDays} dias`;
  };

  if (isLoading) {
    return (
      <Card className="border-gray-100 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100 dark:divide-gray-700">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-6 first:pt-0">
              <div className="flex space-x-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex space-x-4 pt-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100 dark:border-gray-700">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Ver tudo
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="divide-y divide-gray-100 dark:divide-gray-700 p-0">
        {posts?.map((post) => (
          <div key={post.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.avatar} alt={`${post.author.firstName} ${post.author.lastName}`} />
                <AvatarFallback>
                  {post.author.firstName[0]}{post.author.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.author.firstName} {post.author.lastName}
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">criou um novo post</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    {formatTimeAgo(post.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {post.title}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-500 hover:text-red-600">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.likesCount}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-500 hover:text-blue-600">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.commentsCount}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-500 hover:text-green-600">
                    <Share2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">Compartilhar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )) || (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Nenhuma atividade recente encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
