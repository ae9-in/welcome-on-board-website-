import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Clock, CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw, Star, AlertCircle, Target, GraduationCap, ChevronRight, ShieldCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
// ─── Question banks are code-split into quizData.js (~102KB). ────────────────
// Next.js will load this chunk only when the Quiz component is first rendered,
// keeping the initial JS bundle small and the home page fast.
import {
  MATH_QUESTIONS,
  GENERAL_QUESTIONS,
  POLITICS_GK_HISTORY_POOL,
  RIDDLES_POOL,
  SCIENCE_POOL,
} from './quizData';

// ─── Difficulty Level System ─────────────────────────────────────────────────
// Tags every question in a pool with a `level` (1–8) based on its position
// within the pool. Questions at the start of a pool are considered easier;
// questions toward the end are harder. For the PGH pool (176 Qs), earlier
// questions use well-known facts (capital cities, basic history) and later
// ones use constitutional details, obscure history, and precise dates.
const tagLevels = (pool, minLevel, maxLevel) => {
  const range = maxLevel - minLevel;
  return pool.map((q, i) => ({
    ...q,
    level: Math.round(minLevel + (i / (pool.length - 1)) * range),
  }));
};

// Assign levels: PGH spans levels 3–8 (GK/Civics is harder than simple science)
//                Riddles/Puzzles span 2–6 (logic puzzles scale with age)
//                Science spans 2–7
const TAGGED_PGH     = tagLevels(POLITICS_GK_HISTORY_POOL, 3, 8);
const TAGGED_RIDDLES = tagLevels(RIDDLES_POOL, 2, 6);
const TAGGED_SCIENCE = tagLevels(SCIENCE_POOL, 2, 7);

// Grade → { min, max } difficulty levels
// The quiz draws ONLY questions within this range.
// Wider ranges for middle tiers so there are enough questions to fill 20 slots.
const GRADE_DIFFICULTY_MAP = {
  'LKG':      { min: 1, max: 2 },
  'UKG':      { min: 1, max: 3 },
  'Class 1':  { min: 2, max: 3 },
  'Class 2':  { min: 2, max: 4 },
  'Class 3':  { min: 3, max: 4 },
  'Class 4':  { min: 3, max: 5 },
  'Class 5':  { min: 4, max: 5 },
  'Class 6':  { min: 4, max: 6 },
  'Class 7':  { min: 5, max: 6 },
  'Class 8':  { min: 5, max: 7 },
  'Class 9':  { min: 6, max: 7 },
  'Class 10': { min: 6, max: 8 },
  'Class 11': { min: 7, max: 8 },
  'Advanced': { min: 8, max: 8 },
};

// Return questions from the combined pool filtered to grade difficulty
// If the filtered set has fewer than `needed` questions, widen the net by ±1
const getGradedQuestions = (grade, pool, needed = 20) => {
  const tier = GRADE_DIFFICULTY_MAP[grade] || { min: 3, max: 6 };
  let filtered = pool.filter(q => q.level >= tier.min && q.level <= tier.max);
  // Widen if too few
  if (filtered.length < needed) {
    filtered = pool.filter(q => q.level >= Math.max(1, tier.min - 1) && q.level <= Math.min(8, tier.max + 1));
  }
  if (filtered.length < needed) filtered = pool; // fallback: all questions
  return filtered;
};

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};


