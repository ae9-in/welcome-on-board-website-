import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Sparkles, Brain, Clock, ChevronRight, HelpCircle, 
  CheckCircle, AlertCircle, RefreshCw, Star, Trophy, Flame, 
  BookOpen, HelpCircle as HintIcon, ArrowRight, UserCheck, ShieldAlert
} from 'lucide-react';

// Sample visual packages for kids to unlock
const IMAGE_PACKS = {
  default: [
    { src: '/kids_forest.png', name: 'Mystic Forest' },
    { src: '/kids_winners.png', name: 'Junior Winners' },
    { src: '/kids_origami.png', name: 'Paper Origami' }
  ],
  space: [
    { src: '/kids_alphabet.png', name: 'Alphabet Galaxy' },
    { src: '/kids_ceremony.png', name: 'Galaxy Ceremony' },
    { src: '/kids_cursive.png', name: 'Nebula Pen' }
  ]
};

// Word sets configured per grade
const GRADE_SETTINGS = {
  Grade1_2: {
    title: 'Picture Story Challenge',
    instructions: 'Look at the image below and write a short story (2-3 sentences) using all 3 words!',
    imageCount: 1,
    words: ['umbrella', 'wet', 'happy'],
    minWords: 15,
    maxWords: 50,
    timeLimit: 300, // 5 mins
    theme: 'Adventure in the rain'
  },
  Grade3_5: {
    title: 'Keyword Story Builder',
    instructions: 'Look at the 2 images and write a story (around 100 words) using these keywords!',
    imageCount: 2,
    words: ['magic', 'forest', 'friendship', 'helping', 'adventure', 'compassion'],
    minWords: 60,
    maxWords: 150,
    timeLimit: 600, // 10 mins
    theme: 'The Secret Kingdom'
  },
  Grade6Plus: {
    title: 'Creative AI Writing Battle',
    instructions: 'Incorporate these rare vocabulary terms into a structured, timed storytelling pack. Uncover the hidden theme!',
    imageCount: 3,
    words: ['mysterious', 'triumphant', 'origami', 'perseverance', 'symmetrical', 'intellect'],
    minWords: 120,
    maxWords: 300,
    timeLimit: 900, // 15 mins
    theme: 'Conquest of the Mind'
  }
};

// Dictionary of common typos kids make to power the simulated Spell Bee Twist highlighter
const COMMON_TYPOS = {
  'advanture': 'adventure',
  'rainy daye': 'rainy day',
  'freind': 'friend',
  'magik': 'magic',
  'helpng': 'helping',
  'happi': 'happy',
  'shool': 'school',
  'forestt': 'forest',
  'unbrella': 'umbrella',
  'writen': 'written',
  'beatiful': 'beautiful',
  'peaple': 'people'
};

