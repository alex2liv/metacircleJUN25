import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  Building2,
  MoreHorizontal,
  Eye,
  UserPlus,
  Phone
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import metaSyncIcon from "@assets/icone_matasync.png";

const navigationItems = [
  { name: "Dashboard Admin", href: "/admin/users", icon: LayoutDashboard },
  { name: "Gerenciar Usuários", href: "/admin/users", icon: Users, badge: "248", badgeVariant: "secondary" as const },
  { name: "Comunidades", href: "/spaces", icon: MessageSquare, badge: "4", badgeVariant: "default" as const },
  { name: "Eventos", href: "/events", icon: Calendar, badge: "3", badgeVariant: "destructive" as const },
  { name: "Relatórios", href: "/analytics-dashboard", icon: BarChart3 },
  { name: "Convites", href: "/invite-members", icon: UserPlus },
  { name: "WhatsApp", href: "/whatsapp-settings", icon: Phone, badge: "NOVO", badgeVariant: "default" as const },
  { name: "Configurações", href: "/settings", icon: Settings },
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
      {/* Company Admin Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AB7 Admin</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Painel Administrativo</p>
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
                    ? "bg-blue-600 dark:bg-blue-700"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
                style={isActive ? { color: 'white' } : {}}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive
                      ? "text-white"
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

        {/* Administrative Contacts Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Contatos Administrativos
          </h3>
          <div className="mt-2 space-y-1">
            <div className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
              <Avatar className="mr-3 h-6 w-6">
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <span className="truncate">Suporte MetaSync</span>
              <span className="ml-auto w-2 h-2 bg-green-400 rounded-full"></span>
            </div>
            <div className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
              <Avatar className="mr-3 h-6 w-6">
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <span className="truncate">Equipe AB7</span>
              <span className="ml-auto w-2 h-2 bg-yellow-400 rounded-full"></span>
            </div>
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
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Admin da Empresa
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
