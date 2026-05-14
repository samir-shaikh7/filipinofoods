import React from "react";
import { Hero } from "@/components/site/Hero";
import { MenuSection } from "@/components/site/MenuSection";
import { BestSellers } from "@/components/site/BestSellers";
import { GallerySection } from "@/components/site/GallerySection";
import { AboutSection } from "@/components/site/AboutSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { ContactSection } from "@/components/site/ContactSection";
import { FAQSection } from "@/components/site/FAQSection";
import { OfferTicker } from "@/components/site/Floating";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function HomePage() {
  const { ref, sync } = useScrollReveal();
  
  return (
    <div ref={ref} className="bg-atmosphere min-h-screen text-foreground">
      <main>
        <Hero />
        <OfferTicker />
        <MenuSection onDataLoaded={sync} />
        <BestSellers />
        <GallerySection />
        <AboutSection />
        <ReviewsSection />
        <FAQSection />
        <ContactSection />
      </main>
    </div>
  );
}
