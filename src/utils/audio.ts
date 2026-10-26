/**
 * Audio synthesizer for Background Music (BGM) & Sound Effects (SFX)
 * using Web Audio API + SpeechSynthesis for English pronunciation.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isBgmPlaying = false;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmIntervalId: number | null = null;
  private bgmVolume = 0.35;
  private sfxVolume = 0.6;
  private speechRate = 0.82; // Slightly slower, clear speed for elementary English learners

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // --- Sound Effects ---

  /** Cheerful bubble pop when an item appears or disappears */
  public playPop() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

      gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /** Success chime when item is found (ascending harp/bell arpeggio) */
  public playFoundSuccess() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        const startTime = now + idx * 0.07;
        const endTime = startTime + 0.35;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {
      // ignored
    }
  }

  /** Twinkle bell sound for reading / star praise */
  public playStarDing() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const freqs = [1046.5, 1318.51, 1567.98]; // C6, E6, G6

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        const start = now + i * 0.05;
        gain.gain.setValueAtTime(0.3 * this.sfxVolume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // ignored
    }
  }

  /** Soft woodblock tap */
  public playTap() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignored
    }
  }

  // --- Cheerful Marimba Background Music Loop ---

  /** Starts procedural cheerful background music */
  public startBgm() {
    if (this.isBgmPlaying) return;
    try {
      const ctx = this.getAudioContext();
      this.isBgmPlaying = true;

      // Master BGM gain
      this.bgmGain = ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, ctx.currentTime);
      this.bgmGain.connect(ctx.destination);

      // Playful pentatonic pattern (C4, D4, E4, G4, A4, C5)
      // Cheerful bouncy nursery / playground melody in 4/4 time
      const melodyNotes = [
        // Bar 1
        { pitch: 523.25, dur: 0.22, delay: 0.0 },   // C5
        { pitch: 659.25, dur: 0.22, delay: 0.25 },  // E5
        { pitch: 783.99, dur: 0.22, delay: 0.5 },   // G5
        { pitch: 659.25, dur: 0.22, delay: 0.75 },  // E5
        // Bar 2
        { pitch: 880.00, dur: 0.35, delay: 1.0 },   // A5
        { pitch: 783.99, dur: 0.35, delay: 1.35 },  // G5
        { pitch: 659.25, dur: 0.22, delay: 1.7 },   // E5
        // Bar 3
        { pitch: 587.33, dur: 0.22, delay: 2.0 },   // D5
        { pitch: 659.25, dur: 0.22, delay: 2.25 },  // E5
        { pitch: 587.33, dur: 0.22, delay: 2.5 },   // D5
        { pitch: 523.25, dur: 0.35, delay: 2.75 },  // C5
        // Bar 4 (cheerful turnaround)
        { pitch: 659.25, dur: 0.22, delay: 3.1 },   // E5
        { pitch: 783.99, dur: 0.22, delay: 3.35 },  // G5
        { pitch: 1046.5, dur: 0.38, delay: 3.6 },   // C6
      ];

      const bassNotes = [
        { pitch: 261.63, dur: 0.35, delay: 0.0 },   // C4
        { pitch: 392.00, dur: 0.35, delay: 0.5 },   // G4
        { pitch: 261.63, dur: 0.35, delay: 1.0 },   // C4
        { pitch: 349.23, dur: 0.35, delay: 1.5 },   // F4
        { pitch: 261.63, dur: 0.35, delay: 2.0 },   // C4
        { pitch: 392.00, dur: 0.35, delay: 2.5 },   // G4
        { pitch: 261.63, dur: 0.5, delay: 3.0 },    // C4
      ];

      const loopDurationMs = 4000;

      const playPhrase = () => {
        if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
        const now = this.ctx.currentTime;

        // Play melody (gentle marimba / celesta feel)
        melodyNotes.forEach((n) => {
          const osc = this.ctx!.createOscillator();
          const noteGain = this.ctx!.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(n.pitch, now + n.delay);

          const start = now + n.delay;
          const end = start + n.dur;

          noteGain.gain.setValueAtTime(0, start);
          noteGain.gain.linearRampToValueAtTime(0.18, start + 0.02);
          noteGain.gain.exponentialRampToValueAtTime(0.001, end);

          osc.connect(noteGain);
          noteGain.connect(this.bgmGain!);

          osc.start(start);
          osc.stop(end);
        });

        // Play bass line (soft rounded bottom)
        bassNotes.forEach((b) => {
          const osc = this.ctx!.createOscillator();
          const bassGain = this.ctx!.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(b.pitch, now + b.delay);

          const start = now + b.delay;
          const end = start + b.dur;

          bassGain.gain.setValueAtTime(0, start);
          bassGain.gain.linearRampToValueAtTime(0.12, start + 0.03);
          bassGain.gain.exponentialRampToValueAtTime(0.001, end);

          osc.connect(bassGain);
          bassGain.connect(this.bgmGain!);

          osc.start(start);
          osc.stop(end);
        });
      };

      playPhrase();
      this.bgmIntervalId = window.setInterval(playPhrase, loopDurationMs);
    } catch {
      // AudioContext policy
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public isPlayingBgm(): boolean {
    return this.isBgmPlaying;
  }

  public setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public setSpeechRate(rate: number) {
    this.speechRate = rate;
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  // --- Speech Synthesis (Follow-along pronunciation) ---

  public speak(
    text: string,
    options?: {
      rate?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
    }
  ) {
    if (!('speechSynthesis' in window)) {
      options?.onEnd?.();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options?.rate ?? this.speechRate;
    utterance.pitch = 1.05; // Slightly friendly, warm pitch for kids

    // Try finding a friendly natural English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Alex'))) ||
        v.lang === 'en-US'
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    if (options?.onBoundary) {
      utterance.onboundary = (e) => {
        options.onBoundary?.(e.charIndex);
      };
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundCtrl = new SoundController();
