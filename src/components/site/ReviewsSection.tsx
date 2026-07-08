import { Star } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";

const STATIC_REVIEWS = [
  { name: "Liza M.", text: "The Inasal is incredible — the smoky char and calamansi glaze are completely authentic. Finally, a real Filipino taste in Kuwait!", rating: 5 },
  { name: "Jomar T.", text: "The Sisig was still sizzling when it arrived in Salmiya. Premium packaging and the egg yolk was perfectly intact. 10/10.", rating: 5 },
  { name: "Andrea P.", text: "Ordered the Barkada Feast for our movie night. Everyone went completely silent while eating. Best delivery in Kuwait City.", rating: 5 },
  { name: "Karlo R.", text: "The Brown Sugar Milk Tea is the smoothest I've ever had. Ordering via WhatsApp here in Kuwait is dangerously easy.", rating: 5 },
  { name: "Mika L.", text: "The Adobo bowl is elevated comfort food. This has become my team's go-to Friday lunch delivery in Farwaniya.", rating: 5 },
];

export function ReviewsSection() {
  const { reviews: dynamicReviews } = useAppData();
  const REVIEWS = dynamicReviews.length > 0 ? dynamicReviews : STATIC_REVIEWS;
  const items = [...REVIEWS, ...REVIEWS];

  return (
    <section id="reviews" className="scroll-mt-24 overflow-hidden pt-8 pb-8 md:pt-12 md:pb-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className=" mb-10 text-center">
          <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-tropical">
            Reviews
          </div>
          <h2 className="text-4xl font-semibold md:text-6xl">
            Loved by <span className="text-gradient-tropical italic">thousands</span>
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-foreground/70 shadow-soft">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-mango text-mango" />
              ))}
            </div>
            4.9 average · 12,000+ reviews
          </div>
        </div>
      </div>

      <div className=" relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused] [will-change:transform]">
          {items.map((r, i) => (
            <article
              key={i}
              className="w-80 shrink-0 rounded-[2rem] bg-white border border-black/5 p-6 shadow-card transition-all duration-500 hover:shadow-elegant hover:scale-[1.02]"
            >
              <div className="flex items-center gap-1 text-mango">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80 italic">"{r.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-tropical text-sm font-bold text-white shadow-soft transition-transform duration-300">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-[11px] text-foreground/55">Verified Diner</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
