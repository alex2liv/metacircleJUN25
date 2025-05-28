import { ReactNode } from "react";
import { useUserRole } from "@/hooks/use-user-role";

interface RoleBasedLayoutProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredRole?: "owner" | "admin" | "moderator" | "member";
  fallback?: ReactNode;
}

export function RoleBasedLayout({ 
  children, 
  requiredPermission, 
  requiredRole,
  fallback = null 
}: RoleBasedLayoutProps) {
  const { hasPermission, canAccess } = useUserRole();

  // Verificar permissão específica
  if (requiredPermission && !hasPermission(requiredPermission as any)) {
    return <>{fallback}</>;
  }

  // Verificar role mínimo
  if (requiredRole && !canAccess(requiredRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}