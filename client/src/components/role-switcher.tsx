import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, UserCheck, Shield, Crown, Users } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const roles = [
    {
      id: "member",
      name: "Membro",
      description: "Visão do cliente comum",
      icon: Users,
      color: "bg-gray-100 text-gray-800",
      permissions: ["Ver posts", "Comentar", "Participar de eventos", "Acessar cursos"]
    },
    {
      id: "moderator", 
      name: "Moderador",
      description: "Pode moderar conteúdo",
      icon: UserCheck,
      color: "bg-blue-100 text-blue-800",
      permissions: ["Moderar posts", "Gerenciar eventos", "Banir usuários"]
    },
    {
      id: "admin",
      name: "Administrador", 
      description: "Acesso administrativo",
      icon: Shield,
      color: "bg-purple-100 text-purple-800",
      permissions: ["Configurar integrações", "Analytics", "Gerenciar espaços"]
    },
    {
      id: "owner",
      name: "Proprietário",
      description: "Controle total",
      icon: Crown,
      color: "bg-yellow-100 text-yellow-800",
      permissions: ["Acesso completo", "Configurações avançadas", "Billing"]
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Visualizar como...
        </CardTitle>
        <CardDescription>
          Alterne entre diferentes níveis de usuário para ver como fica a experiência
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            
            return (
              <div
                key={role.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onRoleChange(role.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5" />
                  <Badge className={role.color}>
                    {role.name}
                  </Badge>
                  {isActive && (
                    <Badge variant="outline" className="text-xs">
                      ATIVO
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {role.description}
                </p>
                
                <div className="space-y-1">
                  {role.permissions.slice(0, 2).map((permission, index) => (
                    <p key={index} className="text-xs text-gray-500">
                      • {permission}
                    </p>
                  ))}
                  {role.permissions.length > 2 && (
                    <p className="text-xs text-gray-400">
                      +{role.permissions.length - 2} mais...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Modo de Visualização:</strong> Você está vendo a interface como um {roles.find(r => r.id === currentRole)?.name}. 
            Algumas funcionalidades podem estar ocultas ou restritas baseadas no nível de acesso.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}