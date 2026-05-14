import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Phone, MapPin, ShoppingBag, Home, UtensilsCrossed, Gift } from "lucide-react";
import { CURRENCY, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useAppData } from "@/hooks/use-app-data";

export function FloatingButtons() {
  const { pathname } = useLocation();
  const { config } = useAppData();
  const { contact } = config;
  if (pathname === "/cart" || pathname.startsWith("/product/")) return null;

  return (
    <div className="fixed bottom-28 right-4 z-[60] flex flex-col gap-3 md:bottom-8 [will-change:transform] [transform:translateZ(0)]">
      <a
        href={`https://wa.me/96563999999?text=Hello,%20I%20have%20a%20question`}
        target="_blank"
        rel="noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full gradient-tropical text-white btn-glow animate-glow transition hover:scale-110"
        aria-label="Support"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href={`tel:${contact.call.replace(/\s/g, "")}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-pop transition hover:scale-110 hover:text-tropical"
        aria-label="Call"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href="/#contact"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-pop transition hover:scale-110 hover:text-tropical"
        aria-label="Location"
      >
        <MapPin className="h-5 w-5" />
      </a>
    </div>
  );
}

export function MobileBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { count, total } = useCart();
  const { config } = useAppData();
  const { contact } = config;
  const whatsappNumber = contact.whatsapp?.replace(/\D/g, "") || "96563999999";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello! I have a question about Filipino Food.")}`;

  if (pathname === "/cart" || pathname.startsWith("/product/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] md:hidden">
      {count > 0 && (
        <button
          onClick={() => navigate("/cart")}
          className="mx-3 mb-2 flex w-[calc(100%-1.5rem)] items-center justify-between rounded-full gradient-tropical px-5 py-3.5 text-white shadow-glow animate-fade-in transition-all hover:scale-[1.02] active:scale-95"
        >
          <span className="flex items-center gap-2.5 font-semibold">
            <ShoppingBag className="h-4 w-4" />
            <span className="flex items-center gap-1.5">
              <span>{count} item{count > 1 ? "s" : ""}</span>
              <span className="opacity-50 text-xs">•</span>
              <span>{CURRENCY}{formatPrice(total)}</span>
            </span>
          </span>
          <span className="text-sm font-bold flex items-center gap-1">View Cart <span className="text-lg leading-none">→</span></span>
        </button>
      )}
      <div className="glass mx-3 mb-4 flex items-center justify-around rounded-[2rem] px-2 py-2.5 shadow-pop backdrop-blur-xl border-white/40">
        {[
          { href: "/", icon: Home, label: "Home" },
          { href: "/#menu", icon: UtensilsCrossed, label: "Menu" },
          { href: "/#contact", icon: Phone, label: "Contact" },
        ].map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-foreground/70 transition hover:bg-mango/15 hover:text-tropical"
          >
            <l.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{l.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export function OfferTicker() {
  const items = useMemo(() => {
    const offers = [
      "🔥 Fresh & tasty food",
      "🍗 Authentic flavors daily",
      "🥗 Quality you can trust",
      "🚀 Fast service always",
      "⭐ Loved by foodies",
      "🍴 Premium dining vibes",
      "💯 Taste in every bite",
      "❤️ Made with passion",
    ];
    return [...offers, ...offers];
  }, []);

  return (
    <div className="relative overflow-hidden gradient-tropical py-2.5 text-white">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-sm font-semibold [will-change:transform] [transform:translateZ(0)]">
        {items.map((o, i) => (
          <span key={i} className="flex items-center gap-3">
            <span>{o}</span>
            <span className="opacity-60">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
