import { create } from 'zustand';
import { Topic, ModelType } from '../types/chat';
import { toast } from 'sonner';

interface TopicState {
  topics: Topic[];
  selectedTopic: Topic | null;
  addTopic: (name: string, model: ModelType) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  selectTopic: (id: string) => void;
  activateSession: (id: string, timeoutMinutes: number) => void;
  deactivateSession: (id: string) => void;
}

export const useTopicStore = create<TopicState>((set) => ({
  topics: [],
  selectedTopic: null,
  addTopic: (name, model) => {
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      name,
      model,
      systemPrompt: '',
      autoScroll: true,
      enableSuggestions: true,
      createdAt: new Date(),
      userId: '1',
    };

    set((state) => ({
      topics: [...state.topics, newTopic],
    }));
  },
  updateTopic: (id, updates) => {
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === id ? { ...topic, ...updates } : topic
      ),
      selectedTopic:
        state.selectedTopic?.id === id
          ? { ...state.selectedTopic, ...updates }
          : state.selectedTopic,
    }));
  },
  deleteTopic: (id) => {
    set((state) => ({
      topics: state.topics.filter((topic) => topic.id !== id),
      selectedTopic:
        state.selectedTopic?.id === id ? null : state.selectedTopic,
    }));
  },
  selectTopic: (id) => {
    set((state) => ({
      selectedTopic: state.topics.find((topic) => topic.id === id) || null,
    }));
  },
  activateSession: (id, timeoutMinutes) => {
    const expiresAt = new Date(Date.now() + timeoutMinutes * 60 * 1000);
    const shareLink = `${window.location.origin}/share/${id}`;

    set((state) => {
      const updatedTopics = state.topics.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              sessionTimeout: timeoutMinutes,
              shareLink,
              sessionExpiresAt: expiresAt,
            }
          : topic
      );

      const updatedSelectedTopic = state.selectedTopic?.id === id
        ? {
            ...state.selectedTopic,
            sessionTimeout: timeoutMinutes,
            shareLink,
            sessionExpiresAt: expiresAt,
          }
        : state.selectedTopic;

      toast.success('Session activated successfully');
      
      return {
        topics: updatedTopics,
        selectedTopic: updatedSelectedTopic,
      };
    });
  },
  deactivateSession: (id) => {
    set((state) => {
      const updatedTopics = state.topics.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              sessionTimeout: undefined,
              shareLink: undefined,
              sessionExpiresAt: undefined,
            }
          : topic
      );

      const updatedSelectedTopic = state.selectedTopic?.id === id
        ? {
            ...state.selectedTopic,
            sessionTimeout: undefined,
            shareLink: undefined,
            sessionExpiresAt: undefined,
          }
        : state.selectedTopic;

      toast.success('Session deactivated');
      
      return {
        topics: updatedTopics,
        selectedTopic: updatedSelectedTopic,
      };
    });
  },
}));