// app/(auth)/forgot-password/page.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsPending(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit reset request.');
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError('Connection failure. Try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-5xl">🔑</span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-3">
              RESET PASSWORD
            </h1>
            <p className="text-white/40 text-sm mt-1">Enter your email to receive a reset token</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm font-bold text-center"
              >
                📬 If an account exists, a reset link has been sent to your email!
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-white/8 transition-all text-sm"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isPending}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/40 text-black font-black py-3.5 rounded-xl transition-all text-sm tracking-wide mt-2 cursor-pointer"
              >
                {isPending ? 'Sending Link...' : 'SEND RESET LINK →'}
              </motion.button>
            </form>
          )}

          <p className="text-center text-white/40 text-sm mt-6">
            Remembered password?{' '}
            <a href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
              Sign In
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
