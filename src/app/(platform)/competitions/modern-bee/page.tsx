'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Star, Brain, Play, ShieldAlert, ChevronDown } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { CLASS_WORD_BANK } from './wordBank';

// ── Individual class definitions ─────────────────────────────────────────────
const CLASS_OPTIONS = [
  { key: 'LKG',     label: 'LKG',      group: 'group1', display: 'Lower Kindergarten' },
  { key: 'UKG',     label: 'UKG',      group: 'group1', display: 'Upper Kindergarten' },
  { key: 'Class1',  label: 'Class 1',  group: 'group1', display: 'Grade 1' },
  { key: 'Class2',  label: 'Class 2',  group: 'group1', display: 'Grade 2' },
  { key: 'Class3',  label: 'Class 3',  group: 'group1', display: 'Grade 3' },
  { key: 'Class4',  label: 'Class 4',  group: 'group2', display: 'Grade 4' },
  { key: 'Class5',  label: 'Class 5',  group: 'group2', display: 'Grade 5' },
  { key: 'Class6',  label: 'Class 6',  group: 'group2', display: 'Grade 6' },
  { key: 'Class7',  label: 'Class 7',  group: 'group2', display: 'Grade 7' },
  { key: 'Class8',  label: 'Class 8',  group: 'group3', display: 'Grade 8' },
  { key: 'Class9',  label: 'Class 9',  group: 'group3', display: 'Grade 9' },
  { key: 'Class10', label: 'Class 10', group: 'group3', display: 'Grade 10' },
  { key: 'Class11', label: 'Class 11', group: 'group3', display: 'Grade 11' },
];

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Class-wise Difficulty Map ────────────────────────────────────────────────
// Each class maps to a { label, r1desc, r2desc } where:
//   label   = human-readable difficulty tier shown in the UI
//   r1desc  = description of Round 1 difficulty for this class
//   r2desc  = description of Round 2 difficulty for this class
//
// Difficulty is enforced by splitting the 200-word bank:
//   Round 1 → words[0..99]  (easier half, picked when the word bank was built)
//   Round 2 → words[100..199] (harder half)
// Each round randomly selects 10 words from its half so every attempt is unique.
const SPELL_BEE_DIFFICULTY_MAP: Record<string, { label: string; color: string; r1desc: string; r2desc: string }> = {
  LKG:    { label: 'Starter',     color: '#4ade80', r1desc: '3-letter CVC words (cat, dog, sun)',         r2desc: 'Simple 3-letter variants & blends' },
  UKG:    { label: 'Beginner',    color: '#86efac', r1desc: '4-letter common words (ball, cake, rain)',   r2desc: '4-letter words with digraphs & blends' },
  Class1: { label: 'Elementary',  color: '#fde047', r1desc: '4–5 letter sight words & simple nouns',     r2desc: '5-letter words with common patterns' },
  Class2: { label: 'Elementary+', color: '#fbbf24', r1desc: '5-letter words (plant, grade, stone)',      r2desc: '5–6 letter words with vowel combos' },
  Class3: { label: 'Primary',     color: '#fb923c', r1desc: '5–6 letter words (bridge, castle, forest)', r2desc: '6-letter words with prefixes/suffixes' },
  Class4: { label: 'Primary+',    color: '#f97316', r1desc: '6-letter words (danger, frozen, jungle)',   r2desc: '7-letter words with complex patterns' },
  Class5: { label: 'Intermediate',color: '#f87171', r1desc: '6–7 letter words (captain, display)',       r2desc: '7–8 letter words with double letters' },
  Class6: { label: 'Intermediate+',color:'#ef4444', r1desc: '7-letter words (balance, evident)',         r2desc: '8-letter words with Latin/Greek roots' },
  Class7: { label: 'Upper',       color: '#c084fc', r1desc: '8-letter academic words',                   r2desc: '9-letter words — challenge tier' },
  Class8: { label: 'Upper+',      color: '#a855f7', r1desc: '8–9 letter literary/science words',         r2desc: '10-letter words with silent letters' },
  Class9: { label: 'Advanced',    color: '#818cf8', r1desc: '9–10 letter formal vocabulary',             r2desc: '11-letter words — SAT level' },
  Class10:{ label: 'Advanced+',   color: '#6366f1', r1desc: '10-11 letter complex words',                r2desc: '12-letter words — collegiate level' },
  Class11:{ label: 'Expert',      color: '#38bdf8', r1desc: '11-12 letter sophisticated words',          r2desc: '13+ letter words — highest difficulty' },
};