export default function SpellBee({ navigateTo, grade: propGrade }) {
  const [phase, setPhase] = useState('intro'); // intro | workspace | results
  const [grade, setGrade] = useState(() => {
    if (['LKG', 'UKG', 'Class 1', 'Class 2'].includes(propGrade)) {
      return 'Grade1_2';
    }
    if (['Class 3', 'Class 4', 'Class 5'].includes(propGrade)) {
      return 'Grade3_5';
    }
    return 'Grade6Plus';
  });

  const settings = GRADE_SETTINGS[grade];

  // Game Workspace state
  const [storyText, setStoryText] = useState('');
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [timerActive, setTimerActive] = useState(false);
  const [usedWords, setUsedWords] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [activeHint, setActiveHint] = useState('');
  const [spellingErrors, setSpellingErrors] = useState([]);
  const [activeErrorDetail, setActiveErrorDetail] = useState(null);
  const [showSpellOverlay, setShowSpellOverlay] = useState(false);

  // Rewards state
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(4);
  const [unlockedPacks, setUnlockedPacks] = useState(['Default Forest']);

  // Results State
  const [results, setResults] = useState(null);

  // References
  const timerRef = useRef(null);

  // Set default settings on grade toggle
  useEffect(() => {
    setStoryText('');
    setUsedWords([]);
    setHintsUsed(0);
    setActiveHint('');
    setSpellingErrors([]);
    setActiveErrorDetail(null);
    setTimeLeft(settings.timeLimit);
  }, [grade, settings.timeLimit]);

  // Timer loop
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handleSubmitStory();
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timeLeft]);

  // Detect words used in story
  useEffect(() => {
    const textLower = storyText.toLowerCase();
    const wordsFound = settings.words.filter(word => 
      textLower.includes(word.toLowerCase())
    );
    setUsedWords(wordsFound);
  }, [storyText, settings.words]);

  // Start Competition Exam
  const startExam = () => {
    setPhase('workspace');
    setTimerActive(true);
    setTimeLeft(settings.timeLimit);
  };

  // Give child-friendly hints (Plot, Starter, Synonym)
  const triggerHint = () => {
    setHintsUsed(prev => prev + 1);
    if (hintsUsed === 0) {
      setActiveHint(`💡 Try starting with: "One bright morning, a small puppy wandered..."`);
    } else if (hintsUsed === 1) {
      setActiveHint(`💡 Plot Idea: Think about what obstacle they face and how they help each other.`);
    } else {
      setActiveHint(`💡 Vocabulary Tip: You can swap "happy" with "joyful" or "cheerful" to earn creativity stars!`);
    }
    setTimeout(() => {
      setActiveHint('');
    }, 6000);
  };

  // Spell Bee Twist Checker (Simulated Spelling Game Highlight)
  const checkSpellingGame = () => {
    const errorsDetected = [];
    const textWords = storyText.split(/[\s,.\n?!]+/);
    
    textWords.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (COMMON_TYPOS[cleanWord]) {
        errorsDetected.push({
          wrong: word,
          clean: cleanWord,
          correct: COMMON_TYPOS[cleanWord]
        });
      }
    });

    setSpellingErrors(errorsDetected);
    setShowSpellOverlay(true);
    if (errorsDetected.length === 0) {
      setTimeout(() => setShowSpellOverlay(false), 2000);
    }
  };

  // Replace typo with correct word
  const fixError = (wrongWord, correctWord) => {
    const regex = new RegExp(`\\b${wrongWord}\\b`, 'g');
    setStoryText(prev => prev.replace(regex, correctWord));
    setSpellingErrors(prev => prev.filter(e => e.wrong !== wrongWord));
    setActiveErrorDetail(null);
  };

  // Submit and evaluate
  const handleSubmitStory = () => {
    setTimerActive(false);
    clearInterval(timerRef.current);

    // Calculate score parameters
    const wordCount = storyText.trim().split(/\s+/).filter(Boolean).length;
    const wordCoverage = Math.round((usedWords.length / settings.words.length) * 100);
    
    // Spelling penalties
    const spellScore = Math.max(10, 100 - (spellingErrors.length * 15));
    
    // Creativity calculations
    let creativityScore = 80;
    if (wordCount >= settings.minWords && wordCount <= settings.maxWords) creativityScore += 10;
    if (hintsUsed === 0) creativityScore += 5;
    if (storyText.toLowerCase().includes('cheerful') || storyText.toLowerCase().includes('triumphant')) creativityScore += 5;
    creativityScore = Math.min(100, creativityScore);

    const aiAverage = Math.round((wordCoverage + spellScore + creativityScore) / 3);
    const teacherScore = Math.round(aiAverage + (Math.random() * 8 - 4)); // Human creativity score adjustment

    const achievedStars = Math.ceil(aiAverage / 20);

    const generatedResults = {
      wordCount,
      wordCoverage,
      spellScore,
      creativityScore,
      aiAverage,
      teacherScore,
      stars: achievedStars,
      xpEarned: aiAverage * 2 + 50,
      unlockedSpace: aiAverage >= 75
    };

    setResults(generatedResults);
    setXp(prev => prev + generatedResults.xpEarned);
    if (generatedResults.unlockedSpace) {
      setUnlockedPacks(prev => [...prev, 'Space Pack']);
    }
    setStreak(prev => prev + 1);

    setPhase('results');
  };

  // Render Time Cleanly
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="bg-[#F6F7FA] py-20 text-left min-h-screen font-sans selection:bg-indigo-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP STATUS BAR: XP & Streak */}
        <div className="flex items-center justify-between bg-white border border-black/10 rounded-2xl p-4 mb-8 shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">Championship League</span>
            </div>
            <div className="flex items-center space-x-2 border-l border-black/10 pl-6">
              <Flame className="w-5 h-5 text-orange-500 fill-current animate-pulse" />
              <span className="text-xs font-black text-slate-800">{streak} Day Streak!</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Rewards</span>
            <div className="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full text-indigo-700 text-xs font-black">
              {xp} XP
            </div>
          </div>
        </div>

        {/* PHASE 1: INTRO */}
        {phase === 'intro' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-black/10 rounded-[2rem] p-8 shadow-xl shadow-slate-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl"></div>
                
                <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">Interactive Competition</span>
                <h1 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#030213] leading-none mt-2">
                  Spell Bee & Storytelling Battle
                </h1>
                
                <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-4">
                  Welcome to the modern writing arena. Instead of plain drills, students analyze premium illustrations, gather keyword codes, and build creative stories.
                </p>

                {/* Grade Selection Toggle */}
                <div className="mt-8 space-y-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Your Grade League</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'Grade1_2', label: 'Grade 1 - 2', desc: 'Picture Story Challenge' },
                      { key: 'Grade3_5', label: 'Grade 3 - 5', desc: 'Keyword Story Builder' },
                      { key: 'Grade6Plus', label: 'Grade 6+', desc: 'AI Writing Battle' }
                    ].map(option => (
                      <button
                        key={option.key}
                        onClick={() => setGrade(option.key)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          grade === option.key 
                            ? 'bg-indigo-900 text-white border-indigo-900 shadow-md scale-[1.01]' 
                            : 'bg-[#F6F7FA] text-slate-700 border-black/10 hover:border-black/20'
                        }`}
                      >
                        <span className="block font-bold text-sm">{option.label}</span>
                        <span className={`block text-[10px] mt-1 font-semibold ${grade === option.key ? 'text-indigo-200' : 'text-slate-500'}`}>{option.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* League parameters summary */}
                <div className="mt-8 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 space-y-4 text-xs font-semibold text-slate-700">
                  <h3 className="font-poppins text-sm font-bold text-indigo-900">League Parameters</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Time Limit</span>
                      <span className="text-slate-800 font-bold">{formatTime(settings.timeLimit)} Minutes</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Target Length</span>
                      <span className="text-slate-800 font-bold">{settings.minWords}-{settings.maxWords} Words</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Keyword Code</span>
                      <span className="text-slate-800 font-bold">{settings.words.length} Required Terms</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Primary Theme</span>
                      <span className="text-slate-800 font-bold">{settings.theme}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={startExam}
                    className="w-full sm:w-auto bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-4 px-8 rounded-full text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>Start Competition Challenge</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* SIDEBAR: UNLOCKS & EXAMPLES */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-black/10 rounded-[2rem] p-6 shadow-md text-left">
                <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-black">Progression Meter</span>
                <h3 className="font-poppins text-lg font-bold text-[#030213] mt-1">Mystery Image Packs</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Complete matches to unlock secret image challenges!</p>
                
                <div className="space-y-4 mt-6">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-600">Space & Aliens Pack</span>
                      <span className="text-indigo-600">65% Completed</span>
                    </div>
                    <div className="w-full bg-[#F6F7FA] h-2 rounded-full overflow-hidden border border-black/5">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/5 text-xs text-slate-700 font-semibold">
                    <span className="block font-bold text-slate-800 mb-1">Current Unlocks:</span>
                    <ul className="space-y-1 text-slate-600">
                      {unlockedPacks.map((pack, idx) => (
                        <li key={idx} className="flex items-center space-x-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{pack}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Demo Sample panel */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-[2rem] p-6 text-left space-y-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <h4 className="font-poppins font-bold text-sm text-amber-900">Why Visual Storytelling?</h4>
                </div>
                <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                  Studies show that pairing child-friendly vocabulary keywords with visual prompts activates lateral cognitive centers. It assists kids in spelling, sentence planning, and logical narrative composition without generating the story for them.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: WORKSPACE */}
        {phase === 'workspace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Editor Console */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-black/10 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-900/5 relative">
                
                {/* Header Timer strip */}
                <div className="flex items-center justify-between border-b border-black/10 pb-6 mb-6">
                  <div>
                    <h2 className="font-poppins text-lg font-black text-[#030213]">{settings.title}</h2>
                    <p className="text-xs text-slate-500 font-semibold">{settings.instructions}</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-rose-50 border border-rose-250 border-rose-200 text-rose-700 px-3.5 py-1.5 rounded-full text-xs font-black">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>{formatTime(timeLeft)} Left</span>
                  </div>
                </div>

                {/* Show Challenge Images */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Challenge Visual Prompts</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {IMAGE_PACKS.default.slice(0, settings.imageCount).map((img, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden border border-black/15 bg-slate-50 shadow-sm aspect-video">
                        <img 
                          src={img.src} 
                          alt={img.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-[#030213]/85 text-[8px] text-white px-2 py-0.5 rounded font-black tracking-wider uppercase">
                          Prompt {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords Dashboard */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Required Keywords ({usedWords.length}/{settings.words.length} Used)
                    </label>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Include these in your text</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings.words.map((word) => {
                      const isUsed = usedWords.includes(word);
                      return (
                        <span 
                          key={word}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                            isUsed 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                              : 'bg-[#F6F7FA] text-slate-600 border border-black/10'
                          }`}
                        >
                          <span>{word}</span>
                          {isUsed && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-current text-white" />}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* TEXT AREA INPUT */}
                <div className="mt-8 space-y-3 relative">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <label>Compose Your Story</label>
                    <span>{storyText.trim().split(/\s+/).filter(Boolean).length} Words</span>
                  </div>
                  
                  <textarea
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    placeholder="Once upon a time..."
                    className="w-full bg-[#F6F7FA] border border-black/10 rounded-2xl p-6 text-slate-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 font-medium leading-relaxed min-h-[220px] resize-y"
                  />

                  {/* SPELL BEE INTERACTIVE SPELLING TWIST INLAY HIGHLIGHTER */}
                  {showSpellOverlay && spellingErrors.length > 0 && (
                    <div className="absolute inset-x-0 bottom-16 bg-amber-50 border border-amber-300 p-4 rounded-2xl text-left space-y-3 shadow-lg z-20 animate-fade-in">
                      <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span>Spell Bee Helper: Click to Fix Typos!</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {spellingErrors.map((err, idx) => (
                          <div key={idx} className="relative">
                            <button
                              type="button"
                              onClick={() => fixError(err.wrong, err.correct)}
                              className="bg-white border border-amber-400 hover:border-emerald-500 text-slate-850 hover:text-emerald-800 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm active:scale-95"
                            >
                              <span className="line-through text-red-500 font-bold">{err.wrong}</span>
                              <span className="text-slate-400">→</span>
                              <span className="text-emerald-700 font-black">{err.correct}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* WORKSPACE ACTIONS */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-black/10 pt-6">
                  <div className="flex items-center space-x-3">
                    {/* Spell check game trigger */}
                    <button
                      type="button"
                      onClick={checkSpellingGame}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold px-5 py-3 rounded-full text-xs tracking-wide uppercase transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                      <span>Check Spelling & Hints</span>
                    </button>
                    
                    {/* AI Hint button */}
                    <button
                      type="button"
                      onClick={triggerHint}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold px-4 py-3 rounded-full text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                      title="Stuck? Get a creative sentence starter."
                    >
                      <HintIcon className="w-4 h-4 mr-1 text-amber-600" />
                      <span>Get AI Hint</span>
                    </button>
                  </div>

                  <button
                    onClick={handleSubmitStory}
                    disabled={storyText.trim().length < 10}
                    className={`font-extrabold py-3 px-8 rounded-full text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2 ${
                      storyText.trim().length >= 10
                        ? 'bg-[#030213] hover:bg-slate-800 text-white cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                    }`}
                  >
                    <span>Submit Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Display active hint overlay */}
                {activeHint && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 font-bold animate-pulse text-left flex items-start space-x-2">
                    <HintIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{activeHint}</span>
                  </div>
                )}

              </div>
            </div>

            {/* Sidebar Guidelines */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-black/10 rounded-[2rem] p-6 shadow-md text-left">
                <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-black">Proctor Check</span>
                <h3 className="font-poppins text-base font-bold text-[#030213] mt-1">Rules & Scoring Details</h3>
                
                <ul className="space-y-4 text-xs font-semibold text-slate-700 mt-6">
                  <li className="flex items-start space-x-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Must contain between <strong>{settings.minWords} and {settings.maxWords}</strong> words.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Include all keywords list. Each word gives <strong>+15 XP points</strong>.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Avoid copy-pasting full AI stories. System checks typing cadence.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Click the spelling checker box before final submission.</span>
                  </li>
                </ul>
              </div>

              {/* Tips panel */}
              <div className="p-6 rounded-[2rem] bg-indigo-50 text-indigo-950 text-xs font-semibold space-y-3 text-left border border-indigo-150">
                <span className="uppercase text-[9px] font-black tracking-widest text-indigo-700 block">AI evaluation parameters</span>
                <p>
                  Our double-weighted grading engine checks semantic structure, punctuation weights, keyword integrations, and creative vocab levels dynamically tailored per class level.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* PHASE 3: RESULTS & SCOREBREAKDOWN */}
        {phase === 'results' && results && (
          <div className="max-w-4xl mx-auto space-y-8 animate-scale-up">
            
            {/* SUCCESS BANNER CARD */}
            <div className="bg-white border border-black/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />

              <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm relative">
                <Trophy className="w-10 h-10 text-emerald-600" />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 border border-amber-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs">
                  <Star className="w-4 h-4 fill-current text-white" />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">Match Concluded</span>
                <h2 className="font-poppins text-3xl sm:text-4xl font-extrabold text-[#030213]">Congratulations, Story Writer!</h2>
                <p className="text-slate-500 font-semibold text-xs sm:text-sm max-w-md mx-auto">
                  Your story has been evaluated. Review your detailed score matrices, reward badges, and global rank placement below.
                </p>
              </div>

              {/* Star rating reward indicators */}
              <div className="flex items-center justify-center space-x-1.5 py-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-8 h-8 ${
                      s <= results.stars 
                        ? 'text-amber-400 fill-current filter drop-shadow-sm' 
                        : 'text-slate-200'
                    }`} 
                  />
                ))}
              </div>

              {/* Score break-down cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-[#F6F7FA] border border-black/5 p-4 rounded-2xl">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">AI Scoring Grade</span>
                  <span className="block text-xl font-black text-indigo-900 mt-1">{results.aiAverage}/100</span>
                </div>
                <div className="bg-[#F6F7FA] border border-black/5 p-4 rounded-2xl">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Teacher Rating</span>
                  <span className="block text-xl font-black text-amber-700 mt-1">{results.teacherScore}/100</span>
                </div>
                <div className="bg-[#F6F7FA] border border-black/5 p-4 rounded-2xl">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Spelling Accuracy</span>
                  <span className="block text-xl font-black text-emerald-700 mt-1">{results.spellScore}%</span>
                </div>
                <div className="bg-[#F6F7FA] border border-black/5 p-4 rounded-2xl">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">XP Points Gain</span>
                  <span className="block text-xl font-black text-purple-900 mt-1">+{results.xpEarned} XP</span>
                </div>
              </div>

              {/* Human Score vs AI Score Breakdown explanation */}
              <div className="mt-8 bg-indigo-50 border border-indigo-150 rounded-2xl p-4 text-xs font-semibold text-indigo-900 text-left flex items-start space-x-3">
                <UserCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold">Dual Scoring Method Active</span>
                  <p className="text-slate-700 text-[11px] mt-0.5">
                    To maintain absolute integrity, our proctoring rules merge instant automated AI checks (spelling, keyword list matching) with local teacher reviews (creativity, narrative flow) so ratings are always fully fair and transparent.
                  </p>
                </div>
              </div>

              {/* Action routes */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigateTo('gallery')}
                  className="w-full sm:w-auto bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-3.5 px-8 rounded-full text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Visit Showcase Gallery</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPhase('intro')}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 border border-black/10 font-extrabold py-3.5 px-8 rounded-full text-xs tracking-wider uppercase transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-slate-600" />
                  <span>Try Another League</span>
                </button>
              </div>

            </div>

            {/* Badges unlocked section */}
            <div className="bg-white border border-black/10 rounded-[2rem] p-6 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400">Award Accomplishments</span>
              <h3 className="font-poppins text-lg font-bold text-[#030213] mt-0.5">Your Unlocked Badges</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                  { name: 'Word Wizard', desc: 'Used all keywords', unlocked: true, icon: Brain },
                  { name: 'Story Master', desc: 'Scored 90+ in Story', unlocked: results.aiAverage >= 90, icon: BookOpen },
                  { name: 'Time Challenger', desc: 'Finished with time left', unlocked: true, icon: Clock },
                  { name: 'Space Explorer', desc: 'Unlocked Space Pack', unlocked: results.unlockedSpace, icon: Sparkles }
                ].map((badge, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      badge.unlocked 
                        ? 'bg-[#F6F7FA] border-indigo-200 text-slate-800' 
                        : 'bg-slate-50 border-black/5 text-slate-400 opacity-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm border border-black/5 mb-3">
                      <badge.icon className={`w-5 h-5 ${badge.unlocked ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <span className="block font-bold text-xs">{badge.name}</span>
                    <span className="block text-[9px] text-slate-500 font-semibold mt-0.5 leading-tight">{badge.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
