// components/auth/LoginForm.tsx
'use client';
import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginInput = z.infer<typeof LoginSchema>;

// Error message map → user-friendly text
const ERROR_MAP: Record<string, string> = {
  CredentialsSignin: 'Incorrect email or password.',
  AdminsMustUseCredentials: 'Admin accounts must use email + password login, not Google.',
  AccountSuspended: 'Your account has been suspended. Contact support.',
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError = searchParams.get('error');

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(
    urlError ? (ERROR_MAP[urlError] ?? urlError) : null
  );
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const emailValue = watch('email');

  // Live role hint: detect admin/school email patterns
  const getRoleHint = (email: string): string | null => {
    if (!email.includes('@')) return null;
    const domain = email.split('@')[1];
    if (domain === 'modernbee.com' || domain === 'admin.modernbee.com') return 'admin';
    if (domain?.includes('school') || domain?.includes('edu')) return 'student';
    return null;
  };
  const roleHint = getRoleHint(emailValue ?? '');

  const onSubmit = (data: LoginInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError(ERROR_MAP[result.error] ?? result.error);
        return;
      }

      // Fetch session to get role-based redirect
      const session = await fetch('/api/auth/session').then(r => r.json());
      const destination = callbackUrl || session?.user?.redirectTo || '/student/dashboard';
      router.replace(destination);
      router.refresh();
    });
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: callbackUrl || '/student/dashboard' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-4"
    >
      {/* Card */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-5xl mb-3"
          >
            🐝
          </motion.div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            THE MODERN BEE
          </h1>
          <p className="text-white/40 text-sm mt-1">onboreding · Sign in to continue</p>
        </div>

        {/* Role hint badge */}
        <AnimatePresence>
          {roleHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2"
            >
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">
                {roleHint === 'admin' ? '🛡️ Admin Portal' : '🎓 Student Portal'}
              </span>
              <span className="text-white/40 text-xs">detected</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error alert */}
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm"
            >
              ⚠️ {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-white/8 transition-all text-sm"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-white/60 text-xs font-medium uppercase tracking-wide">
                Password
              </label>
              <a href="/forgot-password" className="text-purple-400 text-xs hover:text-purple-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 focus:bg-white/8 transition-all text-sm"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isPending}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/40 text-black font-black py-3.5 rounded-xl transition-all text-sm tracking-wide mt-2 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'SIGN IN →'}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 text-xs">or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google Sign In (students only) */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-white text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
        >
          {isGoogleLoading ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Continue with Google
        </motion.button>
        <p className="text-white/20 text-[10px] text-center mt-2">Google sign-in available for students only</p>

        {/* Register link */}
        <p className="text-center text-white/40 text-sm mt-6">
          New student?{' '}
          <a href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
            Create account
          </a>
        </p>
      </div>

      {/* Role portals hint */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { label: '🛡️ Admin Portal', hint: 'Staff & organisers' },
          { label: '🎓 Student Portal', hint: 'Grades 1–11' },
        ].map(p => (
          <div key={p.label} className="bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3 text-center">
            <div className="text-white/70 text-xs font-semibold">{p.label}</div>
            <div className="text-white/25 text-[10px] mt-0.5">{p.hint}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
