import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyTopicStateProps {
  onCreateTopic: () => void;
}

export const EmptyTopicState: React.FC<EmptyTopicStateProps> = ({ onCreateTopic }) => {
  return (
    <div className="col-span-12 flex items-center justify-center mt-8">
      <div className="text-center max-w-md px-8">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Select a Topic to Start Chatting
        </h3>
        <p className="text-gray-500 mb-6">
          Choose an existing topic from the list or create a new one to begin your conversation
        </p>
        <button
          onClick={onCreateTopic}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Topic
        </button>
      </div>
    </div>
  );
};