const generateDynamicMathQuestions = (grade, staticQs, targetCount = 200) => {
  const list = [...staticQs];
  const generated = [];
  const needed = targetCount - list.length;
  if (needed <= 0) return shuffleArray(list).slice(0, targetCount);

  const seenQ = new Set(list.map(item => item.q));

  const addQ = (q, options, answerIndex, category = 'Math', explanation = '') => {
    if (!seenQ.has(q)) {
      seenQ.add(q);
      generated.push({ q, options, answer: answerIndex, category, explanation });
      return true;
    }
    return false;
  };

  let attempts = 0;
  while (generated.length < needed && attempts < 2000) {
    attempts++;
    let q = '';
    let options = [];
    let answer = 0;
    let explanation = '';

    if (grade === 'LKG') {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 4) + 1;
      const op = Math.random() > 0.5 ? '+' : '-';
      if (op === '+') {
        const ans = a + b;
        q = `What is ${a} + ${b}?`;
        options = [String(ans - 1), String(ans), String(ans + 1), String(ans + 2)];
        answer = 1;
      } else {
        const large = Math.max(a, b);
        const small = Math.min(a, b);
        const ans = large - small;
        q = `What is ${large} - ${small}?`;
        options = [String(ans + 1), String(ans - 1), String(ans), String(ans + 2)];
        answer = 2;
      }
    } else if (grade === 'UKG') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 7) + 1;
      const ans = a + b;
      q = `Solve: ${a} + ${b} = ?`;
      options = [String(ans - 2), String(ans - 1), String(ans + 1), String(ans)];
      answer = 3;
    } else if (grade === 'Class 1') {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 9) + 1;
      const ans = a - b;
      q = `What is ${a} minus ${b}?`;
      options = [String(ans - 1), String(ans), String(ans + 1), String(ans + 2)];
      answer = 1;
    } else if (grade === 'Class 2') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 9) + 2;
      const ans = a * b;
      q = `What is ${a} multiplied by ${b}?`;
      options = [String(ans - 3), String(ans + 2), String(ans), String(ans - 1)];
      answer = 2;
    } else if (grade === 'Class 3') {
      const b = Math.floor(Math.random() * 8) + 3;
      const ans = Math.floor(Math.random() * 9) + 2;
      const a = b * ans;
      q = `What is ${a} divided by ${b}?`;
      options = [String(ans - 1), String(ans + 1), String(ans), String(ans + 2)];
      answer = 2;
    } else if (grade === 'Class 4') {
      const numerators = [1, 2, 3];
      const den = Math.floor(Math.random() * 4) + 5;
      const num1 = numerators[Math.floor(Math.random() * numerators.length)];
      const num2 = Math.floor(Math.random() * 2) + 1;
      q = `Solve the fraction sum: ${num1}/${den} + ${num2}/${den} = ?`;
      options = [`${num1 + num2 + 1}/${den}`, `${num1 + num2}/${den}`, `${num1 + num2}/${den + 1}`, `${num1}/${den}`];
      answer = 1;
    } else if (grade === 'Class 5') {
      const length = Math.floor(Math.random() * 10) + 5;
      const width = Math.floor(Math.random() * 4) + 2;
      q = `What is the perimeter of a rectangle with length ${length} cm and width ${width} cm?`;
      const ans = 2 * (length + width);
      options = [`${ans - 4} cm`, `${ans} cm`, `${ans + 2} cm`, `${length * width} cm`];
      answer = 1;
    } else if (grade === 'Class 6') {
      const a = Math.floor(Math.random() * 4) + 2;
      const x = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 15) + 1;
      const c = a * x + b;
      q = `Find the value of x if ${a}x + ${b} = ${c}:`;
      options = [String(x - 1), String(x + 1), String(x), String(x + 2)];
      answer = 2;
    } else if (grade === 'Class 7') {
      const pct = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      const val = (Math.floor(Math.random() * 5) + 1) * 40;
      q = `What is ${pct}% of ${val}?`;
      const ans = (pct * val) / 100;
      options = [String(ans - 5), String(ans), String(ans + 5), String(ans * 2)];
      answer = 1;
    } else if (grade === 'Class 8') {
      const side = Math.floor(Math.random() * 9) + 4;
      const ans = side * side;
      q = `If the area of a square is ${ans} cm², what is the length of its side?`;
      options = [`${side - 1} cm`, `${side + 2} cm`, `${side} cm`, `${side * 2} cm`];
      answer = 2;
    } else if (grade === 'Class 9') {
      const x1 = Math.floor(Math.random() * 5) + 1;
      const x2 = Math.floor(Math.random() * 5) + 1;
      const sum = x1 + x2;
      const prod = x1 * x2;
      q = `Find the roots of the quadratic equation: x² - ${sum}x + ${prod} = 0:`;
      options = [`-${x1} and -${x2}`, `${x1} and -${x2}`, `${x1} and ${x2}`, `${x1 + 1} and ${x2 - 1}`];
      answer = 2;
    } else if (grade === 'Class 10') {
      const apStart = Math.floor(Math.random() * 5) + 2;
      const diff = Math.floor(Math.random() * 4) + 2;
      const n = Math.floor(Math.random() * 5) + 6;
      const ans = apStart + (n - 1) * diff;
      q = `Find the ${n}th term of the Arithmetic Progression (AP): ${apStart}, ${apStart + diff}, ${apStart + 2 * diff}...`;
      options = [String(ans - diff), String(ans), String(ans + diff), String(ans + 2 * diff)];
      answer = 1;
    } else if (grade === 'Class 11') {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        const a = Math.floor(Math.random() * 8) + 2;
        q = `Evaluate the limit as x approaches 0 of sin(${a}x) / x:`;
        options = ['0', '1', String(a), 'Undefined'];
        answer = 2;
      } else if (type === 1) {
        const a = [3, 5, 6, 8][Math.floor(Math.random() * 4)];
        const b = a === 3 ? 4 : a === 5 ? 12 : a === 6 ? 8 : 15;
        const ans = Math.sqrt(a * a + b * b);
        q = `What is the modulus of the complex number ${a} - ${b}i?`;
        options = [String(a + b), String(ans), String(ans - 1), String(a * b)];
        answer = 1;
      } else if (type === 2) {
        const n = Math.floor(Math.random() * 3) + 5;
        const r = Math.floor(Math.random() * 2) + 2;
        const fact = (num) => num <= 1 ? 1 : num * fact(num - 1);
        const ans = fact(n) / (fact(r) * fact(n - r));
        q = `Find the value of combination C(${n}, ${r}):`;
        options = [String(ans - 2), String(ans + 5), String(ans), String(ans * 2)];
        answer = 2;
      } else {
        const a = Math.floor(Math.random() * 6) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        q = `Find the derivative of ${a}x² + ${b}x with respect to x:`;
        options = [`${2 * a}x`, `${2 * a}x + ${b}`, `${a}x + ${b}`, `${2 * a}x² + ${b}`];
        answer = 1;
      }
    } else if (grade === 'Advanced') {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        const a = Math.floor(Math.random() * 4) + 2;
        q = `If f(x) = x³ + ${a}x² + ${a * 2}x + 5, what is the number of real roots of f(x) = 0?`;
        options = ['0', '1', '2', '3'];
        answer = 1;
        explanation = `f'(x) = 3x² + ${2 * a}x + ${a * 2}. Discriminant D = ${4 * a * a} - 4*3*${a * 2} = ${4 * a * a - 24 * a} < 0 for a <= 5, meaning f'(x) is always positive. Hence, f(x) is strictly increasing and has exactly 1 real root.`;
      } else if (type === 1) {
        const a = Math.floor(Math.random() * 5) + 2;
        const num = a * a;
        q = `Find the area of the region bounded by the curve y² = ${a}x and the line y = x:`;
        options = [`${num}/3`, `${num}/4`, `${num}/6`, `${num}/12`];
        answer = 2;
        explanation = `Intersections are (0,0) and (${a},${a}). Area = \u222b [y - y²/${a}] dy from 0 to ${a} = [y²/2 - y³/${3 * a}] from 0 to ${a} = ${num}/6.`;
      } else {
        q = `Let A be a 2x2 matrix such that A² = 0. Find the trace of matrix A:`;
        options = ['1', '-1', '0', '2'];
        answer = 2;
        explanation = `Since A² = 0, A is nilpotent. Eigenvalues of a nilpotent matrix are 0, so Trace(A) = 0 + 0 = 0.`;
      }
    }

    if (q) {
      addQ(q, options, answer, 'Math', explanation);
    }
  }

  return shuffleArray([...list, ...generated]);
};

