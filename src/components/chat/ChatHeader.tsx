import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Topic } from '../../types/chat';
import { format } from 'date-fns';

interface ChatHeaderProps {
  topic: Topic;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ topic }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <MessageSquare className="h-6 w-6 text-indigo-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{topic.name}</h2>
            <p className="text-sm text-gray-500">
              Created on {format(new Date(topic.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {topic.model}
          </span>
          {topic.sessionExpiresAt && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active Session
            </span>
          )}
        </div>
      </div>
    </div>
  );
};