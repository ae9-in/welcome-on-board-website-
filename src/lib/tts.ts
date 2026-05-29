// lib/tts.ts
// ─────────────────────────────────────────────────────────────────────────────
// Modern Bee TTS Service
// Handles natural word pronunciation with ElevenLabs primary + Web Speech fallback
// CRITICAL: The word is ALWAYS spoken as a complete word, never letter by letter.
// ─────────────────────────────────────────────────────────────────────────────

export interface TTSConfig {
  targetWord?: string;          // The actual spelling word e.g. "RIZZ" (optional for student view)
  ttsOverrideText?: string;     // Phonetic override e.g. "rihz" — use this if set
  stressPattern?: string;       // Stress notation e.g. "RIZZ" or "DE-lu-lu"
  audioUrlHighQuality?: string; // Cloudinary pre-generated mp3 URL
  audioUrl?: string;            // Fallback Cloudinary URL (if HQ not available)
  partOfSpeech: string;
  definition: string;
  exampleSentence1: string;
  exampleSentence2: string;
}

export interface TTSControls {
  playWord: () => Promise<void>;
  playDefinition: () => Promise<void>;
  playSentence: (sentenceNumber: 1 | 2) => Promise<void>;
  playFullPronouncer: () => Promise<void>; // Plays word → definition → both sentences
  stop: () => void;
  isPlaying: boolean;
  source: 'audio-hq' | 'audio-std' | 'web-speech' | 'failed';
}

export class ModernBeeTTS {
  private audioElement: HTMLAudioElement | null = null;
  private speechSynth: SpeechSynthesis | null = null;
  private config: TTSConfig;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor(config: TTSConfig) {
    this.config = config;
    if (typeof window !== 'undefined') {
      this.speechSynth = window.speechSynthesis;
      this.selectBestVoice();
    }
  }

  // ─── Voice selection: pick the most natural-sounding English voice ─────────
  private selectBestVoice(): void {
    if (!this.speechSynth) return;

    const loadVoices = () => {
      const voices = this.speechSynth!.getVoices();

      // Priority order: prefer neural/premium voices, then US/UK English
      const VOICE_PRIORITY = [
        'Google UK English Female',
        'Google UK English Male',
        'Google US English',
        'Microsoft Zira - English (United States)',
        'Microsoft David - English (United States)',
        'Microsoft Mark - English (United States)',
        'Samantha',               // macOS/iOS natural voice
        'Karen',                  // macOS Australian
        'Daniel',                 // macOS UK
        'Alex',                   // macOS US
      ];

      for (const name of VOICE_PRIORITY) {
        const found = voices.find(v => v.name === name);
        if (found) { this.preferredVoice = found; return; }
      }

      // Final fallback: any English voice
      this.preferredVoice = voices.find(v => v.lang.startsWith('en')) ?? voices[0] ?? null;
    };

    // Voices may not load synchronously
    if (this.speechSynth.getVoices().length > 0) {
      loadVoices();
    } else {
      this.speechSynth.addEventListener('voiceschanged', loadVoices, { once: true });
    }
  }

  // ─── Determine the text the TTS should actually speak ────────────────────
  // RULE: Always speak the WHOLE word as a word. Never spell it out.
  // If ttsOverrideText is set, use it (handles tricky slang pronunciations).
  // Otherwise speak the word directly — SpeechSynthesis handles common words.
  private getWordText(): string {
    const override = this.config.ttsOverrideText?.trim();
    if (override && override.length > 0) return override;
    // Speak the word as-is — SpeechSynthesis will treat it as a word
    return this.config.targetWord ? this.config.targetWord.toLowerCase() : '';
  }

  // ─── Web Speech API utterance builder ────────────────────────────────────
  private buildUtterance(text: string, opts?: {
    rate?: number;
    pitch?: number;
    pauseAfterMs?: number;
  }): SpeechSynthesisUtterance {
    const u = new SpeechSynthesisUtterance(text);
    if (this.preferredVoice) u.voice = this.preferredVoice;
    u.lang = 'en-US';
    u.rate = opts?.rate ?? 0.85;     // Slightly slower than default for clarity
    u.pitch = opts?.pitch ?? 1.0;
    u.volume = 1.0;
    return u;
  }

