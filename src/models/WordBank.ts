import mongoose, { Schema, Document } from 'mongoose';

export interface IWordBank extends Document {
  targetWord: string;                    // e.g. "RIZZ"
  group: string;
  situationalPrompt: string;             // "A speaker smoothly convinces..."
  formalSynonym: string;                 // "Charisma or allure"
  millennialCrossRef: string;            // "Having smooth talking game or charm"
  pronunciation?: string;               // Phonetic spelling for pronouncer
  audioUrl?: string;                    // Cloudinary audio file URL
  difficultyScore: number;              // 1–10
  category: 'gaming' | 'social' | 'streaming' | 'messaging' | 'subcultural';
  isActive: boolean;
  usageCount: number;                   // How many times used in competitions
  createdBy: string;
  updatedAt: Date;

  // New fields
  definition: string;
  exampleSentence1: string;
  exampleSentence2: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'interjection' | 'compound';
  stressPattern: string;
  ttsOverrideText: string;
  audioUrlHighQuality: string;
  partnerWords: string[];
}

const WordBankSchema = new Schema<IWordBank>({
  targetWord: { type: String, required: true, uppercase: true, trim: true },
  group: { 
    type: String, 
    enum: ['group1', 'group2', 'group3', 'LKG', 'UKG', 'Class1', 'Class2', 'Class3', 'Class4', 'Class5', 'Class6', 'Class7', 'Class8', 'Class9', 'Class10', 'Class11'], 
    required: true 
  },
  situationalPrompt: { type: String, required: true },
  formalSynonym: { type: String, required: true },
  millennialCrossRef: { type: String, required: true },
  pronunciation: String,
  audioUrl: String,
  difficultyScore: { type: Number, min: 1, max: 10, default: 5 },
  category: {
    type: String,
    enum: ['gaming', 'social', 'streaming', 'messaging', 'subcultural'],
    default: 'social'
  },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 },
  createdBy: { type: String, required: true },
  
  // New fields
  definition: { type: String, required: true },
  exampleSentence1: { type: String, required: true },
  exampleSentence2: { type: String, required: true },
  partOfSpeech: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'interjection', 'compound'],
    default: 'noun'
  },
  stressPattern: { type: String, default: '' },
  ttsOverrideText: { type: String, default: '' },
  audioUrlHighQuality: { type: String, default: '' },
  partnerWords: [{ type: String }],
}, { timestamps: true });

WordBankSchema.index({ group: 1, isActive: 1 });
WordBankSchema.index({ targetWord: 1 }, { unique: true });

export const WordBank = mongoose.models.WordBank || mongoose.model<IWordBank>('WordBank', WordBankSchema);
