import { useState, useCallback, useEffect } from 'react';

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

  // Prime async voice loading on mount; cancel any in-progress speech on unmount
  useEffect(() => {
    if (!supported) return;
    speechSynthesis.getVoices();
    return () => { speechSynthesis.cancel(); };
  }, [supported]);

  const play = useCallback(() => {
    if (!supported) return;
    speechSynthesis.cancel();

    const utterance       = new SpeechSynthesisUtterance(text);
    utterance.rate        = 0.82;  // slower → more contemplative
    utterance.pitch       = 0.95;  // slightly lower → calmer
    utterance.volume      = 1;

    const voice = pickCalmVoice(speechSynthesis.getVoices());
    if (voice) utterance.voice = voice;

    utterance.onend   = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [text, supported]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  return { supported, isPlaying, play, stop };
}
