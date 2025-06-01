const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
import { EventEmitter } from 'events';
import qrcode from 'qrcode';

export class WhatsAppProfessionalService extends EventEmitter {
  private client: Client | null = null;
  private qrCodeData: string | null = null;
  private isConnected: boolean = false;
  private isInitializing: boolean = false;
  private sessionId: string;
  private messagesSentToday: number = 0;
  private messagesSentThisHour: number = 0;
  private lastHourReset: Date = new Date();
  private lastDayReset: Date = new Date();
  private limitsConfig = {
    maxPerDay: 100,
    maxPerHour: 30,
    minDelay: 60 // segundos
  };

  constructor(sessionId: string = 'default') {
    super();
    this.sessionId = sessionId;
  }

  async initialize(): Promise<void> {
    if (this.isInitializing || this.client) {
      return;
    }

    this.isInitializing = true;

    try {
      console.log('Inicializando WhatsApp Web.js...');

      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: this.sessionId,
          dataPath: './whatsapp-sessions'
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process'
          ]
        }
      });

      this.setupEventHandlers();

      console.log('Iniciando cliente WhatsApp...');
      await this.client.initialize();

    } catch (error) {
      console.error('Erro ao inicializar WhatsApp:', error);
      this.isInitializing = false;
      throw error;
    }

    this.isInitializing = false;
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('qr', async (qr) => {
      console.log('QR Code recebido');
      try {
        // Gerar QR Code como imagem base64
        this.qrCodeData = await qrcode.toDataURL(qr, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        this.emit('qr-code', this.qrCodeData);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      }
    });

    this.client.on('ready', () => {
      console.log('WhatsApp Web está pronto!');
      this.isConnected = true;
      this.qrCodeData = null;
      this.emit('connected');
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp autenticado com sucesso');
      this.emit('authenticated');
    });

    this.client.on('auth_failure', (message) => {
      console.error('Falha na autenticação:', message);
      this.emit('auth_failure', message);
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp desconectado:', reason);
      this.isConnected = false;
      this.emit('disconnected', reason);
    });

    this.client.on('message', (message) => {
      this.emit('message', message);
    });
  }

  async generateQRCode(): Promise<string> {
    if (!this.client) {
      await this.initialize();
    }

    if (this.qrCodeData) {
      return this.qrCodeData;
    }

    // Aguardar QR code ser gerado
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout ao gerar QR code'));
      }, 30000);

      this.once('qr-code', (qrCode) => {
        clearTimeout(timeout);
        resolve(qrCode);
      });

      // Se já estiver conectado, não precisa de QR code
      if (this.isConnected) {
        clearTimeout(timeout);
        reject(new Error('WhatsApp já está conectado'));
      }
    });
  }

  private checkHourlyLimits(): void {
    const now = new Date();
    const hoursDiff = (now.getTime() - this.lastHourReset.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff >= 1) {
      this.messagesSentThisHour = 0;
      this.lastHourReset = now;
    }
  }

  private checkDailyLimits(): void {
    const now = new Date();
    const daysDiff = (now.getTime() - this.lastDayReset.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff >= 1) {
      this.messagesSentToday = 0;
      this.lastDayReset = now;
    }
  }

  async sendMessage(number: string, message: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      throw new Error("WhatsApp não está conectado");
    }

    // Verificar limites
    this.checkHourlyLimits();
    this.checkDailyLimits();

    if (this.messagesSentToday >= this.limitsConfig.maxPerDay) {
      throw new Error(`Limite diário atingido: ${this.limitsConfig.maxPerDay} mensagens`);
    }

    if (this.messagesSentThisHour >= this.limitsConfig.maxPerHour) {
      throw new Error(`Limite por hora atingido: ${this.limitsConfig.maxPerHour} mensagens`);
    }

    try {
      // Formatar número para padrão brasileiro
      const formattedNumber = this.formatPhoneNumber(number);
      const chatId = `${formattedNumber}@c.us`;

      // Verificar se o número existe no WhatsApp
      const isRegistered = await this.client.isRegisteredUser(chatId);
      if (!isRegistered) {
        throw new Error(`Número ${number} não está registrado no WhatsApp`);
      }

      // Enviar mensagem
      await this.client.sendMessage(chatId, message);
      
      // Incrementar contadores
      this.messagesSentToday++;
      this.messagesSentThisHour++;

      console.log(`Mensagem enviada para ${number}: ${message.substring(0, 50)}...`);
      return true;

    } catch (error) {
      console.error(`Erro ao enviar mensagem para ${number}:`, error);
      throw error;
    }
  }

  async sendBulkMessages(
    numbers: string[], 
    message: string, 
    delay: number = 60000
  ): Promise<{
    success: number;
    failed: number;
    errors: string[];
    stopped: boolean;
  }> {
    if (!this.isConnected) {
      throw new Error("WhatsApp não está conectado");
    }

    const errors: string[] = [];
    let success = 0;
    let failed = 0;
    let stopped = false;

    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];
      
      try {
        // Verificar limites antes de cada envio
        this.checkHourlyLimits();
        this.checkDailyLimits();

        if (this.messagesSentToday >= this.limitsConfig.maxPerDay) {
          errors.push(`Limite diário atingido. Parando envios.`);
          stopped = true;
          break;
        }

        if (this.messagesSentThisHour >= this.limitsConfig.maxPerHour) {
          errors.push(`Limite por hora atingido. Aguarde ${60 - new Date().getMinutes()} minutos.`);
          stopped = true;
          break;
        }

        await this.sendMessage(number, message);
        success++;
        
        // Aguardar delay entre mensagens (exceto na última)
        if (i < numbers.length - 1 && delay > 0) {
          console.log(`Aguardando ${delay/1000}s antes da próxima mensagem...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error: any) {
        failed++;
        errors.push(`Erro ao enviar para ${number}: ${error.message}`);
        console.error(`Erro ao enviar para ${number}:`, error.message);
      }
    }

    return { success, failed, errors, stopped };
  }

  private formatPhoneNumber(number: string): string {
    // Remover todos os caracteres não numéricos
    let cleaned = number.replace(/\D/g, '');
    
    // Se começar com +55, remover
    if (cleaned.startsWith('55')) {
      cleaned = cleaned.substring(2);
    }
    
    // Se não tiver 11 dígitos (DDD + número), adicionar 55
    if (cleaned.length === 11) {
      cleaned = '55' + cleaned;
    }
    
    return cleaned;
  }

  async sendMediaMessage(number: string, mediaPath: string, caption?: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      throw new Error("WhatsApp não está conectado");
    }

    try {
      const formattedNumber = this.formatPhoneNumber(number);
      const chatId = `${formattedNumber}@c.us`;
      
      const media = MessageMedia.fromFilePath(mediaPath);
      await this.client.sendMessage(chatId, media, { caption });
      
      this.messagesSentToday++;
      this.messagesSentThisHour++;
      
      return true;
    } catch (error) {
      console.error(`Erro ao enviar mídia para ${number}:`, error);
      throw error;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getCurrentQRCode(): string | null {
    return this.qrCodeData;
  }

  getMessageStats(): {
    sentToday: number;
    sentThisHour: number;
    maxPerDay: number;
    maxPerHour: number;
    remainingToday: number;
    remainingThisHour: number;
  } {
    this.checkHourlyLimits();
    this.checkDailyLimits();

    return {
      sentToday: this.messagesSentToday,
      sentThisHour: this.messagesSentThisHour,
      maxPerDay: this.limitsConfig.maxPerDay,
      maxPerHour: this.limitsConfig.maxPerHour,
      remainingToday: Math.max(0, this.limitsConfig.maxPerDay - this.messagesSentToday),
      remainingThisHour: Math.max(0, this.limitsConfig.maxPerHour - this.messagesSentThisHour)
    };
  }

  updateLimits(maxPerDay: number, maxPerHour: number, minDelay: number): void {
    this.limitsConfig = {
      maxPerDay: Math.min(maxPerDay, 300), // Máximo absoluto
      maxPerHour: Math.min(maxPerHour, 120), // Máximo absoluto
      minDelay: Math.max(minDelay, 30) // Mínimo absoluto
    };
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
    }
    this.isConnected = false;
    this.qrCodeData = null;
    this.emit('disconnected');
  }

  async getChats(): Promise<any[]> {
    if (!this.isConnected || !this.client) {
      throw new Error("WhatsApp não está conectado");
    }

    return await this.client.getChats();
  }

  async getContacts(): Promise<any[]> {
    if (!this.isConnected || !this.client) {
      throw new Error("WhatsApp não está conectado");
    }

    return await this.client.getContacts();
  }
}

export const whatsAppProfessionalService = new WhatsAppProfessionalService();