const getMathQuestions = (grade) => {
  return MATH_QUESTIONS[grade] || MATH_QUESTIONS['Class 5'];
};

const getQuestionSet = (grade) => {
  return GENERAL_QUESTIONS[grade] || GENERAL_QUESTIONS['Class 5'];
};

const TIMER_SECONDS = 30;
const categoryColors = {
  'Math': 'bg-blue-100 text-blue-800',
  'Science': 'bg-emerald-100 text-emerald-800',
  'English': 'bg-violet-100 text-violet-800',
  'GK': 'bg-amber-100 text-amber-800',
  'Physics': 'bg-cyan-100 text-cyan-800',
  'Chemistry': 'bg-orange-100 text-orange-800',
  'Biology': 'bg-green-100 text-green-800',
  'History': 'bg-rose-100 text-rose-800',
  'Politics': 'bg-purple-100 text-purple-800',
  'Riddles': 'bg-indigo-100 text-indigo-800',
  'General Knowledge': 'bg-amber-100 text-amber-800',
  'General Affairs': 'bg-purple-100 text-purple-800',
  'Puzzles': 'bg-indigo-100 text-indigo-800',
};

// Remap internal category labels to user-friendly display names
const getCategoryDisplay = (cat) => {
  if (cat === 'Politics') return 'General Affairs';
  if (cat === 'Riddles') return 'Puzzles';
  if (cat === 'History') return 'GK';
  return cat;
};

