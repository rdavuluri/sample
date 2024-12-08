import React from 'react';
import { Plus } from 'lucide-react';
import { TopicItem } from './TopicItem';
import { useTopicStore } from '../../store/topicStore';

interface TopicsSectionProps {
  onAddTopic: () => void;
  onConfigTopic: () => void;
}

export const TopicsSection: React.FC<TopicsSectionProps> = ({
  onAddTopic,
  onConfigTopic,
}) => {
  const { topics, selectedTopic, selectTopic, deleteTopic } = useTopicStore();

  const handleTopicSelect = (topicId: string) => {
    if (selectedTopic?.id === topicId) {
      // Deselect the topic if it's already selected
      selectTopic('');
    } else {
      selectTopic(topicId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Topics</h2>
        <button
          onClick={onAddTopic}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Topic
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {topics.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No topics yet. Create one to get started!</p>
          </div>
        ) : (
          topics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              isSelected={selectedTopic?.id === topic.id}
              onSelect={() => handleTopicSelect(topic.id)}
              onDelete={() => deleteTopic(topic.id)}
              onConfig={() => {
                selectTopic(topic.id);
                onConfigTopic();
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};