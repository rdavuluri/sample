import { z } from 'zod';
import { GPTConfigSchema } from './gptConfig';

export const validateModelConfig = (config: unknown) => {
  try {
    return GPTConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }));
      throw new Error(`Invalid configuration: ${JSON.stringify(issues)}`);
    }
    throw error;
  }
};

export const validateTemperature = (temp: number): boolean => {
  return temp >= 0 && temp <= 2;
};

export const validateMaxTokens = (tokens: number, model: string): boolean => {
  const maxTokensMap: Record<string, number> = {
    'gpt-4': 8192,
    'gpt-3.5-turbo': 4096
  };
  return tokens > 0 && tokens <= (maxTokensMap[model] || 4096);
};