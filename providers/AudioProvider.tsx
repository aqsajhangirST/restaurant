"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AudioValue {
  isEnabled: boolean;
  toggle: () => void;
  registerAudioElement: (element: HTMLAudioElement | null) => void;
}

export const AudioContext = createContext<AudioValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isEnabled, setIsEnabled] = useState(false);

  const registerAudioElement = useCallback(
    (element: HTMLAudioElement | null) => {
      audioRef.current = element;
    },
    []
  );

  const playAudio = useCallback(() => {
    const audio = audioRef.current;

    if (audio && !isEnabled) {
      audio.volume = 0.25;

      audio
        .play()
        .then(() => {
          setIsEnabled(true);
        })
        .catch(() => {});
    }
  }, [isEnabled]);

  useEffect(() => {
    const startMusic = () => {
      playAudio();

      window.removeEventListener("click", startMusic);
      window.removeEventListener("scroll", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };

    window.addEventListener("click", startMusic);
    window.addEventListener("scroll", startMusic);
    window.addEventListener("touchstart", startMusic);

    return () => {
      window.removeEventListener("click", startMusic);
      window.removeEventListener("scroll", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };
  }, [playAudio]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isEnabled) {
      audio.pause();
      setIsEnabled(false);
    } else {
      audio.play();
      setIsEnabled(true);
    }
  }, [isEnabled]);

  const value = useMemo(
    () => ({
      isEnabled,
      toggle,
      registerAudioElement,
    }),
    [isEnabled, toggle, registerAudioElement]
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}