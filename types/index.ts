/** Narrative scene identifiers — the 14-scene structure from the storyboard.
 *  Only scenes 1-13 are meaningfully used yet; the rest are declared now so
 *  later phases can extend the timeline without renaming this type. */
export type SceneName =
  | "loading"
  | "flowers"
  | "tree"
  | "restaurant"
  | "about"
  | "menu"
  | "food"
  | "chef"
  | "gallery"
  | "reviews"
  | "instagram"
  | "reservation"
  | "contact"
  | "ending";

export type PerformanceTier = "high" | "low" | "unknown";

export interface MenuItemData {
  image: string | StaticImport;
  id: string;
  name: string;
  description: string;
  price: string;
  /** True for the handful of dishes featured in Scene 7's spotlight
   *  carousel — not every dish gets the cinematic treatment. */
  spotlight?: boolean;
  /** True for dishes hot enough off the pass to justify the steam overlay
   *  (karahi, steak, wok dishes) — false/undefined for desserts etc. */
  hot?: boolean;
}

export interface MenuCategoryData {
  id: string;
  name: string;
  tagline: string;
  items: MenuItemData[];
}

export interface PlatterData {
  id: string;
  name: string;
  servings: string;
  description: string;
  price: string;
}

export interface GalleryImageData {
  src: string;
  id: string;
  caption: string;
  aspect: "tall" | "wide" | "square";
}


/** Scene 10's guest quotes. `name` is deliberately omitted — content/
 *  reviews.json holds illustrative sample copy only (see ReviewsSection's
 *  header comment), and attaching a fabricated name to a quote would read
 *  as a real, identifiable person's review when it isn't one. */
export interface ReviewData {
  id: string;
  quote: string;
  occasion: string;
  rating: number;
}

import { StaticImport } from "next/dist/shared/lib/get-img-props";
/** Scene 11's feed tiles. No image/caption/permalink fields — there's no
 *  real post content to reference yet, so every tile links out to the
 *  real @bayroute_f6 profile itself rather than a fabricated per-post
 *  permalink (see InstagramGrid's header comment). `kind` only changes
 *  which placeholder icon renders (camera vs. reel-play). */
import { StaticImageData } from "next/image";

export interface InstagramPostData {
  id: string;
  kind: "photo" | "reel";
  src: string | StaticImageData;
  caption: string;
}

/** Scene 13's practical-close info. Only the parts that are actually
 *  known (the neighborhood) are real content; hours and phone/WhatsApp
 *  aren't in here at all because there's no confirmed real value for
 *  either yet — ContactSection labels those "pending" directly rather
 *  than through this data shape (see its header comment). `mapQuery` is a
 *  human-readable search string, not a fabricated coordinate pin. */
export interface ContactInfoData {
  address: string;
  mapQuery: string;
}
