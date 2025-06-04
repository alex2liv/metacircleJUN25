import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Users, User, MessageSquare, Mic, Video, FileText, Paperclip, Square, Play, X } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: number;
  name: string;
  memberCount: number;
  type: "general" | "premium" | "specialist";
}

interface Client {
  id: number;
  name: string;
  email: string;
  status: "active" | "premium";
}

export default function SpecialistMessages() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [messageType, setMessageType] = useState<"room" | "user">("room");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isAllUsers, setIsAllUsers] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const rooms: Room[] = [
    { id: 1, name: "Sala Geral", memberCount: 234, type: "general" },
    { id: 2, name: "Sala Premium", memberCount: 45, type: "premium" },
    { id: 3, name: "Podologia Avançada", memberCount: 89, type: "specialist" }
  ];

  const clients: Client[] = [
    { id: 1, name: "Maria Silva", email: "maria.silva@email.com", status: "premium" },
    { id: 2, name: "João Santos", email: "joao.santos@email.com", status: "active" },
    { id: 3, name: "Ana Costa", email: "ana.costa@email.com", status: "premium" },
    { id: 4, name: "Carlos Oliveira", email: "carlos.oliveira@email.com", status: "active" }
  ];

  const handleAudioRecording = async () => {
    if (!isRecordingAudio) {
      try {
        // Verificar se getUserMedia está disponível
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia não suportado');
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        // Verificar tipos MIME suportados para Mac/Safari
        let mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
            mimeType = 'audio/ogg';
          }
        }
        
        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        
        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const audioUrl = URL.createObjectURL(blob);
          setRecordedAudio(audioUrl);
          toast({
            title: "Áudio gravado com sucesso",
            description: `Arquivo criado: ${(blob.size / 1024).toFixed(1)}KB - Clique em "Ouvir" para reproduzir`,
          });
          // Limpar stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        };
        
        mediaRecorder.start();
        setIsRecordingAudio(true);
        
        toast({
          title: "Gravação iniciada",
          description: "Microfone ativo - fale agora",
        });
      } catch (error) {
        console.error('Erro detalhado:', error);
        toast({
          title: "Erro de permissão",
          description: "Permita acesso ao microfone nas configurações do navegador",
          variant: "destructive"
        });
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecordingAudio(false);
      }
    }
  };

  const handleVideoRecording = async () => {
    if (!isRecordingVideo) {
      try {
        // Verificar se estamos em HTTPS ou localhost (requisito do Chrome)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
          throw new Error('Gravação de vídeo requer HTTPS');
        }

        // Verificar se getUserMedia está disponível
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia não suportado neste navegador');
        }

        console.log('Solicitando acesso à câmera...');
        
        // Solicitar permissões específicas do Chrome
        const constraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: true
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        console.log('Stream obtido:', stream);
        console.log('Tracks de vídeo:', stream.getVideoTracks());
        
        // Verificar se realmente temos vídeo
        if (stream.getVideoTracks().length === 0) {
          throw new Error('Não foi possível obter acesso à câmera');
        }

        // Mostrar preview da câmera
        setShowVideoPreview(true);
        setRecordingTime(0);

        // Aguardar um pouco para o DOM atualizar
        setTimeout(() => {
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
            videoPreviewRef.current.play();
          }
        }, 100);
        
        // Usar codec padrão do Chrome
        const mimeType = 'video/webm';
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (event) => {
          console.log('Dados recebidos:', event.data.size);
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          console.log('Gravação parada, chunks:', chunks.length);
          const blob = new Blob(chunks, { type: mimeType });
          const videoUrl = URL.createObjectURL(blob);
          setRecordedVideo(videoUrl);
          setShowVideoPreview(false);
          setRecordingTime(0);
          
          // Parar contador
          if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
          }
          
          toast({
            title: "Vídeo gravado com sucesso",
            description: `Arquivo criado: ${(blob.size / 1024 / 1024).toFixed(1)}MB`,
          });
          
          // Limpar stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
              console.log('Parando track:', track.kind);
              track.stop();
            });
            streamRef.current = null;
          }
        };
        
        mediaRecorder.start(1000);
        setIsRecordingVideo(true);
        
        // Iniciar contador de tempo
        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        
        toast({
          title: "Câmera ativada!",
          description: "Gravando vídeo - clique para parar (máx. 1min)",
        });
        
        // Parar automaticamente após 1 minuto
        const timeoutId = setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecordingVideo(false);
            toast({
              title: "Gravação finalizada",
              description: "Tempo limite de 1 minuto atingido",
            });
          }
        }, 60000);
        
        (mediaRecorder as any).timeoutId = timeoutId;
        
      } catch (error: any) {
        console.error('Erro detalhado ao acessar câmera:', error);
        let errorMessage = "Erro desconhecido";
        
        if (error.name === 'NotAllowedError') {
          errorMessage = "Permissão negada. Clique no ícone da câmera na barra de endereço para permitir.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "Câmera não encontrada. Verifique se está conectada.";
        } else if (error.name === 'NotReadableError') {
          errorMessage = "Câmera está sendo usada por outro aplicativo.";
        } else {
          errorMessage = error.message || "Não foi possível acessar a câmera";
        }
        
        toast({
          title: "Erro de câmera",
          description: errorMessage,
          variant: "destructive"
        });
        setShowVideoPreview(false);
      }
    } else {
      // Parar gravação
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        if ((mediaRecorderRef.current as any).timeoutId) {
          clearTimeout((mediaRecorderRef.current as any).timeoutId);
        }
        mediaRecorderRef.current.stop();
        setIsRecordingVideo(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma mensagem",
        variant: "destructive"
      });
      return;
    }

    if (messageType === "room" && !selectedRoom) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma sala",
        variant: "destructive"
      });
      return;
    }

    if (messageType === "user" && !selectedUser && !isAllUsers) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um usuário ou marque 'Todos os usuários'",
        variant: "destructive"
      });
      return;
    }

    // Simular envio da mensagem
    setTimeout(() => {
      toast({
        title: "Mensagem enviada",
        description: messageType === "room" 
          ? `Mensagem enviada para ${rooms.find(r => r.id.toString() === selectedRoom)?.name}`
          : isAllUsers 
            ? "Mensagem enviada para todos os usuários"
            : `Mensagem enviada para ${clients.find(c => c.id.toString() === selectedUser)?.name}`,
      });
      setMessage("");
      setSelectedRoom("");
      setSelectedUser("");
      setIsAllUsers(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/specialist-dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Enviar Mensagens</h1>
              <p className="text-sm text-gray-600">Comunique-se com salas e usuários</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Nova Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Message Type Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo de Destinatário
              </label>
              <div className="flex gap-4">
                <Button
                  variant={messageType === "room" ? "default" : "outline"}
                  onClick={() => setMessageType("room")}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Salas
                </Button>
                <Button
                  variant={messageType === "user" ? "default" : "outline"}
                  onClick={() => setMessageType("user")}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Usuários
                </Button>
              </div>
            </div>

            {/* Room Selection */}
            {messageType === "room" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Selecionar Sala
                </label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{room.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {room.memberCount} membros
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* User Selection */}
            {messageType === "user" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allUsers"
                    checked={isAllUsers}
                    onChange={(e) => {
                      setIsAllUsers(e.target.checked);
                      if (e.target.checked) {
                        setSelectedUser("");
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor="allUsers" className="text-sm font-medium text-gray-700">
                    Enviar para todos os usuários
                  </label>
                </div>

                {!isAllUsers && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Selecionar Usuário Específico
                    </label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{client.name}</span>
                              <Badge 
                                variant="secondary" 
                                className={client.status === "premium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}
                              >
                                {client.status === "premium" ? "Premium" : "Ativo"}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Message Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mensagem
              </label>
              <Textarea
                placeholder="Digite sua mensagem aqui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {message.length}/500 caracteres
              </div>
            </div>

            {/* Media and Send Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant={isRecordingAudio ? "destructive" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleAudioRecording}
                >
                  {isRecordingAudio ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecordingAudio ? "Parar" : "Áudio"}
                </Button>
                
                {recordedAudio && (
                  <>
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        const audio = new Audio(recordedAudio);
                        audio.play();
                        toast({
                          title: "Reproduzindo áudio",
                          description: "Áudio gravado está sendo reproduzido",
                        });
                      }}
                    >
                      <Play className="w-4 h-4" />
                      Ouvir
                    </Button>
                    
                    <Button 
                      variant="default"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Áudio enviado",
                          description: "Áudio anexado à mensagem",
                        });
                        setRecordedAudio(null);
                      }}
                    >
                      <Send className="w-4 h-4" />
                      Enviar
                    </Button>
                  </>
                )}
                
                <Button 
                  variant={isRecordingVideo ? "destructive" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleVideoRecording}
                >
                  {isRecordingVideo ? <Square className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  {isRecordingVideo ? "Parar" : "Vídeo"}
                </Button>
                
                {recordedVideo && (
                  <>
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        const video = document.createElement('video');
                        video.src = recordedVideo;
                        video.controls = true;
                        video.style.maxWidth = '100%';
                        video.style.maxHeight = '400px';
                        
                        const dialog = document.createElement('div');
                        dialog.style.position = 'fixed';
                        dialog.style.top = '0';
                        dialog.style.left = '0';
                        dialog.style.width = '100%';
                        dialog.style.height = '100%';
                        dialog.style.backgroundColor = 'rgba(0,0,0,0.8)';
                        dialog.style.display = 'flex';
                        dialog.style.alignItems = 'center';
                        dialog.style.justifyContent = 'center';
                        dialog.style.zIndex = '9999';
                        
                        const container = document.createElement('div');
                        container.style.position = 'relative';
                        container.style.backgroundColor = 'white';
                        container.style.padding = '20px';
                        container.style.borderRadius = '8px';
                        
                        const closeBtn = document.createElement('button');
                        closeBtn.innerHTML = '×';
                        closeBtn.style.position = 'absolute';
                        closeBtn.style.top = '10px';
                        closeBtn.style.right = '10px';
                        closeBtn.style.border = 'none';
                        closeBtn.style.background = 'none';
                        closeBtn.style.fontSize = '24px';
                        closeBtn.style.cursor = 'pointer';
                        closeBtn.onclick = () => {
                          document.body.removeChild(dialog);
                        };
                        
                        container.appendChild(closeBtn);
                        container.appendChild(video);
                        dialog.appendChild(container);
                        document.body.appendChild(dialog);
                        
                        dialog.onclick = (e) => {
                          if (e.target === dialog) {
                            document.body.removeChild(dialog);
                          }
                        };
                        
                        toast({
                          title: "Reproduzindo vídeo",
                          description: "Vídeo gravado está sendo exibido",
                        });
                      }}
                    >
                      <Play className="w-4 h-4" />
                      Assistir
                    </Button>
                    
                    <Button 
                      variant="default"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Vídeo enviado",
                          description: "Vídeo anexado à mensagem",
                        });
                        setRecordedVideo(null);
                      }}
                    >
                      <Send className="w-4 h-4" />
                      Enviar
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.onchange = (e) => {
                      const files = Array.from((e.target as HTMLInputElement).files || []);
                      if (files.length > 0) {
                        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
                        const fileNames = files.map(f => f.name).join(', ');
                        toast({
                          title: `${files.length} arquivo(s) selecionado(s)`,
                          description: `${fileNames.length > 50 ? fileNames.substring(0, 50) + '...' : fileNames} (${(totalSize / 1024 / 1024).toFixed(2)}MB)`,
                        });
                      }
                    };
                    input.click();
                  }}
                >
                  <Paperclip className="w-4 h-4" />
                  Arquivos
                </Button>
              </div>
              
              <Button 
                onClick={handleSendMessage}
                className="flex items-center gap-2"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
                Enviar Mensagem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Mensagens Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mensagem para Sala Geral</p>
                  <p className="text-xs text-gray-500">Enviada há 2 horas</p>
                </div>
                <Badge variant="secondary">234 visualizações</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mensagem para Maria Silva</p>
                  <p className="text-xs text-gray-500">Enviada ontem</p>
                </div>
                <Badge variant="secondary">Lida</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Preview da Câmera */}
      {showVideoPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Gravando Vídeo</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (isRecordingVideo) {
                    handleVideoRecording();
                  } else {
                    setShowVideoPreview(false);
                  }
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="relative">
              <video
                ref={videoPreviewRef}
                className="w-full h-80 bg-black rounded-lg object-cover"
                muted
                autoPlay
                playsInline
              />
              
              {/* Indicador de tempo */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-mono text-sm">
                  {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
                  {(recordingTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
              
              {/* Barra de progresso */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(recordingTime / 60) * 100}%` }}
                  ></div>
                </div>
                <div className="text-white text-xs mt-1 text-center">
                  {60 - recordingTime} segundos restantes
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-4">
              <Button
                variant={isRecordingVideo ? "destructive" : "default"}
                onClick={handleVideoRecording}
                className="flex items-center gap-2"
              >
                {isRecordingVideo ? (
                  <>
                    <Square className="w-4 h-4" />
                    Parar Gravação
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    Iniciar Gravação
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}