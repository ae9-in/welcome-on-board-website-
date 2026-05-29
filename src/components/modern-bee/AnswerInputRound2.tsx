// components/modern-bee/AnswerInputRound2.tsx
'use client';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnswerInputRound2Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (val: string) => void;
  feedback: null | 'correct' | 'wrong';
  disabled: boolean;
  placeholder?: string;
}

export function AnswerInputRound2({
  value,
  onChange,
  onSubmit,
  feedback,
  disabled,
  placeholder = 'TYPE YOUR ANSWER...'
}: AnswerInputRound2Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = value.trim().toUpperCase();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
  };

  const inputBorderColor =
    feedback === 'correct'
      ? 'border-teal-500/60 bg-teal-500/8'
      : feedback === 'wrong'
      ? 'border-red-500/50 bg-red-500/6'
      : 'border-white/15 bg-white/[0.04] focus-within:border-yellow-400/50';

  return (
    <div>
      {/* Section label */}
      <p className="text-[10px] tracking-[0.18em] text-white/28 uppercase mb-3 text-center">
        Your answer
      </p>

      {/* Text input */}
      <motion.div
        animate={
          feedback === 'wrong'
            ? {
                x: [-8, 8, -6, 6, -4, 4, 0],
                transition: { duration: 0.4 }
              }
            : {}
        }
        className={`
          relative rounded-2xl border transition-all duration-200
          ${inputBorderColor}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={disabled || feedback === 'correct'}
          maxLength={30}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          className="
            w-full bg-transparent px-5 py-4 text-center
            font-mono text-2xl font-medium tracking-[0.25em] text-yellow-400
            placeholder:text-white/15 placeholder:tracking-[0.1em] placeholder:text-base
            focus:outline-none
          "
        />
      </motion.div>

      {/* Submit button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled || feedback === 'correct'}
        whileTap={{ scale: 0.97 }}
        className="
          w-full mt-3 py-3.5 rounded-2xl
          font-medium text-sm tracking-[0.1em] uppercase
          border border-yellow-400/30 bg-yellow-400/10 text-yellow-400
          hover:bg-yellow-400/18 transition-all duration-150 cursor-pointer
          disabled:opacity-30 disabled:cursor-not-allowed
        "
      >
        Lock in answer
      </motion.button>
    </div>
  );
}
