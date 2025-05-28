import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ChatResponse {
  message: string;
  model: string;
  tokensUsed: number;
}

export async function generateChatResponse(
  userMessage: string,
  communityContext?: string,
  systemInstructions?: string
): Promise<ChatResponse> {
  try {
    const defaultInstructions = `Você é o assistente oficial do MetaCircle, uma plataforma de comunidades online moderna.

Características da plataforma:
- Três planos: Básico (chat texto), Intermediário (texto+áudio), Premium (completo+SOS)
- 14 dias de teste Premium gratuito
- Integrações: WhatsApp, YouTube, PerfectPAY, Stripe
- Sistema de pontos e gamificação
- Chat com especialistas, agendamentos, eventos
- Assistente IA configurável

Seja sempre:
- Prestativo e amigável
- Direto e claro nas respostas
- Entusiasmado com a plataforma
- Focado em ajudar o usuário

Responda em português brasileiro de forma natural e conversacional.`;

    const finalInstructions = systemInstructions || defaultInstructions;
    const contextMessage = communityContext ? `\n\nContexto da comunidade: ${communityContext}` : '';

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: finalInstructions + contextMessage
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      message: response.choices[0].message.content || "Desculpe, não consegui gerar uma resposta adequada.",
      model: response.model,
      tokensUsed: response.usage?.total_tokens || 0
    };

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Fallback para resposta básica se OpenAI falhar
    return {
      message: getFallbackResponse(userMessage),
      model: "fallback",
      tokensUsed: 0
    };
  }
}

function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes('plano') || msg.includes('preço')) {
    return `💳 **Nossos Planos:**

🥉 **Básico** - Chat apenas texto
🥈 **Intermediário** - Chat texto + áudio  
👑 **Premium** - Acesso completo + SOS

🎁 **14 dias Premium grátis** para testar!

Os preços são configurados pelo administrador da comunidade.`;
  }

  if (msg.includes('erro') || msg.includes('problema')) {
    return `🔧 **Vamos resolver!**

**Teste primeiro:**
✅ Atualizar página (F5)
✅ Limpar cache do navegador

**Suporte direto:**
📱 WhatsApp: 17997337322
📧 Email: suporte@metasync.com.br`;
  }

  return `Olá! 😊 Como posso ajudar você hoje?

💳 **"planos"** - Ver recursos e preços
🔧 **"problema"** - Resolver questões técnicas
📱 **WhatsApp:** 17997337322

Digite sua dúvida específica!`;
}

export async function testOpenAIConnection(): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "test" }],
      max_tokens: 10
    });
    return !!response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Connection Test Failed:', error);
    return false;
  }
}