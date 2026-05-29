// components/modern-bee/PronouncerCard.tsx — FULL REPLACEMENT
'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { WordHero } from './WordHero';
import { HearWordButton } from './HearWordButton';
import { ContextPanel } from './ContextPanel';
import { LivesDisplay } from './LivesDisplay';
import { AnswerInput } from './AnswerInput';
import { useTTS } from '@/hooks/useTTS';
import type { WordDisplayData } from '@/types/modern-bee';

interface PronouncerCardProps {
  word: WordDisplayData;
  sessionId: string;
  autoPlayOnLoad?: boolean;
  onAnswerSubmit: (answer: string, timeTakenMs: number) => Promise<{
    isCorrect: boolean;
    correctAnswer?: string;
    livesRemaining: number;
  }>;
  onWordComplete: () => void;  // Called after correct answer or no lives
}

export function PronouncerCard({
  word, sessionId, autoPlayOnLoad = true, onAnswerSubmit, onWordComplete
}: PronouncerCardProps) {
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [lives, setLives] = useState(word.livesRemaining);
  const wordStartTimeRef = useRef(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  const { speak, stop, isPlaying, activeMode } = useTTS({
    targetWord: word.targetWord || word.ttsOverrideText || word.wordId,
    ttsOverrideText: word.ttsOverrideText,
    audioUrlHighQuality: word.audioUrlHighQuality,
    audioUrl: word.audioUrl,
    definition: word.definition,
    exampleSentence1: word.exampleSentence1,
    exampleSentence2: word.exampleSentence2,
    situationalPrompt: word.situationalPrompt,
    formalSynonym: word.formalSynonym,
    millennialCrossRef: word.millennialCrossRef,
  });

  // Auto-play word when card first appears
  useEffect(() => {
    setHasPlayedOnce(false);
    setIsComplete(false);
    setLives(word.livesRemaining);
    wordStartTimeRef.current = Date.now();

    if (autoPlayOnLoad) {
      const t = setTimeout(async () => {
        await speak('word');
        setHasPlayedOnce(true);
      }, 700); // Wait for card entrance animation
      return () => clearTimeout(t);
    }
  }, [word.wordId]);

  const handlePlayWord = async () => {
    await speak('word');
    setHasPlayedOnce(true);
  };

  const handleAnswerSubmit = async (answer: string, timeTakenMs: number) => {
    const result = await onAnswerSubmit(answer, timeTakenMs);
    setLives(result.livesRemaining);
    return result;
  };

  const handleCorrect = () => {
    setIsComplete(true);
    setTimeout(onWordComplete, 1400); // Brief pause to show correct feedback
  };

  const handleFail = () => {
    setIsComplete(true);
    setTimeout(onWordComplete, 2500); // Longer pause to show the revealed word
  };

  return (
    <motion.div
      key={word.wordId}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-xl"
    >
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        
        {/* WordHero */}
        <WordHero
          group={word.group}
          partOfSpeech={word.partOfSpeech}
          difficultyScore={word.difficultyScore}
          category={word.category}
          wordIndex={word.index}
          totalWords={word.total}
        />

        {/* LivesDisplay */}
        <LivesDisplay
          livesRemaining={lives}
          maxLives={2}
        />

        {/* HearWordButton */}
        <HearWordButton
          onPlay={handlePlayWord}
          isPlaying={isPlaying}
          activeMode={activeMode}
          hasPlayedOnce={hasPlayedOnce}
          stressPattern={word.stressPattern}
        />

        {/* ContextPanel */}
        <ContextPanel
          word={word}
          onSpeak={speak}
          isSpeaking={isPlaying}
          activeMode={activeMode}
        />

        {/* AnswerInput */}
        <AnswerInput
          onSubmit={handleAnswerSubmit}
          disabled={isComplete}
          startTimeMs={wordStartTimeRef.current}
          onCorrect={handleCorrect}
          onFail={handleFail}
        />

      </div>
    </motion.div>
  );
}
