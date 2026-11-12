"use client";

import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/buttons";
import { Field } from "@/components/ui/Field";
import { postJson } from "@/lib/api";

type Status = "idle" | "sending" | "sent";
type ApiResponse = { error?: string };

const subjects = [
  "Une question",
  "Un bouquet sur mesure",
  "Un mariage ou un événement",
  "Autre demande",
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError(null);

    const { ok, data } = await postJson<ApiResponse>("/api/contact", values);

    if (ok) {
      form.reset();
      setStatus("sent");
    } else {
      setStatus("idle");
      setError(data?.error ?? "Impossible d’envoyer votre message. Réessayez dans un instant.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-line bg-sand/60 p-8 sm:p-10" role="status">
        <p className="font-display text-[36px] leading-tight">Message bien reçu.</p>
        <p className="mt-3 text-[16px] font-light leading-7 text-ink-soft">
          Merci ! Nous vous répondons très vite, en général sous 24 h.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-[14px] font-medium text-clay underline underline-offset-6 hover:text-bloom"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Nom" name="name" required autoComplete="name" />
      <Field label="E-mail" name="email" type="email" required autoComplete="email" />
      <Field
        as="select"
        label="Sujet"
        name="subject"
        required
        options={subjects}
        className="sm:col-span-2"
      />
      <Field
        as="textarea"
        label="Message"
        name="message"
        required
        rows={6}
        placeholder="Dites-nous tout : la date, le lieu, vos envies de couleurs…"
        className="sm:col-span-2"
      />

      {/* Champ piège anti-spam : invisible pour les humains, rempli par les robots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className={buttonClass("primary")}>
          {status === "sending" ? "Envoi…" : "Envoyer le message"}
        </button>
        {error && (
          <p role="alert" className="mt-4 text-[14px] text-bloom-deep">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
