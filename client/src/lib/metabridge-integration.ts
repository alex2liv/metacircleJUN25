// Integração com MetaBridge para notificações WhatsApp
// Baseado na Evolution API para envio de mensagens

export interface WhatsAppNotificationConfig {
  instanceName: string;
  apiKey: string;
  baseUrl: string;
  webhookUrl?: string;
}

export interface EventNotification {
  eventId: number;
  eventTitle: string;
  eventDate: Date;
  participants: string[]; // números de telefone
  reminderType: 'immediate' | '1hour' | '1day' | '1week';
  message?: string;
}

export class MetaBridgeIntegration {
  public static readonly DEFAULT_BASE_URL = "https://metabridge-api.metasync.com.br";
  
  private config: WhatsAppNotificationConfig;

  constructor(config: WhatsAppNotificationConfig) {
    this.config = config;
  }

  /**
   * Envia notificação de evento via WhatsApp
   */
  async sendEventNotification(notification: EventNotification): Promise<boolean> {
    try {
      const message = this.formatEventMessage(notification);
      
      const promises = notification.participants.map(phoneNumber => 
        this.sendWhatsAppMessage(phoneNumber, message)
      );

      const results = await Promise.allSettled(promises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      console.log(`Notificações enviadas: ${successCount}/${notification.participants.length}`);
      return successCount > 0;
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
      return false;
    }
  }

  /**
   * Envia mensagem individual via WhatsApp
   */
  private async sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
    const url = `${this.config.baseUrl}/message/sendText/${this.config.instanceName}`;
    
    const payload = {
      number: this.formatPhoneNumber(phoneNumber),
      text: message,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
  }

  /**
   * Formata mensagem de evento
   */
  private formatEventMessage(notification: EventNotification): string {
    const eventDate = new Date(notification.eventDate);
    const dateStr = eventDate.toLocaleDateString('pt-BR');
    const timeStr = eventDate.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const reminderText = this.getReminderText(notification.reminderType);

    if (notification.message) {
      return notification.message;
    }

    return `🗓️ *Lembrete de Evento - MetaCircle*

📅 *${notification.eventTitle}*
🕒 ${dateStr} às ${timeStr}
⏰ ${reminderText}

Não perca este evento importante da nossa comunidade!

_Esta é uma mensagem automática do MetaCircle via MetaBridge_`;
  }

  /**
   * Obtém texto do lembrete baseado no tipo
   */
  private getReminderText(type: EventNotification['reminderType']): string {
    switch (type) {
      case 'immediate':
        return 'O evento começou agora!';
      case '1hour':
        return 'O evento começa em 1 hora';
      case '1day':
        return 'O evento é amanhã';
      case '1week':
        return 'O evento é na próxima semana';
      default:
        return 'Lembrete do evento';
    }
  }

  /**
   * Formatar número de telefone para o padrão brasileiro
   */
  private formatPhoneNumber(phone: string): string {
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Adiciona código do país se não tiver
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return `55${cleaned.substring(1)}`;
    } else if (cleaned.length === 11) {
      return `55${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return cleaned;
    }
    
    return cleaned;
  }

  /**
   * Agenda notificações para um evento
   */
  async scheduleEventNotifications(
    eventId: number,
    eventTitle: string,
    eventDate: Date,
    participants: string[]
  ): Promise<void> {
    const notifications: EventNotification[] = [
      {
        eventId,
        eventTitle,
        eventDate: new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 semana antes
        participants,
        reminderType: '1week'
      },
      {
        eventId,
        eventTitle,
        eventDate: new Date(eventDate.getTime() - 24 * 60 * 60 * 1000), // 1 dia antes
        participants,
        reminderType: '1day'
      },
      {
        eventId,
        eventTitle,
        eventDate: new Date(eventDate.getTime() - 60 * 60 * 1000), // 1 hora antes
        participants,
        reminderType: '1hour'
      }
    ];

    // Aqui seria implementada a lógica de agendamento
    // Por exemplo, usando um job scheduler ou sistema de filas
    console.log('Notificações agendadas:', notifications);
  }

  /**
   * Testa a conexão com o MetaBridge
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const url = `${this.config.baseUrl}/instance/connect/${this.config.instanceName}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': this.config.apiKey,
        },
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Conexão com MetaBridge estabelecida com sucesso!'
        };
      } else {
        return {
          success: false,
          message: `Erro na conexão: ${response.status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro de rede: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
}

/**
 * Hook para usar a integração MetaBridge
 */
export function useMetaBridge() {
  // Configuração seria obtida das settings da comunidade
  const defaultConfig: WhatsAppNotificationConfig = {
    instanceName: 'metacircle-instance',
    apiKey: '', // Seria obtido das configurações
    baseUrl: MetaBridgeIntegration.DEFAULT_BASE_URL,
  };

  const metaBridge = new MetaBridgeIntegration(defaultConfig);

  const sendNotification = async (notification: EventNotification) => {
    return await metaBridge.sendEventNotification(notification);
  };

  const scheduleNotifications = async (
    eventId: number,
    eventTitle: string,
    eventDate: Date,
    participants: string[]
  ) => {
    return await metaBridge.scheduleEventNotifications(
      eventId,
      eventTitle,
      eventDate,
      participants
    );
  };

  const testConnection = async () => {
    return await metaBridge.testConnection();
  };

  return {
    sendNotification,
    scheduleNotifications,
    testConnection,
  };
}