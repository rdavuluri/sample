import { Message, Topic } from '../types/chat';
import { toast } from 'sonner';
import { getModelConfig } from '../utils/gptConfig';
import { parseSSEResponse } from '../utils/sseParser';

export class GPTService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    topic: Topic,
    messages: Message[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.apiKey) {
      toast.error('API key is missing. Please check your environment variables.');
      throw new Error('API key is required');
    }

    const config = getModelConfig(topic.model);
    const systemPrompt = topic.systemPrompt || 
      `You are a highly capable ${topic.model} assistant specialized in: ${topic.name}. 
       Provide detailed, accurate, and well-structured responses.`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }))
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: config.modelId,
          messages: formattedMessages,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Failed to generate response';
        
        if (errorData.error?.code === 'model_not_available') {
          toast.error('GPT-4 is currently not available. Please try again later or switch to GPT-3.5.');
        } else {
          toast.error(errorMessage);
        }
        
        throw new Error(errorMessage);
      }

      return await parseSSEResponse(response, onChunk);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to OpenAI API';
      
      if (errorMessage.includes('insufficient_quota')) {
        toast.error('API quota exceeded. Please check your OpenAI account.');
      } else if (errorMessage.includes('invalid_api_key')) {
        toast.error('Invalid API key. Please check your environment variables.');
      } else {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  }

  validateApiKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.startsWith('sk-') && this.apiKey.length > 20);
  }
}

export const gptService = new GPTService(import.meta.env.VITE_OPENAI_API_KEY);
