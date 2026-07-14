"use client";

import { useEffect, useRef } from "react";
import { ExperienceCanvas } from "@/components/canvas/ExperienceCanvas";
import { LoaderScreen } from "@/components/ui/LoaderScreen";
import { Nav } from "@/components/ui/Nav";
import { RestaurantIntro } from "@/components/ui/RestaurantIntro";
import { AboutSection } from "@/components/sections/AboutSection";
import { MenuSection } from "@/components/sections/MenuSection";
import { FoodSection } from "@/components/sections/FoodSection";
import { ChefSection } from "@/components/sections/ChefSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { InstagramSection } from "@/components/sections/InstagramSection";
import { ReservationSection } from "@/components/sections/ReservationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EndingSection } from "@/components/sections/EndingSection";
import { useScrollTimeline } from "@/hooks/useScrollTimeline";

/**
 * Home — the full 14-scene experience (Loading, Flowers, Tree,
 * Restaurant, About, Menu, Food, Chef, Gallery, Reviews, Instagram,
 * Reservation, Contact, Ending), built phase by phase per scene.
 *
 * Structurally, this page is two different things stacked in sequence: a
 * fixed-position, camera-driven "take" (ExperienceCanvas + the loader/nav
 * /intro overlays, scrubbed via the scrollStage spacer below) for Scenes
 * 1-4, followed by ordinary document-flow content (AboutSection,
 * MenuSection, FoodSection, ChefSection, GallerySection, ReviewsSection,
 * InstagramSection, ReservationSection, ContactSection, EndingSection)
 * for Scene 5 onward.
 */
export default function Home() {
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const { registerTrigger } = useScrollTimeline();

  useEffect(() => {
    registerTrigger(scrollStageRef.current);
    return () => registerTrigger(null);
  }, [registerTrigger]);

  return (
    <main id="main-content" className="relative w-full ">
      <ExperienceCanvas />
      <Nav />
      <LoaderScreen />
      <RestaurantIntro />
      <div ref={scrollStageRef} className="h-[480vh]" aria-hidden="true" />
      <AboutSection />
      <MenuSection />
      <FoodSection />
      <ChefSection />
      <GallerySection />
      <ReviewsSection />
      <InstagramSection />
      <ReservationSection />
      <ContactSection />
      <EndingSection />
    </main>
  );
}
