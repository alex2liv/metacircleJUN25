import metaSyncLogo from "@assets/logo completo metasync.png";

interface MetaSyncBrandingProps {
  show: boolean;
  position?: "footer" | "splash" | "corner";
  size?: "small" | "medium" | "large";
}

export function MetaSyncBranding({ show, position = "footer", size = "medium" }: MetaSyncBrandingProps) {
  if (!show) return null;

  const sizeClasses = {
    small: "h-6",
    medium: "h-8", 
    large: "h-12"
  };

  const positionClasses = {
    footer: "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4",
    splash: "fixed inset-0 bg-black/80 flex items-center justify-center z-50",
    corner: "fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 border"
  };

  if (position === "footer") {
    return (
      <div className={positionClasses.footer}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={metaSyncLogo} 
              alt="MetaSync Digital" 
              className={sizeClasses[size]}
            />
            <div className="text-sm">
              <p className="font-medium">Powered by MetaSync Digital</p>
              <p className="text-blue-100 text-xs">Plataforma de Comunidades Profissionais</p>
            </div>
          </div>
          <div className="text-right text-xs text-blue-100">
            <p>Quer remover esta marca?</p>
            <a 
              href="https://metasync.com.br/white-label" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-300 hover:text-yellow-200 underline"
            >
              Conheça o White Label
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (position === "splash") {
    return (
      <div className={positionClasses.splash}>
        <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4">
          <img 
            src={metaSyncLogo} 
            alt="MetaSync Digital" 
            className="h-16 mx-auto mb-4"
          />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Powered by MetaSync Digital
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            A plataforma mais avançada para comunidades profissionais
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>✅ Gestão completa de especialistas</p>
            <p>✅ Sistema de agendamentos integrado</p>
            <p>✅ Notificações WhatsApp automatizadas</p>
          </div>
        </div>
      </div>
    );
  }

  if (position === "corner") {
    return (
      <div className={positionClasses.corner}>
        <div className="flex items-center gap-2">
          <img 
            src={metaSyncLogo} 
            alt="MetaSync Digital" 
            className="h-6"
          />
          <div className="text-xs">
            <p className="font-medium text-gray-900">MetaSync</p>
            <a 
              href="https://metasync.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              Saiba mais
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Hook para verificar se deve mostrar o branding
export function useMetaSyncBranding() {
  // Em uma implementação real, isso viria do contexto da empresa
  // Por enquanto, vamos simular baseado na URL
  const currentPath = window.location.pathname;
  
  // Empresas sem white-label (exemplo)
  const companiesWithoutWhiteLabel = ['startuphub'];
  const hasWhiteLabel = !companiesWithoutWhiteLabel.some(company => 
    currentPath.includes(company)
  );

  return {
    shouldShowBranding: !hasWhiteLabel,
    company: companiesWithoutWhiteLabel.find(company => 
      currentPath.includes(company)
    ) || 'default'
  };
}