import React from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { Message } from '../../types/chat';

interface ChatContainerProps {
  title: string;
  subtitle: string;
  messages: Message[];
  onSendMessage?: (message: string) => void;
  isGenerating?: boolean;
  currentResponse?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  title,
  subtitle,
  messages,
  onSendMessage,
  isGenerating,
  currentResponse,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} />
        {currentResponse && (
          <div className="p-4">
            <div className="max-w-[70%] bg-gray-100 rounded-lg p-4 text-gray-900">
              <p className="whitespace-pre-wrap">{currentResponse}</p>
            </div>
          </div>
        )}
      </div>
      {onSendMessage && (
        <ChatInput onSendMessage={onSendMessage} disabled={isGenerating} />
      )}
      {isGenerating && !currentResponse && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-pulse text-gray-500">Generating response...</div>
          </div>
        </div>
      )}
    </div>
  );
};