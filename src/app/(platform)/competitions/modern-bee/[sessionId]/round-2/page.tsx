'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Star, Sparkles, AlertCircle, Award } from 'lucide-react';
import { AnswerInputRound2 } from '@/components/modern-bee/AnswerInputRound2';
import { useGameStore } from '@/stores/gameStore';

const FALLBACK_WORDS = {
  group1: [
    { wordId: 'f1', targetWord: 'UNBOXING', situationalPrompt: 'Opening up a brand-new, sealed toy catalog order on a live stream.', formalSynonym: 'Unwrapping or unpacking.', millennialCrossRef: 'Making a home video of opening birthday gifts.' },
    { wordId: 'f2', targetWord: 'EMOTE', situationalPrompt: 'Your character executes a fast victory celebration dance on a gaming server.', formalSynonym: 'Gesture or expression.', millennialCrossRef: 'Doing an animated avatar dance step.' },
    { wordId: 'f3', targetWord: 'VIBE', situationalPrompt: 'The relaxing energy of a low-light music room filled with cozy pillows.', formalSynonym: 'Atmosphere or aura.', millennialCrossRef: 'The overall mood or general feeling.' },
  ],
  group2: [
    { wordId: 'f4', targetWord: 'RIZZ', situationalPrompt: 'A speaker smoothly convinces their classmates to vote for them using pure charm.', formalSynonym: 'Charisma or allure.', millennialCrossRef: 'Having smooth talking game or charm.' },
    { wordId: 'f5', targetWord: 'SUS', situationalPrompt: 'A player quietly sneaks out of a shared document room without saving code.', formalSynonym: 'Suspicious or questionable.', millennialCrossRef: 'Shady or untrustworthy actions.' },
    { wordId: 'f6', targetWord: 'CHEUGY', situationalPrompt: 'Someone inserts bright, word-art animations into a presentation deck.', formalSynonym: 'Outdated or old-fashioned.', millennialCrossRef: 'Basic or trying too hard to stay trendy.' },
  ],
  group3: [
    { wordId: 'f7', targetWord: 'DELULU', situationalPrompt: 'An individual plans to code an entire enterprise network map during a single five-minute recess block.', formalSynonym: 'Delusional or unrealistic.', millennialCrossRef: 'Completely daydreaming or out of touch.' },
    { wordId: 'f8', targetWord: 'GOATED', situationalPrompt: 'A speed-runner completes a flawless level run that shatters all past global time tracking records.', formalSynonym: 'Incomparable or supreme.', millennialCrossRef: 'The Greatest of All Time (G.O.A.T.).' },
    { wordId: 'f9', targetWord: 'CLOUT', situationalPrompt: 'An internet channel compromises software utility just to score algorithmic metrics.', formalSynonym: 'Influence or leverage.', millennialCrossRef: 'Chasing fame or looking for attention online.' },
  ],
};

