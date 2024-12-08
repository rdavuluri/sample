export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  expiresAt: Date;
  userId: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}