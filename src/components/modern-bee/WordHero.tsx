// components/modern-bee/WordHero.tsx
'use client';
import { motion } from 'framer-motion';

interface WordHeroProps {
  group: 'group1' | 'group2' | 'group3';
  partOfSpeech: string;
  difficultyScore: number;
  category: string;
  wordIndex: number;
  totalWords: number;
}

const GROUP_LABELS: Record<string, string> = {
  group1: 'Group 1 · Grades 1–3',
  group2: 'Group 2 · Grades 4–7',
  group3: 'Group 3 · Grades 8–11',
};

const GROUP_COLORS: Record<string, string> = {
  group1: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  group2: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  group3: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

export function WordHero({
  group, partOfSpeech, difficultyScore, category, wordIndex, totalWords
}: WordHeroProps) {
  return (
    <div className="text-center mb-7 pb-6 border-b border-white/[0.07]">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex gap-1">
          {Array.from({ length: totalWords }, (_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i < wordIndex
                  ? 'bg-yellow-400/60 w-4'
                  : i === wordIndex
                    ? 'bg-yellow-400 w-6'
                    : 'bg-white/10 w-4'
              }`}
            />
          ))}
        </div>
        <span className="text-white/30 text-xs ml-1">
          {wordIndex + 1}/{totalWords}
        </span>
      </div>

      {/* "WORD TO SPELL" label */}
      <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mb-3">
        Word to spell
      </p>

      {/* Big honeycomb icon placeholder where the word would be — student listens */}
      <div className="mx-auto w-20 h-20 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4">
        <span className="text-yellow-400 text-4xl">🐝</span>
      </div>

      {/* Meta pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className={`
          text-xs px-3 py-1 rounded-full border capitalize font-medium
          bg-purple-500/15 text-purple-300 border-purple-500/25
        `}>
          {partOfSpeech}
        </span>
        <span className={`
          text-xs px-3 py-1 rounded-full border font-medium
          ${GROUP_COLORS[group] || 'bg-slate-500/20 text-slate-300 border-slate-500/30'}
        `}>
          {GROUP_LABELS[group] || group}
        </span>
        <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/35 capitalize">
          {category}
        </span>
        <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/35">
          Difficulty {difficultyScore}/10
        </span>
      </div>
    </div>
  );
}
