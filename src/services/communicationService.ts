
import { Communication } from '@/types/debt';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: any[];
  };
}

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
}

export class CommunicationService {
  private whatsappApiUrl = 'https://graph.facebook.com/v18.0';
  private twilioApiUrl = 'https://api.twilio.com/2010-04-01';

  async sendWhatsAppMessage(message: WhatsAppMessage, accessToken: string): Promise<Communication> {
    try {
      const response = await fetch(`${this.whatsappApiUrl}/YOUR_PHONE_NUMBER_ID/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to send WhatsApp message');
      }

      return {
        id: result.messages[0].id,
        debtorId: '', // This would be mapped from the phone number
        channel: 'whatsapp',
        direction: 'outbound',
        content: message.text?.body || 'Template message sent',
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
    } catch (error) {
      console.error('WhatsApp send error:', error);
      throw error;
    }
  }

  async sendSMS(message: SMSMessage, accountSid: string, authToken: string): Promise<Communication> {
    try {
      const formData = new URLSearchParams();
      formData.append('To', message.to);
      formData.append('Body', message.body);
      formData.append('From', message.from || 'YOUR_TWILIO_NUMBER');

      const response = await fetch(`${this.twilioApiUrl}/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send SMS');
      }

      return {
        id: result.sid,
        debtorId: '', // This would be mapped from the phone number
        channel: 'sms',
        direction: 'outbound',
        content: message.body,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }

  async sendBulkWhatsApp(messages: WhatsAppMessage[], accessToken: string): Promise<Communication[]> {
    const results: Communication[] = [];
    
    for (const message of messages) {
      try {
        const result = await this.sendWhatsAppMessage(message, accessToken);
        results.push(result);
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Bulk WhatsApp error for message:', message, error);
      }
    }
    
    return results;
  }

  async sendBulkSMS(messages: SMSMessage[], accountSid: string, authToken: string): Promise<Communication[]> {
    const results: Communication[] = [];
    
    for (const message of messages) {
      try {
        const result = await this.sendSMS(message, accountSid, authToken);
        results.push(result);
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Bulk SMS error for message:', message, error);
      }
    }
    
    return results;
  }

  getWhatsAppTemplates() {
    return [
      {
        name: 'payment_reminder',
        displayName: 'Payment Reminder',
        content: 'Hi {{1}}, this is a reminder about your payment of ${{2}} due on {{3}}. Please contact us to arrange payment.',
        variables: ['name', 'amount', 'due_date']
      },
      {
        name: 'payment_overdue',
        displayName: 'Payment Overdue',
        content: 'Dear {{1}}, your payment of ${{2}} is now overdue. Please contact us immediately to resolve this matter.',
        variables: ['name', 'amount']
      },
      {
        name: 'settlement_offer',
        displayName: 'Settlement Offer',
        content: 'Hi {{1}}, we have a special settlement offer for your account. Pay ${{2}} by {{3}} to settle your balance of ${{4}}.',
        variables: ['name', 'settlement_amount', 'deadline', 'total_amount']
      }
    ];
  }

  getSMSTemplates() {
    return [
      {
        name: 'payment_reminder',
        displayName: 'Payment Reminder',
        content: 'Payment reminder: ${{amount}} due {{due_date}}. Call {{phone}} to discuss. Reply STOP to opt out.',
        variables: ['amount', 'due_date', 'phone']
      },
      {
        name: 'urgent_payment',
        displayName: 'Urgent Payment',
        content: 'URGENT: ${{amount}} payment overdue. Contact us today to avoid collection action. {{phone}}',
        variables: ['amount', 'phone']
      },
      {
        name: 'payment_plan',
        displayName: 'Payment Plan Offer',
        content: 'Payment plan available for ${{amount}} balance. Call {{phone}} to discuss options.',
        variables: ['amount', 'phone']
      }
    ];
  }
}

export const communicationService = new CommunicationService();
