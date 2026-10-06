import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types/chat';
import { api } from '../services/api';

export function useChat(activeConversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversationMessages = useCallback(async () => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await api.getConversation(activeConversationId);
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeConversationId]);

  useEffect(() => {
    loadConversationMessages();
  }, [loadConversationMessages]);

  const sendMessage = async (
    question: string,
    autoSpeak: boolean = false,
    onSpeechReady?: (audioUrl: string) => void,
    onAnswerReady?: (answer: string) => void
  ) => {
    if (!question.trim() || loading) return;

    // Create optimistic user message
    const tempUserMsg: Message = {
      id: `temp_user_${Date.now()}`,
      role: 'user',
      content: question.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);
    setError(null);

    const tempAsstId = `stream_asst_${Date.now()}`;
    let accumulatedContent = '';
    let citations: any[] = [];
    let personalMemories: any[] = [];

    try {
      let streamed = false;
      await api.sendChatStream(
        question.trim(),
        activeConversationId || undefined,
        {
          onContext: (data) => {
            streamed = true;
            citations = data.citations || [];
            personalMemories = data.personal_memories || [];
            setMessages(prev => {
              if (prev.some(m => m.id === tempAsstId)) return prev;
              return [...prev, {
                id: tempAsstId,
                role: 'assistant',
                content: '',
                created_at: new Date().toISOString(),
                metadata: {
                  citations,
                  personal_memories: personalMemories,
                  model: data.model || 'Qwen 3.8 8B'
                }
              }];
            });
          },
          onToken: (token) => {
            streamed = true;
            accumulatedContent += token;
            setMessages(prev => {
              const index = prev.findIndex(m => m.id === tempAsstId);
              if (index === -1) {
                return [...prev, {
                  id: tempAsstId,
                  role: 'assistant',
                  content: accumulatedContent,
                  created_at: new Date().toISOString(),
                  metadata: {
                    citations,
                    personal_memories: personalMemories,
                    model: 'Qwen 3.8 8B'
                  }
                }];
              }
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                content: accumulatedContent
              };
              return updated;
            });
          },
          onDone: (data) => {
            streamed = true;
            setMessages(prev => {
              const index = prev.findIndex(m => m.id === tempAsstId);
              const finalMsg: Message = {
                id: data.assistant_message_id || tempAsstId,
                conversation: data.conversation_id,
                role: 'assistant',
                content: data.answer || accumulatedContent,
                created_at: new Date().toISOString(),
                metadata: {
                  citations: data.citations || citations,
                  personal_memories: data.personal_memories || personalMemories,
                  latency_seconds: data.latency,
                  model: data.model || 'Qwen 3.8 8B'
                }
              };
              if (index === -1) return [...prev, finalMsg];
              const updated = [...prev];
              updated[index] = finalMsg;
              return updated;
            });

            const finalAnswer = data.answer || accumulatedContent;
            if (onAnswerReady && finalAnswer) {
              onAnswerReady(finalAnswer);
            }

            if (autoSpeak && finalAnswer) {
              api.speakText(finalAnswer)
                .then(ttsRes => {
                  if (ttsRes?.audio_url && onSpeechReady) {
                    onSpeechReady(ttsRes.audio_url);
                  }
                })
                .catch(err => console.warn("Auto-speak failed:", err));
            }
          },
          onError: (err) => {
            throw err;
          }
        }
      );

      if (!streamed) {
        // Fallback to sync sendChat
        const res = await api.sendChat(question.trim(), activeConversationId || undefined);
        const assistantMsg: Message = {
          id: res.assistant_message_id,
          conversation: res.conversation_id,
          role: 'assistant',
          content: res.answer,
          created_at: new Date().toISOString(),
          metadata: {
            citations: res.citations,
            latency_seconds: res.latency,
            model: res.model
          }
        };
        setMessages(prev => [...prev.filter(m => m.id !== tempAsstId), assistantMsg]);
        if (onAnswerReady && res.answer) {
          onAnswerReady(res.answer);
        }
        if (autoSpeak && res.answer && onSpeechReady) {
          api.speakText(res.answer).then(ttsRes => {
            if (ttsRes?.audio_url) onSpeechReady(ttsRes.audio_url);
          }).catch(console.warn);
        }
      }
    } catch (err: any) {
      console.warn("Stream error, falling back to sync:", err);
      try {
        const res = await api.sendChat(question.trim(), activeConversationId || undefined);
        const assistantMsg: Message = {
          id: res.assistant_message_id,
          conversation: res.conversation_id,
          role: 'assistant',
          content: res.answer,
          created_at: new Date().toISOString(),
          metadata: {
            citations: res.citations,
            latency_seconds: res.latency,
            model: res.model
          }
        };
        setMessages(prev => [...prev.filter(m => m.id !== tempAsstId), assistantMsg]);
      } catch (fallbackErr: any) {
        setError(fallbackErr.message);
        const errorMsg: Message = {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `I encountered an issue processing your question: ${fallbackErr.message}.`,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev.filter(m => m.id !== tempAsstId), errorMsg]);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    reloadMessages: loadConversationMessages
  };
}
