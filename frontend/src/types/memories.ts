export interface PersonalMemory {
  id: string;
  memory_text: string;
  original_input?: string;
  category: string;
  subject?: string;
  source: string;
  confidence: number;
  event_date?: string;
  conversation_timestamp: string;
  updated_at: string;
  is_active: boolean;
  metadata?: Record<string, any>;
}

export interface PersonalVocabulary {
  id: string;
  term: string;
  misrecognitions: string[];
  category: string;
  created_at: string;
  times_used: number;
}

export interface BirthdayConfig {
  creator_name: string;
  recipient_name: string;
  greeting_title: string;
  love_letter: string;
  surprise_message: string;
  birthday_date: string;
  background_music_enabled: boolean;
  theme: string;
  updated_at?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  file_path: string;
  file_hash: string;
  page_count: number;
  chunk_count: number;
  status: string;
  created_at: string;
}

export interface DocumentStatus {
  total_documents: number;
  indexed_documents: number;
  total_vectors_in_store: number;
  collection_name: string;
  documents: DocumentItem[];
}
