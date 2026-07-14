/**
 * Cross-tree, non-reactive progress refs shared between a DOM section and
 * a permanently-mounted 3D scene that lives elsewhere in ExperienceCanvas'
 * tree. Every other cross-layer value so far has flowed through either
 * props (CameraRig -> its children) or the ScrollTimeline context
 * (scrollProgressRef, which is pinned at 1 for the whole page once the
 * Scenes 1-4 scroll-stage ends — useless for telling one Scene 5+ section
 * apart from another). A plain module-level singleton is the cheapest fix
 * for a value like this; it's not worth a new Context provider just to
 * hand one number from a DOM section down to a 3D component.
 *
 * `current` follows the same `{ current: number }` ref shape used
 * throughout the 3D layer (GoldEmberField's `progress`/`fadeOut`,
 * CameraRig's `progressRef`, etc.) so each drops into the same
 * useFrame-read pattern.
 */
export const reservationSpotlightProgress = { current: 0 };

/**
 * Scene 13's continuation of the same light: storyboard says the
 * Reservation spotlight "widens and cools slightly" as Contact comes
 * into view, rather than introducing a second light. SpotlightScene
 * blends angle/color toward a wider, cooler state as this climbs 0->1.
 */
export const contactWideningProgress = { current: 0 };

/**
 * Scene 14 — Ending: "pendant lights extinguish in reverse-staggered
 * sequence" as the site closes out. RestaurantScene's bulbs (lit back in
 * Scene 4) read this to dim themselves back down; 0 = fully lit (their
 * normal Scene 5-13 resting state), 1 = fully extinguished.
 */
export const endingDimProgress = { current: 0 };

/** Scene 14's "final soft re-convergence on the seal" — drives a second,
 *  independent GoldEmberField instance (see ExperienceCanvas). `fade`
 *  brings it from invisible to visible as Ending scrolls into view;
 *  `converge` then plays the same scatter-to-seal motion Scene 1 used,
 *  slightly staggered after `fade` so it reads as forming, not appearing. */
export const endingEmberFade = { current: 0 };
export const endingEmberConverge = { current: 0 };
