import { useState, useCallback } from 'react';
import { Message } from '../types/chat';
import { gptService } from '../services/gptService';
import { toast } from 'sonner';
import { isGPT4Model } from '../utils/gptConfig';

export const useChat = (topicId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const handleSendMessage = useCallback(async (content: string, model: string) => {
    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!gptService.validateApiKey()) {
      toast.error('Invalid API key configuration');
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: content.trim(),
      type: 'user',
      timestamp: new Date(),
      topicId,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);
    setCurrentResponse('');

    try {
      if (isGPT4Model(model)) {
        toast.info('Using GPT-4 model - responses may take longer to generate');
      }

      const response = await gptService.generateResponse(
        { id: topicId, model },
        [...messages, userMessage],
        (chunk) => {
          setCurrentResponse(prev => prev + chunk);
        }
      );
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        type: 'assistant',
        timestamp: new Date(),
        topicId,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentResponse('');
    } catch (error) {
      console.error('Error generating response:', error);
      if (isGPT4Model(model)) {
        toast.error('GPT-4 request failed. Consider switching to GPT-3.5 if the issue persists.');
      } else {
        toast.error('Failed to generate response. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [messages, topicId]);

  return {
    messages,
    isGenerating,
    currentResponse,
    handleSendMessage,
  };
};
