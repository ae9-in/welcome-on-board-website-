// components/student/OwnAnswerKey.tsx
'use client';
import { useEffect, useState } from 'react';

interface OwnAnswerKeyProps {
  attemptId: string;
}

export function OwnAnswerKey({ attemptId }: OwnAnswerKeyProps) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKey() {
      try {
        const res = await fetch(`/api/student/answer-key/${attemptId}`);
        const resData = await res.json();
        if (!res.ok) {
          setError(resData.error || 'Failed to fetch personal review key.');
          return;
        }
        setData(resData);
      } catch (err) {
        setError('Connection failure.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchKey();
  }, [attemptId]);

  if (isLoading) {
    return <div className="text-white/40 text-xs text-center py-8">Fetching spelling reviews...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-xs text-center py-8">⚠️ {error}</div>;
  }

  return (
    <div className="space-y-8 text-white">
      {/* Overview */}
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        <h3 className="text-lg font-black tracking-wide text-yellow-400 mb-2 uppercase">CHALLENGE RUN VERDICT</h3>
        <p className="text-xs text-white/50">Verify your responses vs the official answer key below.</p>
      </div>

      {/* Round 1 */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 border-b border-white/5 pb-2">Round 1 (Dictation) Review</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.round1Answers.map((ans: any, i: number) => (
            <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="block text-[9px] font-bold text-white/40 uppercase tracking-widest">Target Slang Term</span>
                <span className="text-lg font-black tracking-tight text-white mt-1 inline-block">{ans.targetWord}</span>
              </div>
              
              <div className="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-xs">
                <div>
                  <span className="block text-white/40 text-[9px] uppercase tracking-wider font-bold">Your spelling</span>
                  <span className={`font-bold text-sm mt-0.5 inline-block ${ans.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {ans.submittedAnswer || '[No response]'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-white/40 text-[9px] uppercase tracking-wider font-bold">Latency</span>
                  <span className="text-white/60 font-semibold mt-0.5 inline-block">{ans.timeTakenMs / 1000}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Round 2 */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 border-b border-white/5 pb-2">Round 2 (Decryption) Review</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.round2Answers.map((ans: any, i: number) => (
            <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-[8px] font-bold text-indigo-300 uppercase tracking-wider mb-2">
                  {ans.clueType} Clue
                </span>
                <p className="text-xs font-semibold text-white/80 leading-relaxed italic">"{ans.situationalPrompt || ans.formalSynonym || ans.millennialCrossRef}"</p>
              </div>

              <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center text-xs">
                <div>
                  <span className="block text-white/40 text-[9px] uppercase tracking-wider font-bold">Target Word: <strong className="text-white">{ans.targetWord}</strong></span>
                  <span className={`font-bold text-sm mt-0.5 inline-block ${ans.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    Your Answer: {ans.submittedAnswer || '[No response]'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