  // ─── Play the word (primary: Cloudinary audio, fallback: Web Speech) ─────
  async playWord(): Promise<void> {
    // Try high-quality pre-generated audio first
    if (this.config.audioUrlHighQuality) {
      const success = await this.playAudioFile(this.config.audioUrlHighQuality);
      if (success) return;
    }

    // Try standard quality audio
    if (this.config.audioUrl) {
      const success = await this.playAudioFile(this.config.audioUrl);
      if (success) return;
    }

    // Web Speech API fallback — speaks the WHOLE WORD as a natural word
    const textToSpeak = this.getWordText();
    if (textToSpeak) {
      await this.speakWithWebSpeech(textToSpeak, { rate: 0.75, pitch: 1.0 });
    }
  }

  // ─── Play the definition sentence ─────────────────────────────────────────
  async playDefinition(): Promise<void> {
    const wordText = this.getWordText();
    const prefix = wordText ? `${wordText}. ` : '';
    const text = `${prefix}${this.config.definition}`;
    await this.speakWithWebSpeech(text, { rate: 0.85 });
  }

  // ─── Play an example sentence ─────────────────────────────────────────────
  async playSentence(sentenceNumber: 1 | 2): Promise<void> {
    const text = sentenceNumber === 1
      ? this.config.exampleSentence1
      : this.config.exampleSentence2;
    await this.speakWithWebSpeech(text, { rate: 0.88 });
  }

  // ─── Full pronouncer sequence ─────────────────────────────────────────────
  // Mimics how a real competition pronouncer reads:
  // "The word is [WORD]. [WORD]. Definition: [DEF].
  //  Used in a sentence: [SENTENCE 1]. [SENTENCE 2]. [WORD]."
  async playFullPronouncer(): Promise<void> {
    const word = this.getWordText();
    const sequences: Array<{ text: string; rate: number; pauseAfter: number; isWordParts?: boolean }> = [
      { text: word ? `The word is ${word}.` : '',  rate: 0.80, pauseAfter: 600, isWordParts: true  },
      { text: word,                                rate: 0.65, pauseAfter: 800, isWordParts: true  }, // Slow clear repeat
      { text: `Definition: ${this.config.definition}`, rate: 0.85, pauseAfter: 700 },
      { text: `Used in a sentence: ${this.config.exampleSentence1}`, rate: 0.88, pauseAfter: 700 },
      { text: this.config.exampleSentence2,        rate: 0.88, pauseAfter: 700  },
      { text: word,                                rate: 0.70, pauseAfter: 0, isWordParts: true    }, // Final clear repeat
    ];

    // If high-quality audio exists, play it for the word parts only
    // and use Web Speech for definition/sentences
    for (const seq of sequences) {
      if (!seq.text) continue;
      if (seq.isWordParts && this.config.audioUrlHighQuality) {
        await this.playAudioFile(this.config.audioUrlHighQuality);
      } else {
        await this.speakWithWebSpeech(seq.text, { rate: seq.rate });
      }
      if (seq.pauseAfter > 0) {
        await this.pause(seq.pauseAfter);
      }
    }
  }

  // ─── Internal: play audio file from URL ───────────────────────────────────
  private playAudioFile(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement = null;
      }

      const audio = new Audio(url);
      this.audioElement = audio;

      const timeout = setTimeout(() => {
        audio.pause();
        resolve(false); // File took too long — fall back to Web Speech
      }, 8000);

      audio.onended = () => { clearTimeout(timeout); resolve(true); };
      audio.onerror = () => { clearTimeout(timeout); resolve(false); };
      audio.play().catch(() => { clearTimeout(timeout); resolve(false); });
    });
  }

  // ─── Internal: speak text with Web Speech API ─────────────────────────────
  private speakWithWebSpeech(text: string, opts?: { rate?: number; pitch?: number }): Promise<void> {
    return new Promise((resolve) => {
      if (!this.speechSynth) { resolve(); return; }

      this.speechSynth.cancel(); // Cancel any in-progress speech

      const utterance = this.buildUtterance(text, opts);
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve(); // Don't block the sequence on error

      this.speechSynth.speak(utterance);
    });
  }

  // ─── Internal: async pause helper ─────────────────────────────────────────
  private pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ─── Stop all audio ────────────────────────────────────────────────────────
  stop(): void {
    if (this.audioElement) { this.audioElement.pause(); this.audioElement = null; }
    if (this.speechSynth) this.speechSynth.cancel();
  }
}
