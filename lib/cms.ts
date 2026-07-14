import menuData from "@/content/menu.json";
import galleryData from "@/content/gallery.json";
import reviewsData from "@/content/reviews.json";
import instagramData from "@/content/instagram.json";
import contactData from "@/content/contact.json";
import type {
  MenuCategoryData,
  MenuItemData,
  PlatterData,
  GalleryImageData,
  ReviewData,
  InstagramPostData,
  ContactInfoData,
} from "@/types";

/**
 * Single fetch interface for content (project-architecture.md's lib/cms.ts
 * entry) — implementation swappable between these local JSON files and a
 * real headless CMS later without touching any component that calls it.
 * Kept synchronous for now since the sources are static imports; a real
 * CMS-backed version would make these async and callers would await them.
 */
export function getMenuCategories(): MenuCategoryData[] {
  return menuData.categories;
}

export function getPlatters(): PlatterData[] {
  return menuData.platters;
}

/** Flattens every category's items and returns only the ones flagged
 *  `spotlight: true` — Scene 7's hero carousel, not the full menu. */
export function getSpotlightDishes(): MenuItemData[] {
  return menuData.categories
    .flatMap((category) => category.items)
    .filter((item) => item.spotlight === true);
}

export function getGalleryImages(): GalleryImageData[] {
  return galleryData as GalleryImageData[];
}

export function getReviews(): ReviewData[] {
  return reviewsData as ReviewData[];
}

export function getInstagramPosts(): InstagramPostData[] {
  return instagramData as InstagramPostData[];
}

export function getContactInfo(): ContactInfoData {
  return contactData as ContactInfoData;
}
