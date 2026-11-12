import { config } from "../config";
import type { NewMessage, NewOrder } from "../types";

const franc = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 });
const price = (value: number) => franc.format(value);

/**
 * Prévient Flora par e-mail (service Resend) à chaque commande et message.
 * Actif seulement si RESEND_API_KEY et ORDER_NOTIFY_EMAIL sont renseignés.
 * Ne bloque jamais le client : en cas d’échec on journalise l’erreur.
 */
async function sendMail(subject: string, body: string, replyTo?: string): Promise<void> {
  if (!config.resendApiKey || !config.notifyEmail) return;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: config.fromEmail,
        to: [config.notifyEmail],
        subject,
        text: body,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!response.ok) console.error("[notify] Resend a refusé l’e-mail :", await response.text());
  } catch (error) {
    console.error("[notify] Envoi de l’e-mail impossible :", error);
  }
}

export async function notifyNewOrder(order: NewOrder): Promise<void> {
  const { customer, items, totals } = order;
  const lines = [
    `Nouvelle commande ${order.reference}`,
    "",
    ...items.map((item) => `• ${item.qty} × ${item.title} (${price(item.unitPrice)})`),
    "",
    `Sous-total : ${price(totals.subtotal)}`,
    `Livraison : ${totals.delivery === 0 ? "offerte" : price(totals.delivery)}`,
    `TOTAL : ${price(totals.total)}`,
    "",
    `Client : ${customer.firstName} ${customer.lastName}`,
    `Téléphone : ${customer.phone}`,
    customer.email ? `E-mail : ${customer.email}` : "",
    `Adresse : ${customer.address}, ${customer.district}`,
    customer.landmark ? `Repère : ${customer.landmark}` : "",
    `Livraison souhaitée : ${customer.deliveryDate}`,
    customer.cardMessage ? `Message pour la carte : ${customer.cardMessage}` : "",
  ].filter((line, index, all) => line !== "" || all[index - 1] !== "");

  await sendMail(`Nouvelle commande ${order.reference} · ${price(totals.total)}`, lines.join("\n"), customer.email || undefined);
}

export async function notifyNewMessage(message: NewMessage): Promise<void> {
  await sendMail(
    `Nouveau message : ${message.subject}`,
    [`De : ${message.name} <${message.email}>`, `Sujet : ${message.subject}`, "", message.message].join("\n"),
    message.email,
  );
}
