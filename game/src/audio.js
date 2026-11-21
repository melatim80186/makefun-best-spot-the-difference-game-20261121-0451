// audio.js — every sound the game makes, synthesized live with WebAudio.
// No audio files, no network: a handful of oscillators and envelopes.

// Note frequencies (Hz) for the little melodies.
const NOTE = { C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392.0, A4: 440.0, B4: 493.9, C5: 523.3, D5: 587.3, E5: 659.3, G5: 784.0, A5: 880.0 };

export class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  // The AudioContext may only start after a user gesture, so create it lazily.
  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone(freq, startAt, dur, type = 'sine', vol = 0.16) {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = ctx.currentTime + startAt;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  click() { this.tone(660, 0, 0.06, 'triangle', 0.08); }

  // A bright two-note chime when a difference is found.
  found() {
    this.tone(NOTE.E5, 0, 0.18, 'sine', 0.18);
    this.tone(NOTE.G5, 0.09, 0.28, 'sine', 0.18);
    this.tone(NOTE.C5, 0, 0.12, 'triangle', 0.08);
  }

  // A low buzz for a wrong click.
  wrong() {
    this.tone(160, 0, 0.22, 'sawtooth', 0.1);
    this.tone(120, 0.05, 0.25, 'sawtooth', 0.08);
  }

  // A soft shimmer when a hint is spent.
  hint() {
    this.tone(NOTE.A5, 0, 0.15, 'sine', 0.1);
    this.tone(NOTE.E5, 0.08, 0.2, 'sine', 0.1);
  }

  // A short tick when the clock drops under ten seconds.
  tick() { this.tone(880, 0, 0.05, 'square', 0.05); }

  // A rising arpeggio when a level is cleared.
  levelClear() {
    [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5].forEach((f, i) => this.tone(f, i * 0.09, 0.22, 'triangle', 0.14));
  }

  // A full fanfare for finishing all five scenes.
  win() {
    [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C5, NOTE.E5].forEach((f, i) =>
      this.tone(f, i * 0.11, 0.3, 'triangle', 0.14));
    this.tone(NOTE.C5, 0.9, 0.6, 'sine', 0.12);
  }

  // A sad descending pair when time runs out.
  timeUp() {
    this.tone(NOTE.G4, 0, 0.25, 'triangle', 0.12);
    this.tone(NOTE.E4, 0.2, 0.4, 'triangle', 0.12);
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}
