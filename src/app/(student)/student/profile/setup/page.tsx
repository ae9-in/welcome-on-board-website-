// app/(student)/student/profile/setup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [grade, setGrade] = useState('5');
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !city || !parentEmail || !parentPhone) {
      setError('Please fill in all profile fields.');
      return;
    }

    setIsPending(true);
    setError(null);
    try {
      const res = await fetch('/api/student/profile-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          schoolName,
          city,
          parentEmail,
          parentPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update profile.');
        return;
      }

      // Update NextAuth session to trigger studentProfile binding
      await update({
        ...session,
        user: {
          ...session?.user,
          studentProfile: data.studentId,
        }
      });

      router.replace('/student/dashboard');
      router.refresh();
    } catch (err) {
      setError('Connection issue. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center py-12 px-4 relative text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <span className="text-5xl">✍️</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-3">COMPLETE CHALLENGER PROFILE</h1>
          <p className="text-white/40 text-sm mt-1">Provide your details to unlock Spelling Bee competitions</p>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
              Grade Level (1 to 11)
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm font-semibold"
            >
              {Array.from({ length: 11 }, (_, i) => String(i + 1)).map(g => (
                <option key={g} value={g} className="bg-[#080810] text-white">Grade {g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
              School Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Greenwood International"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Los Angeles"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Parent Email
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Parent Phone
              </label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="Parent Phone"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm font-mono"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isPending}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/40 text-white font-black py-3.5 rounded-xl transition-all text-sm tracking-wide mt-4 cursor-pointer"
          >
            {isPending ? 'Saving Profile...' : 'COMPLETE PROFILE →'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
