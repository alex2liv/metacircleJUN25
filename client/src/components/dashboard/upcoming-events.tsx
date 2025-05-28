import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Video } from "lucide-react";

interface Event {
  id: number;
  title: string;
  startDate: string;
  attendeesCount: number;
  isOnline: boolean;
}

interface UpcomingEventsProps {
  events?: Event[];
  isLoading: boolean;
}

export default function UpcomingEvents({ events, isLoading }: UpcomingEventsProps) {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === now.toDateString()) {
      return `Hoje • ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã • ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gray-100 dark:border-gray-700">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
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
        <CardTitle className="text-lg font-semibold">Próximos Eventos</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {events?.map((event) => (
          <div 
            key={event.id} 
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary/30 dark:hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${event.isOnline ? 'bg-green-100 dark:bg-green-900' : 'bg-primary/10 dark:bg-primary/20'}`}>
                {event.isOnline ? (
                  <Video className={`w-4 h-4 ${event.isOnline ? 'text-green-600 dark:text-green-400' : 'text-primary'}`} />
                ) : (
                  <Calendar className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {event.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatEventDate(event.startDate)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {event.attendeesCount} {event.attendeesCount === 1 ? 'participante' : 'participantes'}
                </p>
              </div>
            </div>
          </div>
        )) || (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            Nenhum evento próximo encontrado.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
