"use client";

import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/buttons";
import { postJson } from "@/lib/api";

type Status = "idle" | "sending" | "sent" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");

    setStatus("sending");
    const { ok } = await postJson("/api/newsletter", { email });

    if (ok) {
      form.reset();
      setStatus("sent");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-120">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Votre adresse e-mail
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="votre@email.com"
          className="flex-1 rounded-full border-2 border-ink/20 bg-cream px-6 py-3.5 text-[16px] outline-hidden transition placeholder:text-ink-mute/70 focus:border-ink"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={buttonClass("dark")}
        >
          {status === "sending" ? "Envoi…" : "S’inscrire"}
        </button>
      </div>

      <p role="status" className="mt-4 min-h-6 text-[14px]">
        {status === "sent" && <span className="font-semibold text-ink">Merci, à très vite dans votre boîte mail !</span>}
        {status === "error" && (
          <span className="font-semibold text-bloom-deep">Une erreur est survenue, veuillez réessayer.</span>
        )}
      </p>
    </form>
  );
}
