"use client";

import { MessageCircle } from "lucide-react";

/**
 * Design-system's "WhatsApp quick-book sits above the full form on
 * mobile, styled as its own prominent block, not just another button in
 * the form" (01-design-system.md §17). There's no real WhatsApp Business
 * number for Bayroute available yet, so — same honesty pattern as every
 * other placeholder in this build — this renders as a visually prominent
 * but non-functional block, clearly labeled, rather than a live `wa.me`
 * link built on a fabricated number. Swapping in the real number later is
 * a one-line change: give this an `href` and drop the disabled styling.
 */
export function WhatsAppQuickBook() {
  return (
    <div
      role="group"
      aria-label="WhatsApp quick booking, not yet available"
      className="flex items-center gap-4 rounded-xl border border-success-500/25 bg-success-500/10 px-5 py-4 opacity-70"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success-500/20 text-success-500">
        <MessageCircle size={20} strokeWidth={1.5} />
      </span>
      <div>
        <p className="font-body text-sm font-medium text-ivory-50">Quick-book on WhatsApp</p>
        <p className="mt-0.5 font-body text-xs uppercase tracking-[0.15em] text-charcoal-500">
          WhatsApp number pending
        </p>
      </div>
    </div>
  );
}
