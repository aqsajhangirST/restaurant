import type { LucideIcon } from "lucide-react";

interface ContactDetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  pending?: boolean;
}

/** One line of practical info (address / hours / phone) — icon, label,
 *  value, optionally a real tap-to-call/tap-to-WhatsApp link. When
 *  `pending` is true the value renders as a clearly-labeled placeholder
 *  instead of a live link, per the same honesty pattern used throughout
 *  this build (see ContactSection's header comment for why). */
export function ContactDetailRow({ icon: Icon, label, value, href, pending }: ContactDetailRowProps) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-ink/10 text-gold-ink">
        <Icon size={16} strokeWidth={1.5} />
      </span>
      <div>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-rosewood-500/70">{label}</p>
        {pending || !href ? (
          <p className="mt-1 font-body text-base text-charcoal-700">{value}</p>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block font-body text-base text-charcoal-900 underline decoration-gold-ink/40 underline-offset-4 hover:text-gold-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-700"
          >
            {value}
          </a>
        )}
      </div>
    </div>
  );
}
