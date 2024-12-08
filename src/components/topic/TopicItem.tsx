import React from 'react';
import { MessageSquare, Settings, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Topic } from '../../types/chat';

interface TopicItemProps {
  topic: Topic;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onConfig: () => void;
}

export const TopicItem: React.FC<TopicItemProps> = ({
  topic,
  isSelected,
  onSelect,
  onDelete,
  onConfig,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleConfig = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfig();
  };

  return (
    <div
      onClick={onSelect}
      className={`
        flex items-center justify-between p-4 rounded-lg cursor-pointer
        transition-all duration-200 ease-in-out
        ${
          isSelected
            ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm'
            : 'bg-white hover:bg-gray-50 border-2 border-transparent'
        }
      `}
    >
      <div className="flex items-center space-x-4">
        <MessageSquare
          className={`h-5 w-5 ${
            isSelected ? 'text-indigo-600' : 'text-gray-400'
          }`}
        />
        <div>
          <h3 className={`font-medium ${
            isSelected ? 'text-indigo-900' : 'text-gray-900'
          }`}>
            {topic.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500">
              {format(new Date(topic.createdAt), 'MMM d, yyyy')}
            </span>
            {topic.sessionExpiresAt && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Active Session
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={handleConfig}
          className={`p-2 rounded-full hover:bg-white/50 transition-colors ${
            isSelected ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'
          }`}
          title="Configure Topic"
        >
          <Settings className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete Topic"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
