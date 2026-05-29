import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trophy, Download, X, Star, GraduationCap, Medal, RefreshCw, Brain, PenTool, CheckCircle } from 'lucide-react';

const STATIC_RESULTS = [
  { id: 's1', rank: '1st', name: 'Sneha Malhotra', grade: 'Grade 5', comp: 'Spell Bee Competition', score: '99.2%', award: 'National Champion', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200', source: 'official' },
  { id: 's2', rank: '2nd', name: 'Rohan Sharma', grade: 'Grade 4', comp: 'Quiz Competition', score: '98.5%', award: 'Excellence Gold', badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200', source: 'official' },
  { id: 's3', rank: '3rd', name: 'Mia Carter', grade: 'Grade 2', comp: 'Art & Craft Competition', score: '97.8%', award: 'Excellence Silver', badgeColor: 'bg-orange-50 text-orange-700 border-orange-200', source: 'official' },
  { id: 's4', rank: '4th', name: 'Aditya Deshmukh', grade: 'Grade 8', comp: 'Handwriting Competition', score: '96.4%', award: 'Excellence Bronze', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200', source: 'official' },
  { id: 's5', rank: '5th', name: 'Kunal Sen', grade: 'Grade 7', comp: 'Math Challenge', score: '95.1%', award: 'Top Rank Medal', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', source: 'official' },
];

const awardColors = {
  'National Champion': 'bg-amber-50 text-amber-700 border-amber-200',
  'Excellence Gold': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Excellence Silver': 'bg-orange-50 text-orange-700 border-orange-200',
  'Excellence Bronze': 'bg-blue-50 text-blue-700 border-blue-200',
  'Top Rank Medal': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Participation': 'bg-slate-50 text-slate-700 border-black/10',
};

export default function Results({ navigateTo }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const loadResults = useCallback(() => {
    const local = JSON.parse(localStorage.getItem('onboreding_results') || '[]');
    const studentName = localStorage.getItem('onboreding_student_name') || '';

    const mapped = local.map((r, i) => ({
      id: r.id,
      rank: `#${i + 1}`,
      name: r.name || studentName || 'You',
      grade: r.grade,
      comp: r.comp,
      score: r.score,
      award: r.award || 'Participation',
      badgeColor: awardColors[r.award] || awardColors['Participation'],
      source: 'local',
      date: r.date,
      scoreRaw: r.scoreRaw,
      total: r.total,
    }));

    setAllResults([...mapped, ...STATIC_RESULTS]);
  }, []);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const myResults = allResults.filter(r => r.source === 'local');
  const officialResults = allResults.filter(r => r.source === 'official');

  const displayResults = (() => {
    let base = activeTab === 'my' ? myResults : activeTab === 'official' ? officialResults : allResults;
    if (!searchTerm.trim()) return base;
    const t = searchTerm.toLowerCase();
    return base.filter(r =>
      r.name.toLowerCase().includes(t) ||
      r.grade.toLowerCase().includes(t) ||
      r.comp.toLowerCase().includes(t)
    );
  })();

  return (
    <div className="bg-[#F6F7FA] py-20 text-left min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">Event Winners</span>
          <h2 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
            Championship Results
          </h2>
          <p className="text-sm text-slate-600 font-semibold leading-relaxed">
            Track your quiz scores, view certificates, and see where you rank. Your results update instantly after each competition.
          </p>
        </div>

        {/* CTA banner if no personal results */}
        {myResults.length === 0 && (
          <div className="mb-10 bg-white border border-black/10 rounded-[2rem] p-6 sm:p-8 text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
            <div className="space-y-2 text-center sm:text-left z-10">
              <h3 className="font-poppins font-black text-xl text-[#030213]">Your Results Will Appear Here!</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold">Complete a quiz or submit your handwriting to see your score and certificate.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 z-10 w-full sm:w-auto">
              <button
                onClick={() => navigateTo('competitions')}
                className="flex items-center justify-center space-x-2 bg-[#030213] hover:bg-slate-800 text-white font-extrabold px-6 py-3.5 rounded-full text-xs sm:text-sm active:scale-95 transition-all shadow-md cursor-pointer uppercase tracking-wider"
              >
                <Brain className="w-4 h-4" />
                <span>Take a Quiz</span>
              </button>
              <button
                onClick={() => navigateTo('competitions')}
                className="flex items-center justify-center space-x-2 bg-white border-2 border-[#030213] text-[#030213] hover:bg-[#030213] hover:text-white font-extrabold px-6 py-3.5 rounded-full text-xs sm:text-sm active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
              >
                <PenTool className="w-4 h-4" />
                <span>Submit Work</span>
              </button>
            </div>
          </div>
        )}

        {/* Tabs + Search bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="flex bg-white border border-black/10 rounded-full p-1 shadow-md space-x-1">
            {[
              { key: 'all', label: 'All Results' },
              { key: 'my', label: `My Results ${myResults.length > 0 ? `(${myResults.length})` : ''}` },
              { key: 'official', label: 'Official Rankings' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#030213] text-white shadow-md'
                    : 'text-slate-600 hover:text-[#030213] hover:bg-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + refresh */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Search name, grade, competition..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white text-slate-800 py-3 px-4 pl-10 rounded-full border border-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs sm:text-sm font-semibold placeholder-slate-400"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
            <button
              onClick={loadResults}
              className="p-3 bg-white border border-black/10 rounded-full hover:bg-slate-50 active:scale-95 transition-all shadow-sm text-slate-700 cursor-pointer"
              title="Refresh results"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white border border-black/10 rounded-[2rem] shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="text-[10px] text-slate-500 bg-slate-50 border-b border-black/10 uppercase font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4.5">Rank</th>
                  <th className="px-6 py-4.5">Student Name</th>
                  <th className="px-6 py-4.5">Grade</th>
                  <th className="px-6 py-4.5">Competition</th>
                  <th className="px-6 py-4.5">Score</th>
                  <th className="px-6 py-4.5">Award</th>
                  <th className="px-6 py-4.5 text-center">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs font-semibold text-slate-700 bg-white">
                {displayResults.length > 0 ? displayResults.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className={`hover:bg-slate-50/50 transition-colors ${row.source === 'local' ? 'bg-indigo-50/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 font-bold">
                        {row.source === 'local' ? (
                          <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded border border-indigo-200 uppercase">You</span>
                        ) : idx < 3 ? (
                          <Trophy className={`w-4 h-4 ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : 'text-orange-500'}`} />
                        ) : null}
                        <span className={idx < 3 && row.source !== 'local' ? 'text-[#030213] font-black' : 'text-slate-500'}>{row.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#030213]">{row.name}</td>
                    <td className="px-6 py-4 text-slate-600">{row.grade}</td>
                    <td className="px-6 py-4 text-slate-600">{row.comp}</td>
                    <td className="px-6 py-4 font-poppins text-indigo-600 font-extrabold text-sm">{row.score}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] uppercase font-bold tracking-wider ${row.badgeColor}`}>
                        {row.award}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedCertificate(row)}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-full border border-black/10 transition-all active:scale-95 text-[11px] tracking-wide cursor-pointer"
                      >
                        View Certificate
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-slate-400 font-medium">
                      <div className="space-y-2">
                        <Medal className="w-8 h-8 text-slate-300 mx-auto" />
                        <p>No results found. {activeTab === 'my' ? 'Complete a competition to see your score here!' : 'Try a different search term.'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Certificate Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full border-[16px] border-black relative overflow-hidden p-2 animate-scale-up">
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 bg-slate-100 border border-black/10 hover:bg-slate-200 text-slate-800 p-2.5 rounded-full z-20 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 sm:p-12 text-center relative border border-black/5 rounded-[1.5rem] bg-[#F6F7FA]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl" />

                <div className="space-y-6 relative z-10">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto relative border border-amber-200">
                    <GraduationCap className="w-8 h-8 text-amber-600" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center border border-amber-600">
                      <Star className="w-3 h-3 fill-current text-white" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-poppins text-3xl font-black text-[#030213] tracking-wide">OnBoarding Certificate</h2>
                    <p className="text-[10px] text-amber-600 font-black tracking-widest uppercase">Of Academic Accomplishment</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Proudly Conferred To</p>
                    <h3 className="font-poppins text-3xl sm:text-4xl font-extrabold text-indigo-900 italic tracking-wide">
                      {selectedCertificate.name}
                    </h3>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed max-w-md mx-auto">
                      for securing <span className="text-amber-600 font-black text-sm">{selectedCertificate.rank} Rank</span> in the{' '}
                      <span className="text-indigo-650 font-extrabold block text-sm mt-1">
                        {selectedCertificate.comp} ({selectedCertificate.grade})
                      </span>
                      achieving an evaluation score of <span className="text-indigo-600 font-bold">{selectedCertificate.score}</span>.
                    </p>
                  </div>

                  {parseInt(selectedCertificate.score) >= 75 && (
                    <div className="flex items-center justify-center space-x-2 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl py-2.5 px-4 max-w-sm mx-auto">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold">Excellence Certificate Awarded</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 border-t border-black/10 pt-6 text-[10px] text-slate-500 font-semibold">
                    <div className="space-y-1">
                      <span className="block text-slate-800 font-bold font-poppins">Dr. Amanda Pierce</span>
                      <span>Chief Academic Judge</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-slate-800 font-bold font-poppins">OnBoarding Org.</span>
                      <span>Verify: OB-{selectedCertificate.name?.split(' ')[0]}-{Date.now().toString().slice(-4)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => { alert('Downloading certificate PDF... (Simulated)'); setSelectedCertificate(null); }}
                    className="bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-3.5 px-8 rounded-full text-xs tracking-wider uppercase flex items-center space-x-2 active:scale-95 transition-transform shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
