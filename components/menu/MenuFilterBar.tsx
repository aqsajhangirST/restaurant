"use client";

import type { MenuCategoryData } from "@/types";
import { cn } from "@/lib/utils";

interface MenuFilterBarProps {
  categories: MenuCategoryData[];
  className?: string;
}

/**
 * Category chip row — real anchor links to each category's section id,
 * not decoration. Drives both the `/` Scene 6 experience and the future
 * standalone `/menu` route identically, since both render the same
 * MenuSection component (project-architecture.md's hybrid-routing note).
 */
export function MenuFilterBar({ categories, className }: MenuFilterBarProps) {
  return (
    <nav
      aria-label="Menu categories"
      className={cn(
        "flex snap-x gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible",
        className
      )}
    >
      {categories.map((category) => (
        <a
          key={category.id}
          href={`#menu-${category.id}`}
          className={cn(
            "snap-start whitespace-nowrap rounded-full border border-gold-ink/30 px-4 py-1.5",
            "font-body text-xs uppercase tracking-[0.2em] text-charcoal-900",
            "transition-colors hover:border-gold-ink hover:bg-ivory-100",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-ink"
          )}
        >
          {category.name}
        </a>
      ))}
    </nav>
  );
}
