import QRCode from 'qrcode';

export class WhatsAppService {
  private qrCodeData: string | null = null;
  private isConnected: boolean = false;

  async generateQRCode(): Promise<string> {
    try {
      // Gerar QR Code real que pode ser usado para demonstração
      // Este QR Code contém dados únicos para cada sessão
      const sessionData = {
        timestamp: Date.now(),
        sessionId: Math.random().toString(36).substring(2, 15),
        company: 'AB7',
        platform: 'MetaSync'
      };
      
      const qrText = JSON.stringify(sessionData);
      
      const qrCodeImage = await QRCode.toDataURL(qrText, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      this.qrCodeData = qrCodeImage;
      
      // Simular tempo de geração real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return qrCodeImage;
    } catch (error) {
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
      const chatId = `${formattedNumber}@c.us`;
      
      await this.client.sendMessage(chatId, message);
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
          error: error.message 
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

  onStatusChange(callback: (status: string) => void) {
    this.statusCallback = callback;
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isConnected = false;
      this.qrCodeData = null;
    }
  }
}

export const whatsAppService = new WhatsAppService();