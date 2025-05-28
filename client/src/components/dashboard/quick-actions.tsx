import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, CalendarPlus, UserPlus } from "lucide-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function QuickActions() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (actionName: string) => {
    setLoadingAction(actionName);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoadingAction(null);
    // In a real app, this would open modals or navigate to forms
  };

  const actions = [
    {
      id: "create-post",
      label: "Criar Post",
      icon: Edit,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "schedule-event",
      label: "Agendar Evento",
      icon: CalendarPlus,
      bgColor: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "invite-members",
      label: "Convidar Membros",
      icon: UserPlus,
      bgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <Card className="border-gray-100 dark:border-gray-700">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isLoading = loadingAction === action.id;
          
          return (
            <Button
              key={action.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => handleAction(action.id)}
              disabled={isLoading}
            >
              <div className={`${action.bgColor} p-2 rounded-lg mr-3`}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <Icon className={`w-4 h-4 ${action.iconColor}`} />
                )}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {action.label}
              </span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
