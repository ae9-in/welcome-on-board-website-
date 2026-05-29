// components/modern-bee/HearWordButton.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { TTSMode } from '@/hooks/useTTS';

interface HearWordButtonProps {
  onPlay: () => void;
  isPlaying: boolean;
  activeMode: TTSMode;
  hasPlayedOnce: boolean;
  stressPattern?: string;
}

export function HearWordButton({
  onPlay, isPlaying, activeMode, hasPlayedOnce, stressPattern
}: HearWordButtonProps) {
  const wordIsPlaying = isPlaying && activeMode === 'word';

  return (
    <div className="mb-6">
      <motion.button
        onClick={onPlay}
        disabled={wordIsPlaying}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: wordIsPlaying ? 1 : 1.02 }}
        className={`
          w-full flex items-center justify-center gap-3 py-5 rounded-2xl
          font-bold text-lg tracking-wide transition-all duration-200 cursor-pointer
          ${wordIsPlaying
            ? 'bg-yellow-400/15 border border-yellow-400/25 text-yellow-400 cursor-wait'
            : 'bg-yellow-400 hover:bg-yellow-300 text-black cursor-pointer shadow-lg shadow-yellow-400/10'
          }
        `}
      >
        {wordIsPlaying ? (
          <>
            <AudioWaveIcon />
            <span>Speaking...</span>
          </>
        ) : (
          <>
            {/* Speaker icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            <span>{hasPlayedOnce ? 'Hear again' : 'Hear the word'}</span>
          </>
        )}
      </motion.button>

      {/* Stress pattern — shown after first play */}
      <AnimatePresence>
        {hasPlayedOnce && stressPattern && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mt-3"
          >
            <span className="text-purple-300 font-mono text-sm tracking-[0.25em]">
              {stressPattern}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated waveform icon shown while audio plays
function AudioWaveIcon() {
  return (
    <div className="flex items-end gap-[3px] h-5">
      {[4, 10, 16, 10, 4].map((h, i) => (
        <div
          key={i}
          className="w-[3px] bg-yellow-400 rounded-full"
          style={{
            height: `${h}px`,
            animation: `wavePulse 0.7s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes wavePulse {
          0%  { transform: scaleY(1); }
          100% { transform: scaleY(0.25); }
        }
      `}</style>
    </div>
  );
}
