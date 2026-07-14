"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ReducedMotionValue {
  /** True if motion should be reduced, from either source below. */
  prefersReducedMotion: boolean;
  /** True only if the OS-level media query requested it. */
  systemPrefersReducedMotion: boolean;
  /** True only if the user flipped the in-app toggle manually. */
  manualReducedMotion: boolean;
  setManualReducedMotion: (value: boolean) => void;
}

export const ReducedMotionContext = createContext<ReducedMotionValue | null>(
  null
);

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] =
    useState(false);
  const [manualReducedMotion, setManualReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo<ReducedMotionValue>(
    () => ({
      prefersReducedMotion: systemPrefersReducedMotion || manualReducedMotion,
      systemPrefersReducedMotion,
      manualReducedMotion,
      setManualReducedMotion,
    }),
    [systemPrefersReducedMotion, manualReducedMotion]
  );

  return (
    <ReducedMotionContext.Provider value={value}>
      {children}
    </ReducedMotionContext.Provider>
  );
}
