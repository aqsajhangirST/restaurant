"use client";

import { Minus, Plus } from "lucide-react";

interface PartySizeStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/** Design-system's "party size stepper" — a styled +/- control rather
 *  than a bare `<select>`, per 01-design-system.md §17. */
export function PartySizeStepper({ value, onChange, min = 1, max = 20 }: PartySizeStepperProps) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-charcoal-700 bg-charcoal-800 px-3 py-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease party size"
        className="rounded-full p-1.5 text-ivory-300 transition-colors hover:text-ivory-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
      >
        <Minus size={16} strokeWidth={1.75} />
      </button>

      <span className="min-w-[2.5rem] text-center font-body text-base text-ivory-50" aria-live="polite">
        {value} {value === 1 ? "guest" : "guests"}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase party size"
        className="rounded-full p-1.5 text-ivory-300 transition-colors hover:text-ivory-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
      >
        <Plus size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}
