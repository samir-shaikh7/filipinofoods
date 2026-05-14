import { CATEGORIES } from "@/lib/menu-data";
import inasal from "@/assets/food-tikka.jpg";
import bbq from "@/assets/food-tandoori.jpg";
import pancit from "@/assets/food-noodles.jpg";
import lumpia from "@/assets/food-lollipop.jpg";
import combo from "@/assets/combo-family.jpg";
import adobo from "@/assets/food-biryani.jpg";
import milktea from "@/assets/food-beverage.jpg";

const IMG: Record<string, string> = {
  "bilao-packages": pancit,
  "special-offer-deals": combo,
  "barkada-boodle": combo,
  "filipino-favorites": inasal,
  "main-courses": bbq,
  "alacarte": adobo,
  "fried-rice": adobo,
  "noodles": pancit,
  "appetizers": lumpia,
  "drinks": milktea,
  "cutlery": combo,
};

export function CategoriesSection() {
  return (
    <section className="scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className=" mb-10 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-tropical">
              Categories
            </div>
            <h2 className="text-3xl font-semibold md:text-5xl">
              Pick your <span className="text-gradient-tropical italic">flavour</span>
            </h2>
          </div>
          <a href="#menu" className="hidden text-sm font-medium text-tropical hover:underline md:block">
            View full menu →
          </a>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-7">
          {CATEGORIES.map((c, idx) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="reveal group relative flex h-44 w-40 shrink-0 flex-col justify-end overflow-hidden rounded-3xl shadow-card transition duration-500 hover:-translate-y-2 md:h-48 md:w-auto"
              style={{ transitionDelay: `${idx * 0.15}s` }}
            >
              <img
                src={IMG[c.id]}
                alt={c.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                width={200}
                height={240}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-mango/30 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="relative p-4 text-white">
                <div className="text-2xl drop-shadow">{c.icon}</div>
                <div className="mt-1 font-semibold">{c.name}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
