"use client";

import { useEffect } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { ContactDetailRow } from "@/components/contact/ContactDetailRow";
import { MapPanel } from "@/components/contact/MapPanel";
import { RevealText } from "@/components/motion/RevealText";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getContactInfo } from "@/lib/cms";
import { gsap } from "@/lib/gsap";
import { contactWideningProgress } from "@/lib/sceneRefs";

/**
 * Scene 13 — Contact. Per the storyboard: "practical close — where,
 * when, how to reach," where "the romance recedes slightly in favor of
 * clarity" — hence the switch to an ivory background here, the same
 * clean/scannable register MenuSection uses, rather than continuing
 * Reservation's near-black drama. The 3D spotlight from Scene 12 widens
 * and cools to match (see SpotlightScene + lib/sceneRefs.ts).
 *
 * Hours and phone/WhatsApp aren't real values yet — no confirmed number
 * or hours exist for this restaurant at time of writing — so both render
 * as clearly-labeled pending items rather than invented specifics.
 * Address is real (the neighborhood); the map deliberately doesn't pin an
 * unverified exact location (see MapPanel's header comment).
 */
export function ContactSection() {
  const contact = getContactInfo();
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();
  const { prefersReducedMotion } = useReducedMotion();

  useEffect(() => {
    if (!isVisible) return;
    if (prefersReducedMotion) {
      contactWideningProgress.current = 1;
      return;
    }
    const tween = gsap.to(contactWideningProgress, {
      current: 1,
      duration: 1.6,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
  }, [isVisible, prefersReducedMotion]);

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}`;

  return (
    <section
      aria-label="Contact and location"
      className="relative bg-ivory-50 px-6 py-20 sm:px-10 sm:py-28"
    >
      <div ref={ref} className="mx-auto max-w-2xl text-center">
        <RevealText
          as="p"
          text="Find Us"
          visible={isVisible}
          className="font-body text-xs uppercase tracking-[0.3em] text-gold-ink"
        />
        <RevealText
          as="h2"
          text="The End of the Route"
          visible={isVisible}
          delay={0.08}
          className="mt-3 font-display text-4xl text-charcoal-900 sm:text-5xl"
        />
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-10 sm:grid-cols-2 sm:items-center">
        <div className="space-y-7">
          <ContactDetailRow
            icon={MapPin}
            label="Address"
            value={contact.address}
            href={mapSearchUrl}
          />
          <ContactDetailRow icon={Clock} label="Hours" value="Hours — to be confirmed" pending />
          <ContactDetailRow
            icon={Phone}
            label="Phone / WhatsApp"
            value="Number pending"
            pending
          />
        </div>

        <MapPanel mapQuery={contact.mapQuery} />
      </div>
    </section>
  );
}
