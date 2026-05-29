'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Minimum display of 400ms, then fade out
    const timer = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070A13]"
        >
          {/* Honeycomb spinner */}
          <div className="relative w-20 h-20">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i * 60 * Math.PI) / 180;
              const r = 28;
              const x = 40 + r * Math.cos(angle);
              const y = 40 + r * Math.sin(angle);
              return (
                <motion.div
                  key={i}
                  className="absolute w-5 h-5 rounded-sm bg-yellow-400"
                  style={{
                    left: x - 10,
                    top: y - 10,
                    transformOrigin: 'center',
                    rotate: 30,
                  }}
                  animate={{
                    scale: [0.6, 1.2, 0.6],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.15,
                  }}
                />
              );
            })}
            {/* Center bee emoji */}
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              🐝
            </div>
          </div>

          {/* Brand text */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-6 text-white/60 text-xs font-bold tracking-[0.25em] uppercase"
          >
            OnBoarding
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
