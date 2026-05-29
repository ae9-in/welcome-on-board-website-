// app/(auth)/register/page.tsx
import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up — The Modern Bee | onboreding',
  description: 'Create a student challenger profile',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center overflow-y-auto py-12 relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <Suspense fallback={<div className="text-white text-sm">Loading registration portal...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
