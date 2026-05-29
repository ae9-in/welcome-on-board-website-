import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  sessionId: string | null;
  attemptId: string | null;
  currentRound: 1 | 2;
  currentWordIndex: number;
  livesRemaining: number;
  round1Score: number;
  round2Score: number;
  answers: any[];
  timerStarted: boolean;
  isSubmitting: boolean;
  audienceReactions: { fire: number; clap: number; trophy: number };

  // Actions
  setSession: (sessionId: string, attemptId: string) => void;
  advanceWord: () => void;
  advanceRound: () => void;
  recordAnswer: (answer: any) => void;
  useLife: () => void;
  addReaction: (type: 'fire' | 'clap' | 'trophy') => void;
  reset: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      sessionId: null,
      attemptId: null,
      currentRound: 1,
      currentWordIndex: 0,
      livesRemaining: 2,
      round1Score: 0,
      round2Score: 0,
      answers: [],
      timerStarted: false,
      isSubmitting: false,
      audienceReactions: { fire: 0, clap: 0, trophy: 0 },

      setSession: (sessionId, attemptId) => set({ sessionId, attemptId }),
      advanceWord: () => set(s => ({ currentWordIndex: s.currentWordIndex + 1 })),
      advanceRound: () => set({ currentRound: 2, currentWordIndex: 0 }),
      recordAnswer: (answer) => set(s => {
        const answers = [...s.answers, answer];
        const round1Score = answer.totalRound1Score !== undefined ? answer.totalRound1Score : s.round1Score;
        const round2Score = answer.totalRound2Score !== undefined ? answer.totalRound2Score : s.round2Score;
        return {
          answers,
          round1Score,
          round2Score,
          livesRemaining: answer.livesRemaining !== undefined ? answer.livesRemaining : s.livesRemaining,
        };
      }),
      useLife: () => set(s => ({ livesRemaining: Math.max(0, s.livesRemaining - 1) })),
      addReaction: (type) => set(s => ({
        audienceReactions: { ...s.audienceReactions, [type]: s.audienceReactions[type] + 1 }
      })),
      reset: () => set({
        sessionId: null, attemptId: null, currentRound: 1, currentWordIndex: 0,
        livesRemaining: 2, round1Score: 0, round2Score: 0, answers: []
      }),
    }),
    { 
      name: 'modern-bee-game', 
      partialize: (s) => ({ sessionId: s.sessionId, attemptId: s.attemptId }) 
    }
  )
);