const getCategoryColor = (cat) => {
  return categoryColors[getCategoryDisplay(cat)] || categoryColors[cat] || 'bg-slate-100 text-slate-700';
};

export default function Quiz({ navigateTo, grade: propGrade, competition: propComp, subject }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const [phase, setPhase] = useState('intro'); // intro | quiz | between-rounds | results
  const [grade, setGrade] = useState(propGrade || '');
  const [questions, setQuestions] = useState([]);
  const [round2Questions, setRound2Questions] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [round1Score, setRound1Score] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [answers, setAnswers] = useState([]);
  const [timerActive, setTimerActive] = useState(false);

  const grades = [
    'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4',
    'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Advanced'
  ];

  // Smart shuffle: ensure first question ≠ last question
  const smartShuffle = (arr) => {
    const a = shuffleArray(arr);
    if (a.length >= 2 && a[0].q === a[a.length - 1].q) {
      // Swap last with a random middle element
      const swapIdx = Math.floor(Math.random() * (a.length - 2)) + 1;
      [a[a.length - 1], a[swapIdx]] = [a[swapIdx], a[a.length - 1]];
    }
    return a;
  };

  const startQuiz = () => {
    let limit = TIMER_SECONDS;
    let bank200 = [];

    if (subject === 'math') {
      const qs = getMathQuestions(grade);
      limit = grade === 'Advanced' ? 120 : TIMER_SECONDS;
      // Math bank is already grade-specific (MATH_QUESTIONS[grade])
      // generateDynamicMathQuestions respects grade difficulty
      bank200 = generateDynamicMathQuestions(grade, qs, 200);
    } else {
      // Build grade-filtered 200-question bank:
      // GK + General Affairs + History: ~150 (75%) | Puzzles: ~40 (20%) | Science: ~10 (5%)
      const gradedPGH     = getGradedQuestions(grade, TAGGED_PGH,     150);
      const gradedRiddles = getGradedQuestions(grade, TAGGED_RIDDLES,  40);
      const gradedScience = getGradedQuestions(grade, TAGGED_SCIENCE,  10);

      const polGkHist = shuffleArray(gradedPGH).slice(0, 150);
      const riddles   = shuffleArray(gradedRiddles).slice(0, 40);
      const science   = shuffleArray(gradedScience).slice(0, 10);
      bank200 = shuffleArray([...polGkHist, ...riddles, ...science]).slice(0, 200);
    }

    // Pick 10 for Round 1, next 10 for Round 2 from the grade-difficulty bank
    const r1 = smartShuffle(bank200.slice(0, 20)).slice(0, 10);
    const r2 = smartShuffle(bank200.slice(20, 40)).slice(0, 10);

    setQuestions(r1);
    setRound2Questions(r2);
    setCurrentRound(1);
    setCurrentIndex(0);
    setScore(0);
    setRound1Score(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsAnswered(isAdmin);
    setTimeLeft(limit);
    setTimerActive(!isAdmin);
    setPhase('quiz');
  };

  const handleTimeUp = useCallback(() => {
    if (!isAnswered) {
      setIsAnswered(true);
      setTimerActive(false);
      setAnswers(prev => [...prev, { selected: null, correct: questions[currentIndex]?.answer }]);
    }
  }, [isAnswered, questions, currentIndex]);

  useEffect(() => {
    if (!timerActive || isAnswered) return;
    if (timeLeft <= 0) { handleTimeUp(); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerActive, isAnswered, handleTimeUp]);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setTimerActive(false);
    const correct = idx === questions[currentIndex].answer;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { selected: idx, correct: questions[currentIndex].answer }]);
  };

  const handleNext = () => {
    const isLastInRound = currentIndex + 1 >= questions.length;

    if (isLastInRound) {
      if (currentRound === 1) {
        // End of Round 1 → show between-round screen
        setRound1Score(score);
        setPhase('between-rounds');
        return;
      }
      // End of Round 2 → go to results
      if (isAdmin) { setPhase('intro'); return; }
      const totalScore = score;
      const totalQs = questions.length + round2Questions.length;
      const results = JSON.parse(localStorage.getItem('onboreding_results') || '[]');
      const newResult = {
        id: Date.now(),
        name: localStorage.getItem('onboreding_student_name') || 'Student',
        grade,
        comp: propComp || 'Quiz Competition',
        score: `${Math.round((totalScore / totalQs) * 100)}%`,
        scoreRaw: totalScore,
        total: totalQs,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        award: totalScore / totalQs >= 0.9 ? 'National Champion' : totalScore / totalQs >= 0.75 ? 'Excellence Gold' : totalScore / totalQs >= 0.5 ? 'Excellence Badge' : 'Participation',
      };
      results.unshift(newResult);
      localStorage.setItem('onboreding_results', JSON.stringify(results.slice(0, 50)));
      setPhase('results');
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelectedOption(null);
    setIsAnswered(isAdmin);
    const limit = grade === 'Advanced' ? 120 : TIMER_SECONDS;
    setTimeLeft(limit);
    setTimerActive(!isAdmin);
  };

  const startRound2 = () => {
    setQuestions(round2Questions);
    setCurrentRound(2);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(isAdmin);
    const limit = grade === 'Advanced' ? 120 : TIMER_SECONDS;
    setTimeLeft(limit);
    setTimerActive(!isAdmin);
    setPhase('quiz');
  };

  const totalQuestionsPlayed = (phase === 'results') ? (questions.length + round2Questions.length) : questions.length;
  const percentage = totalQuestionsPlayed > 0 ? Math.round((score / totalQuestionsPlayed) * 100) : 0;
  const getScoreLabel = () => {
    if (percentage >= 90) return { label: 'Outstanding!', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (percentage >= 75) return { label: 'Excellent!', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (percentage >= 50) return { label: 'Good Job!', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'Keep Practicing!', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
  };

  // ── INTRO SCREEN ─────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#F6F7FA] py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full text-indigo-700 font-bold text-xs tracking-widest uppercase">
              <Brain className="w-4 h-4" />
              <span>Live Quiz Competition</span>
            </div>
            <h1 className="font-poppins text-4xl sm:text-5xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
              {propComp || 'Quiz Challenge'}
            </h1>
            <p className="text-[#64748B] font-medium text-sm sm:text-base max-w-md mx-auto">
              {subject === 'math'
                ? "Questions are tailored to your class level. Select your grade to begin!"
                : "200-question bank · 10 fresh questions per round · 2 rounds · Freshly shuffled every attempt!"
              }
            </p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-900/5 border border-black/10 p-8 space-y-8">
            {/* Grade selector */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Select Your Class / Grade</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {grades.map(g => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                      grade === g
                        ? 'bg-[#030213] text-white border-black shadow-md shadow-slate-900/20 scale-105'
                        : 'bg-slate-50 text-slate-700 border-black/5 hover:border-black/20 hover:text-[#030213]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-[#F6F7FA] border border-black/10 rounded-2xl p-5 space-y-3">
              <h3 className="font-poppins font-bold text-sm text-[#030213]">Quiz Rules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Clock className="w-5 h-5 text-indigo-600" />, title: subject === 'math' && grade === 'Advanced' ? '2 min / question' : '30 sec / question', desc: 'Timer resets each round' },
                  { icon: <Target className="w-5 h-5 text-indigo-600" />, title: '200 Questions', desc: subject === 'math' ? 'Class-specific topics' : 'GK, General Affairs, Puzzles & Science' },
                  { icon: <Trophy className="w-5 h-5 text-emerald-600" />, title: 'Earn Certificate', desc: 'Score 75%+ to win' },
                ].map((r, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-600">
                    <div className="mt-0.5 flex-shrink-0">{r.icon}</div>
                    <div>
                      <span className="block font-bold text-slate-800">{r.title}</span>
                      <span>{r.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={!grade}
              className="w-full bg-[#030213] hover:bg-slate-805 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold py-4 rounded-full text-base tracking-wide shadow-md active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer"
            >
              <Brain className="w-5 h-5" />
              <span>Start Quiz Now</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  // ── BETWEEN-ROUNDS SCREEN ────────────────────────────────────────────────────
  if (phase === 'between-rounds') {
    return (
      <div className="min-h-screen bg-[#F6F7FA] flex items-center justify-center py-8 px-4">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 border-4 border-indigo-300 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-indigo-600" />
          </div>
          <div>
            <div className="inline-block bg-indigo-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
              Round 1 Complete!
            </div>
            <h2 className="font-poppins text-3xl font-black text-[#030213] mb-2">Round 1 Done!</h2>
            <p className="text-slate-500 font-medium">You scored <span className="font-black text-indigo-600">{round1Score} / 10</span> in Round 1</p>
          </div>
          <div className="bg-white rounded-2xl border border-black/10 p-6 space-y-3 text-left">
            <h3 className="font-poppins font-black text-sm uppercase tracking-widest text-slate-400">Round 2 Preview</h3>
            <p className="text-slate-700 font-semibold text-sm">10 new questions await — freshly shuffled from the 200-question bank.</p>
            <p className="text-slate-500 text-xs">Categories: GK · General Affairs · Puzzles · Science</p>
          </div>
          <button
            onClick={startRound2}
            className="w-full bg-[#030213] hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-lg active:scale-95 transition-all flex items-center justify-center space-x-3"
          >
            <span>Start Round 2</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }


  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;
    const limit = grade === 'Advanced' ? 120 : TIMER_SECONDS;
    const timerPercent = (timeLeft / limit) * 100;
    const timerColor = timeLeft > (limit / 2) ? 'bg-emerald-500' : timeLeft > (limit / 4) ? 'bg-amber-500' : 'bg-red-500';

    return (
      <div className="min-h-screen bg-[#F6F7FA] py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white border border-black/10 px-4 py-2 rounded-xl">
                <span className="text-[#030213] font-poppins font-black text-sm">{grade}</span>
              </div>
              {/* Round badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                currentRound === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
              }`}>
                Round {currentRound}
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(q.category)}`}>
                {getCategoryDisplay(q.category)}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-indigo-700">
              <Star className="w-4 h-4 text-indigo-650 text-indigo-600 fill-indigo-600" />
              <span className="font-black text-sm">{score} pts</span>
            </div>
          </div>

          {/* Progress — shows Question X of 10 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-semibold">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% done</span>
            </div>
            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Timer — hidden for admin */}
          {!isAdmin && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time Remaining</span>
                </span>
                <span className={`font-black text-sm ${timeLeft <= 7 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Question Card */}
          <div className="bg-white border border-black/10 rounded-[2rem] p-8 shadow-xl shadow-slate-900/5">
            {/* Admin answer-key banner */}
            {isAdmin && (
              <div className="mb-4 flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-2">
                <ShieldCheck className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <span className="text-yellow-700 font-black text-xs uppercase tracking-widest">Admin View — Correct answer pre-highlighted</span>
              </div>
            )}
            <h2 className="font-poppins font-black text-xl sm:text-2xl text-[#030213] leading-snug mb-8">
              {q.q}
            </h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let style = 'bg-slate-50 border-black/5 text-slate-700 hover:border-black/20 hover:bg-slate-100/50';
                if (isAdmin) {
                  // Admin always sees correct answer in gold, others dimmed
                  if (idx === q.answer) style = 'bg-yellow-50 border-yellow-400 text-yellow-900 ring-2 ring-yellow-400/40';
                  else style = 'bg-slate-50 border-black/5 text-slate-400 opacity-50';
                } else if (isAnswered) {
                  if (idx === q.answer) style = 'bg-emerald-50 border-emerald-500 text-emerald-900';
                  else if (idx === selectedOption && idx !== q.answer) style = 'bg-red-50 border-red-400 text-red-900';
                  else style = 'bg-slate-50 border-black/5 text-slate-400 opacity-60';
                } else if (selectedOption === idx) {
                  style = 'bg-indigo-50 border-indigo-500 text-indigo-950 scale-[1.02]';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => !isAdmin && handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border font-semibold text-sm transition-all duration-200 flex items-center justify-between group ${style} ${!isAnswered && !isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        (isAnswered || isAdmin) && idx === q.answer ? 'bg-yellow-400 border-yellow-400 text-black' :
                        isAnswered && idx === selectedOption ? 'bg-red-500 border-red-500 text-white' :
                        'border-current'
                      }`}>
                        {['A', 'B', 'C', 'D'][idx]}
                      </span>
                      <span>{opt}</span>
                    </span>
                    {(isAnswered || isAdmin) && idx === q.answer && <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                    {!isAdmin && isAnswered && idx === selectedOption && idx !== q.answer && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isAdmin && q.explanation && (
              <div className="mt-6 p-5 rounded-2xl border border-yellow-250 bg-yellow-50/40 space-y-2 text-left">
                <h4 className="font-poppins font-black text-xs uppercase tracking-widest text-yellow-800 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 animate-pulse text-yellow-600" />
                  Detailed Solution (Admin Only)
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {q.explanation}
                </p>
              </div>
            )}

            {/* Admin next button — always visible */}
            {isAdmin ? (
              <div className="mt-6 p-4 rounded-xl border bg-yellow-50 border-yellow-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm font-semibold text-yellow-800">
                  <ShieldCheck className="w-5 h-5 text-yellow-600" />
                  <span>Answer: <strong>{q.options[q.answer]}</strong></span>
                </div>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-[#030213] hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-full text-sm active:scale-95 transition-all cursor-pointer"
                >
              <span>{currentIndex + 1 >= questions.length ? (currentRound === 1 ? 'Finish Round 1' : 'Finish Quiz') : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : isAnswered && (
              <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between ${
                selectedOption === q.answer ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center space-x-2 text-sm font-semibold">
                  {selectedOption === q.answer
                    ? <><CheckCircle className="w-5 h-5 text-emerald-600" /><span className="text-emerald-700">Correct! +1 point</span></>
                    : selectedOption === null
                      ? <><AlertCircle className="w-5 h-5 text-amber-600" /><span className="text-amber-700">Time's up! Correct: {q.options[q.answer]}</span></>
                      : <><XCircle className="w-5 h-5 text-red-600" /><span className="text-red-700">Correct: {q.options[q.answer]}</span></>
                  }
                </div>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-[#030213] hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-full text-sm active:scale-95 transition-all cursor-pointer"
                >
              <span>{currentIndex + 1 >= questions.length ? (currentRound === 1 ? 'Finish Round 1' : 'Finish Quiz') : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const { label, color, bg } = getScoreLabel();
    return (
      <div className="min-h-screen bg-[#F6F7FA] py-16 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Score card */}
          <div className={`rounded-[2.5rem] border border-black/10 p-8 text-center shadow-xl shadow-slate-900/5 bg-white`}>
            <div className="w-24 h-24 bg-[#030213] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="font-poppins font-black text-3xl text-[#030213] mb-1">{label}</h1>
            <p className="text-slate-500 text-sm font-medium mb-6">You completed the {grade} quiz!</p>

            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <span className={`block text-5xl font-black font-poppins ${color}`}>{percentage}%</span>
                <span className="text-xs text-slate-550 text-slate-550 text-slate-500 font-semibold uppercase tracking-wider">Score</span>
              </div>
              <div className="w-px h-12 bg-black/5" />
              <div className="text-center">
            <span className="block text-5xl font-black font-poppins text-[#030213]">{score}/{questions.length + round2Questions.length}</span>
                <span className="text-xs text-slate-550 text-slate-550 text-slate-500 font-semibold uppercase tracking-wider">Correct</span>
              </div>
            </div>

            {/* Answer review */}
            <div className="bg-slate-50 border border-black/5 rounded-2xl p-4 space-y-2 text-left mb-6 max-h-64 overflow-y-auto">
              <h3 className="font-poppins font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">Answer Review</h3>
              {questions.map((q, i) => {
                const a = answers[i];
                const correct = a?.selected === a?.correct;
                return (
                  <div key={i} className={`flex items-center space-x-3 p-2.5 rounded-xl text-xs font-semibold ${correct ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                    {correct ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                    <span className="flex-1 truncate">{q.q}</span>
                    <span className="flex-shrink-0">{q.options[a?.correct]}</span>
                  </div>
                );
              })}
            </div>

            {percentage >= 75 && (
              <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl p-4 mb-6 flex items-center space-x-3">
                <GraduationCap className="w-8 h-8 flex-shrink-0 text-indigo-700" />
                <div className="text-left">
                  <span className="block font-black text-sm text-indigo-950">Certificate Unlocked!</span>
                  <span className="text-xs text-indigo-700/80">Check Results page to download your certificate.</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setPhase('intro'); setGrade(propGrade || ''); }}
              className="flex items-center justify-center space-x-2 bg-white border border-black/10 text-slate-700 font-bold py-3.5 rounded-full hover:bg-slate-50 transition-all active:scale-95 text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={() => navigateTo('results')}
              className="flex items-center justify-center space-x-2 bg-[#030213] hover:bg-slate-805 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full transition-all active:scale-95 text-sm shadow-md cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>View Results</span>
            </button>
          </div>
          <button
            onClick={() => navigateTo('competitions')}
            className="w-full flex items-center justify-center space-x-2 text-indigo-600 font-bold text-sm py-3 hover:underline cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Back to Competitions</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
