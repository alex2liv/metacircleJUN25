import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Plus, Edit, Trash2, Video, Phone, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  type: "video" | "phone" | "presencial";
  price: number;
  isActive: boolean;
  maxBookings: number;
}

interface BlockedDate {
  id: number;
  date: string;
  reason: string;
}

export default function SpecialistAgenda() {
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: 1,
      day: "Segunda-feira",
      startTime: "09:00",
      endTime: "12:00",
      type: "video",
      price: 150,
      isActive: true,
      maxBookings: 3
    },
    {
      id: 2,
      day: "Segunda-feira",
      startTime: "14:00",
      endTime: "17:00",
      type: "phone",
      price: 120,
      isActive: true,
      maxBookings: 4
    },
    {
      id: 3,
      day: "Terça-feira",
      startTime: "08:00",
      endTime: "11:00",
      type: "video",
      price: 150,
      isActive: true,
      maxBookings: 3
    }
  ]);

  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    {
      id: 1,
      date: "2025-06-15",
      reason: "Férias"
    },
    {
      id: 2,
      date: "2025-06-20",
      reason: "Compromisso pessoal"
    }
  ]);

  const [newTimeSlot, setNewTimeSlot] = useState({
    day: "",
    startTime: "",
    endTime: "",
    type: "video" as "video" | "phone" | "presencial",
    price: 150,
    maxBookings: 1
  });

  const [newBlockedDate, setNewBlockedDate] = useState({
    date: "",
    reason: ""
  });

  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

  const days = [
    "Segunda-feira",
    "Terça-feira", 
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo"
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "phone":
        return <Phone className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "video":
        return <Badge className="bg-green-100 text-green-800">Videochamada</Badge>;
      case "phone":
        return <Badge className="bg-blue-100 text-blue-800">Telefone</Badge>;
      case "presencial":
        return <Badge className="bg-purple-100 text-purple-800">Presencial</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  // Converter 24h para 12h com AM/PM
  const convert24to12 = (time24: string) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Converter 12h (AM/PM) para 24h
  const convert12to24 = (time12: string) => {
    if (!time12) return "";
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hours24 = hours;
    
    if (period === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0;
    }
    
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Formatar tempo de acordo com o formato selecionado
  const formatTime = (time: string) => {
    return timeFormat === "12h" ? convert24to12(time) : time;
  };

  const handleStartTimeChange = (startTime: string) => {
    setNewTimeSlot({...newTimeSlot, startTime});
    
    // Automaticamente adiciona +1 hora ao horário fim
    if (startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const endHour = hours + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setNewTimeSlot(prev => ({...prev, startTime, endTime}));
    }
  };

  const handleAddTimeSlot = () => {
    if (!newTimeSlot.day || !newTimeSlot.startTime || !newTimeSlot.endTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newSlot: TimeSlot = {
      id: timeSlots.length + 1,
      ...newTimeSlot,
      isActive: true
    };

    setTimeSlots([...timeSlots, newSlot]);
    setNewTimeSlot({
      day: "",
      startTime: "",
      endTime: "",
      type: "video",
      price: 150,
      maxBookings: 1
    });
    setIsAddingSlot(false);

    toast({
      title: "Horário adicionado",
      description: "Novo horário disponível criado com sucesso"
    });
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate.date || !newBlockedDate.reason) {
      toast({
        title: "Campos obrigatórios", 
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    const newBlock: BlockedDate = {
      id: blockedDates.length + 1,
      ...newBlockedDate
    };

    setBlockedDates([...blockedDates, newBlock]);
    setNewBlockedDate({ date: "", reason: "" });
    setIsAddingBlock(false);

    toast({
      title: "Data bloqueada",
      description: "Data indisponível adicionada com sucesso"
    });
  };

  const toggleSlotStatus = (id: number) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
    ));
  };

  const removeTimeSlot = (id: number) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    toast({
      title: "Horário removido",
      description: "Horário foi removido da sua agenda"
    });
  };

  const removeBlockedDate = (id: number) => {
    setBlockedDates(blockedDates.filter(date => date.id !== id));
    toast({
      title: "Bloqueio removido",
      description: "Data foi desbloqueada"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Agenda</h1>
          <p className="text-gray-600">Configure seus horários disponíveis e preços</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Horário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Horário Disponível</DialogTitle>
                <DialogDescription>
                  Configure um novo horário para atendimentos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Dia da Semana</Label>
                  <Select value={newTimeSlot.day} onValueChange={(value) => setNewTimeSlot({...newTimeSlot, day: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Formato de Horário</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={timeFormat === "24h" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeFormat("24h")}
                      >
                        24h
                      </Button>
                      <Button
                        type="button"
                        variant={timeFormat === "12h" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeFormat("12h")}
                      >
                        12h (AM/PM)
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Horário Início</Label>
                      {timeFormat === "24h" ? (
                        <Input
                          type="time"
                          value={newTimeSlot.startTime}
                          onChange={(e) => handleStartTimeChange(e.target.value)}
                        />
                      ) : (
                        <div className="space-y-1">
                          <Input
                            type="time"
                            value={newTimeSlot.startTime}
                            onChange={(e) => handleStartTimeChange(e.target.value)}
                          />
                          <p className="text-xs text-gray-500">
                            Visualização: {formatTime(newTimeSlot.startTime)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Horário Fim</Label>
                      {timeFormat === "24h" ? (
                        <Input
                          type="time"
                          value={newTimeSlot.endTime}
                          onChange={(e) => setNewTimeSlot({...newTimeSlot, endTime: e.target.value})}
                        />
                      ) : (
                        <div className="space-y-1">
                          <Input
                            type="time"
                            value={newTimeSlot.endTime}
                            onChange={(e) => setNewTimeSlot({...newTimeSlot, endTime: e.target.value})}
                          />
                          <p className="text-xs text-gray-500">
                            Visualização: {formatTime(newTimeSlot.endTime)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Tipo de Atendimento</Label>
                  <Select value={newTimeSlot.type} onValueChange={(value: "video" | "phone" | "presencial") => setNewTimeSlot({...newTimeSlot, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Videochamada</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      value={newTimeSlot.price}
                      onChange={(e) => setNewTimeSlot({...newTimeSlot, price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Máx. Agendamentos</Label>
                    <Input
                      type="number"
                      value={newTimeSlot.maxBookings}
                      onChange={(e) => setNewTimeSlot({...newTimeSlot, maxBookings: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingSlot(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddTimeSlot}>
                  Adicionar Horário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingBlock} onOpenChange={setIsAddingBlock}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Bloquear Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bloquear Data</DialogTitle>
                <DialogDescription>
                  Marque uma data como indisponível
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={newBlockedDate.date}
                    onChange={(e) => setNewBlockedDate({...newBlockedDate, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Motivo</Label>
                  <Input
                    placeholder="Ex: Férias, Compromisso pessoal..."
                    value={newBlockedDate.reason}
                    onChange={(e) => setNewBlockedDate({...newBlockedDate, reason: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingBlock(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddBlockedDate}>
                  Bloquear Data
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Horários Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horários Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(slot.type)}
                    <div>
                      <p className="font-medium">{slot.day}</p>
                      <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(slot.type)}
                    <Badge variant="outline">R$ {slot.price}</Badge>
                    <Badge variant="secondary">{slot.maxBookings} vagas</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slot.isActive}
                    onCheckedChange={() => toggleSlotStatus(slot.id)}
                  />
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => removeTimeSlot(slot.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {timeSlots.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nenhum horário configurado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Datas Bloqueadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Datas Bloqueadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blockedDates.map((blocked) => (
              <div key={blocked.id} className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">{new Date(blocked.date).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-gray-600">{blocked.reason}</p>
                </div>
                <Button size="sm" variant="destructive" onClick={() => removeBlockedDate(blocked.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {blockedDates.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nenhuma data bloqueada</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}