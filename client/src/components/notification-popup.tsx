import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Video, Calendar, MessageSquare, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "live" | "schedule" | "message" | "announcement";
  title: string;
  message: string;
  timestamp: Date;
  action?: {
    text: string;
    url?: string;
    onClick?: () => void;
  };
}

interface NotificationPopupProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function NotificationPopup({ notifications, onDismiss }: NotificationPopupProps) {
  const { toast } = useToast();
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, 3)); // Show max 3 at once
  }, [notifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "live":
        return <Video className="w-5 h-5 text-red-500" />;
      case "schedule":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "live":
        return "bg-red-500 text-white";
      case "schedule":
        return "bg-blue-500 text-white";
      case "message":
        return "bg-green-500 text-white";
      default:
        return "bg-yellow-500 text-white";
    }
  };

  const handleAction = (notification: Notification) => {
    if (notification.action?.onClick) {
      notification.action.onClick();
    } else if (notification.action?.url) {
      window.open(notification.action.url, '_blank');
    }
    onDismiss(notification.id);
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {visibleNotifications.map((notification, index) => (
        <Card 
          key={notification.id}
          className="w-80 shadow-lg border-l-4 border-blue-500 animate-in slide-in-from-right duration-300"
          style={{ 
            animationDelay: `${index * 100}ms`,
            borderLeftColor: notification.type === "live" ? "#ef4444" : 
                           notification.type === "schedule" ? "#3b82f6" :
                           notification.type === "message" ? "#10b981" : "#eab308"
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">
                    {notification.title}
                  </h4>
                  <Badge className={`text-xs ${getBadgeColor(notification.type)}`}>
                    {notification.type === "live" ? "AO VIVO" : 
                     notification.type === "schedule" ? "AGENDADO" :
                     notification.type === "message" ? "NOVA MSG" : "AVISO"}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {notification.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  
                  <div className="flex gap-2">
                    {notification.action && (
                      <Button 
                        size="sm" 
                        className="h-7 px-3 text-xs"
                        onClick={() => handleAction(notification)}
                      >
                        {notification.action.text}
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 w-7 p-0"
                      onClick={() => onDismiss(notification.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}