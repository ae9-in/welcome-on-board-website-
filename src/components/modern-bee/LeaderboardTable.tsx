import React from 'react';
import { Trophy, Star, Shield } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  fullName: string;
  schoolName: string;
  city: string;
  totalScore: number;
  round1Score: number;
  round2Score: number;
  status: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentStudentName?: string;
}

export function LeaderboardTable({ entries, currentStudentName }: LeaderboardTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold text-white/50 tracking-wider uppercase">
              <th className="px-6 py-4 text-center w-16">Rank</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4 hidden sm:table-cell">School</th>
              <th className="px-6 py-4 text-center">R1</th>
              <th className="px-6 py-4 text-center">R2</th>
              <th className="px-6 py-4 text-right">Total Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-white/40 text-sm">
                  No submissions yet. Be the first to lock in!
                </td>
              </tr>
            ) : (
              entries.map((entry) => {
                const isCurrentUser = currentStudentName && 
                  entry.fullName.toLowerCase().trim() === currentStudentName.toLowerCase().trim();

                let rankBadge = null;
                if (entry.rank === 1) {
                  rankBadge = <Trophy className="w-5 h-5 text-yellow-400 mx-auto fill-yellow-400/20" />;
                } else if (entry.rank === 2) {
                  rankBadge = <Trophy className="w-5 h-5 text-slate-300 mx-auto fill-slate-300/20" />;
                } else if (entry.rank === 3) {
                  rankBadge = <Trophy className="w-5 h-5 text-amber-600 mx-auto fill-amber-600/20" />;
                } else {
                  rankBadge = <span className="font-mono font-bold text-white/60 text-sm">{entry.rank}</span>;
                }

                return (
                  <tr
                    key={entry.rank + entry.fullName}
                    className={`transition-colors hover:bg-white/5 ${
                      isCurrentUser ? 'bg-yellow-400/10 border-y border-yellow-400/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4.5 text-center">{rankBadge}</td>
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${isCurrentUser ? 'text-yellow-400' : 'text-white'}`}>
                          {entry.fullName}
                          {isCurrentUser && (
                            <span className="ml-2 text-[9px] uppercase tracking-wider font-extrabold bg-yellow-400 text-black px-1.5 py-0.5 rounded">
                              YOU
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-white/40 sm:hidden">
                          {entry.schoolName}, {entry.city}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 hidden sm:table-cell">
                      <div className="flex flex-col text-xs text-white/70">
                        <span className="truncate max-w-[200px] font-semibold">{entry.schoolName}</span>
                        <span className="text-[10px] text-white/40">{entry.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-center font-mono text-xs text-purple-300 font-bold">
                      {entry.round1Score}
                    </td>
                    <td className="px-6 py-4.5 text-center font-mono text-xs text-indigo-300 font-bold">
                      {entry.round2Score}
                    </td>
                    <td className="px-6 py-4.5 text-right font-mono font-black text-sm text-yellow-400">
                      {entry.totalScore} pts
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
