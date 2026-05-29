// components/modern-bee/AnswerInput.tsx — FULL REPLACEMENT
'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FeedbackState = 'idle' | 'correct' | 'wrong' | 'noLives';

interface AnswerInputProps {
  onSubmit: (answer: string, timeTakenMs: number) => Promise<{
    isCorrect: boolean;
    correctAnswer?: string;  // Only sent when wrong
    livesRemaining: number;
  }>;
  disabled: boolean;
  startTimeMs: number;     // When the word was shown — for timing
  onCorrect?: () => void;
  onFail?: () => void;
}

export function AnswerInput({ onSubmit, disabled, startTimeMs, onCorrect, onFail }: AnswerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealedWord, setRevealedWord] = useState('');

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  // Clear input when word changes (disabled changes from true→false)
  useEffect(() => {
    if (!disabled) {
      setValue('');
      setFeedback('idle');
      setFeedbackMsg('');
      setRevealedWord('');
    }
  }, [disabled]);

  const handleSubmit = async () => {
    const trimmed = value.trim().toUpperCase();
    if (!trimmed || isSubmitting || disabled) return;

    setIsSubmitting(true);
    const timeTaken = Date.now() - startTimeMs;

    try {
      const result = await onSubmit(trimmed, timeTaken);

      if (result.isCorrect) {
        setFeedback('correct');
        setFeedbackMsg('Correct! Well done.');
        setValue('');
        onCorrect?.();
      } else if (result.livesRemaining <= 0) {
        setFeedback('noLives');
        setFeedbackMsg('No lives remaining.');
        setRevealedWord(result.correctAnswer ?? '');
        setValue('');
        onFail?.();
      } else {
        setFeedback('wrong');
        setFeedbackMsg(
          `Not quite — ${result.livesRemaining} ${result.livesRemaining === 1 ? 'life' : 'lives'} remaining. Try again.`
        );
        setValue('');
        // Auto-clear wrong feedback after 2s
        setTimeout(() => {
          setFeedback('idle');
          setFeedbackMsg('');
          inputRef.current?.focus();
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBorderColor =
    feedback === 'correct' ? 'border-teal-500/60 bg-teal-500/8'
    : feedback === 'wrong'   ? 'border-red-500/50 bg-red-500/6'
    : feedback === 'noLives' ? 'border-red-500/50 bg-red-500/6'
    : 'border-white/15 bg-white/[0.04] focus-within:border-yellow-400/50';

  return (
    <div>
      {/* Section label */}
      <p className="text-[10px] tracking-[0.18em] text-white/28 uppercase mb-3">
        Your answer
      </p>

      {/* Text input */}
      <motion.div
        animate={feedback === 'wrong' ? {
          x: [-8, 8, -6, 6, -4, 4, 0],
          transition: { duration: 0.4 }
        } : {}}
        className={`
          relative rounded-2xl border transition-all duration-200
          ${inputBorderColor}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          disabled={disabled || isSubmitting || feedback === 'correct' || feedback === 'noLives'}
          maxLength={30}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="TYPE YOUR ANSWER"
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
        disabled={!value.trim() || isSubmitting || disabled || feedback === 'correct' || feedback === 'noLives'}
        whileTap={{ scale: 0.97 }}
        className="
          w-full mt-3 py-3.5 rounded-2xl
          font-medium text-sm tracking-[0.1em] uppercase
          border border-yellow-400/30 bg-yellow-400/10 text-yellow-400
          hover:bg-yellow-400/18 transition-all duration-150 cursor-pointer
          disabled:opacity-30 disabled:cursor-not-allowed
        "
      >
        {isSubmitting ? 'Checking...' : 'Lock in answer'}
      </motion.button>

      {/* Feedback strip */}
      <AnimatePresence>
        {feedback !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`
              mt-3 flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm
              ${feedback === 'correct'
                ? 'bg-teal-500/10 border border-teal-500/25 text-teal-300'
                : 'bg-red-500/10 border border-red-500/20 text-red-300'
              }
            `}
          >
            <span className="text-base shrink-0">
              {feedback === 'correct' ? '✓' : '✗'}
            </span>
            <div className="flex-1">
              <span>{feedbackMsg}</span>
              {/* Reveal correct word when out of lives */}
              {feedback === 'noLives' && revealedWord && (
                <div className="mt-2 pt-2 border-t border-red-500/20">
                  <span className="text-white/40 text-xs">The word was </span>
                  <span className="font-mono font-bold text-white/80 tracking-widest text-base">
                    {revealedWord}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
