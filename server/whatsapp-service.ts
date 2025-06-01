import puppeteer from 'puppeteer-core';
import { EventEmitter } from 'events';

export class WhatsAppService extends EventEmitter {
  private browser: any = null;
  private page: any = null;
  private qrCodeData: string | null = null;
  private isConnected: boolean = false;
  private sessionData: string | null = null;
  private isInitializing: boolean = false;

  constructor() {
    super();
  }

  async initializeWhatsAppWeb(): Promise<void> {
    if (this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    try {
      // Usar Chromium disponível no sistema
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
        executablePath: '/nix/store/*/bin/chromium' // Caminho do Chromium no Nix
      });

      this.page = await this.browser.newPage();
      
      // Configurar user agent
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Navegar para WhatsApp Web
      await this.page.goto('https://web.whatsapp.com', { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });

      // Aguardar o QR code aparecer
      await this.page.waitForSelector('[data-testid="qr-code"]', { timeout: 30000 });

      // Extrair o QR code
      await this.extractQRCode();

      // Monitorar mudanças no estado
      this.monitorConnectionStatus();

    } catch (error) {
      console.error('Erro ao inicializar WhatsApp Web:', error);
      this.isInitializing = false;
      throw error;
    }

    this.isInitializing = false;
  }

  private async extractQRCode(): Promise<void> {
    try {
      // Aguardar elemento do QR code
      await this.page.waitForSelector('[data-testid="qr-code"] canvas', { timeout: 15000 });
      
      // Extrair QR code como imagem
      const qrElement = await this.page.$('[data-testid="qr-code"] canvas');
      if (qrElement) {
        const qrCodeImage = await qrElement.screenshot({ encoding: 'base64' });
        this.qrCodeData = `data:image/png;base64,${qrCodeImage}`;
        this.emit('qr-code', this.qrCodeData);
      }
    } catch (error) {
      console.error('Erro ao extrair QR code:', error);
    }
  }

  private async monitorConnectionStatus(): Promise<void> {
    const checkConnection = async () => {
      try {
        // Verificar se está na tela de conversas (conectado)
        const isConnected = await this.page.$('[data-testid="chat-list"]') !== null;
        
        if (isConnected && !this.isConnected) {
          this.isConnected = true;
          this.qrCodeData = null;
          this.emit('connected');
        } else if (!isConnected && this.isConnected) {
          this.isConnected = false;
          this.emit('disconnected');
        }

        // Verificar se precisa de novo QR code
        if (!isConnected) {
          const qrExists = await this.page.$('[data-testid="qr-code"]') !== null;
          if (qrExists && !this.qrCodeData) {
            await this.extractQRCode();
          }
        }
      } catch (error) {
        console.error('Erro ao monitorar conexão:', error);
      }
    };

    // Verificar a cada 3 segundos
    setInterval(checkConnection, 3000);
  }

  async generateQRCode(): Promise<string> {
    if (!this.browser) {
      await this.initializeWhatsAppWeb();
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
    });
  }

  async sendMessage(number: string, message: string): Promise<boolean> {
    if (!this.isConnected || !this.page) {
      throw new Error("WhatsApp não está conectado");
    }
    
    try {
      // Navegar para o chat
      const chatUrl = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
      await this.page.goto(chatUrl);
      
      // Aguardar e clicar no botão enviar
      await this.page.waitForSelector('[data-testid="send"]', { timeout: 10000 });
      await this.page.click('[data-testid="send"]');
      
      return true;
    } catch (error) {
      console.error(`Erro ao enviar mensagem para ${number}:`, error);
      return false;
    }
  }

  async sendBulkMessages(numbers: string[], message: string, delay: number = 5000): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    if (!this.isConnected) {
      throw new Error("WhatsApp não está conectado");
    }

    const errors: string[] = [];
    let success = 0;
    let failed = 0;

    for (const number of numbers) {
      try {
        await this.sendMessage(number, message);
        success++;
        
        // Aguardar o delay especificado entre mensagens
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        failed++;
        errors.push(`Erro ao enviar para ${number}: ${error}`);
      }
    }

    return { success, failed, errors };
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getCurrentQRCode(): string | null {
    return this.qrCodeData;
  }

  setConnected(connected: boolean) {
    this.isConnected = connected;
    if (connected) {
      this.emit('connected');
    } else {
      this.emit('disconnected');
    }
  }

  async disconnect() {
    this.isConnected = false;
    this.qrCodeData = null;
    this.sessionData = null;
    
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    
    this.emit('disconnected');
  }
}

export const whatsAppService = new WhatsAppService();