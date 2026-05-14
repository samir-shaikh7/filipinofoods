import { COMBOS } from "@/lib/menu-data";
import comboImg from "@/assets/combo-family.jpg";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAppData } from "@/hooks/use-app-data";
import { formatPrice } from "@/lib/utils";

export function CombosSection() {
  const { config } = useAppData();
  const { currency: CURRENCY } = config;
  const { items, add, setQty } = useCart();

  const featuredCombo = {
    id: "combo-barkada",
    name: "Barkada Feast",
    description: "Whole Inasal, smoky BBQ skewers, crackly lumpia, pancit and 2 milk teas.",
    price: 999,
    image: comboImg,
    category: "combo",
  };
  const featuredInCart = items.find((i) => i.id === featuredCombo.id);
  return (
    <section id="combos" className="relative scroll-mt-24 overflow-hidden bg-dark-section py-20 md:py-28">
      <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-mango/15 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-coral/10 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-mango">
            Combo Offers
          </div>
          <h2 className="text-4xl font-semibold md:text-6xl">
            Bigger plates. <span className="text-gradient-tropical italic">Smaller bills.</span>
          </h2>
        </div>

        {/* Featured combo banner */}
        <div className="relative mb-10 overflow-hidden rounded-[2rem] shadow-elegant">
          <img 
            src={comboImg} 
            alt="Barkada Feast" 
            className="absolute inset-0 h-full w-full object-cover" 
            loading="lazy" 
            decoding="async"
            width={1200}
            height={600}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/30" />
          <div className="relative grid gap-6 p-8 md:grid-cols-2 md:p-14">
            <div>
              <span className="inline-block rounded-full gradient-coral px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shimmer-bg">
                Limited time · Save 22%
              </span>
              <h3 className="mt-4 text-3xl font-semibold md:text-5xl">
                The <span className="text-gradient-tropical italic">Barkada Feast</span>
              </h3>
              <p className="mt-3 max-w-md text-white/75">
                Whole inasal, smoky BBQ skewers, crackly lumpia, pancit and 2 milk teas — your barkada
                Friday night sorted.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="text-3xl font-bold text-gradient-tropical">{CURRENCY}{formatPrice(999)}</span>
                <span className="text-lg text-white/40 line-through">{CURRENCY}{formatPrice(1280)}</span>
              </div>
              <div className="mt-6 w-full max-w-[240px]">
                {featuredInCart ? (
                  <div className="flex items-center justify-between rounded-full bg-white/20 p-1.5 backdrop-blur-md transition-all duration-300 animate-fade-in ring-1 ring-white/10 shadow-inner">
                    <button
                      onClick={() => setQty(featuredCombo.id, featuredInCart.qty - 1)}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-tropical shadow-sm transition hover:scale-105 active:scale-95"
                      aria-label="Decrease"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="font-bold text-white text-lg">{featuredInCart.qty} in cart</span>
                    <button
                      onClick={() => setQty(featuredCombo.id, featuredInCart.qty + 1)}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-tropical shadow-sm transition hover:scale-105 active:scale-95"
                      aria-label="Increase"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => add(featuredCombo)}
                    className="flex w-full items-center justify-center gap-2 rounded-full gradient-tropical py-4 text-base font-semibold text-white shadow-glow transition hover:scale-[1.02] active:scale-95"
                  >
                    Add to Cart <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {COMBOS.map((c) => {
            const inCart = items.find((i) => i.id === c.id);
            const cartItem = {
              id: c.id,
              name: c.name,
              description: c.desc,
              price: c.price,
              image: comboImg,
              category: "combo",
            };

            return (
              <article
                key={c.id}
                className="tilt-card group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 text-charcoal shadow-card transition-shadow hover:shadow-soft"
              >
                <div>
                  <div className="absolute inset-x-0 top-0 h-1 gradient-tropical" />
                  <span className="inline-block rounded-full gradient-coral px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-pop">
                    {c.tag}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold">{c.name}</h3>
                  <p className="mt-2 min-h-[48px] text-sm text-charcoal/65">{c.desc}</p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-2xl font-bold text-gradient-tropical">{CURRENCY}{formatPrice(c.price)}</span>
                    <span className="text-sm text-charcoal/45 line-through">{CURRENCY}{formatPrice(c.original)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  {inCart ? (
                    <div className="flex items-center justify-between rounded-full bg-muted/40 p-1.5 ring-1 ring-border shadow-inner transition-all duration-300 animate-fade-in">
                      <button
                        onClick={() => setQty(cartItem.id, inCart.qty - 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition hover:text-coral hover:scale-105 active:scale-95"
                        aria-label="Decrease"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-tropical">{inCart.qty} in cart</span>
                      <button
                        onClick={() => setQty(cartItem.id, inCart.qty + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full gradient-tropical text-white shadow-soft transition hover:scale-105 active:scale-95 hover:shadow-glow"
                        aria-label="Increase"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => add(cartItem)}
                      className="flex w-full items-center justify-center gap-2 rounded-full gradient-tropical py-3.5 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.02] hover:shadow-glow active:scale-95"
                    >
                      <Plus className="h-4 w-4" /> Add to Cart
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
