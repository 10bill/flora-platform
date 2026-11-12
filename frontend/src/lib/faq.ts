import { formatPrice } from "./format";
import { site } from "./site";

// ⚠️ Réponses d’exemple : à valider avec Flora (zones, délais, tarifs).
export const faq = [
  {
    question: "Livrez-vous le jour même ?",
    answer: `Oui, pour toute commande passée avant ${site.sameDayCutoff}, dans la limite des disponibilités du jour. Au-delà, la livraison est programmée le lendemain ou à la date de votre choix.`,
  },
  {
    question: "Combien coûte la livraison ?",
    answer: `La livraison est gratuite les mardis et mercredis, et dès ${formatPrice(site.freeDeliveryFrom)} d’achat les autres jours. Sinon, elle est de ${formatPrice(site.deliveryFee)}.`,
  },
  {
    question: "Puis-je choisir la date de livraison ?",
    answer:
      "Oui. Vous indiquez la date souhaitée au moment de la commande : idéal pour un anniversaire ou une surprise.",
  },
  {
    question: "Puis-je ajouter un message ?",
    answer:
      "Bien sûr. Vous pouvez écrire quelques mots dans le champ « Message pour la carte » lors de la commande, nous les recopions à la main.",
  },
  {
    question: "Comment faire durer mon bouquet ?",
    answer:
      "Recoupez les tiges en biais, changez l’eau tous les deux jours et gardez le vase loin du soleil et des sources de chaleur. Retrouvez tous nos conseils dans le journal.",
  },
  {
    question: "Je veux un bouquet sur mesure ou des fleurs pour un événement.",
    answer:
      "Écrivez-nous depuis la page Contact en précisant la date, le lieu et vos envies de couleurs : nous revenons vers vous avec une proposition.",
  },
] as const;
