import React, { useState, useEffect } from 'react';
import { Brain, SpellCheck, Calculator, Palette, PenTool, Star, ChevronRight, Clock, Users, Trophy, Target, Zap, CheckSquare, Lock, AlertCircle, X } from 'lucide-react';

const competitions = [
  {
    id: 'quiz',
    title: 'Quiz Competition',
    desc: 'Test general knowledge, logic, and learning skills through exciting multiple-choice trivia designed for your class level.',
    eligibility: 'KG to 10th Standard',
    icon: Brain,
    tag: 'Mental IQ',
    color: 'blue',
    gradient: 'from-blue-600 to-indigo-700',
    lightBg: 'from-blue-500/10 to-indigo-500/10',
    border: 'border-blue-500/20',
    accent: 'text-blue-300',
    shadow: 'shadow-blue-500/10',
    route: 'quiz',
    type: 'quiz',
    bullets: [
      'Class-adaptive questions (KG → Grade 10)',
      '30-second timer per question',
      'Instant score & certificate',
      'Compete against national peers',
    ],
    participants: 12840,
    endsIn: 5,
  },
  {
    id: 'spell-bee',
    title: 'Spell Bee Competition',
    desc: 'A modern visual storytelling challenge: analyze images, use AI-generated keywords, write creative stories, and get real-time spelling feedback.',
    eligibility: 'KG to 10th Standard',
    icon: SpellCheck,
    tag: 'Language & Creativity',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/20',
    accent: 'text-amber-300',
    shadow: 'shadow-orange-500/10',
    route: 'spellbee',
    type: 'spellbee',
    bullets: [
      'Visual image prompts + keyword codes',
      'Grade-adaptive difficulty (1–2, 3–5, 6+)',
      'Real-time spell-check twist game',
      'AI + Teacher dual scoring system',
    ],
    participants: 9210,
    endsIn: 7,
  },
  {
    id: 'math',
    title: 'Math Challenge',
    desc: 'Strengthen mathematical thinking, logical deductions, and rapid mental calculations with class-appropriate problems.',
    eligibility: 'KG to 10th Standard',
    icon: Calculator,
    tag: 'Logic & Numbers',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-300',
    shadow: 'shadow-teal-500/10',
    route: 'quiz',
    type: 'quiz',
    bullets: [
      'Grade-adaptive arithmetic & algebra',
      'Speed calculations & visual geometry',
      'Detailed diagnostic score report',
      'Builds base for Olympiad exams',
    ],
    participants: 11530,
    endsIn: 4,
  },
  {
    id: 'art-craft',
    title: 'Art & Craft Competition',
    desc: 'Showcase creativity and artistic imagination through theme-based drawing and craft submissions — online or by photo.',
    eligibility: 'KG to 10th Standard',
    icon: Palette,
    tag: 'Creativity & Fine Art',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    lightBg: 'from-pink-500/10 to-rose-500/10',
    border: 'border-pink-500/20',
    accent: 'text-pink-300',
    shadow: 'shadow-pink-500/10',
    route: 'art-craft',
    type: 'drawing',
    bullets: [
      'Draw digitally on canvas OR upload photo',
      'Grade-based drawing prompt',
      'Creativity, neatness & depth scored',
      'Winning art shown in virtual gallery',
    ],
    participants: 7820,
    endsIn: 6,
  },
  {
    id: 'handwriting',
    title: 'Handwriting Competition',
    desc: 'Improve neatness, fine-motor precision, and presentation style through print or cursive handwriting with live canvas.',
    eligibility: 'KG to 10th Standard',
    icon: PenTool,
    tag: 'Presentation Skills',
    color: 'violet',
    gradient: 'from-violet-600 to-purple-700',
    lightBg: 'from-violet-500/10 to-purple-500/10',
    border: 'border-violet-500/20',
    accent: 'text-violet-300',
    shadow: 'shadow-purple-500/10',
    route: 'handwriting',
    type: 'drawing',
    bullets: [
      'Write on digital canvas or take photo',
      'Grade-based handwriting prompt',
      'Judged on symmetry, alignment & flow',
      'Encourages neat writing habits',
    ],
    participants: 8340,
    endsIn: 3,
  },
];

