import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { helpNav, mainNav } from "@/lib/navigation";
import { site } from "@/lib/site";

const title = "mb-5 text-[17px] font-semibold text-yolk";
const link = "transition hover:text-white";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-mist">
      <Container className="grid gap-12 pb-10 pt-20 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <p className="max-w-xs text-[19px] leading-8 text-cream">
            Des bouquets vivants, composés à la main, à {site.city}. Depuis 8 ans.
          </p>
        </div>

        <div>
          <p className={title}>Explorer</p>
          <ul className="space-y-3 text-[16px]">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={title}>Aide</p>
          <ul className="space-y-3 text-[16px]">
            {helpNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={title}>Nous trouver</p>
          <ul className="space-y-3 text-[16px]">
            {site.locations.map((place) => (
              <li key={place.area}>
                <span className="text-cream">{place.area}</span>, {place.name}
              </li>
            ))}
            <li className="pt-2">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={link}>
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneSecondary.replace(/\s/g, "")}`} className={link}>
                {site.phoneSecondary}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cream underline decoration-2 decoration-yolk underline-offset-4 transition hover:text-yolk"
              >
                Écrire sur WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <p
        aria-hidden="true"
        className="select-none px-5 font-display text-[34vw] font-semibold italic leading-[0.8] text-bloom sm:px-8 sm:text-[26vw]"
      >
        {site.name}.
      </p>

      <div className="border-t border-white/10 py-5 text-center text-[14px] text-ash">
        © {new Date().getFullYear()} {site.name}, {site.city}, {site.country}
      </div>
    </footer>
  );
}
