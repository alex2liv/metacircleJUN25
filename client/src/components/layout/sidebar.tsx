import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Users, 
  Circle,
  MoreHorizontal,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Geral", href: "/spaces", icon: MessageSquare, badge: "12", badgeVariant: "secondary" as const },
  { name: "Cursos", href: "/courses", icon: BookOpen, badge: "3", badgeVariant: "default" as const },
  { name: "Eventos", href: "/events", icon: Calendar, badge: "2", badgeVariant: "destructive" as const },
  { name: "Ranking", href: "/ranking", icon: Trophy },
  { name: "Membros", href: "/members", icon: Users },
  { name: "👁️ Visão Cliente", href: "/client-view", icon: Eye, badge: "DEMO", badgeVariant: "outline" as const },
];

const directMessages = [
  {
    id: 1,
    name: "Alexandre Nunes",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=32&h=32",
    isOnline: true,
  },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Community Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 metacircle-gradient rounded-lg flex items-center justify-center">
            <Circle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">MetaCircle</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">248 membros</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive
                      ? "text-primary"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                  )}
                />
                {item.name}
                {item.badge && (
                  <Badge variant={item.badgeVariant} className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}

        {/* Direct Messages Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Mensagens Diretas
          </h3>
          <div className="mt-2 space-y-1">
            {directMessages.map((dm) => (
              <a
                key={dm.id}
                href="#"
                className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <Avatar className="mr-3 h-6 w-6">
                  <AvatarImage src={dm.avatar} alt={dm.name} />
                  <AvatarFallback>{dm.name[0]}</AvatarFallback>
                </Avatar>
                <span className="truncate">{dm.name}</span>
                {dm.isOnline && (
                  <span className="ml-auto w-2 h-2 bg-green-400 rounded-full"></span>
                )}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} alt={user?.firstName} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
              {user?.role}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
