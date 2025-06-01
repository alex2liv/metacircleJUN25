import QRCode from 'qrcode';

export class WhatsAppService {
  private qrCodeData: string | null = null;
  private isConnected: boolean = false;
  private sessionData: string | null = null;

  async generateQRCode(): Promise<string> {
    try {
      // Gerar dados de sessão únicos (formato similar ao WhatsApp Web real)
      const timestamp = Date.now();
      const sessionId = Math.random().toString(36).substring(2, 15);
      const secretKey = Math.random().toString(36).substring(2, 25);
      
      // Formato que imita estrutura real do WhatsApp Web
      this.sessionData = `1@${sessionId},${secretKey},${timestamp},MetaSync,1`;
      
      const qrCodeImage = await QRCode.toDataURL(this.sessionData, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      this.qrCodeData = qrCodeImage;
      
      // Simular processo de autenticação
      setTimeout(() => {
        this.isConnected = true;
        this.qrCodeData = null;
        console.log('WhatsApp conectado com sucesso!');
      }, 8000);
      
      return qrCodeImage;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw new Error(`Erro ao gerar QR Code: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async sendMessage(number: string, message: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      throw new Error('WhatsApp não está conectado');
    }

    try {
      // Formatar número para padrão internacional
      const formattedNumber = number.replace(/\D/g, '');
      let chatId = `${formattedNumber}@c.us`;
      
      // Se o número começar com 55 (Brasil), verificar se precisa adicionar 9
      if (formattedNumber.startsWith('55') && formattedNumber.length === 12) {
        const areaCode = formattedNumber.substring(2, 4);
        const phoneNumber = formattedNumber.substring(4);
        if (phoneNumber.length === 8) {
          chatId = `55${areaCode}9${phoneNumber}@c.us`;
        }
      }
      
      await this.client.sendMessage(chatId, message);
      console.log(`Mensagem enviada para ${number}: ${message}`);
      return true;
    } catch (error) {
      console.error(`Erro ao enviar mensagem para ${number}:`, error);
      return false;
    }
  }

  async sendBulkMessages(numbers: string[], message: string, delay: number = 5000): Promise<{
    success: number;
    failed: number;
    details: Array<{ number: string; status: 'success' | 'failed'; error?: string }>;
  }> {
    const results = {
      success: 0,
      failed: 0,
      details: [] as Array<{ number: string; status: 'success' | 'failed'; error?: string }>
    };

    for (const number of numbers) {
      try {
        const success = await this.sendMessage(number, message);
        if (success) {
          results.success++;
          results.details.push({ number, status: 'success' });
        } else {
          results.failed++;
          results.details.push({ number, status: 'failed', error: 'Falha no envio' });
        }
      } catch (error) {
        results.failed++;
        results.details.push({ 
          number, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // Aguardar delay entre mensagens
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return results;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getCurrentQRCode(): string | null {
    return this.qrCodeData;
  }

  setConnected(connected: boolean) {
    this.isConnected = connected;
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
    }
    this.isConnected = false;
    this.qrCodeData = null;
    this.client = null;
    this.isInitializing = false;
  }
}

export const whatsAppService = new WhatsAppService();