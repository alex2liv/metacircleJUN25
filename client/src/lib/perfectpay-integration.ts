// Integração com PerfectPay
export interface PerfectPayCredentials {
  email: string;
  password: string;
}

export class PerfectPayIntegration {
  private static readonly PERFECTPAY_BASE_URL = "https://clarissavaz.academy.perfectpay.com.br";
  private static readonly DEFAULT_PASSWORD = "12345";

  static getLoginUrl(): string {
    return `${this.PERFECTPAY_BASE_URL}/login/`;
  }

  static getCourseUrl(courseSlug?: string): string {
    if (courseSlug) {
      return `${this.PERFECTPAY_BASE_URL}/curso/${courseSlug}`;
    }
    return `${this.PERFECTPAY_BASE_URL}/cursos`;
  }

  static getDashboardUrl(): string {
    return `${this.PERFECTPAY_BASE_URL}/dashboard`;
  }

  static getCredentials(userEmail: string): PerfectPayCredentials {
    return {
      email: userEmail,
      password: this.DEFAULT_PASSWORD
    };
  }

  static async autoLogin(userEmail: string): Promise<boolean> {
    try {
      const credentials = this.getCredentials(userEmail);
      
      // Criar uma nova janela/tab para PerfectPay
      const perfectPayWindow = window.open(
        this.getLoginUrl(),
        '_blank',
        'width=1200,height=800,scrollbars=yes,resizable=yes'
      );

      if (!perfectPayWindow) {
        throw new Error('Popup bloqueado pelo navegador');
      }

      // Informar o usuário sobre as credenciais
      const message = `
        🔐 Acesso à Plataforma PerfectPay
        
        Email: ${credentials.email}
        Senha: ${credentials.password}
        
        Use essas credenciais para fazer login na plataforma de cursos.
      `;

      // Exibir as credenciais em um alert temporário
      alert(message);

      return true;
    } catch (error) {
      console.error('Erro ao abrir PerfectPay:', error);
      return false;
    }
  }

  static async redirectToCourse(userEmail: string, courseSlug?: string): Promise<void> {
    const credentials = this.getCredentials(userEmail);
    const courseUrl = this.getCourseUrl(courseSlug);
    
    // Abrir curso específico em nova aba
    const perfectPayWindow = window.open(
      courseUrl,
      '_blank',
      'width=1200,height=800,scrollbars=yes,resizable=yes'
    );

    if (perfectPayWindow) {
      // Mostrar credenciais se necessário
      setTimeout(() => {
        const shouldShowCredentials = confirm(
          'Precisa das credenciais de acesso?\n\nClique "OK" para ver email e senha.'
        );
        
        if (shouldShowCredentials) {
          alert(`
            🔐 Credenciais PerfectPay:
            
            Email: ${credentials.email}
            Senha: ${credentials.password}
          `);
        }
      }, 1000);
    }
  }
}

// Hook para facilitar o uso nos componentes
export function usePerfectPayIntegration() {
  const openPerfectPay = (userEmail: string, courseSlug?: string) => {
    return PerfectPayIntegration.redirectToCourse(userEmail, courseSlug);
  };

  const openPerfectPayLogin = (userEmail: string) => {
    return PerfectPayIntegration.autoLogin(userEmail);
  };

  const getPerfectPayCredentials = (userEmail: string) => {
    return PerfectPayIntegration.getCredentials(userEmail);
  };

  return {
    openPerfectPay,
    openPerfectPayLogin,
    getPerfectPayCredentials,
  };
}