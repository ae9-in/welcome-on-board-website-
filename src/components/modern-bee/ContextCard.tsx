// components/modern-bee/ContextCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// A single expandable card in the "Need more context?" panel.
//
// BEHAVIOUR:
// - Collapsed: shows icon + label + chevron arrow (like old design)
// - Expanded: reveals the actual text content fully on screen
//   → definition text appears as a readable paragraph
//   → sentences appear as italic quoted text
//   → full context shows a grid of all clue types
// - A small secondary speaker icon appears inside expanded content
//   so the student can OPTIONALLY hear that specific text spoken
// - Only one card open at a time (controlled by parent useContextCards hook)
// ─────────────────────────────────────────────────────────────────────────────
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContextCardContent, ContextCardId } from '@/types/modern-bee';
import type { TTSMode } from '@/hooks/useTTS';
import React from 'react';

interface ContextCardProps {
  id: ContextCardId;
  label: string;
  icon: React.ReactNode;
  iconBg: string;              // e.g. "bg-purple-500/15"
  accentBorder: string;        // e.g. "border-purple-500/30" when open
  content: ContextCardContent;
  isOpen: boolean;
  onToggle: () => void;
  // TTS props — optional, for the audio mini-button inside expanded view
  onSpeak?: (mode: TTSMode, text?: string) => void;
  isSpeaking?: boolean;
  activeSpeakMode?: TTSMode;
  speakMode?: TTSMode;         // which mode this card triggers
  speakText?: string;          // custom text to speak (for full context)
}

