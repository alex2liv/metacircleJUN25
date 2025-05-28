import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

interface Member {
  id: number;
  points: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

interface TopMembersProps {
  members?: Member[];
  isLoading: boolean;
}

export default function TopMembers({ members, isLoading }: TopMembersProps) {
  if (isLoading) {
    return (
      <Card className="border-gray-100 dark:border-gray-700">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Star className="w-4 h-4 text-yellow-400 fill-current" />;
    return <Star className="w-4 h-4 text-gray-400 fill-current" />;
  };

  const getRankPosition = (index: number) => {
    const positions = ["1º", "2º", "3º"];
    return positions[index] || `${index + 1}º`;
  };

  return (
    <Card className="border-gray-100 dark:border-gray-700">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold">Top Membros</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {members?.map((member, index) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.user.avatar} alt={`${member.user.firstName} ${member.user.lastName}`} />
                <AvatarFallback>
                  {member.user.firstName[0]}{member.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {member.user.firstName} {member.user.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {member.points.toLocaleString()} pontos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {getRankIcon(index)}
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getRankPosition(index)}
              </span>
            </div>
          </div>
        )) || (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            Nenhum membro encontrado.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
