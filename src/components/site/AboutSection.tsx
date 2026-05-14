import chef from "@/assets/gallery-chef.jpg";
import interior from "@/assets/gallery-interior.jpg";

const STATS = [
  { v: "12+", l: "Years of mastery" },
  { v: "50K+", l: "Orders delivered" },
  { v: "100%", l: "Fresh & hygienic" },
  { v: "30min", l: "Avg. delivery" },
];

export function AboutSection() {
  return (
    <section id="about" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center">
        {/* Bento gallery */}
        <div className=" relative grid grid-cols-2 gap-3">
          <div className="overflow-hidden rounded-[2rem] shadow-pop ring-tropical row-span-2 aspect-[3/4]">
            <img src={chef} alt="Filipino Food Chef" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="overflow-hidden rounded-3xl shadow-soft aspect-square">
            <img src={interior} alt="Restaurant interior" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="rounded-3xl gradient-tropical p-5 text-white shadow-pop aspect-square flex flex-col justify-between">
            <span className="text-3xl">🌴</span>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-xs uppercase tracking-widest">Fresh, locally sourced</div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-tropical">
            About Filipino Food
          </div>
          <h2 className="text-4xl font-semibold md:text-5xl">
            The <span className="text-gradient-tropical italic">Best Filipino Restaurant</span> in
            <span className="text-gradient-coral italic"> Kuwait City</span>
          </h2>
          <p className="mt-5 text-foreground/70">
            Filipino Food is a love letter to authentic Pinoy flavours right here in Kuwait — char-grilled inasal over real charcoal,
            sisig sizzled to order, and lumpia rolled by hand each morning. Bright, bold, and made with
            family-recipe care.
          </p>
          <p className="mt-3 text-foreground/60">
            From spotless kitchens to our 30-minute hot-delivery promise, we obsess over every detail
            so you get restaurant-grade flavours at home.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.l} className="rounded-2xl bg-white px-4 py-5 shadow-soft">
                <div className="text-3xl font-bold text-gradient-tropical">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-foreground/55">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
