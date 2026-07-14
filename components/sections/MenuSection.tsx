"use client";

import { getMenuCategories, getPlatters } from "@/lib/cms";
import { MenuFilterBar } from "@/components/menu/MenuFilterBar";
import { DishCard } from "@/components/menu/DishCard";
import { PlattersSpotlight } from "@/components/menu/PlattersSpotlight";
import { RouteLine } from "@/components/motion/RouteLine";
import { RevealText } from "@/components/motion/RevealText";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import type { MenuCategoryData } from "@/types";

function CategoryBlock({ category }: { category: MenuCategoryData }) {
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();

  return (
    <div id={`menu-${category.id}`} ref={ref} className="scroll-mt-24 py-12 sm:py-16">
      <RevealText
        as="h3"
        text={category.name}
        visible={isVisible}
        className="font-display text-2xl text-charcoal-900 sm:text-3xl"
      />
      <RevealText
        as="p"
        text={category.tagline}
        visible={isVisible}
        delay={0.08}
        className="mt-2 font-body text-sm text-charcoal-500 sm:text-base"
        wordClassName="mr-[0.2em]"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {category.items.map((item) => (
          <DishCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

/**
 * Scene 6 — Menu. The menu's real breadth (desi, continental, Chinese,
 * burgers, desserts) framed as "the route" — category chips and a
 * scroll-drawn gold line standing in for stops on a journey, per the
 * storyboard. First light/ivory-background section in the whole
 * experience, deliberately: it echoes the real physical menu's cream-and-
 * gold design and signals "we've arrived somewhere new" against Scenes
 * 1-5's dark grounding.
 *
 * `getMenuCategories`/`getPlatters` come from lib/cms.ts's swappable
 * content interface — this component and the future standalone `/menu`
 * route both call the same functions, so they can never drift out of
 * sync with each other.
 */
export function MenuSection() {
  const categories = getMenuCategories();
  const platters = getPlatters();
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionReveal<HTMLDivElement>();

  return (
    <section
      id="menu"
      aria-label="Menu"
      className="relative bg-ivory-100 px-6 py-20 sm:px-10 sm:py-28"
    >
      <RouteLine />

      <div className="mx-auto max-w-3xl text-center">
        <div ref={headerRef}>
          <RevealText
            as="p"
            text="The Route"
            visible={headerVisible}
            className="font-body text-xs uppercase tracking-[0.3em] text-gold-ink"
          />
          <RevealText
            as="h2"
            text="The Menu"
            visible={headerVisible}
            delay={0.08}
            className="mt-3 font-display text-4xl text-charcoal-900 sm:text-5xl"
          />
          <RevealText
            as="p"
            text="Six stops on one table — desi to continental to Chinese, in whatever order you like."
            visible={headerVisible}
            delay={0.16}
            className="mt-4 font-body text-base text-charcoal-500 sm:text-lg"
            wordClassName="mr-[0.22em]"
          />
        </div>

        <div className="mt-10">
          <MenuFilterBar categories={categories} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl sm:pl-10">
        {categories.map((category) => (
          <CategoryBlock key={category.id} category={category} />
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-4xl sm:pl-10">
        <PlattersSpotlight platters={platters} />
      </div>
    </section>
  );
}
