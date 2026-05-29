'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

import { useGameStore } from '@/stores/gameStore';
import { PronouncerCard } from '@/components/modern-bee/PronouncerCard';
import type { WordDisplayData } from '@/types/modern-bee';

// Local fallbacks in case DB connections are unseeded/offline
const FALLBACK_WORDS = {
  group1: [
    { wordId: 'f1', targetWord: 'UNBOXING', pronunciation: 'un-boxing', category: 'streaming', audioUrl: '' },
    { wordId: 'f2', targetWord: 'EMOTE', pronunciation: 'ee-moht', category: 'gaming', audioUrl: '' },
    { wordId: 'f3', targetWord: 'VIBE', pronunciation: 'vyb', category: 'social', audioUrl: '' },
  ],
  group2: [
    { wordId: 'f4', targetWord: 'RIZZ', pronunciation: 'riz', category: 'social', audioUrl: '' },
    { wordId: 'f5', targetWord: 'SUS', pronunciation: 'suhs', category: 'gaming', audioUrl: '' },
    { wordId: 'f6', targetWord: 'CHEUGY', pronunciation: 'choo-gee', category: 'social', audioUrl: '' },
  ],
  group3: [
    { wordId: 'f7', targetWord: 'DELULU', pronunciation: 'deh-loo-loo', category: 'subcultural', audioUrl: '' },
    { wordId: 'f8', targetWord: 'GOATED', pronunciation: 'goh-tid', category: 'gaming', audioUrl: '' },
    { wordId: 'f9', targetWord: 'CLOUT', pronunciation: 'klowt', category: 'subcultural', audioUrl: '' },
  ],
};

