// types/modern-bee.ts — ADD these types

export type ContextCardId = 'definition' | 'sentence1' | 'sentence2' | 'fullContext';

export interface ContextCardConfig {
  id: ContextCardId;
  label: string;               // Button label e.g. "Definition"
  icon: string;                // Tabler icon name e.g. "ti-book-2"
  iconColorClass: string;      // Tailwind class e.g. "text-purple-400"
  accentClass: string;         // Border/bg accent on expand e.g. "border-purple-500/30"
  content: ContextCardContent;
}

export interface ContextCardContent {
  // Definition card
  definition?: string;
  partOfSpeech?: string;

  // Sentence cards
  sentence?: string;
  sentenceNumber?: 1 | 2;

  // Full context card
  situationalPrompt?: string;
  formalSynonym?: string;
  millennialCrossRef?: string;
  stressPattern?: string;
  pronunciation?: string;
  category?: string;
  difficultyScore?: number;
}

export interface WordDisplayData {
  // These come from the API — targetWord is NEVER included for students during exam
  wordId: string;
  targetWord?: string;          // Optional: only for admin/local simulation
  group: 'group1' | 'group2' | 'group3';
  partOfSpeech: string;
  difficultyScore: number;
  category: string;
  stressPattern: string;
  pronunciation: string;
  definition: string;
  exampleSentence1: string;
  exampleSentence2: string;
  situationalPrompt: string;
  formalSynonym: string;
  millennialCrossRef: string;
  audioUrlHighQuality: string;  // ElevenLabs pre-generated mp3
  audioUrl: string;             // Standard quality fallback
  ttsOverrideText: string;      // Phonetic respelling for TTS
  timeLimit: number;            // seconds
  livesRemaining: number;
  index: number;
  total: number;
}
