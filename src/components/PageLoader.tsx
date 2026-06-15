'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Minimum display of 1000ms, then fade out
    const timer = setTimeout(() => setVisible(false), 1000);
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
          {/* Uiverse bounce-step loader */}
          <div className="loader"></div>

          {/* Brand text */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-6 text-white/60 text-xs font-bold tracking-[0.25em] uppercase"
          >
            Welcome On Board
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
