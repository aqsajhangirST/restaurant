import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins. Every file that needs
 * ScrollTrigger imports it from here (not directly from "gsap/ScrollTrigger")
 * so the plugin is guaranteed to be registered exactly once, regardless of
 * import order.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
