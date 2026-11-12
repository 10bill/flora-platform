import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CatalogProvider } from "@/components/catalog/CatalogProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getBouquets } from "@/lib/catalog";
import { bodoni, hanken } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Flora | Votre fleuriste",
    template: "%s | Flora",
  },
  description:
    "Flora, fleuriste à Ouagadougou depuis 8 ans : roses, coffrets cadeaux et bouquets composés à la main, livrés avec soin.",
  keywords: ["fleuriste", "Ouagadougou", "Burkina Faso", "bouquet", "roses", "coffret cadeau"],
};

// Le catalogue vient de la base de données : les pages sont générées à chaque visite.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const bouquets = await getBouquets();

  return (
    <html lang="fr" className={`${bodoni.variable} ${hanken.variable}`}>
      {/* suppressHydrationWarning : ignore les attributs ajoutés par des extensions de navigateur */}
      <body suppressHydrationWarning className="min-h-screen bg-cream font-sans text-ink antialiased">
        <CatalogProvider bouquets={bouquets}>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
          >
            Aller au contenu
          </a>
          <AnnouncementBar />
          <Navbar />
          <main id="contenu">{children}</main>
          <Footer />
        </CatalogProvider>
      </body>
    </html>
  );
}
