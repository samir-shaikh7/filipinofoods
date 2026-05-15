import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Star, Plus, Flame, Leaf, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart";
import { useAppData } from "@/hooks/use-app-data";
import { resolveImage, formatPrice } from "@/lib/utils";
import { MenuSectionSkeleton } from "./Skeletons";
import { motion, AnimatePresence } from "framer-motion";

// Reusable Spice Meter
const SpiceMeter = React.memo(({ level = 1 }: { level?: 1 | 2 | 3 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3].map((i) => (
      <Flame
        key={i}
        className={`h-3.5 w-3.5 transition-all duration-300 ${i <= level ? "text-coral fill-coral drop-shadow-[0_2px_4px_rgba(220,38,38,0.4)]" : "text-foreground/15"}`}
      />
    ))}
  </div>
));

// Reusable Product Card Component
const MenuItemCard = React.memo(({ item, inCart, onAdd, onUpdateQty, currency }: { 
  item: any, 
  inCart: any, 
  onAdd: (m: any) => void, 
  onUpdateQty: (id: string, q: number) => void,
  currency: string
}) => (
  <Link to={`/product/${item.id}`} className="group relative block overflow-hidden rounded-[2rem] bg-white border border-black/5 shadow-card transition-all duration-500 hover:shadow-elegant active:scale-[0.98]">
    <div className="relative aspect-square overflow-hidden">
      <img
        src={resolveImage(item.image)}
        alt={item.name}
        className="h-full w-full object-cover transition duration-1000 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute right-2 top-2">
        <div className="flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold shadow-soft backdrop-blur">
          <Star className="h-2.5 w-2.5 fill-mango text-mango" />
          {item.rating}
        </div>
      </div>
      {item.badge && (
        <div className="absolute left-2 top-2">
          <span className="rounded-full gradient-coral px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-pop">
            {item.badge}
          </span>
        </div>
      )}
    </div>

    <div className="p-3 pb-4">
      <h3 className="line-clamp-1 text-sm font-bold leading-tight group-hover:text-tropical transition-colors duration-300">{item.name}</h3>
      <div className="mt-1 flex items-center gap-2">
        <SpiceMeter level={item.spice} />
      </div>
      <p className="mt-1 line-clamp-1 text-[10px] text-foreground/50">{item.description}</p>
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-tropical">{currency}{formatPrice(item.price)}</span>
        
        {inCart ? (
           <div className="flex items-center gap-2 rounded-full bg-muted/50 p-1">
             <button 
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpdateQty(item.id, inCart.qty - 1); }}
               className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition hover:text-coral active:scale-90"
             >
               <Minus className="h-3 w-3" />
             </button>
             <span className="w-4 text-center text-xs font-black text-tropical">{inCart.qty}</span>
             <button 
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpdateQty(item.id, inCart.qty + 1); }}
               className="flex h-6 w-6 items-center justify-center rounded-full gradient-tropical text-white shadow-sm transition active:scale-90"
             >
               <Plus className="h-3 w-3" />
             </button>
           </div>
        ) : (
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(item); }}
            className="flex h-8 w-8 items-center justify-center rounded-full gradient-tropical text-white shadow-soft transition hover:scale-110 active:scale-90"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  </Link>
));

// Main Menu Section
export function MenuSection({ onDataLoaded }: { onDataLoaded?: () => void }) {
  const { menu: MENU, categories: CATEGORIES, config, loading } = useAppData();
  const { currency: CURRENCY } = config;
  const [active, setActive] = useState<string>(CATEGORIES[0]?.id);
  const [q, setQ] = useState("");
  const { items, add, setQty } = useCart();
  const observer = useRef<IntersectionObserver | null>(null);

  // Sync scroll reveals when loading finishes or search changes
  useEffect(() => {
    if (!loading) {
      if (onDataLoaded) setTimeout(onDataLoaded, 100);
      
      // Auto-scroll to hash if present after loading
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
        }, 300);
      }
    }
  }, [loading, onDataLoaded, q]);

  // Filter items by search query
  const filteredMenu = useMemo(() => {
    if (!q) return MENU;
    return MENU.filter(item => 
      item.name.toLowerCase().includes(q.toLowerCase()) || 
      item.description.toLowerCase().includes(q.toLowerCase())
    );
  }, [q, MENU]);

  // Setup intersection observer to highlight active filter
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-100px 0px -70% 0px",
      threshold: 0
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, options);

    const sections = document.querySelectorAll(".menu-section");
    sections.forEach((s) => observer.current?.observe(s));

    return () => observer.current?.disconnect();
  }, [loading, MENU]); // Re-observe when items change

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="menu" className="relative bg-atmosphere scroll-mt-24 pb-20">
      {/* Search Header */}
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-tropical">
          Full Menu
        </div>
        <h2 className="text-4xl font-semibold md:text-6xl">
          Everything <span className="text-gradient-tropical italic">Delicious</span>
        </h2>
        
        <div className="relative mx-auto mt-10 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search our authentic Filipino dishes..."
            className="w-full rounded-full bg-white py-4 pl-11 pr-4 text-sm shadow-soft outline-none focus:ring-2 focus:ring-tropical/40"
          />
        </div>
      </div>

      {/* Filter Bar (Static) */}
      <div className="relative z-10 border-b border-white/10 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => scrollToSection(c.slug || c.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 md:px-5 md:py-2.5 md:text-sm ${
                  active === c.id
                    ? "gradient-tropical text-white shadow-soft scale-105"
                    : "bg-white text-foreground/60 shadow-sm border border-black/5 hover:border-tropical/30 hover:text-tropical"
                }`}
              >
                <span className="mr-1.5 md:mr-2">{c.icon}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="mx-auto mt-12 max-w-7xl px-4 min-h-[100vh]">
        {loading && MENU.length === 0 ? (
          <MenuSectionSkeleton />
        ) : (
          <div className="space-y-16">
            <div className="space-y-16">
              {CATEGORIES.map((cat) => {
                const catItems = filteredMenu.filter(m => m.section_id === cat.id);
                if (catItems.length === 0) return null;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    key={cat.id}
                    id={cat.slug || cat.id}
                    className="menu-section scroll-mt-32 transform-gpu"
                  >
                    <div className="mb-6 flex items-center gap-4">
                      <h3 className="text-xl font-bold md:text-3xl">{cat.name}</h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                      {catItems.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          inCart={items.find(i => i.id === item.id)}
                          onAdd={add}
                          onUpdateQty={setQty}
                          currency={CURRENCY}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredMenu.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold">No dishes found</h3>
                <p className="mt-2 text-foreground/55">Try searching for something else or clear filters.</p>
                <button onClick={() => setQ("")} className="mt-6 rounded-full bg-white px-6 py-2 shadow-soft hover:text-tropical transition">
                  Clear Search
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
