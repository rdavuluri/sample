import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Copy, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { useTopicStore } from '../../store/topicStore';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import type { Topic, ModelType } from '../../types/chat';
import { toast } from 'sonner';

interface TopicConfigForm {
  name: string;
  model: ModelType;
  systemPrompt: string;
  autoScroll: boolean;
  enableSuggestions: boolean;
}

interface TopicConfigProps {
  onClose: () => void;
}

export const TopicConfig: React.FC<TopicConfigProps> = ({ onClose }) => {
  const [sessionTimeout, setSessionTimeout] = useState('');
  const { selectedTopic, updateTopic, activateSession, deactivateSession } = useTopicStore();
  const { register, handleSubmit, reset } = useForm<TopicConfigForm>();
  const isExpired = useSessionTimeout(selectedTopic?.id);

  useEffect(() => {
    if (selectedTopic) {
      reset({
        name: selectedTopic.name,
        model: selectedTopic.model,
        systemPrompt: selectedTopic.systemPrompt,
        autoScroll: selectedTopic.autoScroll,
        enableSuggestions: selectedTopic.enableSuggestions,
      });
    }
  }, [selectedTopic, reset]);

  if (!selectedTopic) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8 text-gray-500">
          Please select a topic to view its configuration.
        </div>
      </div>
    );
  }

  const onSubmit = (data: TopicConfigForm) => {
    updateTopic(selectedTopic.id, data);
    toast.success('Topic settings updated successfully');
    onClose();
  };

  const handleActivateSession = () => {
    const timeout = parseInt(sessionTimeout, 10);
    if (isNaN(timeout) || timeout <= 0) {
      toast.error('Please enter a valid session timeout');
      return;
    }
    activateSession(selectedTopic.id, timeout);
    toast.success('Session activated successfully');
  };

  const handleDeactivateSession = () => {
    deactivateSession(selectedTopic.id);
    setSessionTimeout('');
    toast.success('Session deactivated');
  };

  const copyShareLink = () => {
    if (selectedTopic.shareLink) {
      navigator.clipboard.writeText(selectedTopic.shareLink);
      toast.success('Share link copied to clipboard');
    }
  };

  const isSessionActive = !!selectedTopic.sessionExpiresAt && !isExpired;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium text-gray-900">Topic Settings</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Topic Name
          </label>
          <input
            {...register('name')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <select
            {...register('model')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="GPT-4o">GPT-4o</option>
            <option value="GPT-4">GPT-4</option>
            <option value="GPT-3.5">GPT-3.5</option>
            <option value="GPT-O1">GPT-O1</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            System Prompt
          </label>
          <textarea
            {...register('systemPrompt')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              {...register('autoScroll')}
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Enable Auto-scroll
            </label>
          </div>

          <div className="flex items-center">
            <input
              {...register('enableSuggestions')}
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Enable Suggestions
            </label>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Session Management
          </h3>
          
          <div className="space-y-4">
            {!isSessionActive ? (
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  placeholder="Session timeout (minutes)"
                  className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleActivateSession}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Activate Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Share Link Available
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Link</span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Expires: {new Date(selectedTopic.sessionExpiresAt!).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={handleDeactivateSession}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Deactivate Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};