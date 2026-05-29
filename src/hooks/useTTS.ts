// hooks/useTTS.ts — FULL REPLACEMENT
'use client';
import { useRef, useState, useCallback, useEffect } from 'react';

export type TTSMode = 'word' | 'definition' | 'sentence1' | 'sentence2' | 'full' | null;

export interface TTSWordConfig {
  targetWord: string;          // actual word — only used for TTS, never displayed to student
  ttsOverrideText: string;     // phonetic override e.g. "choo-ghee" for CHEUGY
  audioUrlHighQuality: string; // ElevenLabs pre-generated mp3 (Cloudinary)
  audioUrl: string;            // fallback mp3
  definition: string;
  exampleSentence1: string;
  exampleSentence2: string;
  situationalPrompt: string;
  formalSynonym: string;
  millennialCrossRef: string;
}

interface UseTTSReturn {
  speak: (mode: TTSMode, text?: string) => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
  activeMode: TTSMode;
}

export function useTTS(config: TTSWordConfig | null): UseTTSReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState<TTSMode>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const runIdRef = useRef<number>(0);

  // Initialise Web Speech + pick best voice
  useEffect(() => {
    if (typeof window === 'undefined') return;
    synthRef.current = window.speechSynthesis;

    const pickVoice = () => {
      const voices = synthRef.current!.getVoices();
      const PREFERRED = [
        'Google UK English Female',
        'Google UK English Male',
        'Google US English',
        'Microsoft Zira - English (United States)',
        'Microsoft David - English (United States)',
        'Samantha', 'Karen', 'Daniel', 'Alex',
      ];
      for (const name of PREFERRED) {
        const v = voices.find(v => v.name === name);
        if (v) { voiceRef.current = v; return; }
      }
      voiceRef.current = voices.find(v => v.lang.startsWith('en')) ?? null;
    };

    if (synthRef.current.getVoices().length > 0) pickVoice();
    else synthRef.current.addEventListener('voiceschanged', pickVoice, { once: true });
  }, []);

  // Reset state when word changes
  useEffect(() => {
    stop();
  }, [config?.targetWord]);

  // ─── Internal: play an audio file URL ──────────────────────────────────────
  const playAudioFile = useCallback((url: string): Promise<boolean> => {
    return new Promise(resolve => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      const audio = new Audio(url);
      audioRef.current = audio;
      const timer = setTimeout(() => { audio.pause(); resolve(false); }, 8000);
      audio.onended = () => { clearTimeout(timer); resolve(true); };
      audio.onerror = () => { clearTimeout(timer); resolve(false); };
      audio.play().catch(() => { clearTimeout(timer); resolve(false); });
    });
  }, []);

  // ─── Internal: speak text with Web Speech API ───────────────────────────────
  const speakText = useCallback((text: string, rate = 0.82): Promise<void> => {
    return new Promise(resolve => {
      if (!synthRef.current) { resolve(); return; }
      synthRef.current.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = rate;
      u.pitch = 1.0;
      u.volume = 1.0;
      if (voiceRef.current) u.voice = voiceRef.current;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      synthRef.current.speak(u);
    });
  }, []);

  const pause = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  // ─── Internal: get the text the TTS speaks for the word ────────────────────
  // RULE: always speak the WHOLE WORD as a word — NEVER letter by letter
  const getWordSpeakText = useCallback(() => {
    if (!config) return '';
    const override = config.ttsOverrideText?.trim();
    return override && override.length > 0
      ? override
      : config.targetWord.toLowerCase();
  }, [config]);

  // ─── Main speak function ────────────────────────────────────────────────────
  const speak = useCallback(async (mode: TTSMode, customText?: string) => {
    if (!config || isPlaying) return;
    
    const runId = ++runIdRef.current;
    const isAborted = () => runIdRef.current !== runId;

    setIsPlaying(true);
    setActiveMode(mode);

    try {
      switch (mode) {
        // ── Speak the whole word (primary: Cloudinary mp3, fallback: Web Speech)
        case 'word': {
          if (config.audioUrlHighQuality) {
            const ok = await playAudioFile(config.audioUrlHighQuality);
            if (isAborted()) return;
            if (ok) break;
          }
          if (config.audioUrl) {
            const ok = await playAudioFile(config.audioUrl);
            if (isAborted()) return;
            if (ok) break;
          }
          await speakText(getWordSpeakText(), 0.72);
          break;
        }

        // ── Speak the definition text
        case 'definition': {
          await speakText(`Definition: ${config.definition}`, 0.85);
          break;
        }

        // ── Speak example sentence 1
        case 'sentence1': {
          await speakText(config.exampleSentence1, 0.88);
          break;
        }

        // ── Speak example sentence 2
        case 'sentence2': {
          await speakText(config.exampleSentence2, 0.88);
          break;
        }

        // ── Speak any custom text (used by ContextCard audio mini-buttons)
        case 'full': {
          if (customText) {
            await speakText(customText, 0.85);
          } else {
            // Full pronouncer sequence: word → def → s1 → s2 → word again
            const word = getWordSpeakText();
            if (config.audioUrlHighQuality) {
              await playAudioFile(config.audioUrlHighQuality);
            } else {
              await speakText(`The word is ${word}.`, 0.78);
            }
            if (isAborted()) return;
            await pause(500);
            if (isAborted()) return;
            await speakText(word, 0.65);
            if (isAborted()) return;
            await pause(600);
            if (isAborted()) return;
            await speakText(`Definition: ${config.definition}`, 0.85);
            if (isAborted()) return;
            await pause(500);
            if (isAborted()) return;
            await speakText(`Used in a sentence: ${config.exampleSentence1}`, 0.88);
            if (isAborted()) return;
            await pause(400);
            if (isAborted()) return;
            await speakText(config.exampleSentence2, 0.88);
            if (isAborted()) return;
            await pause(500);
            if (isAborted()) return;
            await speakText(word, 0.68);
          }
          break;
        }
      }
    } finally {
      if (!isAborted()) {
        setIsPlaying(false);
        setActiveMode(null);
      }
    }
  }, [config, isPlaying, playAudioFile, speakText, getWordSpeakText]);

  // ─── Stop everything ────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    runIdRef.current++;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(false);
    setActiveMode(null);
  }, []);

  return { speak, stop, isPlaying, activeMode };
}
