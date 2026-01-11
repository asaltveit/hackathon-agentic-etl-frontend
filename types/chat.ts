// types/chat.ts
import { EvidenceReference } from './evidence';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  answer?: ChatAnswer;
}

export interface ChatAnswer {
  text: string;
  citations: Citation[];
  hasEvidence: boolean;
}

export interface Citation {
  id: string;
  number: number;
  reference: EvidenceReference;
  label: string;
}
