import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message } from '../types/chat';
import { api } from '../services/api';

export function useChat(activeConversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeConvRef = useRef<string | null>(activeConversationId);
  useEffect(() => {
    activeConvRef.current = activeConversationId;
  }, [activeConversationId]);

  const loadConversationMessages = useCallback(async (convId?: string | null) => {
    const idToLoad = convId !== undefined ? convId : activeConversationId;
    if (!idToLoad) {
      setMessages([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await api.getConversation(idToLoad);
      if (activeConvRef.current === idToLoad) {
        setMessages(data.messages || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeConversationId]);

  // When active conversation ID changes, immediately clear old messages
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }
    setMessages([]);
    loadConversationMessages(activeConversationId);
  }, [activeConversationId, loadConversationMessages]);

  const sendMessage = async (
    question: string,
    targetConversationId?: string | null
  ) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    const convId = targetConversationId !== undefined ? targetConversationId : activeConversationId;

    const tempUserMsgId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const tempUserMsg: Message = {
      id: tempUserMsgId,
      conversation: convId || undefined,
      role: 'user',
      content: trimmedQuestion,
      created_at: new Date().toISOString()
    };

    // Requirement 9: The assistant message must be created BEFORE streaming begins
    const tempAsstId = `asst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const initialAsstMsg: Message = {
      id: tempAsstId,
      conversation: convId || undefined,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
      metadata: {
        streaming: true,
        model: 'Qwen 3.8 8B'
      }
    };

    console.debug(`[CHAT] User query received: "${trimmedQuestion.slice(0, 50)}"`);
    console.debug(`[MODEL] Qwen request started (model: Qwen 3.8 8B)`);

    // Add both user message and initial assistant message immediately
    setMessages(prev => [...prev, tempUserMsg, initialAsstMsg]);
    setLoading(true);
    setError(null);

    let accumulatedContent = '';
    let citations: any[] = [];
    let personalMemories: any[] = [];
    let firstTokenLogged = false;

    try {
      let streamed = false;

      await api.sendChatStream(
        trimmedQuestion,
        convId || undefined,
        {
          onContext: (data) => {
            streamed = true;
            citations = data.citations || [];
            personalMemories = data.personal_memories || [];
            console.debug("[RETRIEVAL] Documents retrieved:", citations.length, "Memories:", personalMemories.length);

            setMessages(prev => prev.map(m => {
              if (m.id === tempAsstId) {
                return {
                  ...m,
                  metadata: {
                    ...m.metadata,
                    citations,
                    personal_memories: personalMemories,
                    model: data.model || 'Qwen 3.8 8B'
                  }
                };
              }
              return m;
            }));
          },
          onToken: (token) => {
            streamed = true;
            if (!firstTokenLogged) {
              console.debug("[MODEL] First token received");
              firstTokenLogged = true;
            }
            accumulatedContent += token;
            const currentText = accumulatedContent;
            console.debug(`[SSE] Chunk received. Assistant content length: ${currentText.length}`);

            // Requirement 10 & 11: Safely update assistant message using functional update
            setMessages(prev => prev.map(m => {
              if (m.id === tempAsstId) {
                return {
                  ...m,
                  content: currentText,
                  metadata: {
                    ...m.metadata,
                    streaming: true
                  }
                };
              }
              return m;
            }));
            console.debug("[FRONTEND] Assistant message updated");
          },
          onDone: (data) => {
            streamed = true;
            const finalAnswer = data.answer || accumulatedContent;
            const finalId = data.assistant_message_id || tempAsstId;
            console.debug("[CHAT] Generation completed. Final answer length:", finalAnswer.length);

            // Requirement 12: Mark message complete when streaming finishes
            setMessages(prev => prev.map(m => {
              if (m.id === tempAsstId) {
                return {
                  ...m,
                  id: finalId,
                  conversation: data.conversation_id || m.conversation,
                  content: finalAnswer,
                  metadata: {
                    ...m.metadata,
                    streaming: false,
                    citations: data.citations || citations,
                    personal_memories: data.personal_memories || personalMemories,
                    latency_seconds: data.latency,
                    model: data.model || 'Qwen 3.8 8B'
                  }
                };
              }
              return m;
            }));
          },
          onError: (err) => {
            console.error("[CHAT] SSE stream error:", err);
            // Requirement 14: Display actual error in chat UI, never silent blank
            setMessages(prev => prev.map(m => {
              if (m.id === tempAsstId) {
                return {
                  ...m,
                  content: `I encountered an issue processing your question: ${err.message}. Please try again. ❤️`,
                  metadata: {
                    ...m.metadata,
                    streaming: false,
                    error: true
                  }
                };
              }
              return m;
            }));
          }
        }
      );

      // Fallback if no SSE tokens arrived
      if (!streamed) {
        console.warn("[CHAT] Stream produced no tokens, falling back to sync endpoint");
        const res = await api.sendChat(trimmedQuestion, convId || undefined);
        const assistantMsg: Message = {
          id: res.assistant_message_id || tempAsstId,
          conversation: res.conversation_id,
          role: 'assistant',
          content: res.answer,
          created_at: new Date().toISOString(),
          metadata: {
            citations: res.citations,
            personal_memories: res.personal_memories,
            latency_seconds: res.latency,
            model: res.model,
            streaming: false
          }
        };
        setMessages(prev => prev.map(m => m.id === tempAsstId ? assistantMsg : m));
      }
    } catch (err: any) {
      console.warn("Stream error, falling back to sync:", err);
      try {
        const res = await api.sendChat(trimmedQuestion, convId || undefined);
        const assistantMsg: Message = {
          id: res.assistant_message_id || tempAsstId,
          conversation: res.conversation_id,
          role: 'assistant',
          content: res.answer,
          created_at: new Date().toISOString(),
          metadata: {
            citations: res.citations,
            personal_memories: res.personal_memories,
            latency_seconds: res.latency,
            model: res.model,
            streaming: false
          }
        };
        setMessages(prev => prev.map(m => m.id === tempAsstId ? assistantMsg : m));
      } catch (fallbackErr: any) {
        setError(fallbackErr.message);
        setMessages(prev => prev.map(m => {
          if (m.id === tempAsstId) {
            return {
              ...m,
              content: `I'm having trouble retrieving that right now: ${fallbackErr.message}. Please try again. ❤️`,
              metadata: {
                ...m.metadata,
                streaming: false,
                error: true
              }
            };
          }
          return m;
        }));
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
