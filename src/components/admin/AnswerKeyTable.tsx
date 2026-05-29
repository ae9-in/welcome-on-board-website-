// components/admin/AnswerKeyTable.tsx
'use client';
import { useState } from 'react';

interface AnswerKeyTableProps {
  answerKey: any[];
}

export function AnswerKeyTable({ answerKey }: AnswerKeyTableProps) {
  const [selectedAttempt, setSelectedAttempt] = useState<any | null>(null);

  return (
    <div className="space-y-6 text-white">
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-wider text-white/50">
                <th className="p-4 font-bold hidden md:table-cell">Reg Number</th>
                <th className="p-4 font-bold">Student Name</th>
                <th className="p-4 font-bold hidden sm:table-cell">Grade</th>
                <th className="p-4 font-bold hidden sm:table-cell">Round 1 Acc</th>
                <th className="p-4 font-bold hidden sm:table-cell">Round 2 Acc</th>
                <th className="p-4 font-bold">Total Score</th>
                <th className="p-4 font-bold hidden sm:table-cell">Status</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-semibold">
              {answerKey.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-yellow-400 hidden md:table-cell">{item.registrationNumber}</td>
                  <td className="p-4">
                    <div>
                      <span className="block">{item.fullName}</span>
                      <span className="text-[10px] text-white/40 block mt-0.5 sm:hidden">
                        Grade {item.grade} • {item.registrationNumber}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">{item.grade}</td>
                  <td className="p-4 text-emerald-400 hidden sm:table-cell">{item.round1Accuracy}%</td>
                  <td className="p-4 text-indigo-400 hidden sm:table-cell">{item.round2Accuracy}%</td>
                  <td className="p-4 text-yellow-400 font-bold">{item.totalScore} pts</td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide ${
                      item.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/25'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedAttempt(item)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {selectedAttempt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#0f0f1a] border border-white/10 rounded-3xl w-full max-w-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto relative space-y-6">
            <button
              onClick={() => setSelectedAttempt(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-xl cursor-pointer"
            >
              ✕
            </button>

            <div>
              <h3 className="text-xl font-black text-yellow-400 tracking-tight">{selectedAttempt.fullName}</h3>
              <p className="text-white/40 text-xs mt-1">School: {selectedAttempt.schoolName} | Division: {selectedAttempt.group}</p>
            </div>

            {/* Round 1 Answers */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 border-b border-white/5 pb-2">Round 1 (Dictation) Logs</h4>
              {selectedAttempt.round1Answers.length === 0 ? (
                <div className="text-xs text-white/30 italic">No answers logged.</div>
              ) : (
                <div className="space-y-2">
                  {selectedAttempt.round1Answers.map((ans: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl text-xs">
                      <div>
                        <span className="block text-white/50 text-[9px] uppercase tracking-wider font-bold">Category: {ans.category}</span>
                        <span className="text-sm font-bold mt-1 inline-block">Target: {ans.targetWord}</span>
                      </div>
                      <div className="text-right">
                        <span className={`block font-bold ${ans.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          Answer: {ans.submittedAnswer || '[Timeout]'}
                        </span>
                        <span className="block text-white/30 text-[10px] mt-0.5">{ans.timeTakenMs / 1000}s response latency</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Round 2 Answers */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 border-b border-white/5 pb-2">Round 2 (Decryption) Logs</h4>
              {selectedAttempt.round2Answers.length === 0 ? (
                <div className="text-xs text-white/30 italic">No answers logged.</div>
              ) : (
                <div className="space-y-2">
                  {selectedAttempt.round2Answers.map((ans: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl text-xs">
                      <div>
                        <span className="block text-white/50 text-[9px] uppercase tracking-wider font-bold">Type: {ans.clueType}</span>
                        <span className="text-sm font-bold mt-1 inline-block">Target: {ans.targetWord}</span>
                      </div>
                      <div className="text-right">
                        <span className={`block font-bold ${ans.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          Answer: {ans.submittedAnswer || '[Timeout]'}
                        </span>
                        <span className="block text-white/30 text-[10px] mt-0.5">{ans.timeTakenMs / 1000}s response latency</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