export default function Round1Page({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';

  const { 
    currentWordIndex, 
    livesRemaining, 
    advanceWord, 
    advanceRound, 
    recordAnswer 
  } = useGameStore();

  const [currentWord, setCurrentWord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [group, setGroup] = useState<'group1' | 'group2' | 'group3'>('group2');

  // Identify student division group based on grade
  useEffect(() => {
    const lastSelectGrade = document.cookie.includes('Grade1_2') ? 'group1' : 'group3';
    // Match division setup based on landing selection
    if (document.cookie.includes('Grade1_2')) {
      setGroup('group1');
    } else if (document.cookie.includes('Grade8_11')) {
      setGroup('group3');
    } else {
      setGroup('group2');
    }
  }, []);

  // Fetch next word
  const fetchWord = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/competitions/modern-bee/round-1/words?sessionId=${params.sessionId}&index=${currentWordIndex}`);
      const data = await res.ok ? await res.json() : null;
      
      if (data && !data.error) {
        if (data.done) {
          // Finished R1, go to R2
          advanceRound();
          router.push(`/competitions/modern-bee/${params.sessionId}/round-2`);
          return;
        }
        setCurrentWord(data);
        setIsLoading(false);
      } else {
        throw new Error('Fallback to local simulation');
      }
    } catch (err) {
      // Local Sandbox Simulation
      const localWordsStr = typeof window !== 'undefined' ? localStorage.getItem('onboreding_r1_words') : null;
      let localWords: string[] = [];
      if (localWordsStr) {
        try {
          localWords = JSON.parse(localWordsStr);
        } catch (e) {
          console.error(e);
        }
      }
      
      const list = localWords.length > 0 ? localWords.map((w, idx) => ({
        wordId: `local-r1-${idx}`,
        targetWord: w.toUpperCase(),
        pronunciation: w.toLowerCase(),
        category: 'spelling',
        audioUrl: ''
      })) : FALLBACK_WORDS[group].map((w, idx) => ({
        ...w,
        targetWord: w.targetWord.toUpperCase()
      }));

      if (currentWordIndex >= list.length) {
        advanceRound();
        router.push(`/competitions/modern-bee/${params.sessionId}/round-2`);
        return;
      }
      const item = list[currentWordIndex];

      const loadSimulationDetails = async () => {
        let definition = "";
        let partOfSpeech = "noun";
        let exampleSentence1 = "";
        let exampleSentence2 = "";
        let situationalPrompt = "";
        let formalSynonym = "";
        let millennialCrossRef = "";

        const targetUpper = item.targetWord.toUpperCase();

        try {
          const { generateFallbackDetails, SLANG_DICT, LOCAL_DICTIONARY } = await import('@/lib/dictionary-client');
          const details = generateFallbackDetails(item.targetWord);
          
          definition = details.definition;
          partOfSpeech = details.partOfSpeech;
          exampleSentence1 = details.exampleSentence1;
          exampleSentence2 = details.exampleSentence2;
          situationalPrompt = details.situationalPrompt;
          formalSynonym = details.formalSynonym;
          millennialCrossRef = details.millennialCrossRef;

          // If not slang or a local word, try fetching from Dictionary API
          if (!SLANG_DICT[targetUpper] && !LOCAL_DICTIONARY[targetUpper]) {
            const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${item.targetWord.toLowerCase()}`);
            if (dictRes.ok) {
              const data = await dictRes.json();
              const firstEntry = data[0];
              const firstMeaning = firstEntry?.meanings?.[0];
              partOfSpeech = firstMeaning?.partOfSpeech || partOfSpeech;
              definition = firstMeaning?.definitions?.[0]?.definition || definition;

              const examples: string[] = [];
              firstMeaning?.definitions?.forEach((d: any) => {
                if (d.example) examples.push(d.example);
              });
              if (examples.length < 2) {
                firstEntry?.meanings?.forEach((m: any) => {
                  m.definitions?.forEach((d: any) => {
                    if (d.example && !examples.includes(d.example)) {
                      examples.push(d.example);
                    }
                  });
                });
              }
              if (examples[0]) exampleSentence1 = examples[0];
              if (examples[1]) exampleSentence2 = examples[1];

              situationalPrompt = `Imagine a scenario where one refers to the concept of "${item.targetWord.toLowerCase()}". ${exampleSentence1}`;
              formalSynonym = `A term meaning: ${definition}`;
              millennialCrossRef = `Using "${item.targetWord.toLowerCase()}" in context: "${exampleSentence2}"`;
            }
          }
        } catch (e) {
          console.warn('Client dictionary load failed:', e);
        }

        setCurrentWord({
          wordId: item.wordId,
          index: currentWordIndex,
          total: list.length,
          pronunciation: item.pronunciation,
          audioUrl: '',
          difficultyScore: 5,
          category: item.category,
          timeLimit: 45,
          livesRemaining: livesRemaining,
          targetWord: item.targetWord,
          definition,
          partOfSpeech,
          exampleSentence1,
          exampleSentence2,
          situationalPrompt,
          formalSynonym,
          millennialCrossRef
        });
        setIsLoading(false);
      };

      loadSimulationDetails();
    }
  }, [currentWordIndex, params.sessionId, group, livesRemaining, advanceRound, router]);

  useEffect(() => {
    fetchWord();
  }, [currentWordIndex, fetchWord]);

  const handleAnswerSubmit = async (trimmedAnswer: string, timeTakenMs: number) => {
    try {
      const res = await fetch('/api/competitions/modern-bee/round-1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: params.sessionId,
          wordId: currentWord.wordId,
          submittedAnswer: trimmedAnswer,
          timeTakenMs,
        }),
      });
      const data = await res.json();
      
      if (res.ok && !data.error) {
        recordAnswer(data);
        return {
          isCorrect: data.isCorrect,
          correctAnswer: data.correctAnswer,
          livesRemaining: data.livesRemaining,
        };
      } else {
        throw new Error('Local check fallback');
      }
    } catch (err) {
      // Local simulation check
      const correctWord = currentWord.targetWord || 'RIZZ';
      const isCorrect = trimmedAnswer.toLowerCase().trim() === correctWord.toLowerCase().trim();
      let simulatedLives = livesRemaining;
      
      if (!isCorrect && livesRemaining > 0) {
        simulatedLives -= 1;
      }
      
      const timeBonus = isCorrect ? (timeTakenMs < 15000 ? 3 : timeTakenMs < 30000 ? 1 : 0) : 0;
      const pts = isCorrect ? (10 + timeBonus) : 0;

      recordAnswer({
        isCorrect,
        correctAnswer: isCorrect ? undefined : correctWord,
        pointsEarned: pts,
        livesRemaining: simulatedLives,
        totalRound1Score: useGameStore.getState().round1Score + pts
      });

      return {
        isCorrect,
        correctAnswer: isCorrect ? undefined : correctWord,
        livesRemaining: simulatedLives,
      };
    }
  };

  const handleWordComplete = () => {
    if (currentWordIndex + 1 >= (currentWord?.total ?? 3)) {
      advanceRound();
      router.push(`/competitions/modern-bee/${params.sessionId}/round-2`);
    } else {
      advanceWord();
    }
  };

  const wordData: WordDisplayData | null = currentWord ? {
    wordId: currentWord.wordId,
    targetWord: currentWord.targetWord,
    group: currentWord.group || 'group2',
    partOfSpeech: currentWord.partOfSpeech || 'noun',
    difficultyScore: currentWord.difficultyScore || 5,
    category: currentWord.category || 'social',
    stressPattern: currentWord.stressPattern || '',
    pronunciation: currentWord.pronunciation || '',
    definition: currentWord.definition || `Definition for ${currentWord.targetWord || 'spelling word'}.`,
    exampleSentence1: currentWord.exampleSentence1 || `Used in a context sentence.`,
    exampleSentence2: currentWord.exampleSentence2 || `Used in another context sentence.`,
    situationalPrompt: currentWord.situationalPrompt || '',
    formalSynonym: currentWord.formalSynonym || '',
    millennialCrossRef: currentWord.millennialCrossRef || '',
    audioUrlHighQuality: currentWord.audioUrlHighQuality || '',
    audioUrl: currentWord.audioUrl || '',
    ttsOverrideText: currentWord.ttsOverrideText || '',
    timeLimit: currentWord.timeLimit || 45,
    livesRemaining: livesRemaining,
    index: currentWordIndex,
    total: currentWord.total || 10,
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] flex flex-col items-center justify-center p-6 text-white">
      {/* Header Info */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 w-full max-w-lg flex flex-col items-center"
      >
        <h1 className="font-black text-4xl text-yellow-400 tracking-tight">THE MODERN BEE</h1>
        <p className="text-purple-300 text-[10px] tracking-widest font-black uppercase mt-1">
          ROUND 1 — AUDIO DICTATION
        </p>
      </motion.div>

      {/* Dictation Word Card / PronouncerCard */}
      {isLoading ? (
        <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center shadow-xl">
          <div className="py-8 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <span className="text-white/40 text-sm font-semibold">Readying word stream...</span>
          </div>
        </div>
      ) : (
        wordData && (
          <div className="w-full flex flex-col items-center gap-4">
            <PronouncerCard
              word={wordData}
              sessionId={params.sessionId}
              autoPlayOnLoad={true}
              onAnswerSubmit={handleAnswerSubmit}
              onWordComplete={handleWordComplete}
            />
            {/* ── ADMIN ANSWER KEY PANEL ─────────────────────────── */}
            {(currentWord?.isAdmin || isAdmin) && currentWord?.targetWord && (
              <div className="w-full max-w-xl bg-yellow-400/10 border-2 border-yellow-400/40 rounded-2xl p-4 space-y-2 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">🛡️ Admin — Answer Key</span>
                </div>
                <div className="bg-yellow-400/20 rounded-xl px-4 py-2 text-center overflow-hidden">
                  <span className={`text-yellow-300 font-black break-all block ${
                    currentWord.targetWord.length > 18
                      ? 'text-sm sm:text-base tracking-[0.1em] sm:tracking-[0.15em]'
                      : currentWord.targetWord.length > 12
                      ? 'text-base sm:text-xl tracking-[0.15em] sm:tracking-[0.2em]'
                      : currentWord.targetWord.length > 8
                      ? 'text-xl sm:text-2xl tracking-[0.2em] sm:tracking-[0.25em]'
                      : 'text-2xl sm:text-3xl tracking-[0.3em]'
                  }`}>
                    {currentWord.targetWord}
                  </span>
                </div>
                {currentWord.situationalPrompt && (
                  <p className="text-white/60 text-xs"><span className="text-white/40 font-bold">PROMPT:</span> {currentWord.situationalPrompt}</p>
                )}
                {currentWord.formalSynonym && (
                  <p className="text-white/60 text-xs"><span className="text-white/40 font-bold">SYNONYM:</span> {currentWord.formalSynonym}</p>
                )}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
