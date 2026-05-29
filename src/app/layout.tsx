import React from 'react';
import { Providers } from './providers';
import '../index.css';
import type { Metadata } from 'next';
import { Inter, Poppins, Anton } from 'next/font/google';

// ── Self-hosted fonts via next/font ─────────────────────────────────────────
// next/font eliminates the render-blocking Google Fonts network request,
// self-hosts the font files, and applies font-display: swap automatically.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OnBoarding — Competitions for KG to Grade 11',
  description: 'Gamified digital spelling, art, handwriting & quiz competitions for school students.',
  keywords: ['spell bee', 'school quiz', 'handwriting competition', 'art competition', 'student competitions'],
  openGraph: {
    title: 'OnBoarding — School Competitions',
    description: 'Gamified digital competitions for school students from KG to Grade 11.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${anton.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" />
        {/* DNS prefetch for any remaining third-party domains */}
        <link rel="dns-prefetch" href="https://api.dictionaryapi.dev" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'var(--font-inter), sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
