export type ModelType = 'GPT-4o' | 'GPT-4' | 'GPT-3.5' | 'GPT-O1' | 'Custom';

export interface Topic {
  id: string;
  name: string;
  model: ModelType;
  systemPrompt: string;
  autoScroll: boolean;
  enableSuggestions: boolean;
  createdAt: Date;
  userId: string;
  sessionTimeout?: number;
  shareLink?: string;
  sessionExpiresAt?: Date;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  topicId: string;
}

export interface TopicSession {
  topicId: string;
  expiresAt: Date;
}