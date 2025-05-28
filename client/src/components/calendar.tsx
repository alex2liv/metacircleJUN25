import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useMetaBridge } from "@/lib/metabridge-integration";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  isOnline: boolean;
  organizerId: number;
  attendeesCount: number;
  maxAttendees: number | null;
  notificationsSent?: boolean;
  participants?: string[]; // números de telefone dos participantes
}

export function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { sendNotification, scheduleNotifications } = useMetaBridge();
  const { toast } = useToast();

  const { data: eventsData = [], isLoading } = useQuery({
    queryKey: ['/api/communities/3/events'],
  });

  const events = eventsData as CalendarEvent[];

  const filteredEvents = events.filter((event: CalendarEvent) => {
    const eventDate = new Date(event.startDate);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  const upcomingEvents = events
    .filter((event: CalendarEvent) => new Date(event.startDate) > new Date())
    .sort((a: CalendarEvent, b: CalendarEvent) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .slice(0, 5);

  const handleSendNotification = async (event: CalendarEvent) => {
    if (!event.participants || event.participants.length === 0) {
      toast({
        title: "Sem participantes",
        description: "Este evento não possui participantes cadastrados.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await sendNotification({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: new Date(event.startDate),
        participants: event.participants,
        reminderType: 'immediate',
      });

      if (success) {
        toast({
          title: "Notificações enviadas",
          description: `Notificações WhatsApp enviadas para ${event.participants.length} participantes.`,
        });
      } else {
        toast({
          title: "Erro no envio",
          description: "Não foi possível enviar as notificações WhatsApp.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o MetaBridge.",
        variant: "destructive",
      });
    }
  };

  const getEventBadgeColor = (event: CalendarEvent) => {
    const eventDate = new Date(event.startDate);
    if (isToday(eventDate)) return "bg-red-100 text-red-800";
    if (isTomorrow(eventDate)) return "bg-orange-100 text-orange-800";
    if (isThisWeek(eventDate)) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const getEventBadgeText = (event: CalendarEvent) => {
    const eventDate = new Date(event.startDate);
    if (isToday(eventDate)) return "Hoje";
    if (isTomorrow(eventDate)) return "Amanhã";
    if (isThisWeek(eventDate)) return "Esta semana";
    return format(eventDate, "dd/MM", { locale: ptBR });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-8 h-8" />
          Calendário de Eventos
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie eventos e envie notificações WhatsApp automáticas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário Simples */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Selecionar Data</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Próximos Eventos</h4>
              <div className="space-y-2">
                {upcomingEvents.map((event: CalendarEvent) => (
                  <div key={event.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{event.title}</span>
                    <Badge variant="secondary" className={getEventBadgeColor(event)}>
                      {getEventBadgeText(event)}
                    </Badge>
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhum evento próximo</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eventos do Dia Selecionado */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Eventos - {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <CardDescription>
              {filteredEvents.length} evento(s) nesta data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum evento nesta data</p>
              </div>
            ) : (
              filteredEvents.map((event: CalendarEvent) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-gray-600 mt-1">{event.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(event.startDate), "HH:mm", { locale: ptBR })}
                          {event.endDate && (
                            <span> - {format(new Date(event.endDate), "HH:mm", { locale: ptBR })}</span>
                          )}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.attendeesCount}
                          {event.maxAttendees && ` / ${event.maxAttendees}`}
                        </div>
                        
                        {event.isOnline && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Online
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleSendNotification(event)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                      
                      {event.notificationsSent && (
                        <Badge variant="outline" className="text-xs">
                          Notificado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informações do MetaBridge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Integração MetaBridge - WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Notificações Automáticas</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Lembretes 1 semana antes do evento</li>
              <li>✓ Lembretes 1 dia antes do evento</li>
              <li>✓ Lembretes 1 hora antes do evento</li>
              <li>✓ Notificação imediata quando o evento começar</li>
              <li>✓ Mensagens personalizadas via Evolution API</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}