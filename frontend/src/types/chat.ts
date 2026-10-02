export interface Citation {
  id: number;
  chunk_id: string;
  page_number: number | string;
  email_subject?: string | null;
  email_date?: string | null;
  relevance_score: number;
  snippet: string;
}

export interface Message {
  id: string;
  conversation?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
  metadata?: {
    citations?: Citation[];
    latency_seconds?: number;
    model?: string;
    audio_url?: string;
    chunks_count?: number;
    [key: string]: any;
  };
}

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ConversationDetail extends ConversationSummary {
  messages: Message[];
}