export default function ModernBeeLanding() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setSession, reset } = useGameStore();

  const [studentName, setStudentName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('onboreding_student_name');
    if (storedName) setStudentName(storedName);
    reset();
  }, [reset]);

  const startCompetition = async () => {
    if (!selectedClass || !studentName.trim()) {
      setError('Please enter your name and select your class.');
      return;
    }
    setIsLoading(true);
    setError('');

    // Save student info + class + shuffled word assignment to localStorage (guest fallback)
    localStorage.setItem('onboreding_student_name', studentName.trim());
    localStorage.setItem('onboreding_class', selectedClass);

    const allWords = CLASS_WORD_BANK[selectedClass] ?? CLASS_WORD_BANK['Class5'];

    // ── Difficulty-aware word selection ────────────────────────────────────────
    // The 200-word bank per class is ordered: first 100 = easier, last 100 = harder.
    // Round 1 draws 10 randomly from the EASIER first half (words 0–99).
    // Round 2 draws 10 randomly from the HARDER second half (words 100–199).
    // This ensures Round 2 is always more challenging than Round 1, class-specifically.
    const easyHalf = allWords.slice(0, 100);  // first  100 → easier words
    const hardHalf = allWords.slice(100, 200); // second 100 → harder words

    const r1 = shuffle(easyHalf).slice(0, 10); // 10 random from easy half
    const r2 = shuffle(hardHalf).slice(0, 10); // 10 random from hard half

    localStorage.setItem('onboreding_r1_words', JSON.stringify(r1));
    localStorage.setItem('onboreding_r2_words', JSON.stringify(r2));

    const classInfo = CLASS_OPTIONS.find(c => c.key === selectedClass)!;
    const mockSessionId = '6655c1e0e8549f2b882379d4';
    const mockAttemptId = '6655c256e8549f2b882379da';

    try {
      const res = await fetch(`/api/competitions/modern-bee/sessions/${mockSessionId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: classInfo.group, studentName: studentName.trim(), classKey: selectedClass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSession(mockSessionId, data.attemptId);
      } else {
        setSession(mockSessionId, mockAttemptId);
      }
    } catch {
      setSession(mockSessionId, mockAttemptId);
    }

    router.push(`/competitions/modern-bee/${mockSessionId}/round-1`);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] py-12 px-4 text-white flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full space-y-8">

        {/* HERO */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 rounded-full text-yellow-400 font-bold text-xs tracking-wide"
          >
            <Star className="w-4 h-4 fill-yellow-400/20" />
            <span>SPELL BEE CHAMPIONSHIP — LKG to Class 11</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-black text-5xl sm:text-6xl md:text-7xl leading-none tracking-tight bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent"
          >
            THE MODERN BEE
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-base sm:text-lg max-w-xl mx-auto font-semibold leading-relaxed"
          >
            200-word bank per class • 10 questions Round 1 • 10 questions Round 2 • Freshly shuffled every attempt
          </motion.p>
        </div>

        {/* COMPETITION FORMAT */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md"
        >
          <h2 className="text-xl font-black mb-6 text-yellow-400 tracking-tight flex items-center gap-2 border-b border-white/10 pb-4">
            <Brain className="w-5 h-5" />
            COMPETITION FORMAT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-white/70 font-semibold">
            <div className="space-y-3">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/25 text-purple-400 text-xs flex items-center justify-center font-black">1</span>
                Round 1: Audio Dictation
              </h3>
              <p>Listen to your class word, then type the correct spelling.</p>
              <ul className="list-disc list-inside pl-4 text-xs text-white/50 space-y-1">
                <li>10 unique words per student (randomly drawn from 200-word bank)</li>
                <li>Double heart lifelines (1 retry/miss)</li>
                <li>10 points per correct word • Speed bonuses</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/25 text-indigo-400 text-xs flex items-center justify-center font-black">2</span>
                Round 2: Contextual Decryption
              </h3>
              <p>Solve semantic clues and synonyms to decode the hidden word.</p>
              <ul className="list-disc list-inside pl-4 text-xs text-white/50 space-y-1">
                <li>10 different words (next 10 from shuffle pool)</li>
                <li>No lifelines — answers locked in</li>
                <li>15 points per word • Speed bonuses up to +5</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* REGISTRATION */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md max-w-2xl mx-auto w-full"
        >
          <h2 className="text-lg font-black text-center mb-6 tracking-wide">ENTER CHAMPIONSHIP LEAGUE</h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                Student Full Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Enter student's full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-semibold"
              />
            </div>

            {/* Class selector */}
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
                Select Your Class
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {CLASS_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedClass(opt.key)}
                    className={`py-3.5 px-2 rounded-xl border text-center transition-all text-xs font-bold ${
                      selectedClass === opt.key
                        ? 'bg-yellow-400 text-black border-yellow-400 scale-105 shadow-lg shadow-yellow-400/20'
                        : 'bg-white/5 text-white/70 border-white/10 hover:border-yellow-400/40 hover:bg-white/10'
                    }`}
                  >
                    <span className="block">{opt.label}</span>
                  </button>
                ))}
              </div>
              {selectedClass && (
                <p className="text-yellow-400/70 text-xs font-semibold mt-2">
                  ✓ {CLASS_OPTIONS.find(c => c.key === selectedClass)?.display} — 200-word bank, 10 per round, shuffled fresh every attempt
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-xs font-bold flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </p>
            )}

            <button
              onClick={startCompetition}
              disabled={isLoading || !studentName.trim() || !selectedClass}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-white/10 disabled:text-white/20 text-black font-black py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm uppercase tracking-wider disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Shuffling your word set...
                </span>
              ) : (
                <>
                  <span>Begin Challenge Run</span>
                  <Play className="w-4 h-4 fill-current" />
                </>
              )}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
