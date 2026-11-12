import { AtelierSection } from "@/components/home/AtelierSection";
import { FeaturedBouquets } from "@/components/home/FeaturedBouquets";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Newsletter } from "@/components/home/Newsletter";
import { OccasionsSection } from "@/components/home/OccasionsSection";
import { SeasonBanner } from "@/components/home/SeasonBanner";
import { Services } from "@/components/home/Services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedBouquets />
      <OccasionsSection />
      <AtelierSection />
      <SeasonBanner />
      <Services />
      <Newsletter />
    </>
  );
}
