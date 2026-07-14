"use client";

import Image from "next/image";
import { RevealText } from "@/components/motion/RevealText";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { cn } from "@/lib/utils";

const BEATS = [
  {
    eyebrow: "The Story",
    heading: "Why Bayroute",
    body: "The name traces a route to the Bay — Beirut, refracted through a warmer, closer light. Inside, that journey becomes a room: a canopy of bloom overhead, warm bulbs strung through it like the last light before dusk, and a table waiting under all of it.",
    image: "/images/restaurant/image5.jpeg",
    mediaLabel: "Interior",
  },
  {
    eyebrow: "The Canopy",
    heading: "A room that blooms",
    body: "Blush and white climb the ceiling and spill down the walls, lit from beneath until the whole room reads like dusk caught indoors. It's the first thing every guest photographs, and the reason most come back.",
    image: "/images/restaurant/image1.jpeg",
    mediaLabel: "Bloom Canopy",
  },
  {
    eyebrow: "The Route",
    heading: "One table, many cuisines",
    body: "Karahi and kebabs sit beside chow mein and a proper steak — not a compromise, but the point. Bayroute's table is a route across cuisines the same way its name is a route across a city.",
    image: "/images/restaurant/image3.jpeg",
    mediaLabel: "Dining Experience",
  },
] as const;

type Beat = (typeof BEATS)[number];

function StoryBeat({
  beat,
  index,
}: {
  beat: Beat;
  index: number;
}) {
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();
  const reversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-20",
        "sm:flex-row sm:px-10 sm:py-28",
        reversed && "sm:flex-row-reverse"
      )}
    >
      {/* Text */}
      <div className="flex-1">
        <RevealText
          as="p"
          text={beat.eyebrow}
          visible={isVisible}
          className="font-body text-xs uppercase tracking-[0.3em] text-gold-300"
        />

        <RevealText
          as="h2"
          text={beat.heading}
          visible={isVisible}
          delay={0.08}
          className="mt-4 font-display text-3xl text-ivory-50 sm:text-4xl"
        />

        <RevealText
          as="p"
          text={beat.body}
          visible={isVisible}
          delay={0.16}
          className="mt-5 max-w-md font-body text-base leading-relaxed text-ivory-300 sm:text-lg"
          wordClassName="mr-[0.24em]"
        />
      </div>

      {/* Image */}
      <div className="relative aspect-[4/5] w-full flex-1 overflow-hidden rounded-2xl border border-gold-500/20 shadow-2xl">
        <Image
          src={beat.image}
          alt={beat.heading}
          fill
          priority={index === 0}
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-5 left-5">
          <p className="font-body text-xs uppercase tracking-[0.25em] text-gold-300">
            {beat.mediaLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section
      id="story"
      aria-label="About Bayroute"
      className="relative bg-charcoal-900 py-8"
    >
      {BEATS.map((beat, i) => (
        <StoryBeat key={beat.heading} beat={beat} index={i} />
      ))}
    </section>
  );
}