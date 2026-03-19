'use client';

import ResultsChart from '@/components/ResultsChart';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useTheme } from '@/hooks/useTheme';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const { soundEnabled, toggleSound, playKeySound, playErrorSound, playCompleteSound } = useAudioEngine();
  const typingEngine = useTypingEngine(playKeySound, playErrorSound, playCompleteSound);
  const { theme, changeTheme } = useTheme();
  const textDisplayRef = useRef<HTMLDivElement>(null);
  
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customTime, setCustomTime] = useState(60);

  // Global Keydown Handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (showCustomModal) return;
      typingEngine.handleKeyDown(e);
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showCustomModal, typingEngine]);

  const handleStartCustom = () => {
    if (!customText.trim() || customTime < 10) return;
    typingEngine.initTest(customText.trim(), customTime, true);
    setShowCustomModal(false);
    textDisplayRef.current?.focus();
  };

  const elapsed = typingEngine.selectedTime - typingEngine.timeRemaining || typingEngine.selectedTime;
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round((typingEngine.correctCount / 5) / minutes) : 0;
  const rawWpm = minutes > 0 ? Math.round((typingEngine.totalKeystrokes / 5) / minutes) : 0;
  const totalAttempted = typingEngine.correctCount + typingEngine.incorrectCount;
  const accuracy = totalAttempted > 0 ? Math.round((typingEngine.correctCount / totalAttempted) * 100) : 100;
  const missed = typingEngine.chars.filter(c => c.status === 'untyped').length;

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 sticky top-0 z-50 glass-header border-b border-[var(--color-border-light)] transition-all duration-400">
        <div className="flex items-center gap-2 select-none">
          <span className="text-xl opacity-70">⌨</span>
          <span className="font-sans text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
            Type<span className="text-[var(--color-accent)]">Flow</span>
          </span>
        </div>

        <nav className={`flex items-center gap-2 transition-all duration-400 ${typingEngine.mode === 'typing' ? 'opacity-0 pointer-events-none -translate-y-1' : ''}`}>
          <div className="flex bg-[var(--color-bg-surface)] rounded-md p-[3px] gap-[2px]">
            {[15, 30, 60, 120].map((t) => (
              <button
                key={t}
                onClick={() => typingEngine.setSelectedTime(t)}
                className={`px-4 py-1.5 rounded-[6px] text-xs font-medium font-sans cursor-pointer transition-all duration-200 tracking-wide ${typingEngine.selectedTime === t ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
              >
                {t}s
              </button>
            ))}
          </div>
          <div className="w-[1px] h-[18px] bg-[var(--color-border-medium)] mx-1" />
          <button
            onClick={() => typingEngine.isCustom ? typingEngine.initTest(typingEngine.text, typingEngine.selectedTime, true) : typingEngine.loadRandomTest()}
            className="flex items-center justify-center w-9 h-9 border-none rounded-md bg-transparent text-[var(--color-text-muted)] cursor-pointer hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-secondary)] active:scale-95 transition-all"
            title="Restart Test"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </button>
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="relative group">
            <select
              value={theme}
              onChange={(e) => changeTheme(e.target.value as any)}
              className="appearance-none bg-[var(--color-bg-elevated)] border border-[var(--color-border-light)] text-[var(--color-text-secondary)] font-sans text-xs font-medium px-3.5 py-2 h-9 rounded-md cursor-pointer outline-none hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-medium)] shadow-sm transition-all focus:border-[var(--color-accent)] pr-8"
            >
              <option value="light">Light Flow</option>
              <option value="midnight">Midnight</option>
              <option value="sakura">Sakura</option>
              <option value="obsidian">Obsidian</option>
              <option value="terminal">Terminal</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 h-9 border border-[var(--color-border-light)] rounded-md bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] font-sans text-xs font-medium cursor-pointer hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-medium)] shadow-sm active:scale-95 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>Custom</span>
          </button>
          <button
            onClick={toggleSound}
            className={`flex items-center justify-center w-9 h-9 border-none rounded-md bg-transparent cursor-pointer hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-secondary)] active:scale-95 transition-all ${soundEnabled ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-dimmed)]'}`}
          >
            {soundEnabled ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-10 max-w-[1200px] mx-auto w-full relative">
        {typingEngine.mode !== 'finished' ? (
          <section className="flex items-start gap-8 w-full max-w-[1000px] my-[60px] mx-auto">
            <div className={`w-[50px] shrink-0 text-left pt-2 transition-opacity duration-400 select-none ${typingEngine.mode === 'typing' ? 'opacity-100' : 'opacity-0'}`}>
              <span className={`font-mono text-[1.4rem] font-semibold leading-none ${typingEngine.timeRemaining <= 5 ? 'text-[var(--color-state-incorrect)]' : typingEngine.timeRemaining <= 10 ? 'text-[var(--color-state-warning)]' : 'text-[var(--color-accent)]'}`}>
                {typingEngine.timeRemaining}
              </span>
            </div>

            <section className="w-full relative cursor-text grow" onClick={() => textDisplayRef.current?.focus()}>
              <div
                ref={textDisplayRef}
                className={`font-mono text-[1.25rem] font-medium leading-[2.2] tracking-[0.3px] outline-none relative overflow-hidden max-h-[calc(2.2em*3)] ${typingEngine.mode === 'typing' ? 'is-typing' : ''}`}
                tabIndex={0}
              >
                {typingEngine.chars.map((c, i) => {
                  let cls = 'relative transition-colors duration-75 ';
                  if (c.status === 'untyped') cls += 'text-[var(--color-text-dimmed)] ';
                  if (c.status === 'correct') cls += 'text-[var(--color-state-correct)] ';
                  if (c.status === 'incorrect') cls += 'text-[var(--color-state-incorrect)] bg-[rgba(255,59,48,0.08)] rounded-[2px] ';
                  if (i === typingEngine.currentIndex) cls += 'current cursor-underline ';
                  return (
                    <span key={i} className={cls}>
                      {c.char}
                    </span>
                  );
                })}
              </div>
            </section>
          </section>
        ) : (
          <section className="w-full max-w-[800px] my-10 mx-auto animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="w-full bg-transparent py-5">
              <div className="text-center mb-8">
                <h2 className="text-[1.4rem] font-bold text-[var(--color-text-primary)] tracking-tight">Results</h2>
                <p className="text-[0.85rem] text-[var(--color-text-muted)] mt-1">Here&apos;s how you performed</p>
              </div>

              <div className="text-center py-7 mb-7 border-y border-[var(--color-border-light)]">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[4rem] font-extrabold text-[var(--color-accent)] tracking-[-3px] leading-none">{wpm}</span>
                  <span className="text-[0.75rem] uppercase tracking-[2px] text-[var(--color-text-muted)] font-medium">words per minute</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-[1px] bg-[var(--color-border-light)] rounded-xl overflow-hidden mb-7">
                {[
                  { label: "Accuracy", value: `${accuracy}%` },
                  { label: "Raw WPM", value: rawWpm },
                  { label: "Correct", value: typingEngine.correctCount },
                  { label: "Incorrect", value: typingEngine.incorrectCount },
                  { label: "Missed", value: missed },
                  { label: "Characters", value: typingEngine.totalKeystrokes },
                ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 py-4 px-3 bg-[var(--color-bg-primary)]">
                    <span className="font-mono text-lg font-bold text-[var(--color-text-primary)]">{stat.value}</span>
                    <span className="text-[0.65rem] uppercase tracking-[1px] text-[var(--color-text-muted)] font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="mb-7 p-5 bg-[var(--color-bg-primary)] rounded-xl">
                <h3 className="text-[0.7rem] uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-semibold mb-4">Performance Over Time</h3>
                <ResultsChart data={typingEngine.wpmHistory} />
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => { typingEngine.initTest(typingEngine.text, typingEngine.selectedTime, typingEngine.isCustom); textDisplayRef.current?.focus(); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 border-none rounded-xl font-sans text-[0.85rem] font-semibold cursor-pointer transition-all bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(45,127,249,0.2)] active:scale-98"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Try Again
                </button>
                <button
                  onClick={() => { typingEngine.loadRandomTest(); textDisplayRef.current?.focus(); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-sans text-[0.85rem] font-semibold cursor-pointer transition-all bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border-light)] hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]"
                >
                  Next Test
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-1 mt-auto px-8">
        <div className="border-t border-[var(--color-border-light)] py-5 text-center">
          <p className="text-[var(--color-text-muted)] text-[0.72rem] tracking-[0.5px]">TypeFlow - Crafted with precision. Type with purpose.</p>
        </div>
      </footer>

      {/* CUSTOM TEST MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center glass-overlay animate-[fadeIn_0.25s_cubic-bezier(0.16,1,0.3,1)]">
          <div className="w-[90%] max-w-[480px] bg-[var(--color-bg-elevated)] border border-[var(--color-border-light)] rounded-[24px] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)] animate-[cardIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[1.15rem] font-bold tracking-tight">Create Custom Test</h2>
              <button
                onClick={() => setShowCustomModal(false)}
                className="flex items-center justify-center w-8 h-8 border-none rounded-md bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-secondary)] cursor-pointer transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="mb-5">
              <label className="block text-[0.75rem] font-semibold uppercase tracking-[0.8px] text-[var(--color-text-muted)] mb-2">
                Your Paragraph
              </label>
              <textarea
                rows={6}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste or type your custom paragraph here..."
                className="w-full p-3.5 border border-[var(--color-border-light)] rounded-xl bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-mono text-[0.85rem] leading-[1.7] resize-y outline-none transition-colors focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
              />
              <span className="block text-right text-[0.7rem] text-[var(--color-text-muted)] mt-1.5">{customText.length} characters</span>
            </div>

            <div className="mb-5">
              <label className="block text-[0.75rem] font-semibold uppercase tracking-[0.8px] text-[var(--color-text-muted)] mb-2">
                Duration (seconds)
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="number"
                  min="10"
                  max="600"
                  value={customTime}
                  onChange={(e) => setCustomTime(parseInt(e.target.value) || 10)}
                  className="w-[100px] p-2.5 border border-[var(--color-border-light)] rounded-xl bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-mono text-[0.95rem] outline-none transition-colors focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
                />
                <span className="text-[var(--color-text-muted)] text-[0.8rem]">seconds</span>
              </div>
            </div>

            <div className="mt-2">
              <button
                onClick={handleStartCustom}
                className="w-full flex items-center justify-center py-3.5 px-6 bg-[var(--color-accent)] text-white rounded-xl font-sans text-[0.85rem] font-semibold cursor-pointer transition-all hover:bg-[var(--color-accent-hover)] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(45,127,249,0.2)] active:scale-98"
              >
                Start Custom Test
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
