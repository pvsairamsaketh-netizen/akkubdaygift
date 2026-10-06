import { useState, useEffect, useCallback } from 'react';
import type { ConversationSummary } from '../types/chat';
import { api } from '../services/api';

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
      setActiveId(current => {
        if (!current && data.length > 0) {
          return data[0].id;
        }
        return current;
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const createNewConversation = async (title?: string) => {
    try {
      const newConv = await api.createConversation(title || "New Memory Chat");
      setConversations(prev => [newConv, ...prev.filter(c => c.id !== newConv.id)]);
      setActiveId(newConv.id);
      return newConv;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const renameConversation = async (id: string, newTitle: string) => {
    try {
      const updated = await api.renameConversation(id, newTitle);
      setConversations(prev => prev.map(c => (c.id === id ? updated : c)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      await api.deleteConversation(id);
      setConversations(prev => {
        const remaining = prev.filter(c => c.id !== id);
        if (activeId === id) {
          setActiveId(remaining.length > 0 ? remaining[0].id : null);
        }
        return remaining;
      });
    } catch (err: any) {
      console.error("Failed to delete conversation:", err);
      setError(err.message);
    }
  };

  return {
    conversations,
    activeId,
    setActiveId,
    loading,
    error,
    refreshConversations: loadConversations,
    createNewConversation,
    renameConversation,
    deleteConversation,
  };
}
