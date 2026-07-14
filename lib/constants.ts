/**
 * Bayroute design tokens, mirrored from app/globals.css.
 *
 * CSS variables can't be read synchronously by GSAP tweens or Three.js
 * materials (they need real values, not `var(--x)` strings, in most cases),
 * so the same palette/timing values are duplicated here as plain JS. If you
 * change a color or duration in globals.css, change it here too — these two
 * files are the single source of truth for the whole design system.
 */

export const colors = {
  charcoal950: "#0d0b0a",
  charcoal900: "#151110",
  charcoal800: "#1e1917",
  charcoal700: "#2b2422",
  charcoal500: "#5a4f4a",

  bloom100: "#fbeaee",
  bloom300: "#f3c9d2",
  bloom500: "#e8879c",
  bloom700: "#b85c72",
  bloom900: "#6e2f3e",

  gold300: "#e4c68a",
  gold500: "#c9a15a",
  gold700: "#9c7a3e",
  goldInk: "#8a6a34", // text-safe dark gold for ivory backgrounds only, see globals.css

  light200: "#fff3d9",
  light400: "#ffe3b0",
  light600: "#ffce85",

  ivory50: "#fbf8f3",
  ivory100: "#f6efe6",
  ivory300: "#e9ddc9",

  rosewood500: "#8b5e4b",
  rosewood700: "#5f3f32",
} as const;

export const durations = {
  instant: 0.12,
  fast: 0.22,
  base: 0.4,
  slow: 0.7,
  cinematic: 1.6,
} as const;

export const easings = {
  // cubic-bezier(0.22, 1, 0.36, 1) — the signature "bloom" curve, used for
  // nearly every reveal/entrance in the experience.
  bloom: [0.22, 1, 0.36, 1] as [number, number, number, number],
  // cubic-bezier(0.4, 0, 0.2, 1) — snappier, reserved for functional UI
  // (buttons, toggles) that should feel responsive rather than dreamy.
  snap: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

/** Scene 1 timing budget, in seconds, per the cinematic storyboard.
 *  Both LoadingScene (3D convergence) and LoaderScreen (DOM chrome) read
 *  from this single source so the two layers land in sync without needing
 *  to bridge live callbacks between the canvas and the DOM. */
export const loadingSceneTiming = {
  igniteDelay: 0.3,
  igniteDuration: 1.2,
  convergeDuration: 2.2,
  wordmarkDelay: 2.4,
  taglineDelay: 2.8,
  chromeRevealDelay: 3.6,
} as const;

/**
 * Per-scene slices of the master scroll progress (0..1) — see
 * lib/curves.ts for the camera path these are keyed against. Ranges
 * overlap deliberately (e.g. flowersStart sits before loadingFadeEnd) so
 * hand-offs are soft cross-fades, never hard cuts. Scene 5 gets its own
 * range here (and its own scroll-stage height) once it exists; for now
 * Restaurant simply runs to the end of the currently-available scroll
 * track — this is also where the continuous camera take finishes.
 */
export const sceneProgress = {
  loadingFadeStart: 0.03,
  loadingFadeEnd: 0.1,
  flowersStart: 0.04,
  flowersEnd: 0.3,
  treeStart: 0.22,
  treeEnd: 0.62,
  restaurantStart: 0.55,
  restaurantEnd: 1.0,
} as const;
