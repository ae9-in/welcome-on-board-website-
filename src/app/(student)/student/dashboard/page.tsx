// app/(student)/student/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Student } from '@/models/Student';
import { Session } from '@/models/Session';
import Link from 'next/link';

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const student = await Student.findOne({ userId: (session?.user as any).id });
  
  // Fetch active tournament session
  const activeSessions = await Session.find({ status: 'open' }).lean();

  return (
    <div className="space-y-8 text-white">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full text-blue-300 font-bold text-xs uppercase tracking-wider">
            ⚡ Level Up
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">WELCOME BACK, {student?.fullName || session?.user?.name}!</h1>
          <p className="text-white/60 text-sm max-w-xl font-medium leading-relaxed">
            Ready to test your spelling skills? Your grade is registered in <strong className="text-blue-300">Grade {student?.grade || 'N/A'}</strong> (Division: <strong className="text-blue-300">{student?.group === 'group1' ? 'Group 1 (Grades 1-3)' : student?.group === 'group2' ? 'Group 2 (Grades 4-7)' : 'Group 3 (Grades 8-11)'}</strong>).
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active competitions */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-lg font-black tracking-wide uppercase border-b border-white/10 pb-3">Available Spelling Leagues</h2>
          
          {activeSessions.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center text-white/40">
              No active spelling leagues are currently open. Check back soon!
            </div>
          ) : (
            <div className="space-y-4">
              {activeSessions.map((s: any) => (
                <div key={s._id.toString()} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all hover:border-white/20">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-yellow-400">{s.title}</h3>
                    <p className="text-xs text-white/50">Scheduled At: {new Date(s.scheduledAt).toLocaleString()}</p>
                    <div className="flex gap-2">
                      <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] text-white/60 font-bold uppercase tracking-wider">
                        {s.round1Config.wordsPerGroup} Words
                      </span>
                      <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] text-white/60 font-bold uppercase tracking-wider">
                        {s.round2Config.cluesPerGroup} Clues
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/competitions/modern-bee`}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer inline-block whitespace-nowrap self-stretch sm:self-auto text-center"
                  >
                    Enter Arena →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar panels */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-black tracking-wide uppercase border-b border-white/10 pb-3">Student Stats</h2>
          
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40 text-xs font-semibold">Total Points</span>
              <span className="text-sm font-bold text-yellow-400">{student?.totalPoints || 0} pts</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40 text-xs font-semibold">Division Rank</span>
              <span className="text-sm font-bold">Unranked</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-white/40 text-xs font-semibold">Division League</span>
              <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">{student?.group}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
