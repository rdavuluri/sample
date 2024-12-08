import React from 'react';
import { ChatContainer } from './ChatContainer';
import { ChatHeader } from './ChatHeader';
import { Topic } from '../../types/chat';
import { useChat } from '../../hooks/useChat';

interface ChatSectionProps {
  topic: Topic;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ topic }) => {
  const {
    messages,
    isGenerating,
    currentResponse,
    handleSendMessage,
  } = useChat(topic.id);

  const userMessages = messages.filter(msg => msg.type === 'user');
  const assistantMessages = messages.filter(msg => msg.type === 'assistant');

  return (
    <div className="space-y-4">
      <ChatHeader topic={topic} />
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-16rem)] opacity-100 transition-opacity duration-300">
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
  );
};