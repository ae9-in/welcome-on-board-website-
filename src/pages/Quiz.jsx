import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Clock, CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw, Star, AlertCircle, Target, GraduationCap, ChevronRight } from 'lucide-react';

// ─── Class-Based Question Bank ────────────────────────────────────────────────
const QUESTION_BANK = {
  KG: [
    { q: 'What color is the sky?', options: ['Red', 'Blue', 'Green', 'Yellow'], answer: 1, category: 'General Knowledge' },
    { q: 'How many fingers do you have on one hand?', options: ['3', '4', '5', '6'], answer: 2, category: 'Math' },
    { q: 'Which animal says "Moo"?', options: ['Dog', 'Cat', 'Cow', 'Sheep'], answer: 2, category: 'Science' },
    { q: 'What shape is the sun?', options: ['Square', 'Triangle', 'Rectangle', 'Circle'], answer: 3, category: 'General Knowledge' },
    { q: 'Which fruit is red and sweet?', options: ['Lemon', 'Apple', 'Banana', 'Grape'], answer: 1, category: 'Science' },
    { q: 'How many days are in a week?', options: ['5', '6', '7', '8'], answer: 2, category: 'Math' },
    { q: 'What do you use to write?', options: ['Pencil', 'Scissors', 'Eraser', 'Ruler'], answer: 0, category: 'General Knowledge' },
    { q: 'Which is the biggest animal?', options: ['Cat', 'Dog', 'Horse', 'Elephant'], answer: 3, category: 'Science' },
  ],
  Grade1_2: [
    { q: '3 + 5 = ?', options: ['7', '8', '9', '6'], answer: 1, category: 'Math' },
    { q: 'Which letter comes after D?', options: ['C', 'E', 'F', 'B'], answer: 1, category: 'English' },
    { q: 'What is the capital of India?', options: ['Mumbai', 'Delhi', 'Chennai', 'Kolkata'], answer: 1, category: 'GK' },
    { q: 'How many months are in a year?', options: ['10', '11', '12', '13'], answer: 2, category: 'Math' },
    { q: 'Which planet do we live on?', options: ['Mars', 'Venus', 'Earth', 'Jupiter'], answer: 2, category: 'Science' },
    { q: 'What is 10 - 4?', options: ['5', '6', '7', '8'], answer: 1, category: 'Math' },
    { q: 'Which season has snow?', options: ['Summer', 'Spring', 'Winter', 'Autumn'], answer: 2, category: 'Science' },
    { q: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], answer: 1, category: 'Math' },
  ],
  Grade3_5: [
    { q: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], answer: 2, category: 'GK' },
    { q: '12 × 5 = ?', options: ['55', '60', '65', '70'], answer: 1, category: 'Math' },
    { q: 'Which gas do plants absorb?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 2, category: 'Science' },
    { q: 'What is the synonym of "Happy"?', options: ['Sad', 'Angry', 'Joyful', 'Tired'], answer: 2, category: 'English' },
    { q: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], answer: 2, category: 'GK' },
    { q: '144 ÷ 12 = ?', options: ['10', '11', '12', '13'], answer: 2, category: 'Math' },
    { q: 'Who wrote "Romeo and Juliet"?', options: ['Dickens', 'Shakespeare', 'Keats', 'Shelley'], answer: 1, category: 'English' },
    { q: 'The heart is part of which system?', options: ['Nervous', 'Digestive', 'Circulatory', 'Skeletal'], answer: 2, category: 'Science' },
    { q: 'What is 25% of 200?', options: ['25', '50', '75', '100'], answer: 1, category: 'Math' },
    { q: 'Which continent is Egypt in?', options: ['Asia', 'Europe', 'Africa', 'Australia'], answer: 2, category: 'GK' },
  ],
  Grade6_8: [
    { q: 'What is 12 × 13?', options: ['144', '156', '148', '160'], answer: 1, category: 'Math' },
    { q: 'H2O is the chemical formula for?', options: ['Hydrogen', 'Oxygen', 'Water', 'Salt'], answer: 2, category: 'Science' },
    { q: 'The speed of light is approximately?', options: ['2×10⁸ m/s', '3×10⁸ m/s', '4×10⁸ m/s', '1×10⁸ m/s'], answer: 1, category: 'Physics' },
    { q: 'Who discovered gravity?', options: ['Einstein', 'Newton', 'Galileo', 'Darwin'], answer: 1, category: 'Science' },
    { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'], answer: 2, category: 'Biology' },
    { q: 'Solve: 3x + 9 = 18. Find x.', options: ['2', '3', '4', '5'], answer: 1, category: 'Math' },
    { q: 'What is the antonym of "Benevolent"?', options: ['Kind', 'Generous', 'Malevolent', 'Gentle'], answer: 2, category: 'English' },
    { q: 'Which gas is most abundant in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], answer: 2, category: 'Chemistry' },
    { q: 'The Mughal Empire was founded by?', options: ['Akbar', 'Humayun', 'Babur', 'Aurangzeb'], answer: 2, category: 'History' },
    { q: 'What is the area of a circle with radius 7? (π≈22/7)', options: ['154', '144', '164', '174'], answer: 0, category: 'Math' },
  ],
  Grade9_10: [
    { q: 'Newton\'s Second Law: F = ?', options: ['ma', 'mv', 'mg', 'mgh'], answer: 0, category: 'Physics' },
    { q: 'The atomic number of Carbon is?', options: ['5', '6', '7', '8'], answer: 1, category: 'Chemistry' },
    { q: 'What is the derivative of sin(x)?', options: ['-cos(x)', 'cos(x)', '-sin(x)', 'tan(x)'], answer: 1, category: 'Math' },
    { q: 'Ohm\'s Law: V = ?', options: ['IR', 'I/R', 'I+R', 'I-R'], answer: 0, category: 'Physics' },
    { q: 'DNA stands for?', options: ['Deoxyribonucleic Acid', 'Deoxyribose Nucleic Acid', 'Diribonucleic Acid', 'Dynamic Nucleic Acid'], answer: 0, category: 'Biology' },
    { q: 'The French Revolution occurred in?', options: ['1689', '1776', '1789', '1804'], answer: 2, category: 'History' },
    { q: 'log₁₀(1000) = ?', options: ['2', '3', '4', '10'], answer: 1, category: 'Math' },
    { q: 'The process of photosynthesis takes place in the?', options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Ribosome'], answer: 2, category: 'Biology' },
    { q: 'What is the SI unit of electric charge?', options: ['Volt', 'Ampere', 'Coulomb', 'Watt'], answer: 2, category: 'Physics' },
    { q: 'Who wrote "Pride and Prejudice"?', options: ['Charlotte Brontë', 'Emily Brontë', 'Jane Austen', 'Virginia Woolf'], answer: 2, category: 'English' },
  ],
};

const getQuestionSet = (grade) => {
  if (grade === 'Kindergarten (KG)') return QUESTION_BANK.KG;
  if (['1st Standard', '2nd Standard'].includes(grade)) return QUESTION_BANK.Grade1_2;
  if (['3rd Standard', '4th Standard', '5th Standard'].includes(grade)) return QUESTION_BANK.Grade3_5;
  if (['6th Standard', '7th Standard', '8th Standard'].includes(grade)) return QUESTION_BANK.Grade6_8;
  return QUESTION_BANK.Grade9_10;
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
  'General Knowledge': 'bg-amber-100 text-amber-800',
};

export default function Quiz({ navigateTo, grade: propGrade, competition: propComp }) {
  const [phase, setPhase] = useState('intro'); // intro | quiz | results
  const [grade, setGrade] = useState(propGrade || '');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [answers, setAnswers] = useState([]);
  const [timerActive, setTimerActive] = useState(false);

  const grades = [
    'Kindergarten (KG)', '1st Standard', '2nd Standard', '3rd Standard',
    '4th Standard', '5th Standard', '6th Standard', '7th Standard',
    '8th Standard', '9th Standard', '10th Standard',
  ];

  const startQuiz = () => {
    const qs = getQuestionSet(grade);
    const shuffled = [...qs].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(true);
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
    if (currentIndex + 1 >= questions.length) {
      // Save to localStorage
      const results = JSON.parse(localStorage.getItem('onboreding_results') || '[]');
      const newResult = {
        id: Date.now(),
        name: localStorage.getItem('onboreding_student_name') || 'Student',
        grade,
        comp: propComp || 'Quiz Competition',
        score: `${Math.round((score / questions.length) * 100)}%`,
        scoreRaw: score,
        total: questions.length,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        award: score / questions.length >= 0.9 ? 'National Champion' : score / questions.length >= 0.75 ? 'Excellence Gold' : score / questions.length >= 0.5 ? 'Excellence Badge' : 'Participation',
      };
      results.unshift(newResult);
      localStorage.setItem('onboreding_results', JSON.stringify(results.slice(0, 50)));
      setPhase('results');
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(true);
  };

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
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
            <p className="text-slate-605 text-slate-600 font-medium text-sm sm:text-base max-w-md mx-auto">
              Questions are tailored to your class level. Select your grade to begin!
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
                  { icon: <Clock className="w-5 h-5 text-indigo-600" />, title: '30 sec / question', desc: 'Timer resets each round' },
                  { icon: <Target className="w-5 h-5 text-indigo-600" />, title: '8 Questions', desc: 'Class-specific topics' },
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

  // ── QUIZ SCREEN ───────────────────────────────────────────────────────────────
  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;
    const timerPercent = (timeLeft / TIMER_SECONDS) * 100;
    const timerColor = timeLeft > 15 ? 'bg-emerald-500' : timeLeft > 7 ? 'bg-amber-500' : 'bg-red-500';

    return (
      <div className="min-h-screen bg-[#F6F7FA] py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white border border-black/10 px-4 py-2 rounded-xl">
                <span className="text-[#030213] font-poppins font-black text-sm">{grade}</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[q.category] || 'bg-slate-100 text-slate-700'}`}>
                {q.category}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-indigo-700">
              <Star className="w-4 h-4 text-indigo-650 text-indigo-600 fill-indigo-600" />
              <span className="font-black text-sm">{score} pts</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-semibold">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% done</span>
            </div>
            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-slate-655 text-slate-600 font-semibold">
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

          {/* Question Card */}
          <div className="bg-white border border-black/10 rounded-[2rem] p-8 shadow-xl shadow-slate-900/5">
            <h2 className="font-poppins font-black text-xl sm:text-2xl text-[#030213] leading-snug mb-8">
              {q.q}
            </h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let style = 'bg-slate-50 border-black/5 text-slate-700 hover:border-black/20 hover:bg-slate-100/50';
                if (isAnswered) {
                  if (idx === q.answer) style = 'bg-emerald-50 border-emerald-500 text-emerald-900';
                  else if (idx === selectedOption && idx !== q.answer) style = 'bg-red-50 border-red-400 text-red-900';
                  else style = 'bg-slate-50 border-black/5 text-slate-400 opacity-60';
                } else if (selectedOption === idx) {
                  style = 'bg-indigo-50 border-indigo-500 text-indigo-950 scale-[1.02]';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border font-semibold text-sm transition-all duration-200 flex items-center justify-between group ${style} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        isAnswered && idx === q.answer ? 'bg-emerald-500 border-emerald-500 text-white' :
                        isAnswered && idx === selectedOption ? 'bg-red-500 border-red-500 text-white' :
                        'border-current'
                      }`}>
                        {['A', 'B', 'C', 'D'][idx]}
                      </span>
                      <span>{opt}</span>
                    </span>
                    {isAnswered && idx === q.answer && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                    {isAnswered && idx === selectedOption && idx !== q.answer && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between ${
                selectedOption === q.answer ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-250'
              }`}>
                <div className="flex items-center space-x-2 text-sm font-semibold">
                  {selectedOption === q.answer
                    ? <><CheckCircle className="w-5 h-5 text-emerald-600" /><span className="text-emerald-700">Correct! +1 point</span></>
                    : selectedOption === null
                      ? <><AlertCircle className="w-5 h-5 text-amber-600" /><span className="text-amber-700">Time's up! Correct answer: {q.options[q.answer]}</span></>
                      : <><XCircle className="w-5 h-5 text-red-600" /><span className="text-red-700">Correct answer: {q.options[q.answer]}</span></>
                  }
                </div>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-[#030213] hover:bg-slate-805 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-full text-sm active:scale-95 transition-all cursor-pointer"
                >
                  <span>{currentIndex + 1 >= questions.length ? 'Finish' : 'Next'}</span>
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
                <span className="block text-5xl font-black font-poppins text-[#030213]">{score}/{questions.length}</span>
                <span className="text-xs text-slate-550 text-slate-550 text-slate-500 font-semibold uppercase tracking-wider">Correct</span>
              </div>
            </div>

            {/* Answer review */}
            <div className="bg-slate-50 border border-black/5 rounded-2xl p-4 space-y-2 text-left mb-6">
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
