import React, { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher-client';

interface Props { 
  sessionId: string;
}

export function AudienceReactionPanel({ sessionId }: Props) {
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [counts, setCounts] = useState({ fire: 0, clap: 0, trophy: 0 });

  useEffect(() => {
    // Subscribe to pusher channel
    const channel = pusherClient.subscribe(`session-${sessionId}`);
    
    // Bind to reaction events
    channel.bind('audience-reaction', (data: { type: 'fire' | 'clap' | 'trophy'; count: number }) => {
      const emoji = data.type === 'fire' ? '🔥' : data.type === 'clap' ? '👏' : '🏆';
      const id = Date.now() + Math.random();
      
      // Add floating emoji
      setFloatingEmojis(prev => [...prev, { id, emoji, x: Math.random() * 80 + 10 }]);
      setCounts(prev => ({ ...prev, [data.type]: prev[data.type] + 1 }));
      
      // Auto-remove emoji after 2 seconds
      setTimeout(() => {
        setFloatingEmojis(prev => prev.filter(e => e.id !== id));
      }, 2000);
    });

    return () => {
      pusherClient.unsubscribe(`session-${sessionId}`);
    };
  }, [sessionId]);

  const sendReaction = async (type: 'fire' | 'clap' | 'trophy') => {
    try {
      await fetch('/api/competitions/modern-bee/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, type }),
      });
    } catch (err) {
      console.error('Failed to send reaction:', err);
    }
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 z-50 pointer-events-none">
      {/* Floating emojis container */}
      <div className="absolute inset-0 h-64 -top-64 overflow-hidden pointer-events-none">
        {floatingEmojis.map(e => (
          <div
            key={e.id}
            className="absolute bottom-0 text-3xl animate-float-up text-center pointer-events-none"
            style={{ 
              left: `${e.x}%`,
            }}
          >
            {e.emoji}
          </div>
        ))}
      </div>

      {/* Reaction buttons panel */}
      <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 pointer-events-auto shadow-2xl">
        {[
          { type: 'fire' as const, emoji: '🔥', label: 'LIT' },
          { type: 'clap' as const, emoji: '👏', label: 'CLAP' },
          { type: 'trophy' as const, emoji: '🏆', label: 'GOAT' },
        ].map(btn => (
          <button
            key={btn.type}
            onClick={() => sendReaction(btn.type)}
            className="flex flex-col items-center bg-white/5 hover:bg-white/15 active:scale-95 px-4 py-2 rounded-xl transition-all border border-white/5 min-w-[60px]"
          >
            <span className="text-2xl">{btn.emoji}</span>
            <span className="text-white/40 text-[9px] font-bold mt-1 tracking-wider uppercase">{btn.label}</span>
            <span className="text-yellow-400 font-mono text-xs font-black mt-0.5">{counts[btn.type]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
