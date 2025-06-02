import { useAuth } from "./use-auth";

export type UserRole = "owner" | "admin" | "moderator" | "specialist" | "member";

export interface UserPermissions {
  canCreateCommunity: boolean;
  canEditCommunity: boolean;
  canDeleteCommunity: boolean;
  canCreateSpace: boolean;
  canEditSpace: boolean;
  canDeleteSpace: boolean;
  canCreatePost: boolean;
  canEditAnyPost: boolean;
  canDeleteAnyPost: boolean;
  canCreateEvent: boolean;
  canEditAnyEvent: boolean;
  canDeleteAnyEvent: boolean;
  canManageMembers: boolean;
  canViewAnalytics: boolean;
  canModerateContent: boolean;
  canAccessSettings: boolean;
}

const rolePermissions: Record<UserRole, UserPermissions> = {
  owner: {
    canCreateCommunity: true,
    canEditCommunity: true,
    canDeleteCommunity: true,
    canCreateSpace: true,
    canEditSpace: true,
    canDeleteSpace: true,
    canCreatePost: true,
    canEditAnyPost: true,
    canDeleteAnyPost: true,
    canCreateEvent: true,
    canEditAnyEvent: true,
    canDeleteAnyEvent: true,
    canManageMembers: true,
    canViewAnalytics: true,
    canModerateContent: true,
    canAccessSettings: true,
  },
  admin: {
    canCreateCommunity: false,
    canEditCommunity: true,
    canDeleteCommunity: false,
    canCreateSpace: true,
    canEditSpace: true,
    canDeleteSpace: true,
    canCreatePost: true,
    canEditAnyPost: true,
    canDeleteAnyPost: true,
    canCreateEvent: true,
    canEditAnyEvent: true,
    canDeleteAnyEvent: true,
    canManageMembers: true,
    canViewAnalytics: true,
    canModerateContent: true,
    canAccessSettings: false,
  },
  moderator: {
    canCreateCommunity: false,
    canEditCommunity: false,
    canDeleteCommunity: false,
    canCreateSpace: false,
    canEditSpace: false,
    canDeleteSpace: false,
    canCreatePost: true,
    canEditAnyPost: true,
    canDeleteAnyPost: true,
    canCreateEvent: true,
    canEditAnyEvent: false,
    canDeleteAnyEvent: false,
    canManageMembers: false,
    canViewAnalytics: false,
    canModerateContent: true,
    canAccessSettings: false,
  },
  specialist: {
    canCreateCommunity: false,
    canEditCommunity: false,
    canDeleteCommunity: false,
    canCreateSpace: false,
    canEditSpace: false,
    canDeleteSpace: false,
    canCreatePost: true,
    canEditAnyPost: false,
    canDeleteAnyPost: false,
    canCreateEvent: true,
    canEditAnyEvent: true,
    canDeleteAnyEvent: true,
    canManageMembers: false,
    canViewAnalytics: false,
    canModerateContent: true,
    canAccessSettings: true, // Specialist pode acessar configurações (WhatsApp)
  },
  member: {
    canCreateCommunity: false,
    canEditCommunity: false,
    canDeleteCommunity: false,
    canCreateSpace: false,
    canEditSpace: false,
    canDeleteSpace: false,
    canCreatePost: true,
    canEditAnyPost: false,
    canDeleteAnyPost: false,
    canCreateEvent: false,
    canEditAnyEvent: false,
    canDeleteAnyEvent: false,
    canManageMembers: false,
    canViewAnalytics: false,
    canModerateContent: false,
    canAccessSettings: false,
  },
};

export function useUserRole() {
  const { user } = useAuth();
  
  // Simular diferentes roles para demonstração
  // Na implementação real, isso viria do contexto da comunidade
  const currentRole: UserRole = (user?.role as UserRole) || "member";
  
  const permissions = rolePermissions[currentRole];
  
  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return permissions[permission];
  };
  
  const canAccess = (requiredRole: UserRole): boolean => {
    const roleHierarchy: Record<UserRole, number> = {
      member: 1,
      specialist: 2,
      moderator: 3,
      admin: 4,
      owner: 5,
    };
    
    return roleHierarchy[currentRole] >= roleHierarchy[requiredRole];
  };

  return {
    role: currentRole,
    permissions,
    hasPermission,
    canAccess,
    isOwner: currentRole === "owner",
    isAdmin: currentRole === "admin" || currentRole === "owner",
    isModerator: currentRole === "moderator" || currentRole === "admin" || currentRole === "owner",
    isSpecialist: currentRole === "specialist",
    isMember: true,
  };
}