export default function Round2Page({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';

  const { 
    currentWordIndex, 
    sessionId, 
    advanceWord, 
    recordAnswer, 
    round1Score, 
    round2Score 
  } = useGameStore();

  const [currentClue, setCurrentClue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<null | 'correct' | 'wrong'>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [group, setGroup] = useState<'group1' | 'group2' | 'group3'>('group2');
  const [clueCache, setClueCache] = useState<Record<number, any>>({});
  const isOfflineRef = useRef(false);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Prefetch next clue in background
  const prefetchNextClue = useCallback(async (nextIndex: number) => {
    if (isOfflineRef.current) return;
    try {
      const res = await fetch(`/api/competitions/modern-bee/round-2/clues?sessionId=${params.sessionId}&index=${nextIndex}`);
      const data = await res.ok ? await res.json() : null;
      if (data && !data.error && !data.done) {
        setClueCache(prev => ({ ...prev, [nextIndex]: data }));
      }
    } catch (e) {
      // Ignore prefetch errors
    }
  }, [params.sessionId]);

  // Fetch next clue
  const fetchClue = useCallback(async () => {
    if (clueCache[currentWordIndex]) {
      setCurrentClue(clueCache[currentWordIndex]);
      setIsLoading(false);
      setStartTime(Date.now());
      if (!isOfflineRef.current) {
        prefetchNextClue(currentWordIndex + 1);
      }
      return;
    }

    setIsLoading(true);
    try {
      if (isOfflineRef.current) {
        throw new Error('Offline mode');
      }
      const res = await fetch(`/api/competitions/modern-bee/round-2/clues?sessionId=${params.sessionId}&index=${currentWordIndex}`);
      const data = await res.ok ? await res.json() : null;

      if (data && !data.error) {
        if (data.done) {
          // Finished R2, trigger submission and completion
          router.push(`/competitions/modern-bee/${params.sessionId}/results`);
          return;
        }
        setCurrentClue(data);
        setClueCache(prev => ({ ...prev, [currentWordIndex]: data }));
        setIsLoading(false);
        setStartTime(Date.now());
        prefetchNextClue(currentWordIndex + 1);
      } else {
        isOfflineRef.current = true;
        throw new Error('Fallback to local simulation');
      }
    } catch (err) {
      isOfflineRef.current = true;
      // Local Sandbox Simulation
      const localWordsStr = typeof window !== 'undefined' ? localStorage.getItem('onboreding_r2_words') : null;
      let localWords: string[] = [];
      if (localWordsStr) {
        try {
          localWords = JSON.parse(localWordsStr);
        } catch (e) {
          console.error(e);
        }
      }

      const list = localWords.length > 0 ? localWords.map((w, idx) => {
        const targetWord = w.toUpperCase();
        return {
          wordId: `local-r2-${idx}`,
          targetWord,
          situationalPrompt: `Solve the spelling. Clue: This word starts with ${targetWord[0]} and ends with ${targetWord[targetWord.length-1]} and has ${targetWord.length} letters.`,
          formalSynonym: `Spell the word: ${targetWord}.`,
          millennialCrossRef: `Modern spelling practice: ${targetWord}.`
        };
      }) : FALLBACK_WORDS[group];

      if (currentWordIndex >= list.length) {
        router.push(`/competitions/modern-bee/${params.sessionId}/results`);
        return;
      }
      
      const item = list[currentWordIndex];
      const clueTypes = ['situational', 'synonym', 'millennial'];
      const clueType = clueTypes[currentWordIndex % clueTypes.length];
      
      let clueText = '';
      if (clueType === 'situational') clueText = item.situationalPrompt;
      else if (clueType === 'synonym') clueText = item.formalSynonym;
      else clueText = item.millennialCrossRef;

      const simulatedClueData = {
        wordId: item.wordId,
        clueType,
        clueText,
        index: currentWordIndex,
        total: list.length,
        timeLimit: 60,
        targetWord: item.targetWord
      };

      setCurrentClue(simulatedClueData);
      setClueCache(prev => ({ ...prev, [currentWordIndex]: simulatedClueData }));
      setIsLoading(false);
      setStartTime(Date.now());
    }
  }, [currentWordIndex, params.sessionId, group, router, clueCache, prefetchNextClue]);

  useEffect(() => {
    fetchClue();
  }, [currentWordIndex, fetchClue]);

  const handleSubmit = useCallback(async (finalAnswer: string) => {
    if (feedback) return; // prevent double submit
    const timeTaken = Date.now() - startTime;
    setIsLoading(true);

    try {
      if (isOfflineRef.current) {
        throw new Error('Offline mode');
      }
      const res = await fetch('/api/competitions/modern-bee/round-2/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: params.sessionId,
          wordId: currentClue.wordId,
          clueType: currentClue.clueType,
          submittedAnswer: finalAnswer,
          timeTakenMs: timeTaken,
        }),
      });
      const data = await res.ok ? await res.json() : null;

      if (res.ok && data && !data.error) {
        setFeedback(data.isCorrect ? 'correct' : 'wrong');
        setPointsEarned(data.pointsEarned);
        recordAnswer(data);
      } else {
        isOfflineRef.current = true;
        throw new Error('Local simulation fallback');
      }
    } catch (err) {
      isOfflineRef.current = true;
      // Sandbox validation
      const correctWord = currentClue.targetWord;
      const isCorrect = finalAnswer.toLowerCase().trim() === correctWord.toLowerCase().trim();
      const timeBonus = isCorrect ? (timeTaken < 20000 ? 5 : timeTaken < 40000 ? 2 : 0) : 0;
      const pts = isCorrect ? (15 + timeBonus) : 0;

      setFeedback(isCorrect ? 'correct' : 'wrong');
      setPointsEarned(pts);
      recordAnswer({
        isCorrect,
        correctAnswer: isCorrect ? undefined : correctWord,
        pointsEarned: pts,
        totalRound2Score: useGameStore.getState().round2Score + pts
      });
    }

    setTimeout(() => {
      setFeedback(null);
      setAnswer('');
      setIsLoading(false);
      if (currentWordIndex + 1 >= (currentClue?.total ?? 3)) {
        router.push(`/competitions/modern-bee/${params.sessionId}/results`);
      } else {
        advanceWord();
      }
    }, 1800);
  }, [currentClue, params.sessionId, currentWordIndex, startTime, recordAnswer, router, advanceWord]);

  // Convert clueType key to user friendly label
  const getClueTypeLabel = (type: string) => {
    switch (type) {
      case 'situational': return 'Situational Prompt';
      case 'synonym': return 'Formal Synonym';
      case 'millennial': return 'Millennial Translation';
      default: return 'Semantic Clue';
    }
  };

  // Target word length placeholder preview
  const getWordLengthPlaceholder = () => {
    if (currentClue?.targetWord) {
      return currentClue.targetWord.length;
    }
    // approximate fallback
    return 6;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] flex flex-col items-center justify-center p-6 text-white">
      {/* Header Info */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 w-full max-w-lg flex flex-col items-center"
      >
        <h1 className="font-black text-4xl text-yellow-400 tracking-tight">THE MODERN BEE</h1>
        <p className="text-indigo-400 text-[10px] tracking-widest font-black uppercase mt-1">
          ROUND 2 — CONTEXTUAL DECRYPTION
        </p>

        <div className="flex items-center justify-between w-full mt-6 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl">
          <span className="text-white/60 text-xs font-bold font-mono">
            CLUE: {currentWordIndex + 1} / {currentClue?.total ?? '...'}
          </span>
          <div className="bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/25">
            <span className="text-purple-300 font-mono text-xs font-black">
              R1 SCORE: {round1Score} pts
            </span>
          </div>
        </div>
      </motion.div>



      {/* Decryption Clue Card */}
      <motion.div
        key={currentWordIndex}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white/5 backdrop-blur border border-white/10 rounded-[2rem] p-8 shadow-xl relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>

        {isLoading && !feedback ? (
          <div className="py-8 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white/40 text-sm font-semibold">Decrypting clue cipher...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-400/10 border border-indigo-400/20 px-3.5 py-1.5 rounded-full text-indigo-300 font-bold text-xs tracking-wider uppercase">
              <Award className="w-4 h-4" />
              <span>{getClueTypeLabel(currentClue?.clueType)}</span>
            </div>

            <p className="text-white font-semibold text-lg leading-relaxed px-2 font-poppins">
              "{currentClue?.clueText}"
            </p>

            {/* Word Length Hint boxes */}
            <div className="pt-2">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mb-3">
                WORD LENGTH: {getWordLengthPlaceholder()} LETTERS
              </span>
              <div className="flex justify-center flex-wrap gap-1.5 sm:gap-2.5">
                {Array.from({ length: getWordLengthPlaceholder() }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-5 h-8 sm:w-8 sm:h-10 border-b-2 border-white/20 flex items-center justify-center font-mono font-black text-white/40 text-xs sm:text-sm"
                  >
                    _
                  </div>
                ))}
              </div>
            </div>

            {/* ── ADMIN ANSWER KEY PANEL ─────────────────────────── */}
            {isAdmin && currentClue?.targetWord && (
              <div className="mt-6 w-full bg-yellow-400/10 border-2 border-yellow-400/40 rounded-2xl p-4 space-y-2 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">🛡️ Admin — Answer Key</span>
                </div>
                <div className="bg-yellow-400/20 rounded-xl px-4 py-2 text-center overflow-hidden">
                  <span className={`text-yellow-300 font-black break-all block ${
                    currentClue.targetWord.length > 18
                      ? 'text-sm sm:text-base tracking-[0.1em] sm:tracking-[0.15em]'
                      : currentClue.targetWord.length > 12
                      ? 'text-base sm:text-xl tracking-[0.15em] sm:tracking-[0.2em]'
                      : currentClue.targetWord.length > 8
                      ? 'text-xl sm:text-2xl tracking-[0.2em] sm:tracking-[0.25em]'
                      : 'text-2xl sm:text-3xl tracking-[0.3em]'
                  }`}>
                    {currentClue.targetWord}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Answer Input */}
      <AnswerInputRound2
        value={answer}
        onChange={setAnswer}
        onSubmit={handleSubmit}
        feedback={feedback}
        disabled={isLoading || !!feedback}
        placeholder="DECRYPT KEYWORD..."
      />



      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 bg-black/30 backdrop-blur-sm"
          >
            <div className="bg-black/90 border border-white/10 px-8 py-6 rounded-3xl text-center space-y-3 shadow-2xl flex flex-col items-center">
              <span className="text-8xl">
                {feedback === 'correct' ? '🔥' : '💥'}
              </span>
              <h3 className={`text-2xl font-black ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {feedback === 'correct' ? 'DECRYPTED!' : 'FAILED TO DECRYPT!'}
              </h3>
              <p className="text-white/60 text-xs font-semibold">
                {feedback === 'correct' 
                  ? `+${pointsEarned} points locked in!` 
                  : `Keyword was: ${currentClue?.targetWord}`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
