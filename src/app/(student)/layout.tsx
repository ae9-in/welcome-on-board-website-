// app/(student)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import React from 'react';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'student') {
    redirect('/login?error=Forbidden');
  }

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col text-white">
      {/* Top Navigation */}
      <header className="bg-white/[0.02] border-b border-white/10 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/student/dashboard" className="text-yellow-400 font-black text-xl flex items-center gap-2">
              <span>🐝</span>
              <span>Modern Bee</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/50">
              <Link href="/student/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/student/history" className="hover:text-white transition-colors">Score History</Link>
              <Link href="/student/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white text-xs font-semibold">{session?.user?.name}</div>
              <div className="text-blue-400 text-[9px] font-bold uppercase tracking-wider mt-0.5">🎓 Student</div>
            </div>
            <Link 
              href="/api/auth/signout"
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-7xl mx-auto p-6 md:p-8 w-full">
        {children}
      </main>
    </div>
  );
}
