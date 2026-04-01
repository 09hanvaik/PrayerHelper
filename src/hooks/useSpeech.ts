import { useState, useCallback, useEffect, useRef } from 'react';

// Preferred calm-sounding English voices, checked in priority order.
// The browser provides whatever voices the OS has installed, so this
// gracefully falls back through the list.
const PREFERRED_VOICES = [
  'Google UK English Female',
  'Microsoft Sonia Online (Natural) - English (United Kingdom)',
  'Microsoft Libby Online (Natural) - English (United Kingdom)',
  'Microsoft Hazel Desktop - English (Great Britain)',
  'Samantha',   // macOS / iOS
  'Karen',      // macOS
  'Moira',      // macOS Irish English
];

// Chrome has a bug where speechSynthesis pauses after ~15s of continuous
// speech. Calling .resume() on a timer keeps it alive.
const CHROME_RESUME_INTERVAL_MS = 10_000;

function pickCalmVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  for (const name of PREFERRED_VOICES) {
    const match = voices.find(v => v.name === name);
    if (match) return match;
  }
  // Fall back to any en-GB voice, then any English voice
  return (
    voices.find(v => v.lang === 'en-GB') ??
    voices.find(v => v.lang.startsWith('en')) ??
    null
  );
}

export function useSpeech(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const resumeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearResumeTimer() {
    if (resumeTimer.current !== null) {
      clearInterval(resumeTimer.current);
      resumeTimer.current = null;
    }
  }

  // Prime async voice loading on mount; cancel any in-progress speech on unmount
  useEffect(() => {
    if (!supported) return;
    speechSynthesis.getVoices();
    return () => {
      speechSynthesis.cancel();
      clearResumeTimer();
    };
  }, [supported]);

  const play = useCallback(() => {
    if (!supported) return;
    speechSynthesis.cancel();
    clearResumeTimer();

    const utterance       = new SpeechSynthesisUtterance(text);
    utterance.rate        = 0.82;  // slower → more contemplative
    utterance.pitch       = 0.95;  // slightly lower → calmer
    utterance.volume      = 1;

    const voice = pickCalmVoice(speechSynthesis.getVoices());
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      setIsPlaying(false);
      clearResumeTimer();
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      clearResumeTimer();
    };

    speechSynthesis.speak(utterance);
    setIsPlaying(true);

    // Work around Chrome's ~15s pause bug by periodically calling resume()
    resumeTimer.current = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, CHROME_RESUME_INTERVAL_MS);
  }, [text, supported]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    clearResumeTimer();
    setIsPlaying(false);
  }, []);

  return { supported, isPlaying, play, stop };
}
