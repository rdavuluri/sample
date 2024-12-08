import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, Settings, Trash2 } from 'lucide-react';
import { useTopicStore } from '../../store/topicStore';
import type { Topic } from '../../types/chat';

interface TopicsListProps {
  onConfigClick: () => void;
}

export const TopicsList: React.FC<TopicsListProps> = ({ onConfigClick }) => {
  const { topics, selectTopic, deleteTopic } = useTopicStore();

  const handleDelete = (e: React.MouseEvent, topic: Topic) => {
    e.stopPropagation();
    deleteTopic(topic.id);
  };

  if (topics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No topics yet. Create one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {topics.map((topic) => (
        <div
          key={topic.id}
          onClick={() => selectTopic(topic.id)}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="font-medium text-gray-900">{topic.name}</h3>
              <p className="text-sm text-gray-500">
                {format(new Date(topic.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                selectTopic(topic.id);
                onConfigClick();
              }}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => handleDelete(e, topic)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};