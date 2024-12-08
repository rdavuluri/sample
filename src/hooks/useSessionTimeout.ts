import { useEffect, useState } from 'react';
import { useTopicStore } from '../store/topicStore';
import { toast } from 'sonner';

export const useSessionTimeout = (topicId: string | undefined) => {
  const [isExpired, setIsExpired] = useState(false);
  const { topics, deactivateSession } = useTopicStore();

  useEffect(() => {
    if (!topicId) return;

    const topic = topics.find(t => t.id === topicId);
    if (!topic?.sessionExpiresAt) return;

    const expiresAt = new Date(topic.sessionExpiresAt);
    const now = new Date();

    if (now > expiresAt) {
      setIsExpired(true);
      deactivateSession(topicId);
      toast.error('Session has expired');
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsExpired(true);
      deactivateSession(topicId);
      toast.error('Session has expired');
    }, expiresAt.getTime() - now.getTime());

    return () => clearTimeout(timeoutId);
  }, [topicId, topics, deactivateSession]);

  return isExpired;
};