import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Clock, 
  AlertTriangle, 
  X,
  Zap
} from "lucide-react";

interface GracePeriodBannerProps {
  daysLeft: number;
  onUpgrade: () => void;
  onDismiss?: () => void;
}

export function GracePeriodBanner({ daysLeft, onUpgrade, onDismiss }: GracePeriodBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getBannerStyle = () => {
    if (daysLeft === 0) {
      return {
        bgColor: "bg-gradient-to-r from-red-600 to-pink-600",
        borderColor: "border-red-300",
        textColor: "text-white",
        urgency: "🚨 ÚLTIMO DIA!"
      };
    } else if (daysLeft === 1) {
      return {
        bgColor: "bg-gradient-to-r from-orange-600 to-red-600",
        borderColor: "border-orange-300",
        textColor: "text-white",
        urgency: "⚠️ Falta 1 dia!"
      };
    } else if (daysLeft === 2) {
      return {
        bgColor: "bg-gradient-to-r from-yellow-600 to-orange-600",
        borderColor: "border-yellow-300",
        textColor: "text-white",
        urgency: "⏰ Faltam 2 dias!"
      };
    } else {
      return {
        bgColor: "bg-gradient-to-r from-blue-600 to-purple-600",
        borderColor: "border-blue-300",
        textColor: "text-white",
        urgency: `📅 Faltam ${daysLeft} dias!`
      };
    }
  };

  const style = getBannerStyle();

  const getMessage = () => {
    if (daysLeft === 0) {
      return "Seu acesso Premium Beta expira hoje às 23:59! Não perca o acesso ao chat direto e todas as funcionalidades exclusivas.";
    } else if (daysLeft === 1) {
      return "Amanhã seu acesso Premium Beta expira! Garante já seu plano Premium para continuar com todos os benefícios.";
    } else if (daysLeft === 2) {
      return "Seu período de teste Premium termina em 2 dias. Aproveite para conhecer todas as funcionalidades antes de assinar!";
    } else {
      return `Você ainda tem ${daysLeft} dias de acesso Premium gratuito! Aproveite ao máximo e considere fazer upgrade.`;
    }
  };

  return (
    <Card className={`mb-6 border-2 ${style.borderColor} shadow-lg`}>
      <CardContent className={`${style.bgColor} ${style.textColor} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-6 h-6" />
              <Badge className="bg-white/20 text-white border-white/30">
                {style.urgency}
              </Badge>
              {daysLeft === 0 && (
                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-sm">
                    {timeLeft.hours.toString().padStart(2, '0')}:
                    {timeLeft.minutes.toString().padStart(2, '0')}:
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-bold mb-2">
              {daysLeft === 0 ? "Último dia de acesso Premium!" : "Seu período de teste está acabando"}
            </h3>
            
            <p className="text-sm opacity-90 mb-4">
              {getMessage()}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Button 
                onClick={onUpgrade}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                {daysLeft === 0 ? "Garantir Premium AGORA!" : "Fazer Upgrade para Premium"}
              </Button>
              
              {daysLeft > 0 && (
                <span className="text-xs opacity-75">
                  • Chat direto • SOS • Agendamentos • Suporte prioritário
                </span>
              )}
            </div>
          </div>

          {onDismiss && daysLeft > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-white hover:bg-white/20 ml-4"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}