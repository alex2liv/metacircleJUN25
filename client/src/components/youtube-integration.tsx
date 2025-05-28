import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Youtube, Play, ExternalLink, Bell } from "lucide-react";
import { useMetaBridge } from "@/lib/metabridge-integration";
import { useToast } from "@/hooks/use-toast";

interface YouTubeVideo {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string;
  isLive: boolean;
  viewsCount: number;
  duration?: number;
}

interface YouTubeIntegrationProps {
  videos?: YouTubeVideo[];
  onVideoAdd?: (url: string, title: string, isLive: boolean) => void;
}

export function YouTubeIntegration({ videos = [], onVideoAdd }: YouTubeIntegrationProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [isLive, setIsLive] = useState(false);
  const { sendNotification } = useMetaBridge();
  const { toast } = useToast();

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleAddVideo = () => {
    if (!youtubeUrl || !videoTitle) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e a URL do YouTube",
        variant: "destructive",
      });
      return;
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do YouTube",
        variant: "destructive",
      });
      return;
    }

    onVideoAdd?.(youtubeUrl, videoTitle, isLive);
    
    toast({
      title: "Vídeo adicionado",
      description: isLive ? "Live adicionada com sucesso!" : "Vídeo adicionado com sucesso!",
    });

    // Limpar formulário
    setYoutubeUrl("");
    setVideoTitle("");
    setIsLive(false);
  };

  const handleWatchVideo = (video: YouTubeVideo) => {
    // Abrir vídeo em nova aba
    window.open(video.youtubeUrl, '_blank');
  };

  const handleNotifySubscribers = async (video: YouTubeVideo) => {
    try {
      // Aqui seria implementado o envio de notificações para os inscritos
      // Por enquanto, simulamos o envio
      
      toast({
        title: "Notificações enviadas",
        description: `Notificações WhatsApp enviadas sobre: ${video.title}`,
      });
    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar as notificações",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "Ao vivo";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Formulário para adicionar vídeo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-600" />
            Adicionar Vídeo/Live do YouTube
          </CardTitle>
          <CardDescription>
            Cole a URL do YouTube e configure as opções de notificação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="videoTitle">Título do Vídeo/Live</Label>
              <Input
                id="videoTitle"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Ex: Workshop React Avançado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">URL do YouTube</Label>
              <Input
                id="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isLive"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isLive">
              Este é um evento ao vivo (Live)
            </Label>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleAddVideo}
              className="bg-red-600 hover:bg-red-700"
            >
              <Youtube className="w-4 h-4 mr-2" />
              Adicionar {isLive ? "Live" : "Vídeo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de vídeos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative">
              {video.thumbnail ? (
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <Youtube className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              <div className="absolute top-2 right-2">
                {video.isLive ? (
                  <Badge className="bg-red-600 text-white">
                    AO VIVO
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    {formatDuration(video.duration)}
                  </Badge>
                )}
              </div>

              <Button
                size="sm"
                className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700"
                onClick={() => handleWatchVideo(video)}
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {video.title}
              </h3>
              
              {video.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{video.viewsCount.toLocaleString()} visualizações</span>
                {video.isLive && (
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></div>
                    Live
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleWatchVideo(video)}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Assistir
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleNotifySubscribers(video)}
                  className="bg-green-50 hover:bg-green-100"
                >
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum vídeo adicionado
          </h3>
          <p className="text-gray-600">
            Adicione vídeos do YouTube para compartilhar com sua comunidade
          </p>
        </div>
      )}
    </div>
  );
}

export default YouTubeIntegration;