function CountdownDays({ days }) {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date();
      end.setDate(end.getDate() + days);
      const diff = end - now;
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeStr(`${days - 1}d ${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [days]);
  return <span className="font-mono font-black tabular-nums">{timeStr}</span>;
}

function AnimatedCount({ target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      setCount(c => {
        if (c + step >= target) { clearInterval(t); return target; }
        return c + step;
      });
    }, 20);
    return () => clearInterval(t);
  }, [target]);
  return <span>{count.toLocaleString()}</span>;
}

export default function Competitions({ navigateTo, setSelectedComp, activeFigurineBg }) {
  const [alert, setAlert] = useState(null);

  const isRegistered = (compTitle) => {
    const regs = JSON.parse(localStorage.getItem('onboreding_registrations') || '[]');
    return regs.some(r => r.competition === compTitle);
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(null), 4000);
  };

  const handleStart = (comp) => {
    if (!isRegistered(comp.title)) {
      setSelectedComp(comp.title);
      showAlert(`Please register for "${comp.title}" before starting.`);
      setTimeout(() => navigateTo('register'), 1800);
      return;
    }
    setSelectedComp(comp.title);
    const regs = JSON.parse(localStorage.getItem('onboreding_registrations') || '[]');
    const reg = regs.find(r => r.competition === comp.title);
    navigateTo(comp.route, { grade: reg?.grade || '', comp: comp.title, name: reg?.studentName || '' });
  };

  const handleRegister = (comp) => {
    setSelectedComp(comp.title);
    navigateTo('register');
  };

  return (
    <div className="bg-[#F6F7FA] py-20 text-left min-h-screen">
      {alert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-3 bg-amber-600 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-500 animate-bounce-slow">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{alert}</span>
          <button onClick={() => setAlert(null)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white border border-black/10 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden shadow-xl shadow-slate-900/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-[-20%] right-[-10%] w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: activeFigurineBg }} />
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-slate-100 border border-black/5 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-800">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Enrollment Open 2026</span>
            </div>
            <h2 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
              Our Elite Online <br />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Contests</span>
            </h2>
            <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-md">
              5 curated competitions for KG–10th Standard. Questions & tasks adapt to your grade level. Click "Start Now" to compete instantly.
            </p>
          </div>
          <div className="flex flex-row md:flex-col lg:flex-row gap-6 shrink-0 border-t md:border-t-0 md:border-l border-black/10 pt-6 md:pt-0 md:pl-8 w-full md:w-auto justify-around">
            {[
              { label: 'Enrolled Students', value: '50,000+' },
              { label: 'Countries', value: '15+' },
              { label: 'Awards Given', value: '250+' },
            ].map((s, i) => (
              <div key={i} className="text-center md:text-left">
                <span className="block font-poppins font-black text-2xl sm:text-3xl text-indigo-605 text-indigo-600">{s.value}</span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competition Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {competitions.map((comp, idx) => {
          const Icon = comp.icon;
          return (
            <div
              key={comp.id}
              className="bg-white border border-black/10 rounded-[2rem] overflow-hidden hover:border-black/20 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 hover:scale-[1.005]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Visual panel */}
                <div 
                  className={`lg:col-span-5 p-8 flex flex-col justify-between relative text-white min-h-[300px] overflow-hidden ${idx === 0 ? '' : `bg-gradient-to-br ${comp.gradient}`}`}
                  style={idx === 0 ? { backgroundColor: '#d48ab1' } : {}}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-full blur-xl" />

                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Competition #{idx + 1}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wider">{comp.tag}</span>
                        <span className="flex items-center space-x-1 text-xs text-amber-300 font-bold bg-amber-500/20 px-2 py-1 rounded-full border border-amber-500/20">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                          <span>Live</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/15 backdrop-blur-sm border border-white/20 rounded-[1.5rem]">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-4">
                    <h2 className="font-poppins text-2xl lg:text-3xl font-black leading-tight text-white">{comp.title}</h2>
                    <p className="text-xs text-white/80 font-medium leading-relaxed">{comp.desc}</p>

                    {/* Live countdown */}
                    <div className="bg-black/25 backdrop-blur-sm border border-white/10 rounded-[1.5rem] p-4 space-y-1">
                      <div className="flex items-center space-x-2 text-xs text-white/60 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Registration closes in</span>
                      </div>
                      <div className="text-amber-300 text-xs sm:text-sm font-bold">
                        <CountdownDays days={comp.endsIn} />
                      </div>
                    </div>

                    {/* Participant count */}
                    <div className="flex items-center space-x-2 text-xs font-semibold text-white/90">
                      <Users className="w-4 h-4 text-white/70" />
                      <AnimatedCount target={comp.participants} />
                      <span>students enrolled</span>
                    </div>
                  </div>
                </div>

                {/* Content panel */}
                <div className="lg:col-span-7 p-8 flex flex-col justify-between bg-white">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl border border-black/10 bg-slate-50 text-slate-700">
                        {comp.tag}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Free Study Kit Included</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span>KG to 10th Eligible</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-poppins font-black text-xs text-[#030213] uppercase tracking-widest mb-3">What's Included:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-semibold">
                        {comp.bullets.map((b, i) => (
                          <li key={i} className="flex items-start space-x-2 font-medium">
                            <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Type badge */}
                    <div className="p-4 rounded-[1.5rem] border border-black/10 bg-[#F6F7FA] flex items-center space-x-3">
                      <Icon className="w-6 h-6 text-slate-700 flex-shrink-0" />
                      <div>
                        <span className="block text-xs font-black text-[#030213] uppercase tracking-wider">
                          {comp.type === 'quiz' ? 'Live MCQ Quiz' : 'Canvas / Camera Submission'}
                        </span>
                        <span className="text-xs text-slate-650 text-slate-600 font-medium">
                          {comp.type === 'quiz'
                            ? 'Questions automatically match your class level'
                            : 'Draw online or take a photo of your physical work'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-8 border-t border-black/10 mt-8 space-y-3">
                    {!isRegistered(comp.title) && (
                      <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-[1.5rem] px-4 py-2.5 text-xs font-semibold text-amber-800">
                        <Lock className="w-3.5 h-3.5 text-amber-605 text-amber-600 flex-shrink-0" />
                        <span>Register first to unlock this competition.</span>
                      </div>
                    )}
                    {isRegistered(comp.title) && (
                      <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-[1.5rem] px-4 py-2.5 text-xs font-semibold text-emerald-800">
                        <Trophy className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>You are registered! Ready to compete.</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => handleStart(comp)}
                        className={`w-full sm:flex-1 flex items-center justify-center space-x-2 bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-4 px-6 rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-wide cursor-pointer`}
                      >
                        {isRegistered(comp.title) ? (
                          <><span>Start Competition Now</span><ChevronRight className="w-5 h-5" /></>
                        ) : (
                          <><Lock className="w-4 h-4" /><span>Register to Start</span><ChevronRight className="w-5 h-5" /></>
                        )}
                      </button>
                      {!isRegistered(comp.title) && (
                        <button
                          onClick={() => handleRegister(comp)}
                          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white border-2 border-[#030213] text-[#030213] hover:bg-[#030213] hover:text-white font-bold py-4 px-6 rounded-full active:scale-95 transition-all text-sm cursor-pointer"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Register Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
