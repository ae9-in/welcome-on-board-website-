// app/(admin)/admin/dashboard/page.tsx
'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  const mockStats = [
    { label: 'Active Sessions', value: '1', icon: '📅', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Words in Bank', value: '9', icon: '🗂️', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Registered Students', value: '12,840', icon: '👥', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Welcome header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight">ADMIN PLATFORM CONSOLE</h1>
        <p className="text-white/40 text-sm">Welcome back, {session?.user?.name || 'Administrator'}. Monitor sessions, adjust scoring, and publish results.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {mockStats.map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <span className={`text-3xl p-3 rounded-xl ${stat.bg}`}>{stat.icon}</span>
              <div>
                <span className="block text-white/40 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                <span className={`block text-2xl font-black tracking-tight ${stat.color} mt-1`}>{stat.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick shortcuts */}
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-md">
        <h2 className="text-lg font-black tracking-wide mb-6">QUICK ADMINISTRATIVE ACTIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/sessions" className="bg-white/5 hover:bg-white/8 border border-white/5 hover:border-white/10 p-5 rounded-2xl transition-all hover:scale-[1.01]">
            <span className="block text-xl mb-2">📅</span>
            <span className="block text-sm font-bold text-white mb-1">Manage Sessions</span>
            <span className="block text-xs text-white/40 leading-relaxed">Create new competitions, review schedules, and edit structures.</span>
          </Link>
          
          <Link href="/admin/word-bank" className="bg-white/5 hover:bg-white/8 border border-white/5 hover:border-white/10 p-5 rounded-2xl transition-all hover:scale-[1.01]">
            <span className="block text-xl mb-2">🗂️</span>
            <span className="block text-sm font-bold text-white mb-1">Slang Word Bank</span>
            <span className="block text-xs text-white/40 leading-relaxed">Add words, situational clues, pronunciations, and category tags.</span>
          </Link>

          <Link href="/admin/users" className="bg-white/5 hover:bg-white/8 border border-white/5 hover:border-white/10 p-5 rounded-2xl transition-all hover:scale-[1.01]">
            <span className="block text-xl mb-2">👥</span>
            <span className="block text-sm font-bold text-white mb-1">User Permissions</span>
            <span className="block text-xs text-white/40 leading-relaxed">Assign roles (judge, pronouncer, student) and set overrides.</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
