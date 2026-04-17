import { useEffect, useState } from 'react';

type PlaybackListener = (playbackId: string | null) => void;

let activePlaybackId: string | null = null;
let playbackToken = 0;
const listeners = new Set<PlaybackListener>();

function hasSpeechSupport() {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && 'SpeechSynthesisUtterance' in window;
}

function emitPlaybackChange() {
  listeners.forEach(listener => listener(activePlaybackId));
}

function getRussianVoice() {
  if (!hasSpeechSupport()) return null;

  const voices = window.speechSynthesis.getVoices();

  return voices.find(voice => voice.lang.toLowerCase().startsWith('ru'))
    ?? voices.find(voice => voice.lang.toLowerCase().includes('ru'))
    ?? null;
}

export function stopRussianSpeech() {
  if (!hasSpeechSupport()) return;

  playbackToken += 1;
  activePlaybackId = null;
  window.speechSynthesis.cancel();
  emitPlaybackChange();
}

export function useRussianSpeech(playbackId: string, text: string) {
  const [isPlaying, setIsPlaying] = useState(activePlaybackId === playbackId);
  const [isSupported] = useState(hasSpeechSupport);

  useEffect(() => {
    const syncPlayback = (currentPlaybackId: string | null) => {
      setIsPlaying(currentPlaybackId === playbackId);
    };

    listeners.add(syncPlayback);
    syncPlayback(activePlaybackId);

    return () => {
      listeners.delete(syncPlayback);

      if (activePlaybackId === playbackId) {
        stopRussianSpeech();
      }
    };
  }, [playbackId]);

  const togglePlayback = () => {
    if (!isSupported || !text.trim()) return;

    if (activePlaybackId === playbackId) {
      stopRussianSpeech();
      return;
    }

    const token = playbackToken + 1;
    playbackToken = token;
    activePlaybackId = playbackId;
    window.speechSynthesis.cancel();
    emitPlaybackChange();

    const utterance = new SpeechSynthesisUtterance(text);
    const russianVoice = getRussianVoice();

    utterance.lang = 'ru-RU';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    if (russianVoice) {
      utterance.voice = russianVoice;
    }

    const finishPlayback = () => {
      if (playbackToken !== token) return;

      activePlaybackId = null;
      emitPlaybackChange();
    };

    utterance.onend = finishPlayback;
    utterance.onerror = finishPlayback;

    window.speechSynthesis.speak(utterance);
  };

  return {
    isPlaying,
    isSupported,
    togglePlayback,
  };
}