export function ContextCard({
  id, label, icon, iconBg, accentBorder, content,
  isOpen, onToggle, onSpeak, isSpeaking, activeSpeakMode, speakMode, speakText
}: ContextCardProps) {
  const cardIsCurrentlySpeaking = isSpeaking && activeSpeakMode === speakMode;

  return (
    <div
      className={`
        rounded-2xl border overflow-hidden transition-all duration-200
        ${isOpen
          ? `border-white/15 bg-white/[0.04] ${accentBorder}`
          : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.035]'
        }
      `}
    >
      {/* ── Trigger row (always visible) ─────────────────────────────────── */}
      <button
        onClick={onToggle}
        type="button"
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
      >
        {/* Icon bubble */}
        <div className={`
          w-8 h-8 rounded-xl flex items-center justify-center shrink-0
          ${iconBg}
        `}>
          {icon}
        </div>

        {/* Label */}
        <span className={`
          flex-1 text-sm font-medium transition-colors duration-150
          ${isOpen ? 'text-white' : 'text-white/60'}
        `}>
          {label}
        </span>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="text-white/25 shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </motion.div>
      </button>

      {/* ── Expanded content ──────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-white/[0.06]">
              <ContextCardBody
                id={id}
                content={content}
                onSpeak={onSpeak}
                isSpeaking={cardIsCurrentlySpeaking}
                speakMode={speakMode}
                speakText={speakText}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Inner body — renders the right content type per card ────────────────────
function ContextCardBody({
  id, content, onSpeak, isSpeaking, speakMode, speakText
}: {
  id: ContextCardId;
  content: ContextCardContent;
  onSpeak?: (mode: TTSMode, text?: string) => void;
  isSpeaking?: boolean;
  speakMode?: TTSMode;
  speakText?: string;
}) {
  switch (id) {
    // ── Definition card ─────────────────────────────────────────────────────
    case 'definition':
      return (
        <div className="mt-3">
          {/* Part of speech badge */}
          {content.partOfSpeech && (
            <span className="inline-block text-[11px] text-purple-300 bg-purple-500/15 border border-purple-500/20 px-2.5 py-0.5 rounded-full mb-3 capitalize">
              {content.partOfSpeech}
            </span>
          )}

          {/* THE DEFINITION — full readable text */}
          <p className="text-white/85 text-[15px] leading-[1.75] mb-3">
            {content.definition}
          </p>

          {/* Optional: hear it spoken */}
          {onSpeak && (
            <MiniSpeakButton
              onClick={() => onSpeak(speakMode ?? 'definition', speakText)}
              isSpeaking={!!isSpeaking}
              label="Hear definition"
            />
          )}
        </div>
      );

    // ── Sentence 1 card ─────────────────────────────────────────────────────
    case 'sentence1':
      return (
        <div className="mt-3">
          {/* Sentence number badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] text-teal-300 bg-teal-500/15 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
              Sentence 1
            </span>
          </div>

          {/* THE ACTUAL SENTENCE — large, readable, quoted */}
          <blockquote className="
            text-white/85 text-[15px] leading-[1.8] italic
            border-l-2 border-teal-500/40 pl-4 mb-3
          ">
            "{content.sentence}"
          </blockquote>

          {onSpeak && (
            <MiniSpeakButton
              onClick={() => onSpeak(speakMode ?? 'sentence1', speakText)}
              isSpeaking={!!isSpeaking}
              label="Hear sentence"
            />
          )}
        </div>
      );

    // ── Sentence 2 card ─────────────────────────────────────────────────────
    case 'sentence2':
      return (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] text-teal-300 bg-teal-500/15 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
              Sentence 2
            </span>
          </div>

          <blockquote className="
            text-white/85 text-[15px] leading-[1.8] italic
            border-l-2 border-teal-500/40 pl-4 mb-3
          ">
            "{content.sentence}"
          </blockquote>

          {onSpeak && (
            <MiniSpeakButton
              onClick={() => onSpeak(speakMode ?? 'sentence2', speakText)}
              isSpeaking={!!isSpeaking}
              label="Hear sentence"
            />
          )}
        </div>
      );

    // ── Full context card ────────────────────────────────────────────────────
    case 'fullContext':
      return (
        <div className="mt-3 space-y-2">

          {/* Situational prompt */}
          {content.situationalPrompt && (
            <ContextRow
              label="Situational prompt"
              value={content.situationalPrompt}
              accentColor="border-l-yellow-400/40"
            />
          )}

          {/* Formal synonym */}
          {content.formalSynonym && (
            <ContextRow
              label="Formal synonym"
              value={content.formalSynonym}
              accentColor="border-l-blue-400/40"
            />
          )}

          {/* Millennial cross-reference */}
          {content.millennialCrossRef && (
            <ContextRow
              label="Millennial equivalent"
              value={content.millennialCrossRef}
              accentColor="border-l-pink-400/40"
            />
          )}

          {/* Phonetic + stress */}
          {(content.pronunciation || content.stressPattern) && (
            <div className="flex gap-2 flex-wrap mt-2">
              {content.pronunciation && (
                <span className="text-xs text-purple-300 font-mono bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
                  /{content.pronunciation}/
                </span>
              )}
              {content.stressPattern && (
                <span className="text-xs text-white/50 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  {content.stressPattern}
                </span>
              )}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

// ─── Small inline row for the full context card ──────────────────────────────
function ContextRow({ label, value, accentColor }: {
  label: string; value: string; accentColor: string;
}) {
  return (
    <div className={`
      bg-white/[0.03] rounded-xl px-4 py-3
      border-l-2 ${accentColor} border border-white/[0.06]
    `}
    style={{ borderRadius: '12px' }}
    >
      <div className="text-[10px] text-white/30 uppercase tracking-[0.12em] mb-1.5">
        {label}
      </div>
      <div className="text-white/80 text-[13.5px] leading-[1.6]">
        {value}
      </div>
    </div>
  );
}

// ─── Mini speaker button inside expanded cards ───────────────────────────────
// This is the SECONDARY audio control — text is always primary
function MiniSpeakButton({
  onClick, isSpeaking, label
}: { onClick: () => void; isSpeaking: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={isSpeaking}
      type="button"
      className={`
        flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border
        transition-all duration-150 cursor-pointer
        ${isSpeaking
          ? 'border-white/10 text-white/25 cursor-wait'
          : 'border-white/10 text-white/35 hover:text-white/60 hover:border-white/20'
        }
      `}
    >
      {isSpeaking ? (
        <>
          <SmallWave />
          <span>Speaking...</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

function SmallWave() {
  return (
    <div className="flex items-end gap-[2px] h-3">
      {[2, 6, 10, 6, 2].map((h, i) => (
        <div key={i} className="w-[2px] bg-white/30 rounded-full"
          style={{ height: `${h}px`, animation: 'waveS 0.6s ease-in-out infinite alternate', animationDelay: `${i * 0.07}s` }} />
      ))}
      <style>{`@keyframes waveS { to { transform: scaleY(0.2); } }`}</style>
    </div>
  );
}
