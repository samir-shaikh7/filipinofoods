import logo from "@/assets/logo2.png";

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
        {/* Large Logo container */}
        <div className="flex items-center justify-center p-4">
          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-mango/20 via-tropical/20 to-coral/20 blur-2xl opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              <img
                src={logo}
                alt="Filipino Food Logo"
                className="h-72 w-72 object-contain md:h-[30rem] md:w-[30rem]"
              />
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
          <p className="mt-5 text-foreground/70 leading-relaxed">
            Filipino Food is your home for authentic Pinoy flavors in Kuwait — smoky grilled BBQ,
            sizzling sisig cooked fresh to order, and crispy lumpia handmade daily with family-style care.✨
          </p>
          <p className="mt-4 text-foreground/70 leading-relaxed">
            Bold flavors, fresh ingredients, and comforting Filipino classics come together in every bite,
            bringing the taste of home straight to your table.
          </p>
          <p className="mt-4 text-foreground/60 leading-relaxed">
            From our clean, carefully prepared kitchens to our fast hot-delivery service, we focus on
            every detail so you can enjoy fresh, restaurant-quality Filipino meals anytime.
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
