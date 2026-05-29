// components/auth/RegisterForm.tsx
'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  grade: z.coerce.number().min(1, 'Grade must be at least 1').max(11, 'Grade must be at most 11'),
  schoolName: z.string().min(2, 'Enter your school name'),
  city: z.string().min(2, 'Enter your city'),
  parentEmail: z.string().email('Enter a valid parent email'),
  parentPhone: z.string().min(10, 'Enter a valid phone number'),
});

type RegisterInput = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema) as any,
    defaultValues: {
      grade: 5,
    }
  });

  const onSubmit = (data: RegisterInput) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const resData = await res.json();
        
        if (!res.ok) {
          setServerError(resData.error || 'Failed to create student account.');
          return;
        }

        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err) {
        setServerError('Network connection issue. Please try again.');
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-4"
    >
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-5xl">🎓</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-3">
            CREATE CHALLENGER PROFILE
          </h1>
          <p className="text-white/40 text-sm mt-1">Enroll in The Modern Bee spelling league</p>
        </div>

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

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm font-bold text-center"
            >
              🎉 Profile Registered Successfully! Redirecting to login...
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Full Name
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="Student Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="student@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Grade */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Grade Level (1 to 11)
              </label>
              <input
                {...register('grade')}
                type="number"
                placeholder="e.g. 5"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm font-mono"
              />
              {errors.grade && (
                <p className="text-red-400 text-xs mt-1">{errors.grade.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* School Name */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                School Name
              </label>
              <input
                {...register('schoolName')}
                type="text"
                placeholder="School Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm"
              />
              {errors.schoolName && (
                <p className="text-red-400 text-xs mt-1">{errors.schoolName.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                City
              </label>
              <input
                {...register('city')}
                type="text"
                placeholder="Los Angeles"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm"
              />
              {errors.city && (
                <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parent Email */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Parent Email
              </label>
              <input
                {...register('parentEmail')}
                type="email"
                placeholder="parent@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm"
              />
              {errors.parentEmail && (
                <p className="text-red-400 text-xs mt-1">{errors.parentEmail.message}</p>
              )}
            </div>

            {/* Parent Phone */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Parent Phone
              </label>
              <input
                {...register('parentPhone')}
                type="text"
                placeholder="Parent Phone"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm font-mono"
              />
              {errors.parentPhone && (
                <p className="text-red-400 text-xs mt-1">{errors.parentPhone.message}</p>
              )}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isPending || success}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/40 text-white font-black py-3.5 rounded-xl transition-all text-sm tracking-wide mt-4 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Profile...
              </span>
            ) : 'CREATE CHALLENGER PROFILE →'}
          </motion.button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already registered?{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Sign In
          </a>
        </p>
      </div>
    </motion.div>
  );
}
