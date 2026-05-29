// app/(auth)/login/page.tsx
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — The Modern Bee | onboreding',
  description: 'Login to your student or admin portal',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <Suspense fallback={<div className="text-white text-sm">Loading arena portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
