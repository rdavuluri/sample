import React, { useState } from 'react';
import { Header } from '../layout/Header';
import { TopicsSection } from '../topics/TopicsSection';
import { AddTopicDialog } from './AddTopicDialog';
import { TopicConfig } from './TopicConfig';
import { ChatSection } from '../chat/ChatSection';
import { EmptyTopicState } from '../topics/EmptyTopicState';
import { ConfigurationManager } from '../config/ConfigurationManager';
import { ShareTestingGuide } from '../share/ShareTestingGuide';
import { useTopicStore } from '../../store/topicStore';
import { Toaster } from 'sonner';

export const Dashboard: React.FC = () => {
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showModelConfig, setShowModelConfig] = useState(false);
  const [showShareGuide, setShowShareGuide] = useState(false);
  const { selectedTopic } = useTopicStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header 
        onConfigClick={() => setShowModelConfig(true)} 
        onShareGuideClick={() => setShowShareGuide(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showModelConfig ? (
          <ConfigurationManager onBack={() => setShowModelConfig(false)} />
        ) : showShareGuide ? (
          <div className="space-y-6">
            <button
              onClick={() => setShowShareGuide(false)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <span className="mr-2">←</span> Back to Dashboard
            </button>
            <ShareTestingGuide />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            <div className={`${selectedTopic ? 'col-span-4' : 'col-span-12'} transition-all duration-300`}>
              <TopicsSection
                onAddTopic={() => setIsAddTopicOpen(true)}
                onConfigTopic={() => setShowConfig(true)}
              />
            </div>

            {selectedTopic && (
              <div className="col-span-8 transition-all duration-300">
                {showConfig ? (
                  <TopicConfig onClose={() => setShowConfig(false)} />
                ) : (
                  <ChatSection topic={selectedTopic} />
                )}
              </div>
            )}

            {!selectedTopic && !showModelConfig && (
              <EmptyTopicState onCreateTopic={() => setIsAddTopicOpen(true)} />
            )}
          </div>
        )}
      </div>

      <AddTopicDialog
        isOpen={isAddTopicOpen}
        onClose={() => setIsAddTopicOpen(false)}
      />
    </div>
  );
};
