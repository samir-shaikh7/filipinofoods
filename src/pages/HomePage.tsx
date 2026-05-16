import React from "react";
import { Hero } from "@/components/site/Hero";
import { MenuSection } from "@/components/site/MenuSection";
import { BestSellers } from "@/components/site/BestSellers";
import { AboutSection } from "@/components/site/AboutSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { ContactSection } from "@/components/site/ContactSection";
import { FAQSection } from "@/components/site/FAQSection";
import { GallerySection } from "@/components/site/GallerySection";
import { OfferTicker } from "@/components/site/Floating";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useHashScroll } from "@/hooks/use-hash-scroll";
import { PromoPopup } from "@/components/site/PromoPopup";

export default function HomePage() {
  const { ref, sync } = useScrollReveal();
  useHashScroll();
  
  return (
    <div ref={ref} className="bg-atmosphere min-h-screen text-foreground">
      <PromoPopup />
      <main>
        <Hero />
        <OfferTicker />
        <MenuSection onDataLoaded={sync} />
        <BestSellers />
        <AboutSection />
        <ReviewsSection />
        <FAQSection />
        <GallerySection />
        <ContactSection />
      </main>
    </div>
  );
}
