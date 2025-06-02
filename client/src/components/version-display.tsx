import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, X } from "lucide-react";
import { VERSION_INFO } from "@shared/version";

interface VersionDisplayProps {
  compact?: boolean;
}

export default function VersionDisplay({ compact = false }: VersionDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          v{VERSION_INFO.version}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowDetails(true)}
          className="h-6 w-6 p-0"
        >
          <Info className="w-3 h-3" />
        </Button>
        
        {showDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">MetaSync Platform</CardTitle>
                  <CardDescription>
                    Versão {VERSION_INFO.version} - {VERSION_INFO.codeName}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Build Date:</p>
                    <p className="text-sm text-muted-foreground">{VERSION_INFO.buildDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Recursos desta versão:</p>
                    <ul className="text-xs space-y-1">
                      {VERSION_INFO.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Informações da Versão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Versão:</span>
            <Badge variant="outline">{VERSION_INFO.version}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Build:</span>
            <span className="text-sm text-muted-foreground">{VERSION_INFO.buildDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Codinome:</span>
            <span className="text-sm text-muted-foreground">{VERSION_INFO.codeName}</span>
          </div>
          <div>
            <p className="font-medium mb-2">Recursos:</p>
            <ul className="text-sm space-y-1">
              {VERSION_INFO.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}