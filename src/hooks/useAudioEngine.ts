'use client';

import { useCallback, useRef, useState } from 'react';

export function useAudioEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getAudioCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if suspended (browser security policy)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const getPitchMultiplierForKey = (key: string) => {
    if (!key) return 1.0;
    const k = key.toLowerCase();
    // Key row ke hisaab se pitch thoda badlega taaki natural lage
    if ("1234567890-=".includes(k)) return 1.1; 
    if ("qwertyuiop[]\\".includes(k)) return 1.05;
    if ("asdfghjkl;'".includes(k)) return 1.0;
    if ("zxcvbnm,./".includes(k)) return 0.95;
    return 1.0;
  };

  const playKeySound = useCallback((keyEventStr: string) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const pitchMult = getPitchMultiplierForKey(keyEventStr);
      const randomVariation = 0.95 + Math.random() * 0.1; // Thoda randomness har press par

      // --- 1. THE "CLICK" (High frequency transient) ---
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle'; 
      clickOsc.frequency.setValueAtTime(2500 * pitchMult * randomVariation, t);
      
      clickGain.gain.setValueAtTime(0.15, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.01);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      // --- 2. THE "THOCK" (Low frequency body sound) ---
      const thockBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const thockData = thockBuffer.getChannelData(0);
      for (let i = 0; i < thockBuffer.length; i++) {
        // Brown noise base for a deeper sound
        thockData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }

      const thockSource = ctx.createBufferSource();
      thockSource.buffer = thockBuffer;

      const thockFilter = ctx.createBiquadFilter();
      thockFilter.type = 'lowpass';
      thockFilter.frequency.value = 800 * pitchMult; // Lower freq for "thock"
      thockFilter.Q.value = 1.2;

      const thockGain = ctx.createGain();
      thockGain.gain.setValueAtTime(0.4, t);
      thockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      thockSource.connect(thockFilter);
      thockFilter.connect(thockGain);
      thockGain.connect(ctx.destination);

      // Start everything
      clickOsc.start(t);
      clickOsc.stop(t + 0.02);
      thockSource.start(t);
      thockSource.stop(t + 0.1);

    } catch (e) {
      console.error("Audio error", e);
    }
  }, [getAudioCtx, soundEnabled]);

  const playErrorSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(150, t);
      osc2.frequency.setValueAtTime(160, t);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.2);
      osc2.stop(t + 0.2);
    } catch (e) {
      console.error("Audio error", e);
    }
  }, [getAudioCtx, soundEnabled]);

  const playCompleteSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t); 
      osc.frequency.setValueAtTime(659.25, t + 0.1); 
      osc.frequency.setValueAtTime(783.99, t + 0.2); 
      osc.frequency.setValueAtTime(1046.50, t + 0.3); 

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
      gain.gain.setValueAtTime(0.2, t + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.85);

    } catch (e) {
      console.error("Audio error", e);
    }
  }, [getAudioCtx, soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
    if (!soundEnabled) playKeySound(' ');
  }, [soundEnabled, playKeySound]);

  return { soundEnabled, toggleSound, playKeySound, playErrorSound, playCompleteSound };
}