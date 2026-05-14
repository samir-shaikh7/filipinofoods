import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAppData } from "@/hooks/use-app-data";
import { resolveImage, formatPrice } from "@/lib/utils";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { menu: MENU, config } = useAppData();
  const { currency: CURRENCY } = config;
  const { items, add, setQty } = useCart();
  
  const item = MENU.find((m) => m.id === id);
  const inCart = items.find((i) => i.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!item) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white px-4 text-center">
        <h1 className="text-2xl font-bold">Dish not found</h1>
        <button onClick={() => navigate("/")} className="mt-4 text-tropical font-bold">Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)} 
            className="mb-6 flex items-center gap-2 text-foreground/60 transition hover:text-tropical"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Menu</span>
          </button>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            {/* Image Section */}
            <div className="relative w-full overflow-hidden rounded-[3rem] shadow-2xl lg:w-1/2">
              <img 
                src={resolveImage(item.image)} 
                alt={item.name} 
                className="aspect-square h-full w-full object-cover transition-transform duration-1000 hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {item.badge && (
                <div className="absolute left-6 top-6">
                  <span className="rounded-full gradient-coral px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-pop">
                    {item.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-1 flex-col py-2 lg:py-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-tropical font-bold uppercase tracking-widest text-sm mb-2">
                  <span>Authentic</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-tropical/30" />
                  <span>{item.section_name}</span>
                </div>
                <h1 className="font-display text-4xl font-black md:text-6xl mb-4 leading-tight">{item.name}</h1>
                
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 rounded-full bg-mango/15 px-3 py-1.5 text-sm font-bold text-tropical shadow-sm">
                    <Star className="h-4 w-4 fill-tropical" />
                    {item.rating}
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-border" />
                  <span className="text-sm font-bold text-foreground/40">Premium Choice</span>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-foreground/40">About this Dish</h3>
                <p className="text-lg leading-relaxed text-foreground/70">
                  {item.description}. This iconic Filipino specialty is prepared using a secret family recipe passed down through generations. We source our ingredients daily from local farmers to ensure every plate captures the true essence of island dining.
                </p>
              </div>

              {/* Action Area (Sticky on mobile) */}
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 p-6 backdrop-blur-md shadow-[0_-8px_30px_rgb(0,0,0,0.08)] lg:relative lg:p-0 lg:bg-transparent lg:shadow-none lg:border-t lg:border-border lg:pt-10 lg:mt-auto">
                <div className="mx-auto max-w-7xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-8">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-0.5">Dish Price</div>
                      <div className="text-3xl font-black text-gradient-tropical sm:text-5xl">{CURRENCY}{formatPrice(item.price)}</div>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-4 rounded-3xl bg-muted/30 p-1.5 ring-1 ring-border shadow-inner sm:gap-6 sm:p-2 sm:rounded-[2rem]">
                        <button 
                          onClick={() => setQty(item.id, inCart.qty - 1)} 
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft transition hover:text-coral active:scale-90 sm:h-16 sm:w-16 sm:rounded-3xl"
                        >
                          <Minus className="h-5 w-5 sm:h-7 sm:w-7" />
                        </button>
                        <span className="text-xl font-black text-tropical w-6 text-center sm:text-3xl sm:w-10">{inCart.qty}</span>
                        <button 
                          onClick={() => setQty(item.id, inCart.qty + 1)} 
                          className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-tropical text-white shadow-glow transition active:scale-90 sm:h-16 sm:w-16 sm:rounded-3xl"
                        >
                          <Plus className="h-5 w-5 sm:h-7 sm:w-7" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => add(item)} 
                        className="flex h-14 grow items-center justify-center gap-3 rounded-2xl gradient-tropical px-8 text-lg font-bold text-white shadow-glow transition hover:scale-[1.02] active:scale-[0.98] sm:h-20 sm:rounded-[2rem] sm:px-12 sm:text-2xl lg:grow-0"
                      >
                        Add to Cart <Plus className="h-5 w-5 sm:h-8 sm:w-8" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Spacer for sticky footer on mobile */}
      <div className="h-32 lg:hidden" aria-hidden="true" />
    </div>
  );
}
