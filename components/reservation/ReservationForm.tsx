"use client";

import { useMemo, useState, type FormEvent } from "react";
import { PartySizeStepper } from "@/components/reservation/PartySizeStepper";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  phone: string;
  date: string;
  occasion: string;
}

const EMPTY_FORM: FormState = { name: "", phone: "", date: "", occasion: "" };

/**
 * The reservation form itself (design-system §17: name, phone/WhatsApp,
 * date, party size stepper, occasion note). There's no reservation
 * backend to submit to yet, so this is a fully real, validated, accessible
 * form shell with nowhere to send its data — submitting doesn't fake a
 * confirmation (that would misinform a real guest that a table is held
 * when it isn't); it honestly says the booking system isn't connected
 * yet. Wiring a real endpoint later only touches the `handleSubmit` body.
 */
export function ReservationForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [partySize, setPartySize] = useState(2);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const errors = {
    name: form.name.trim().length === 0,
    phone: form.phone.trim().length === 0,
    date: form.date.trim().length === 0,
  };
  const hasErrors = errors.name || errors.phone || errors.date;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (hasErrors) return;
    // No booking backend exists yet — see component header comment.
    setSubmitted(true);
  };

  const fieldClass = (hasError: boolean) =>
    cn(
      "w-full rounded-md border bg-charcoal-800 px-3 py-2.5 font-body text-sm text-ivory-50",
      "placeholder:text-charcoal-500 focus-visible:outline focus-visible:outline-2",
      hasError && touched
        ? "border-error-500 focus-visible:outline-error-500"
        : "border-charcoal-700 focus-visible:outline-gold-500"
    );

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-lg border border-gold-500/20 bg-charcoal-800/60 p-6 text-center"
      >
        <p className="font-display text-lg text-ivory-50">Thank you, {form.name.split(" ")[0]}.</p>
        <p className="mt-2 font-body text-sm text-ivory-300">
          This form isn&apos;t connected to a live booking system yet, so nothing has actually
          been sent — but the moment it is, this exact form is ready to go.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="res-name" className="font-body text-sm text-ivory-300">
          Name
        </label>
        <input
          id="res-name"
          type="text"
          required
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Your name"
          className={cn("mt-1.5", fieldClass(errors.name))}
        />
        {touched && errors.name && (
          <p className="mt-1 font-body text-xs text-error-500">Name is required.</p>
        )}
      </div>

      <div>
        <label htmlFor="res-phone" className="font-body text-sm text-ivory-300">
          Phone / WhatsApp
        </label>
        <input
          id="res-phone"
          type="tel"
          required
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          placeholder="03xx xxxxxxx"
          className={cn("mt-1.5", fieldClass(errors.phone))}
        />
        {touched && errors.phone && (
          <p className="mt-1 font-body text-xs text-error-500">A contact number is required.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="res-date" className="font-body text-sm text-ivory-300">
            Date
          </label>
          <input
            id="res-date"
            type="date"
            required
            min={today}
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            className={cn("mt-1.5", fieldClass(errors.date))}
          />
          {touched && errors.date && (
            <p className="mt-1 font-body text-xs text-error-500">Pick a date.</p>
          )}
        </div>

        <div>
          <span className="font-body text-sm text-ivory-300">Party size</span>
          <div className="mt-1.5">
            <PartySizeStepper value={partySize} onChange={setPartySize} />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="res-occasion" className="font-body text-sm text-ivory-300">
          Occasion <span className="text-charcoal-500">(optional)</span>
        </label>
        <textarea
          id="res-occasion"
          rows={3}
          value={form.occasion}
          onChange={(event) => setForm((prev) => ({ ...prev, occasion: event.target.value }))}
          placeholder="Anniversary, birthday, first visit..."
          className={cn("mt-1.5 resize-none", fieldClass(false))}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-gold-500 px-6 py-3 font-body text-sm font-medium text-charcoal-950 transition-transform hover:scale-[1.01] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400"
      >
        Request Reservation
      </button>
    </form>
  );
}
