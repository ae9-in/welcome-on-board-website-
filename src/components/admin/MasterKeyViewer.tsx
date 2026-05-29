// components/admin/MasterKeyViewer.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModernBeeTTS } from '@/lib/tts';
import { 
  Play, 
  Volume2, 
  Search, 
  Filter, 
  Award, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  VolumeX
} from 'lucide-react';

interface Props { sessionId: string }

export function MasterKeyViewer({ sessionId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [groupFilter, setGroupFilter] = useState('all');
  const [roundFilter, setRoundFilter] = useState('all');
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);
  const ttsRef = useRef<ModernBeeTTS | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (groupFilter !== 'all') params.set('group', groupFilter);
    if (roundFilter !== 'all') params.set('round', roundFilter);
    setLoading(true);
    fetch(`/api/admin/master-key/${sessionId}?${params}`)
      .then(r => r.json())
      .then(d => { 
        setData(d); 
        setLoading(false); 
      })
      .catch(e => {
        console.error('Failed to load master key:', e);
        setLoading(false);
      });
  }, [sessionId, groupFilter, roundFilter]);

  const playWordAudio = async (entry: any) => {
    if (ttsRef.current) {
      ttsRef.current.stop();
    }
    
    if (playingWordId === entry.wordId) {
      setPlayingWordId(null);
      return;
    }

    setPlayingWordId(entry.wordId);

    const tts = new ModernBeeTTS({
      targetWord: entry.targetWord,
      ttsOverrideText: entry.ttsOverrideText ?? '',
      stressPattern: entry.stressPattern ?? '',
      audioUrlHighQuality: entry.audioUrlHighQuality ?? '',
      audioUrl: entry.audioUrl ?? '',
      partOfSpeech: entry.partOfSpeech,
      definition: entry.definition,
      exampleSentence1: entry.exampleSentence1,
      exampleSentence2: entry.exampleSentence2,
    });
    ttsRef.current = tts;

    await tts.playFullPronouncer();
    setPlayingWordId(null);
  };

  const stopAudio = () => {
    if (ttsRef.current) {
      ttsRef.current.stop();
    }
    setPlayingWordId(null);
  };

  const filtered = data?.masterKey?.filter((entry: any) => {
    const q = searchQuery.toLowerCase();
    return !q || entry.targetWord.toLowerCase().includes(q) ||
      entry.definition?.toLowerCase().includes(q);
  }) ?? [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        <span className="text-white/40 text-sm">Loading master key data...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 text-white">
      {/* Session summary cards */}
      {data?.sessionSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Words', value: data.sessionSummary.totalWords, icon: '🗂️' },
            { label: 'Round 1 Words', value: data.sessionSummary.round1Words, icon: '🎙️' },
            { label: 'Round 2 Words', value: data.sessionSummary.round2Words, icon: '💡' },
            { label: 'Total Student Submissions', value: data.sessionSummary.totalStudents, icon: '👥' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden backdrop-blur-md">
              <span className="text-2xl p-3 bg-white/5 rounded-xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-black text-yellow-400 tracking-tight">{stat.value}</div>
                <div className="text-white/40 text-[10px] uppercase font-bold tracking-wider mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hardest / Easiest words */}
      {data?.sessionSummary?.hardestWords?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hardest Words */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 relative overflow-hidden">
            <h3 className="text-xs font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <AlertCircle className="w-4 h-4" /> Hardest Words (Lowest Accuracy)
            </h3>
            <div className="space-y-3">
              {data.sessionSummary.hardestWords.map((w: any) => (
                <div key={w.word} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="font-mono text-white/90 uppercase tracking-wider">{w.word}</span>
                    <span className="text-red-400">{w.correctPct}% accuracy</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${w.correctPct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Easiest Words */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <Award className="w-4 h-4" /> Easiest Words (Highest Accuracy)
            </h3>
            <div className="space-y-3">
              {data.sessionSummary.easiestWords.map((w: any) => (
                <div key={w.word} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="font-mono text-white/90 uppercase tracking-wider">{w.word}</span>
                    <span className="text-emerald-400">{w.correctPct}% accuracy</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${w.correctPct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Control panel: search & filters */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
          <input
            type="text"
            placeholder="Search words or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Round Filter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-white/40" />
            <select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              className="bg-transparent text-xs text-white/80 focus:outline-none cursor-pointer pr-4"
            >
              <option value="all" className="bg-slate-900 text-white">All Rounds</option>
              <option value="1" className="bg-slate-900 text-white">Round 1 (Dictation)</option>
              <option value="2" className="bg-slate-900 text-white">Round 2 (Context)</option>
            </select>
          </div>

          {/* Group Filter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-white/40" />
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="bg-transparent text-xs text-white/80 focus:outline-none cursor-pointer pr-4"
            >
              <option value="all" className="bg-slate-900 text-white">All Groups</option>
              <option value="group1" className="bg-slate-900 text-white">Group 1</option>
              <option value="group2" className="bg-slate-900 text-white">Group 2</option>
              <option value="group3" className="bg-slate-900 text-white">Group 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Words Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 border border-white/5 bg-white/[0.01] rounded-2xl">
            <span className="block text-2xl">📭</span>
            <span className="block text-white/40 text-sm mt-2">No words match your filters.</span>
          </div>
        ) : (
          filtered.map((entry: any) => {
            const isExpanded = expandedWord === entry.wordId;
            const isCurrentPlaying = playingWordId === entry.wordId;
            return (
              <div
                key={entry.wordId}
                className={`bg-white/[0.02] border transition-all duration-300 rounded-2xl overflow-hidden ${
                  isExpanded ? 'border-yellow-400/40 bg-white/[0.03]' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Header card header click targets expansion */}
                <div
                  onClick={() => setExpandedWord(isExpanded ? null : entry.wordId)}
                  className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black tracking-wider text-yellow-400 font-mono uppercase">
                        {entry.targetWord}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30 uppercase">
                        {entry.partOfSpeech}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 capitalize">
                        {entry.group}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs truncate max-w-xl">
                      {entry.definition}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                    {/* Word-level stats summary */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-400">{entry.stats.correctPct}%</div>
                        <div className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Accuracy</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white/70">{entry.stats.total}</div>
                        <div className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Attempts</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Audio playback button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrentPlaying) stopAudio();
                          else playWordAudio(entry);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isCurrentPlaying
                            ? 'bg-yellow-400 border-yellow-500 text-black animate-pulse'
                            : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {isCurrentPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-black/20"
                    >
                      <div className="p-6 border-t border-white/10 space-y-6">
                        {/* Word details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            {/* Definition */}
                            <div className="space-y-1">
                              <span className="text-[10px] text-yellow-400/70 font-black uppercase tracking-wider flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" /> Formal Dictionary Definition
                              </span>
                              <p className="text-white/80 text-sm leading-relaxed bg-white/[0.01] border border-white/5 rounded-xl p-3.5">
                                {entry.definition}
                              </p>
                            </div>

                            {/* Examples */}
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Example Sentence 1</span>
                                <p className="text-white/60 text-xs italic bg-white/[0.01] border border-white/5 rounded-xl p-3">
                                  "{entry.exampleSentence1}"
                                </p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Example Sentence 2</span>
                                <p className="text-white/60 text-xs italic bg-white/[0.01] border border-white/5 rounded-xl p-3">
                                  "{entry.exampleSentence2}"
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Slang details */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 grid grid-cols-1 gap-3">
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-white/40 font-bold">Situational Prompt:</span>
                                <span className="text-xs text-white/80 max-w-[200px] text-right truncate" title={entry.situationalPrompt}>{entry.situationalPrompt || '—'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-white/40 font-bold">Formal Synonym:</span>
                                <span className="text-xs text-white/80">{entry.formalSynonym || '—'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-white/40 font-bold">Millennial Cross-ref:</span>
                                <span className="text-xs text-white/80">{entry.millennialCrossRef || '—'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-white/40 font-bold">Phonetic IPA:</span>
                                <span className="text-xs font-mono text-purple-300">/{entry.pronunciation || '—'}/</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-white/40 font-bold">Stress Pattern:</span>
                                <span className="text-xs font-mono text-yellow-400 font-black">{entry.stressPattern || '—'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-white/40 font-bold">Difficulty Score:</span>
                                <span className="text-xs font-bold text-yellow-400">{entry.difficultyScore} / 10</span>
                              </div>
                            </div>

                            {/* Additional Actions */}
                            <button
                              onClick={() => playWordAudio(entry)}
                              className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold py-3 px-6 rounded-xl transition-all shadow-md active:scale-98 text-xs tracking-wider uppercase cursor-pointer"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              <span>{isCurrentPlaying ? 'Stop Audio Read' : 'Hear Pronouncer Sequence'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Submission status breakdown */}
                        <div className="border-t border-white/5 pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black text-white/50 uppercase tracking-wider">Live student responses</h4>
                            <div className="flex gap-3 text-[10px] text-white/60">
                              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {entry.stats.correct} Correct</span>
                              <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-400" /> {entry.stats.wrong} Incorrect</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-white/30" /> {entry.stats.blank} Blank</span>
                            </div>
                          </div>

                          {entry.responses.length === 0 ? (
                            <div className="text-center py-6 text-xs text-white/35 bg-white/[0.01] rounded-xl border border-white/5">
                              No students have attempted this session yet.
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                              {entry.responses.map((resp: any) => (
                                <div
                                  key={resp.studentId}
                                  className={`flex flex-col p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-help relative group/tooltip ${
                                    resp.isCorrect
                                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 font-bold'
                                      : resp.submittedAnswer === ''
                                        ? 'bg-white/[0.02] border-white/5 text-white/40'
                                        : 'bg-red-500/10 border-red-500/20 text-red-300 font-bold'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[10px] font-semibold gap-1.5">
                                    <span className="truncate max-w-[85px]">{resp.fullName}</span>
                                    <span>{resp.isCorrect ? '✓' : resp.submittedAnswer === '' ? '—' : '✗'}</span>
                                  </div>
                                  {resp.submittedAnswer !== '' && (
                                    <span className="text-[9px] font-mono opacity-80 mt-0.5 truncate uppercase">
                                      "{resp.submittedAnswer}"
                                    </span>
                                  )}
                                  
                                  {/* Tooltip on hover */}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-white/10 rounded-xl p-3 text-[10px] text-white hidden group-hover/tooltip:block z-50 shadow-2xl font-normal leading-relaxed">
                                    <p className="font-extrabold text-yellow-400 text-xs border-b border-white/5 pb-1 mb-1">{resp.fullName}</p>
                                    <p className="text-white/60">{resp.schoolName}</p>
                                    <p className="text-white/60">Grade {resp.grade}</p>
                                    <p className="mt-2 text-white/90">
                                      Submitted: <span className="font-mono text-yellow-400 font-black uppercase">"{resp.submittedAnswer || '—'}"</span>
                                    </p>
                                    <p>Time Taken: {(resp.timeTakenMs / 1000).toFixed(1)} seconds</p>
                                    {resp.lifeUsed && <p className="text-purple-400 font-bold mt-1">♥ Heart Lifeline Used</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
