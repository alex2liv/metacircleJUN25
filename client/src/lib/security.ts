// Funções de segurança para validação e sanitização

/**
 * Sanitiza entrada de texto para prevenir XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida se uma URL é segura
 */
export function validateSecureUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Só permite HTTPS em produção
    if (import.meta.env.PROD && urlObj.protocol !== 'https:') {
      return false;
    }
    // Lista de domínios permitidos para PerfectPay
    const allowedDomains = [
      'perfectpay.com.br',
      'academy.perfectpay.com.br',
      'clarissavaz.academy.perfectpay.com.br'
    ];
    
    return allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

/**
 * Valida força da senha
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (password.length < 8) {
    issues.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    issues.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    issues.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    issues.push('Senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('Senha deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Gera token seguro para sessões
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica se o usuário tem permissão para acessar recursos administrativos
 */
export function hasAdminAccess(userRole?: string): boolean {
  return userRole === 'owner' || userRole === 'admin';
}

/**
 * Rate limiting básico no cliente
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove tentativas antigas
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeLeft = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, timeLeft);
  }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 tentativas por 15 minutos
export const apiRateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests por minuto

/**
 * Mascarar dados sensíveis para logs
 */
export function maskSensitiveData(data: any): any {
  if (typeof data !== 'object' || data === null) return data;
  
  const masked = { ...data };
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
  
  for (const key in masked) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      masked[key] = '***MASKED***';
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }
  
  return masked;
}

/**
 * Validar dados de entrada de formulários
 */
export function validateFormInput(input: any, schema: any): {
  isValid: boolean;
  errors: string[];
  sanitizedData: any;
} {
  try {
    // Sanitizar strings recursivamente
    const sanitized = sanitizeObjectStrings(input);
    
    // Validar com Zod
    const result = schema.safeParse(sanitized);
    
    if (result.success) {
      return {
        isValid: true,
        errors: [],
        sanitizedData: result.data
      };
    } else {
      return {
        isValid: false,
        errors: result.error.errors.map(err => err.message),
        sanitizedData: sanitized
      };
    }
  } catch (error) {
    return {
      isValid: false,
      errors: ['Erro de validação interno'],
      sanitizedData: input
    };
  }
}

function sanitizeObjectStrings(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeObjectStrings);
  } else if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObjectStrings(obj[key]);
    }
    return sanitized;
  }
  return obj;
}