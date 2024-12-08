import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChatContainer } from '../chat/ChatContainer';
import { useTopicStore } from '../../store/topicStore';
import { ExpiredSession } from './ExpiredSession';
import { LoadingState } from '../common/LoadingState';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import { useChat } from '../../hooks/useChat';

export const ShareableChat: React.FC = () => {
  const { topicId } = useParams();
  const { topics } = useTopicStore();
  const [isLoading, setIsLoading] = useState(true);
  const isExpired = useSessionTimeout(topicId);

  const topic = topics.find(t => t.id === topicId);
  const {
    messages,
    isGenerating,
    currentResponse,
    handleSendMessage,
  } = useChat(topicId || '');

  useEffect(() => {
    if (topic) {
      setIsLoading(false);
    }
  }, [topic]);

  if (isLoading) {
    return <LoadingState message="Loading shared chat..." />;
  }

  if (!topic || isExpired) {
    return <ExpiredSession />;
  }

  const userMessages = messages.filter(msg => msg.type === 'user');
  const assistantMessages = messages.filter(msg => msg.type === 'assistant');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Shared Chat: {topic.name}
          </h1>
          <div className="grid grid-cols-2 gap-4 h-[calc(100vh-16rem)]">
            <ChatContainer
              title="Voice Input"
              subtitle="Speak or type your message"
              messages={userMessages}
              onSendMessage={(message) => handleSendMessage(message, topic.model)}
              isGenerating={isGenerating}
            />
            <ChatContainer
              title="GPT Response"
              subtitle={`Using ${topic.model}`}
              messages={assistantMessages}
              currentResponse={currentResponse}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
