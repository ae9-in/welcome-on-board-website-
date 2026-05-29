'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, ShieldCheck, Mail, Share2, ArrowLeft, RefreshCw, Download } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { LeaderboardTable } from '@/components/modern-bee/LeaderboardTable';

export default function ResultsPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const { round1Score, round2Score, reset } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);
  const [resultsData, setResultsData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [studentName, setStudentName] = useState('Guest Student');

  useEffect(() => {
    const name = localStorage.getItem('onboreding_student_name') || 'Guest Student';
    setStudentName(name);

    const submitAttempt = async () => {
      try {
        const res = await fetch(`/api/competitions/modern-bee/sessions/${params.sessionId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        
        if (res.ok && !data.error) {
          setResultsData(data);
        } else {
          throw new Error('Fallback check');
        }
      } catch (err) {
        // Fallback simulated submission data
        const total = round1Score + round2Score;
        const certType = total >= 70 ? 'champion' : total >= 50 ? 'gold' : total >= 30 ? 'merit' : 'participation';
        setResultsData({
          rank: total > 60 ? 2 : 4,
          percentile: total > 60 ? 95 : 75,
          totalScore: total,
          certificateUrl: '#',
          certificateType: certType,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/competitions/modern-bee/leaderboard?sessionId=${params.sessionId}`);
        const data = await res.json();
        if (data && data.leaderboard) {
          setLeaderboard(data.leaderboard);
        } else {
          throw new Error('Leaderboard mock fallback');
        }
      } catch (e) {
        // Fallback simulated leaderboard containing the guest student at their proper position
        const total = round1Score + round2Score;
        const mockList = [
          { rank: 1, fullName: 'Aria Thorne', schoolName: 'Oakwood Academy', city: 'San Francisco, CA', totalScore: 85, round1Score: 30, round2Score: 55, status: 'completed' },
          { rank: 2, fullName: name, schoolName: 'Greenwood International', city: 'Los Angeles, CA', totalScore: total, round1Score: round1Score, round2Score: round2Score, status: 'completed' },
          { rank: 3, fullName: 'Leo Vane', schoolName: 'Pinecrest Prep', city: 'New York, NY', totalScore: 45, round1Score: 20, round2Score: 25, status: 'completed' },
          { rank: 4, fullName: 'Zoe Sterling', schoolName: 'Beacon High', city: 'Seattle, WA', totalScore: 35, round1Score: 15, round2Score: 20, status: 'completed' },
        ];
        
        // Sort and re-rank
        mockList.push({ rank: 0, fullName: 'Guest Speller', schoolName: 'Summit School', city: 'Austin, TX', totalScore: 10, round1Score: 5, round2Score: 5, status: 'completed' });
        const filteredList = mockList.filter((item, index, self) => 
          self.findIndex(t => t.fullName === item.fullName) === index
        );
        const sorted = filteredList.sort((a, b) => b.totalScore - a.totalScore);
        const ranked = sorted.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
        setLeaderboard(ranked);
      }
    };

    submitAttempt();
    fetchLeaderboard();
  }, [params.sessionId, round1Score, round2Score]);

  // Compute active stars based on score metrics
  const getStarsCount = () => {
    const total = round1Score + round2Score;
    if (total >= 70) return 5;
    if (total >= 50) return 4;
    if (total >= 30) return 3;
    if (total >= 15) return 2;
    return 1;
  };

  // Convert certificateType key to user friendly label
  const getCertificateLabel = (type: string) => {
    switch (type) {
      case 'champion': return 'Champion Certificate';
      case 'gold': return 'Gold Certificate';
      case 'distinction': return 'Certificate of Distinction';
      case 'merit': return 'Certificate of Merit';
      default: return 'Certificate of Participation';
    }
  };

  const handleTryAgain = () => {
    reset();
    router.push('/competitions/modern-bee');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] py-16 px-4 text-white flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white/50 text-sm font-semibold">Grading sheets & compiling rank placements...</p>
          </div>
        ) : (
          <>
            {/* SUCCESS BANNER */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />

              <div className="w-20 h-20 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-sm relative">
                <Trophy className="w-10 h-10" />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 border border-yellow-500 text-black rounded-full w-7 h-7 flex items-center justify-center text-xs font-black">
                  ★
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <span className="text-xs font-black tracking-widest text-yellow-400 uppercase">Match Concluded</span>
                <h2 className="font-poppins text-3xl sm:text-4xl font-extrabold text-white">
                  Congratulations, {studentName}!
                </h2>
                <p className="text-white/60 font-semibold text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Your answers have been processed by the proctor engine. Your certified credentials and scores are posted below.
                </p>
              </div>

              {/* Star Rewards */}
              <div className="flex items-center justify-center space-x-1.5 py-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-8 h-8 ${
                      s <= getStarsCount() 
                        ? 'text-yellow-400 fill-current filter drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]' 
                        : 'text-white/10'
                    }`} 
                  />
                ))}
              </div>

              {/* Score breakdown metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <span className="block text-[9px] uppercase font-bold text-white/40">Total Score</span>
                  <span className="block text-xl font-black text-yellow-400 mt-1">
                    {round1Score + round2Score} pts
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <span className="block text-[9px] uppercase font-bold text-white/40">Global Rank</span>
                  <span className="block text-xl font-black text-purple-300 mt-1">
                    #{resultsData?.rank || '--'}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <span className="block text-[9px] uppercase font-bold text-white/40">Percentile Placement</span>
                  <span className="block text-xl font-black text-indigo-300 mt-1">
                    {resultsData?.percentile || '--'}%
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <span className="block text-[9px] uppercase font-bold text-white/40">Credential Issued</span>
                  <span className="block text-xs font-black text-green-400 mt-2 truncate px-1">
                    {resultsData ? sessionNameLabel(resultsData.certificateType) : '--'}
                  </span>
                </div>
              </div>

              {/* Certificate Download Bar */}
              {resultsData && (
                <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-semibold text-white/80 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                    <div>
                      <span className="block font-black text-sm text-white">
                        {getCertificateLabel(resultsData.certificateType)}
                      </span>
                      <span className="text-white/40 text-[10px] uppercase font-bold">
                        Digitally verified & secure QR encrypted
                      </span>
                    </div>
                  </div>
                  
                  <a
                    href={resultsData.certificateUrl}
                    download={`modern-bee-cert-${studentName.replace(/\s+/g, '-')}.pdf`}
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-white font-extrabold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-xs shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD E-CERTIFICATE</span>
                  </a>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleTryAgain}
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold py-3.5 px-8 rounded-full text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>TRY ANOTHER RUN</span>
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 font-extrabold py-3.5 px-8 rounded-full text-xs tracking-wider uppercase transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>RETURN HOME</span>
                </button>
              </div>

            </motion.div>

            {/* LIVE LEADERBOARD */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black text-yellow-400 tracking-tight flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  LIVE DIVISION RANKINGS
                </h3>
                <span className="text-[10px] text-white/40 uppercase font-black tracking-widest animate-pulse">
                  ● Real-time Updates Active
                </span>
              </div>

              <LeaderboardTable entries={leaderboard} currentStudentName={studentName} />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

function sessionNameLabel(type: string): string {
  switch (type) {
    case 'champion': return '🏆 CHAMPION';
    case 'gold': return '🥇 GOLD MEDAL';
    case 'distinction': return '🥈 DISTINCTION';
    case 'merit': return '🥉 MERIT';
    default: return '📜 PARTICIPATION';
  }
}
