// components/modern-bee/ContextPanel.tsx
// ─────────────────────────────────────────────────────────────────────────────
// The full "Need more context?" section containing all 4 expandable cards.
// Wires card configs together with the useContextCards hook.
// ─────────────────────────────────────────────────────────────────────────────
'use client';
import { ContextCard } from './ContextCard';
import { useContextCards } from '@/hooks/useContextCards';
import type { WordDisplayData } from '@/types/modern-bee';
import type { TTSMode } from '@/hooks/useTTS';
import React from 'react';

interface ContextPanelProps {
  word: WordDisplayData;
  onSpeak: (mode: TTSMode, text?: string) => void;
  isSpeaking: boolean;
  activeMode: TTSMode;
}

export function ContextPanel({ word, onSpeak, isSpeaking, activeMode }: ContextPanelProps) {
  const { isOpen, toggle } = useContextCards();

  // Icon helpers — using inline SVGs matching the exact Tabler style
  const BookIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#afa9ec" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );

  const ChatIcon1 = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5dcaa5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );

  const ChatIcon2 = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5dcaa5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
    </svg>
  );

  const GridIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );

  return (
    <div className="mb-6">
      {/* Section label */}
      <p className="text-[10px] tracking-[0.18em] text-white/28 uppercase mb-3">
        Need more context?
      </p>

      <div className="flex flex-col gap-2">

        {/* ── 1. Definition ────────────────────────────────────────────────── */}
        <ContextCard
          id="definition"
          label="Definition"
          icon={BookIcon}
          iconBg="bg-purple-500/15"
          accentBorder="border-purple-500/20"
          content={{
            definition: word.definition,
            partOfSpeech: word.partOfSpeech,
          }}
          isOpen={isOpen('definition')}
          onToggle={() => toggle('definition')}
          onSpeak={onSpeak}
          isSpeaking={isSpeaking}
          activeSpeakMode={activeMode}
          speakMode="definition"
        />

        {/* ── 2. Sentence 1 ────────────────────────────────────────────────── */}
        <ContextCard
          id="sentence1"
          label="Sentence 1"
          icon={ChatIcon1}
          iconBg="bg-teal-500/15"
          accentBorder="border-teal-500/20"
          content={{
            sentence: word.exampleSentence1,
            sentenceNumber: 1,
          }}
          isOpen={isOpen('sentence1')}
          onToggle={() => toggle('sentence1')}
          onSpeak={onSpeak}
          isSpeaking={isSpeaking}
          activeSpeakMode={activeMode}
          speakMode="sentence1"
        />

        {/* ── 3. Sentence 2 ────────────────────────────────────────────────── */}
        <ContextCard
          id="sentence2"
          label="Sentence 2"
          icon={ChatIcon2}
          iconBg="bg-teal-500/15"
          accentBorder="border-teal-500/20"
          content={{
            sentence: word.exampleSentence2,
            sentenceNumber: 2,
          }}
          isOpen={isOpen('sentence2')}
          onToggle={() => toggle('sentence2')}
          onSpeak={onSpeak}
          isSpeaking={isSpeaking}
          activeSpeakMode={activeMode}
          speakMode="sentence2"
        />

        {/* ── 4. Full context (all clues grid) ─────────────────────────────── */}
        <ContextCard
          id="fullContext"
          label="Full context"
          icon={GridIcon}
          iconBg="bg-yellow-400/10"
          accentBorder="border-yellow-400/20"
          content={{
            situationalPrompt: word.situationalPrompt,
            formalSynonym: word.formalSynonym,
            millennialCrossRef: word.millennialCrossRef,
            pronunciation: word.pronunciation,
            stressPattern: word.stressPattern,
          }}
          isOpen={isOpen('fullContext')}
          onToggle={() => toggle('fullContext')}
        />

      </div>
    </div>
  );
}
