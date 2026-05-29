// components/modern-bee/LivesDisplay.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface LivesDisplayProps {
  livesRemaining: number;
  maxLives: number;
}

export function LivesDisplay({ livesRemaining, maxLives }: LivesDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      <div className="flex gap-1.5">
        {Array.from({ length: maxLives }, (_, i) => {
          const active = i < livesRemaining;
          return (
            <AnimatePresence key={i}>
              <motion.div
                animate={active ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0.2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {/* Heart SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24"
                  fill={active ? '#f09595' : 'none'}
                  stroke={active ? '#f09595' : 'rgba(255,255,255,0.25)'}
                  strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
      <span className="text-white/25 text-xs ml-1 font-semibold">
        {livesRemaining} {livesRemaining === 1 ? 'life' : 'lives'} remaining
      </span>
    </div>
  );
}
