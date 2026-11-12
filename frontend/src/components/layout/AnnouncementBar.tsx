import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export function AnnouncementBar() {
  const { years, price, oldPrice, period } = site.anniversary;

  return (
    <div className="bg-ink px-4 py-2.5 text-center text-[14px] font-medium text-cream">
      {years} ans de {site.name} : la rose à {formatPrice(price)} au lieu de {formatPrice(oldPrice)},{" "}
      {period}.{" "}
      <span className="whitespace-nowrap text-yolk">Livraison gratuite les mardis et mercredis.</span>
    </div>
  );
}
