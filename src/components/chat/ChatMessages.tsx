import React from 'react';
import { format } from 'date-fns';
import { Message } from '../../types/chat';

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-4 ${
              message.type === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            <span
              className={`text-xs ${
                message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
              } block mt-2`}
            >
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};