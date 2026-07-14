"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "@/hooks/useAudio";

export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { registerAudioElement } = useAudio();

  useEffect(() => {
    registerAudioElement(audioRef.current);

    return () => {
      registerAudioElement(null);
    };
  }, [registerAudioElement]);

  return (
    <audio
      ref={audioRef}
      src="/images/Gallery/Pufinos.mp3"
      loop
      preload="auto"
    />
  );
}