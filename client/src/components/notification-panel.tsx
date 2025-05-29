import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Volume2, 
  VolumeX,
  MessageCircle,
  Calendar,
  Users,
  X,
  Settings
} from "lucide-react";

interface NotificationSettings {
  visual: boolean;
  sound: boolean;
  comments: boolean;
  events: boolean;
  mentions: boolean;
  newMembers: boolean;
}

interface Notification {
  id: number;
  type: 'comment' | 'event' | 'mention' | 'member';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    visual: true,
    sound: true,
    comments: true,
    events: true,
    mentions: true,
    newMembers: false
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'comment',
      title: 'Novo comentário',
      message: 'João comentou no seu post "Como usar o MetaCircle"',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'event',
      title: 'Evento próximo',
      message: 'Workshop React começa em 1 hora',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'mention',
      title: 'Você foi mencionado',
      message: 'Maria te mencionou na discussão sobre desenvolvimento',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simular chegada de nova notificação
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance a cada 10 segundos
        const newNotification: Notification = {
          id: Date.now(),
          type: 'comment',
          title: 'Nova mensagem',
          message: 'Você recebeu uma nova mensagem no chat',
          timestamp: new Date(),
          read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Tocar som se habilitado
        if (settings.sound && settings.comments) {
          playNotificationSound();
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [settings]);

  const playNotificationSound = () => {
    // Som de notificação simples
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEASAAAAAB');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Silenciar erro se autoplay bloqueado
    });
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-600" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-green-600" />;
      case 'mention':
        return <MessageCircle className="w-4 h-4 text-purple-600" />;
      case 'member':
        return <Users className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  return (
    <>
      {/* Botão de Notificações */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Painel de Notificações */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Notificações</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Configurações Rápidas */}
              <div className="flex items-center justify-between py-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.visual}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, visual: checked})
                    }
                    size="sm"
                  />
                  <Label className="text-xs">Visual</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, sound: checked})
                    }
                    size="sm"
                  />
                  {settings.sound ? 
                    <Volume2 className="w-4 h-4 text-green-600" /> : 
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  }
                  <Label className="text-xs">Som</Label>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
                <span className="text-xs text-gray-600">{notifications.length} notificações</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs h-6"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Nenhuma notificação
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Configurações Detalhadas */}
              <div className="p-3 border-t bg-gray-50">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Comentários</Label>
                    <Switch
                      checked={settings.comments}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, comments: checked})
                      }
                      size="sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Eventos</Label>
                    <Switch
                      checked={settings.events}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, events: checked})
                      }
                      size="sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Menções</Label>
                    <Switch
                      checked={settings.mentions}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, mentions: checked})
                      }
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}