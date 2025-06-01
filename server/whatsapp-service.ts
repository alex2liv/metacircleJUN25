import QRCode from 'qrcode';

export class WhatsAppService {
  private qrCodeData: string | null = null;
  private isConnected: boolean = false;

  async generateQRCode(): Promise<string> {
    try {
      // Gerar QR Code no formato WhatsApp Web
      // Este é o formato usado pelo WhatsApp Web para autenticação
      const sessionId = Math.random().toString(36).substring(2, 15);
      const timestamp = Date.now();
      
      // Formato similar ao WhatsApp Web (base64 encoded session data)
      const sessionData = `1@${sessionId},${timestamp},MetaSync-AB7`;
      const encodedData = Buffer.from(sessionData).toString('base64');
      
      const qrCodeImage = await QRCode.toDataURL(encodedData, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      this.qrCodeData = qrCodeImage;
      
      // Simular conexão após 3 segundos
      setTimeout(() => {
        this.isConnected = true;
      }, 3000);
      
      return qrCodeImage;
    } catch (error) {
      throw new Error(`Erro ao gerar QR Code: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async sendMessage(number: string, message: string): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('WhatsApp não está conectado');
    }

    try {
      // Simular envio de mensagem
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Simulando envio para ${number}: ${message}`);
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
    this.isConnected = false;
    this.qrCodeData = null;
  }
}

export const whatsAppService = new WhatsAppService();