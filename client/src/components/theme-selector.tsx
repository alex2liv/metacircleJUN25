import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme, predefinedThemes, type CommunityTheme } from "@/hooks/use-theme";
import { Palette, Moon, Sun, Check } from "lucide-react";

export function ThemeSelector() {
  const { currentTheme, setTheme, darkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (theme: CommunityTheme) => {
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          Personalizar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Personalizar Aparência
          </DialogTitle>
          <DialogDescription>
            Escolha um tema que represente a identidade da sua comunidade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <Label htmlFor="dark-mode">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Alternar entre tema claro e escuro
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>

          {/* Theme Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predefinedThemes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  currentTheme.id === theme.id 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleThemeSelect(theme)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {theme.name}
                    </CardTitle>
                    {currentTheme.id === theme.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Color Preview */}
                  <div className="flex gap-2 mb-3">
                    <div 
                      className="w-8 h-8 rounded-md border"
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                      title="Cor Primária"
                    />
                    <div 
                      className="w-8 h-8 rounded-md border"
                      style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                      title="Cor Secundária"
                    />
                    <div 
                      className="w-8 h-8 rounded-md border"
                      style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                      title="Cor de Destaque"
                    />
                  </div>

                  {/* Theme Preview */}
                  <div 
                    className="p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: `hsl(${theme.colors.background})`,
                      color: `hsl(${theme.colors.text})`
                    }}
                  >
                    <div className="text-xs font-medium mb-1" style={{ fontFamily: theme.fonts.heading }}>
                      {theme.name}
                    </div>
                    <div className="text-xs opacity-70" style={{ fontFamily: theme.fonts.body }}>
                      Preview do tema
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `hsl(${theme.colors.primary})`,
                          color: 'white'
                        }}
                      >
                        Botão
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Theme Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Tema Atual: {currentTheme.name}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Fonte do título:</span>
                <div style={{ fontFamily: currentTheme.fonts.heading }}>
                  {currentTheme.fonts.heading}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Fonte do corpo:</span>
                <div style={{ fontFamily: currentTheme.fonts.body }}>
                  {currentTheme.fonts.body}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}