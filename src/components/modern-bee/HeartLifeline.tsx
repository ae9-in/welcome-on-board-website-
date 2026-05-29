import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartLifelineProps {
  lives: number;
  maxLives?: number;
}

export function HeartLifeline({ lives, maxLives = 2 }: HeartLifelineProps) {
  return (
    <div className="flex items-center space-x-2 bg-black/35 px-4 py-2 rounded-full border border-white/10">
      <span className="text-white/60 text-xs font-semibold mr-1">LIVES:</span>
      <div className="flex items-center space-x-1.5">
        <AnimatePresence>
          {Array.from({ length: maxLives }).map((_, index) => {
            const isFilled = index < lives;
            return (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    isFilled
                      ? 'text-red-500 fill-red-500 filter drop-shadow-[0_0_4px_rgba(239,68,68,0.5)] animate-pulse'
                      : 'text-white/20 fill-transparent'
                  }`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
