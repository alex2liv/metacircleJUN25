import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, CalendarPlus, UserPlus, Mail, MessageCircle, Plus, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function QuickActions() {
  const [inviteMethod, setInviteMethod] = useState<string>("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [showEndTime, setShowEndTime] = useState(false);

  const calculateEndTime = (startTime: string) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(':');
    const startHour = parseInt(hours);
    const endHour = (startHour + 1) % 24;
    return `${endHour.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleStartTimeChange = (value: string) => {
    setEventStartTime(value);
    setEventEndTime(calculateEndTime(value));
  };

  return (
    <Card className="border-gray-100 dark:border-gray-700">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        
        {/* Criar Post */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Criar Post
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Post</DialogTitle>
              <DialogDescription>Compartilhe algo interessante com a comunidade</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="post-community">Selecionar Comunidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma comunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌐 Todas as Comunidades</SelectItem>
                    <SelectItem value="community-1">📚 Discussões Gerais</SelectItem>
                    <SelectItem value="community-2">💡 Ideias e Sugestões</SelectItem>
                    <SelectItem value="community-3">🎯 Metas e Objetivos</SelectItem>
                    <SelectItem value="community-4">🤝 Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="post-title">Título do Post</Label>
                <Input id="post-title" placeholder="Digite o título..." />
              </div>
              <div>
                <Label htmlFor="post-content">Conteúdo</Label>
                <Textarea id="post-content" placeholder="Escreva seu post..." className="h-32" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Publicar Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Agendar Evento */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-3">
                <CalendarPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Agendar Evento
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Novo Evento</DialogTitle>
              <DialogDescription>Configure um evento para sua comunidade</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-community">Selecionar Comunidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma comunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌐 Todas as Comunidades</SelectItem>
                    <SelectItem value="community-1">📚 Discussões Gerais</SelectItem>
                    <SelectItem value="community-2">💡 Ideias e Sugestões</SelectItem>
                    <SelectItem value="community-3">🎯 Metas e Objetivos</SelectItem>
                    <SelectItem value="community-4">🤝 Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event-title">Título do Evento</Label>
                <Input id="event-title" placeholder="Digite o título..." />
              </div>
              <div>
                <Label htmlFor="event-description">Descrição</Label>
                <Textarea id="event-description" placeholder="Descreva o evento..." className="h-20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="event-date">Data</Label>
                  <Input id="event-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="event-start-time">Horário de Início</Label>
                  <Input 
                    id="event-start-time" 
                    type="time" 
                    value={eventStartTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="event-location">Local/Link</Label>
                <Input id="event-location" placeholder="Presencial ou link online..." />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Criar Evento
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Convidar Membros */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Convidar Membros
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novos Membros</DialogTitle>
              <DialogDescription>Envie convites por email ou WhatsApp</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invite-method">Método de Convite</Label>
                <Select value={inviteMethod} onValueChange={setInviteMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como deseja enviar o convite?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">📧 Por Email</SelectItem>
                    <SelectItem value="whatsapp">📱 Por WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {inviteMethod === "email" && (
                <div>
                  <Label htmlFor="email-addresses">Endereços de Email</Label>
                  <Textarea 
                    id="email-addresses" 
                    placeholder="Digite os emails separados por vírgula&#10;exemplo: joao@email.com, maria@email.com" 
                    className="h-20"
                  />
                </div>
              )}
              
              {inviteMethod === "whatsapp" && (
                <div>
                  <Label htmlFor="phone-numbers">Números de WhatsApp</Label>
                  <Textarea 
                    id="phone-numbers" 
                    placeholder="Digite os números separados por vírgula&#10;exemplo: 11999999999, 11888888888" 
                    className="h-20"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="invite-message">Mensagem Personalizada</Label>
                <Textarea 
                  id="invite-message" 
                  placeholder="Olá! Você foi convidado(a) para participar da nossa comunidade..." 
                  className="h-24"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  {inviteMethod === "email" ? (
                    <Mail className="w-4 h-4 mr-2" />
                  ) : (
                    <MessageCircle className="w-4 h-4 mr-2" />
                  )}
                  Enviar Convites
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
      </CardContent>
    </Card>
  );
}
