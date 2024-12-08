import React from 'react';
import { ClipboardCheck, Clock, Link2, MessageSquare } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const ShareTestingGuide: React.FC = () => {
  const steps: Step[] = [
    {
      title: 'Create a Topic',
      description: 'Start by creating a new topic with your preferred GPT model',
      icon: <MessageSquare className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: 'Activate Session',
      description: 'Go to topic settings and activate a session with a timeout (e.g., 30 minutes)',
      icon: <Clock className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: 'Copy Share Link',
      description: 'Copy the generated share link from the topic settings',
      icon: <Link2 className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: 'Test in New Window',
      description: 'Open the share link in a new private/incognito window to test the shared chat',
      icon: <ClipboardCheck className="h-6 w-6 text-indigo-600" />,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        How to Test Shared Chat
      </h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-indigo-50 rounded-full p-3">
              {step.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-1 text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> The shared chat session will automatically expire
          after the configured timeout period. You can always create a new session
          from the topic settings.
        </p>
      </div>
    </div>
  );
};