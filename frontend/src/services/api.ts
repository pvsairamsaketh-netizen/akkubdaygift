import type { ConversationSummary, ConversationDetail } from '../types/chat';
import type { VoiceStatus, VoiceChatResponse } from '../types/voice';

const isLocalDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.hostname === 'localhost' && window.location.port !== '80');
const API_BASE = import.meta.env.VITE_API_URL || (isLocalDev ? 'http://localhost:8000/api' : '/api');

export function getUserId(): string {
  try {
    return localStorage.getItem('akku_user_id') || 'default_user';
  } catch {
    return 'default_user';
  }
}

export function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    'X-User-ID': getUserId(),
    ...extraHeaders
  };
}

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health/`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Conversations
  async getConversations(): Promise<ConversationSummary[]> {
    const res = await fetch(`${API_BASE}/conversations/`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load conversations");
    return res.json();
  },

  async createConversation(title?: string): Promise<ConversationSummary> {
    const res = await fetch(`${API_BASE}/conversations/`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title: title || "New Relationship Memory" })
    });
    if (!res.ok) throw new Error("Failed to create conversation");
    return res.json();
  },

  async getConversation(id: string): Promise<ConversationDetail> {
    const res = await fetch(`${API_BASE}/conversations/${id}/`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load conversation messages");
    return res.json();
  },

  async renameConversation(id: string, title: string): Promise<ConversationSummary> {
    const res = await fetch(`${API_BASE}/conversations/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ title })
    });
    if (!res.ok) throw new Error("Failed to rename conversation");
    return res.json();
  },

  async deleteConversation(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/conversations/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete conversation");
  },

  // Chat
  async sendChat(
    question: string,
    conversation_id?: string,
    top_k?: number,
    min_relevance?: number
  ) {
    const res = await fetch(`${API_BASE}/chat/`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ question, conversation_id, top_k, min_relevance, user_id: getUserId() })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to send chat message");
    }
    return res.json();
  },

  async sendChatStream(
    question: string,
    conversation_id?: string,
    callbacks?: {
      onContext?: (data: any) => void;
      onToken?: (token: string) => void;
      onDone?: (data: any) => void;
      onError?: (err: Error) => void;
    }
  ) {
    const res = await fetch(`${API_BASE}/chat/stream/`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ question, conversation_id, user_id: getUserId() })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to start streaming chat");
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("ReadableStream not supported");
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const eventStr of events) {
        if (!eventStr.trim()) continue;
        let eventName = 'message';
        let dataStr = '';

        for (const line of eventStr.split('\n')) {
          if (line.startsWith('event: ')) {
            eventName = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            dataStr = line.slice(6).trim();
          }
        }

        try {
          const parsed = JSON.parse(dataStr);
          if (eventName === 'context') {
            callbacks?.onContext?.(parsed);
          } else if (eventName === 'token') {
            callbacks?.onToken?.(parsed.token);
          } else if (eventName === 'done') {
            callbacks?.onDone?.(parsed);
          } else if (eventName === 'error') {
            callbacks?.onError?.(new Error(parsed.error));
          }
        } catch {
          // ignore parsing error
        }
      }
    }
  },

  // Voice
  async transcribeAudio(audioBlob: Blob, language: string = 'auto'): Promise<{ text: string; language: string }> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);

    const res = await fetch(`${API_BASE}/voice/transcribe/`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to transcribe audio");
    }
    return res.json();
  },

  async voiceChat(
    audioBlob: Blob,
    conversation_id?: string,
    synthesize_voice: boolean = true,
    voice_preset: string = 'af_heart'
  ): Promise<VoiceChatResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    if (conversation_id) formData.append('conversation_id', conversation_id);
    formData.append('synthesize_voice', String(synthesize_voice));
    formData.append('voice_preset', voice_preset);

    const res = await fetch(`${API_BASE}/voice/chat/`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to process voice chat");
    }
    return res.json();
  },

  async speakText(text: string, voice: string = 'af_heart', speed: number = 1.0): Promise<{ audio_url: string }> {
    const res = await fetch(`${API_BASE}/voice/speak/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, speed })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "TTS synthesis failed");
    }
    return res.json();
  },

  async getVoiceStatus(): Promise<VoiceStatus> {
    const res = await fetch(`${API_BASE}/voice/status/`);
    if (!res.ok) throw new Error("Failed to fetch voice status");
    return res.json();
  },

  // Document Management
  async getDocumentStatus() {
    const res = await fetch(`${API_BASE}/documents/status/`);
    if (!res.ok) throw new Error("Failed to fetch document status");
    return res.json();
  },

  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/documents/ingest/`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to upload document");
    }
    return res.json();
  },

  async deleteDocument(id: string) {
    const res = await fetch(`${API_BASE}/documents/${id}/`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error("Failed to delete document");
    return res.json();
  },

  async reindexDocuments() {
    const res = await fetch(`${API_BASE}/documents/reindex/`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error("Failed to reindex documents");
    return res.json();
  },

  // Personal Memories
  async getMemories(params?: { category?: string; search?: string }): Promise<{ total_memories: number; memories: any[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/memories/?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch memories");
    return res.json();
  },

  async createMemory(data: { memory_text: string; category?: string; subject?: string; event_date?: string }) {
    const res = await fetch(`${API_BASE}/memories/`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ ...data, user_id: getUserId() })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.detail || "Failed to save memory");
    }
    return res.json();
  },

  async updateMemory(id: string, data: { memory_text?: string; category?: string; subject?: string; event_date?: string }) {
    const res = await fetch(`${API_BASE}/memories/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ ...data, user_id: getUserId() })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.detail || "Failed to update memory");
    }
    return res.json();
  },

  async deleteMemory(id: string) {
    const res = await fetch(`${API_BASE}/memories/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.detail || "Failed to delete memory");
    }
    return res.json();
  },

  async clearAllMemories() {
    const res = await fetch(`${API_BASE}/memories/clear/`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ user_id: getUserId() })
    });
    if (!res.ok) throw new Error("Failed to clear memories");
    return res.json();
  },

  // Personal Vocabulary
  async getVocabulary(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/memories/vocabulary/`);
    if (!res.ok) throw new Error("Failed to fetch personal vocabulary");
    return res.json();
  },

  async addVocabulary(term: string, misrecognitions: string[] = [], category: string = 'name') {
    const res = await fetch(`${API_BASE}/memories/vocabulary/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term, misrecognitions, category })
    });
    if (!res.ok) throw new Error("Failed to add vocabulary");
    return res.json();
  },

  async deleteVocabulary(id: string) {
    const res = await fetch(`${API_BASE}/memories/vocabulary/${id}/`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error("Failed to delete vocabulary");
    return res.json();
  },

  // Birthday Configuration
  async getBirthdayConfig(): Promise<any> {
    const res = await fetch(`${API_BASE}/memories/birthday-config/`);
    if (!res.ok) throw new Error("Failed to fetch birthday configuration");
    return res.json();
  },

  async updateBirthdayConfig(data: Partial<any>): Promise<any> {
    const res = await fetch(`${API_BASE}/memories/birthday-config/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update birthday configuration");
    return res.json();
  },

  // Academics - Data Engineering Academy API
  academics: {
    async executeSQL(query: string, expected_sql?: string) {
      const res = await fetch(`${API_BASE}/academics/sql/execute/`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ query, expected_sql, user_id: getUserId() })
      });
      return res.json();
    },

    async getSQLSchema() {
      const res = await fetch(`${API_BASE}/academics/sql/schema/`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch SQL schema");
      return res.json();
    },

    async resetSQLDatabase() {
      const res = await fetch(`${API_BASE}/academics/sql/reset/`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' })
      });
      return res.json();
    },

    async getSQLHistory() {
      const res = await fetch(`${API_BASE}/academics/sql/history/`, {
        headers: getAuthHeaders()
      });
      return res.json();
    },

    async runCode(code: string, stdin_input: string = '', test_cases?: any[], timeout_seconds: number = 5.0) {
      const res = await fetch(`${API_BASE}/academics/code/run/`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ code, stdin_input, test_cases, timeout_seconds, user_id: getUserId() })
      });
      return res.json();
    },

    async getNotes(params?: { category?: string; day_number?: number; search?: string }) {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.set('category', params.category);
      if (params?.day_number !== undefined) queryParams.set('day_number', String(params.day_number));
      if (params?.search) queryParams.set('search', params.search);

      const res = await fetch(`${API_BASE}/academics/notes/?${queryParams.toString()}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      return res.json();
    },

    async createNote(note: any) {
      const res = await fetch(`${API_BASE}/academics/notes/`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ ...note, user_id: getUserId() })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create note");
      }
      return res.json();
    },

    async updateNote(noteId: string, note: any) {
      const res = await fetch(`${API_BASE}/academics/notes/${noteId}/`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ ...note, user_id: getUserId() })
      });
      if (!res.ok) throw new Error("Failed to update note");
      return res.json();
    },

    async deleteNote(noteId: string) {
      const res = await fetch(`${API_BASE}/academics/notes/${noteId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete note");
      return res.json();
    },

    async getProgress() {
      const res = await fetch(`${API_BASE}/academics/progress/`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch academic progress");
      return res.json();
    },

    async updateProgress(data: any) {
      const res = await fetch(`${API_BASE}/academics/progress/`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ ...data, user_id: getUserId() })
      });
      if (!res.ok) throw new Error("Failed to update academic progress");
      return res.json();
    }
  }
};
