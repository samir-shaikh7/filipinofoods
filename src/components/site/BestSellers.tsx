import { Star, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAppData } from "@/hooks/use-app-data";
import { resolveImage, formatPrice } from "@/lib/utils";

export function BestSellers() {
  const { bestSellers: top, config, loading } = useAppData();
  const { add } = useCart();
  const { currency: CURRENCY } = config;

  if (loading && top.length === 0) {
    return (
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] w-72 shrink-0 animate-pulse rounded-3xl bg-muted/20 md:w-80" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (top.length === 0) return null;

  return (
    <section id="bestsellers" className="scroll-mt-24 pt-8 pb-10 md:pt-12 md:pb-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className=" mb-10 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-tropical">
              Best Sellers
            </div>
            <h2 className="text-4xl font-semibold md:text-6xl">
              Most <span className="text-gradient-tropical italic">ordered</span> this week
            </h2>
          </div>
          <a href="#menu" className="hidden text-sm font-medium text-tropical hover:underline md:block">
            See full menu →
          </a>
        </div>

        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4">
          {top.map((m, idx) => (
            <article
              key={m.id}
              className="reveal snap-start group relative w-72 shrink-0 overflow-hidden rounded-3xl bg-white shadow-card md:w-80"
              style={{ transitionDelay: `${idx * 0.15}s` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={resolveImage(m.image)}
                  alt={m.name}
                  className="h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  width={320}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full gradient-coral px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {m.badge}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-1 text-xs text-mango">
                    <Star className="h-3 w-3 fill-current" /> {m.rating}
                  </div>
                  <h3 className="mt-1 text-xl font-semibold">{m.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gradient-tropical">{CURRENCY}{formatPrice(m.price)}</span>
                    <button
                      onClick={() => add(m)}
                      className="flex h-11 w-11 items-center justify-center rounded-full gradient-tropical text-white shadow-pop transition hover:scale-110 hover:shadow-glow active:scale-95"
                      aria-label={`Add ${m.name}`}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
