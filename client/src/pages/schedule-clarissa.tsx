import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  Phone,
  CheckCircle,
  AlertCircle,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, isSameDay, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimeSlot {
  time: string;
  available: boolean;
  type?: "regular" | "sos";
}

interface Appointment {
  id: number;
  date: Date;
  time: string;
  duration: number;
  type: "regular" | "sos";
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  userName: string;
  userPhone?: string;
  notes?: string;
}

export default function ScheduleClarissa() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<"regular" | "sos">("regular");
  const [notes, setNotes] = useState("");

  // Disponibilidades da Clarissa (simulado)
  const [availability] = useState([
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }, // Segunda
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" }, // Terça
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" }, // Quarta
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" }, // Quinta
    { dayOfWeek: 5, startTime: "09:00", endTime: "15:00" }, // Sexta
  ]);

  // Agendamentos existentes (simulado)
  const [existingAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: new Date(),
      time: "10:00",
      duration: 60,
      type: "regular",
      status: "confirmed",
      userName: "Maria Silva",
      userPhone: "11999999999",
      notes: "Dúvidas sobre funis de vendas"
    },
    {
      id: 2,
      date: addDays(new Date(), 1),
      time: "14:00",
      duration: 60,
      type: "sos",
      status: "scheduled",
      userName: "João Santos",
      userPhone: "11888888888",
      notes: "Emergência: problema com campanha"
    }
  ]);

  // Gerar horários disponíveis para o dia selecionado
  const getAvailableSlots = (date: Date): TimeSlot[] => {
    const dayOfWeek = date.getDay();
    const dayAvailability = availability.find(a => a.dayOfWeek === dayOfWeek);
    
    if (!dayAvailability) return [];

    const slots: TimeSlot[] = [];
    const startHour = parseInt(dayAvailability.startTime.split(':')[0]);
    const endHour = parseInt(dayAvailability.endTime.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      const isBooked = existingAppointments.some(apt => 
        isSameDay(apt.date, date) && apt.time === timeSlot
      );

      slots.push({
        time: timeSlot,
        available: !isBooked,
        type: "regular"
      });
    }

    return slots;
  };

  const handleScheduleAppointment = () => {
    if (!selectedTime) {
      toast({
        title: "Selecione um horário",
        description: "Escolha um horário disponível para o agendamento",
        variant: "destructive",
      });
      return;
    }

    // Aqui faria a chamada para API
    toast({
      title: "🗓️ Agendamento realizado!",
      description: `Consulta agendada para ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })} às ${selectedTime}`,
    });

    // Simular envio de WhatsApp
    setTimeout(() => {
      toast({
        title: "📱 WhatsApp enviado!",
        description: "Confirmação enviada para Clarissa (11910018833)",
      });
    }, 2000);
  };

  const isPremiumUser = user?.email === "alexandre.nunes@metasync.tech"; // Simular usuário premium
  const canUseSOS = isPremiumUser; // Apenas Premium pode usar SOS

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Agendar com Clarissa
              </h1>
              <p className="text-gray-600">
                Especialista em marketing digital e funis de vendas
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>17997337322</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Consultas de 60 minutos</span>
            </div>
            {canUseSOS && (
              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                SOS Disponível
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Selecione o dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setSelectedTime("");
                    }
                  }}
                  disabled={(date) => {
                    const dayOfWeek = date.getDay();
                    const hasAvailability = availability.some(a => a.dayOfWeek === dayOfWeek);
                    return !hasAvailability || date < new Date();
                  }}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Horários disponíveis */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horários para {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {getAvailableSlots(selectedDate).map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      className={`h-12 ${
                        !slot.available 
                          ? 'opacity-50 cursor-not-allowed' 
                          : selectedTime === slot.time
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                            : 'hover:bg-purple-50 hover:border-purple-300'
                      }`}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
                
                {getAvailableSlots(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum horário disponível neste dia</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Painel de agendamento */}
          <div className="space-y-6">
            {/* Tipo de consulta */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Consulta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant={appointmentType === "regular" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setAppointmentType("regular")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Consulta Regular
                </Button>
                
                {canUseSOS && (
                  <Button
                    variant={appointmentType === "sos" ? "default" : "outline"}
                    className={`w-full justify-start ${
                      appointmentType === "sos" 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                        : 'border-orange-300 text-orange-600 hover:bg-orange-50'
                    }`}
                    onClick={() => setAppointmentType("sos")}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    SOS Clarissa
                  </Button>
                )}
                
                {!canUseSOS && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Crown className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-orange-900">SOS Clarissa</div>
                        <div className="text-orange-700">
                          Disponível apenas para usuários Premium
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={4}
                  placeholder="Descreva brevemente o que gostaria de discutir na consulta..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Botão de agendamento */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleScheduleAppointment}
                  disabled={!selectedTime}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Agendamento
                </Button>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  📱 Você receberá uma confirmação via WhatsApp
                </div>
              </CardContent>
            </Card>

            {/* Próximos agendamentos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Seus Próximos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingAppointments
                    .filter(apt => apt.userName === `${user?.firstName} ${user?.lastName}`)
                    .slice(0, 3)
                    .map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">
                            {format(apt.date, 'dd/MM', { locale: ptBR })} às {apt.time}
                          </div>
                          <div className="text-xs text-gray-600">
                            {apt.type === "sos" ? "SOS Clarissa" : "Consulta Regular"}
                          </div>
                        </div>
                        <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>
                          {apt.status === "confirmed" ? "Confirmado" : "Agendado"}
                        </Badge>
                      </div>
                    ))}
                    
                  {existingAppointments.filter(apt => apt.userName === `${user?.firstName} ${user?.lastName}`).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum agendamento</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}