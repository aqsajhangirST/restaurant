"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { ScrollTrigger } from "@/lib/gsap";

interface ScrollTimelineValue {
  /** 0..1 across the registered trigger element's scroll distance. This
   *  is a mutable ref, not React state — 3D consumers read it inside
   *  useFrame, which already runs every frame, so pushing updates through
   *  setState here would just cost re-renders nothing reads. */
  progressRef: { current: number };
  /** Called by the page to hand the provider the DOM element whose
   *  scroll distance defines "0..1" (see app/page.tsx's scroll-stage
   *  spacer). Passing null unregisters it. */
  registerTrigger: (element: HTMLElement | null) => void;
}

export const ScrollTimelineContext = createContext<ScrollTimelineValue | null>(
  null
);

export function ScrollTimelineProvider({ children }: { children: ReactNode }) {
  const progressRef = useRef(0);
  const triggerElRef = useRef<HTMLElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const registerTrigger = useCallback((element: HTMLElement | null) => {
    triggerElRef.current = element;
  }, []);

  useEffect(() => {
    // The trigger element registers itself a render after this provider
    // mounts (it lives in the page, below this in the tree), so defer
    // creating the ScrollTrigger by one frame rather than racing it.
    const raf = requestAnimationFrame(() => {
      if (!triggerElRef.current) return;
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: triggerElRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
    };
  }, []);

  const value = useMemo<ScrollTimelineValue>(
    () => ({ progressRef, registerTrigger }),
    [registerTrigger]
  );

  return (
    <ScrollTimelineContext.Provider value={value}>
      {children}
    </ScrollTimelineContext.Provider>
  );
}
