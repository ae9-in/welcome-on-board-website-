import React, { useState, useEffect } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

interface CountdownTimerProps {
  duration: number;
  onComplete: () => void;
  size?: number;
}

export function CountdownTimer({ duration, onComplete, size = 100 }: CountdownTimerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className="flex items-center justify-center rounded-full bg-white/5 border border-white/10"
      >
        <span className="text-white font-black text-xl">{duration}</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={['#facc15', '#f59e0b', '#d97706', '#dc2626']}
        colorsTime={[duration * 0.6, duration * 0.4, duration * 0.2, 0]}
        size={size}
        strokeWidth={6}
        trailColor="rgba(255, 255, 255, 0.05)"
        onComplete={() => {
          onComplete();
          return { shouldRepeat: false };
        }}
      >
        {({ remainingTime }) => (
          <div className="flex flex-col items-center">
            <span className={`text-white font-mono font-black text-2xl ${remainingTime <= 10 ? 'text-red-500 animate-bounce' : ''}`}>
              {remainingTime}
            </span>
            <span className="text-[8px] text-white/40 uppercase tracking-widest">SEC</span>
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  );
}
