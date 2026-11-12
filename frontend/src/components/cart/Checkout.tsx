"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/buttons";
import { Field } from "@/components/ui/Field";
import { Photo } from "@/components/ui/Photo";
import { postJson } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { clearCart, removeFromCart, setQuantity, useCart } from "./useCart";

type Status = "idle" | "sending" | "done";
type OrderResponse = { reference?: string; total?: number; error?: string };

const qtyButton =
  "flex size-8 items-center justify-center rounded-full border border-line-strong text-ink-soft transition hover:border-bloom hover:text-bloom";

export function Checkout() {
  const { lines, subtotal, delivery, total } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const customer = Object.fromEntries(new FormData(event.currentTarget).entries());

    setStatus("sending");
    setError(null);

    const { ok, data } = await postJson<OrderResponse>("/api/orders", {
      customer,
      lines: lines.map((line) => ({ slug: line.bouquet.slug, qty: line.qty })),
    });

    if (!ok) {
      setStatus("idle");
      setError(data?.error ?? "Impossible d’envoyer la commande. Réessayez dans un instant.");
      return;
    }

    const orderRef = data?.reference ?? "";
    const orderTotal = data?.total ?? total;
    const value = (key: string) => String(customer[key] ?? "").trim();
    const message = [
      `Bonjour ${site.name}, voici ma commande${orderRef ? ` ${orderRef}` : ""} :`,
      ...lines.map((line) => `• ${line.qty} × ${line.bouquet.title}`),
      `Total : ${formatPrice(orderTotal)}`,
      `Nom : ${value("firstName")} ${value("lastName")}`,
      `Tél : ${value("phone")}`,
      `Livraison : ${value("address")}, ${value("district")}, le ${value("deliveryDate")}`,
    ].join("\n");

    setWhatsappUrl(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`);
    setReference(orderRef);
    clearCart();
    setStatus("done");
  }

  // 1. Commande envoyée
  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-line bg-sand/60 p-8 text-center sm:p-12" role="status">
        <p className="font-display text-[44px] leading-none">Merci !</p>
        <p className="mt-4 text-[16px] font-light leading-7 text-ink-soft">
          Votre commande est bien enregistrée. Pour aller plus vite, envoyez-la-nous aussi sur
          WhatsApp : nous vous contactons très vite pour la confirmer et organiser le paiement.
        </p>
        {reference && (
          <p className="mt-5 text-[14px] text-clay">
            Référence : {reference}
          </p>
        )}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("primary", "mt-8")}
          >
            Envoyer ma commande sur WhatsApp
          </a>
        )}
        <div>
          <Link href="/bouquets" className={buttonClass("outline", "mt-4")}>
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  // 2. Panier vide
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-line-strong bg-sand/50 px-6 py-16 text-center">
        <p className="font-display text-[36px] leading-tight">Votre panier est vide.</p>
        <p className="mt-3 text-[16px] font-light text-ink-soft">
          Choisissez un bouquet pour commencer.
        </p>
        <Link href="/bouquets" className={buttonClass("primary", "mt-8")}>
          Découvrir les bouquets
        </Link>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("fr-CA"); // AAAA-MM-JJ, heure locale
  const missing = delivery === 0 ? 0 : Math.max(0, site.freeDeliveryFrom - subtotal);

  // 3. Panier + formulaire
  return (
    <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
        <h2 className="font-display text-[34px] leading-none sm:col-span-2">Vos coordonnées</h2>
        <Field label="Prénom" name="firstName" required autoComplete="given-name" />
        <Field label="Nom" name="lastName" required autoComplete="family-name" />
        <Field label="E-mail (facultatif)" name="email" type="email" autoComplete="email" />
        <Field label="Téléphone" name="phone" type="tel" required autoComplete="tel" />

        <h2 className="mt-4 font-display text-[34px] leading-none sm:col-span-2">Livraison</h2>
        <Field
          label="Adresse ou description du lieu"
          name="address"
          required
          autoComplete="street-address"
          className="sm:col-span-2"
        />
        <Field label="Quartier" name="district" required placeholder="Ex. Patte d’oie, Koulouba…" />
        <Field label="Repère (facultatif)" name="landmark" placeholder="Ex. près de la pharmacie…" />
        <Field
          label="Date de livraison souhaitée"
          name="deliveryDate"
          type="date"
          min={today}
          required
          className="sm:col-span-2"
        />
        <Field
          as="textarea"
          label="Message pour la carte (facultatif)"
          name="cardMessage"
          rows={4}
          placeholder="Quelques mots que nous recopierons à la main…"
          className="sm:col-span-2"
        />

        <div className="sm:col-span-2">
          <button type="submit" disabled={status === "sending"} className={buttonClass("primary")}>
            {status === "sending" ? "Envoi…" : "Envoyer ma commande"}
          </button>
          <p className="mt-4 text-[13px] font-light leading-6 text-ink-mute">
            Le paiement en ligne arrive bientôt : pour le moment, nous vous recontactons pour
            confirmer la commande et le règlement.
          </p>
          {error && (
            <p role="alert" className="mt-3 text-[14px] text-bloom-deep">
              {error}
            </p>
          )}
        </div>
      </form>

      <aside className="rounded-3xl border border-line bg-sand/60 p-6 sm:p-8 lg:sticky lg:top-28">
        <h2 className="font-display text-[34px] leading-none">Votre panier</h2>

        <ul className="mt-6 divide-y divide-line">
          {lines.map(({ bouquet, qty, lineTotal }) => (
            <li key={bouquet.slug} className="flex gap-4 py-5 first:pt-0">
              <Photo
                src={bouquet.image}
                alt={bouquet.title}
                position={bouquet.position}
                sizes="64px"
                className="size-16 shrink-0 rounded-2xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-[22px] leading-tight">{bouquet.title}</p>
                  <p className="font-display text-[20px] text-clay">{formatPrice(lineTotal)}</p>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    className={qtyButton}
                    onClick={() => setQuantity(bouquet.slug, qty - 1)}
                    aria-label={`Retirer une unité de ${bouquet.title}`}
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-[15px]" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    className={qtyButton}
                    onClick={() => setQuantity(bouquet.slug, qty + 1)}
                    aria-label={`Ajouter une unité de ${bouquet.title}`}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(bouquet.slug)}
                    className="ml-auto text-[14px] text-ink-mute underline underline-offset-4 hover:text-bloom"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-2 space-y-3 border-t border-line pt-5 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Sous-total</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Livraison</dt>
            <dd>{delivery === 0 ? "Offerte" : formatPrice(delivery)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <dt className="font-display text-[24px]">Total</dt>
            <dd className="font-display text-[30px] text-clay">{formatPrice(total)}</dd>
          </div>
        </dl>

        {missing > 0 && (
          <p className="mt-4 text-[13px] font-light leading-6 text-ink-mute">
            Plus que {formatPrice(missing)} pour profiter de la livraison offerte.
          </p>
        )}
      </aside>
    </div>
  );
}
