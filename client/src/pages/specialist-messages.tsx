import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Users, User, MessageSquare, Mic, Video, FileText, Paperclip } from "lucide-react";
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
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    toast({
                      title: "Funcionalidade em desenvolvimento",
                      description: "Gravação de áudio será implementada em breve",
                    });
                  }}
                >
                  <Mic className="w-4 h-4" />
                  Áudio
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    toast({
                      title: "Funcionalidade em desenvolvimento", 
                      description: "Gravação de vídeo será implementada em breve",
                    });
                  }}
                >
                  <Video className="w-4 h-4" />
                  Vídeo
                </Button>
                
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
    </div>
  );
}