import React from "react";
import hero from "@/assets/hero-biryani.jpg";
import { ArrowRight, Sparkles, Star, Clock, Truck, MessageCircle } from "lucide-react";


export function Hero() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <section id="home" className="relative w-full overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
      {/* Animated tropical mesh background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-mango/20 blur-3xl animate-blob" />
        <div className="absolute top-20 right-0 h-[380px] w-[380px] rounded-full bg-tropical/15 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-12 lg:gap-8">
        {/* Left content */}
        <div className="lg:col-span-7">
          <div className="mb-5 inline-flex animate-fade-in items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-wide text-tropical shadow-soft">
            <Sparkles className="h-3.5 w-3.5" />
            New menu · Kuwait's freshest Filipino flavours
          </div>

          <h1 className="animate-fade-up max-w-4xl text-balance text-5xl font-black leading-[1.02] md:text-7xl lg:text-[5.4rem]">
            <span className="inline-block animate-fade-up stagger-1">Best</span>{" "}
            <span className="text-gradient-tropical italic inline-block animate-fade-up stagger-2">Filipino</span>{" "}
            <span className="inline-block animate-fade-up stagger-3">Restaurant</span><br />
            <span className="inline-block animate-fade-up stagger-4">in</span>{" "}
            <span className="text-gradient-coral inline-block animate-fade-up stagger-5">Kuwait</span>.
          </h1>

          <p
            className="mt-6 max-w-xl animate-fade-up text-base text-foreground/70 md:text-lg"
            style={{ animationDelay: "0.15s" }}
          >
            Char-grilled inasal, sizzling sisig, smoky BBQ and creamy milk tea — crafted by Filipino Food
            and rushed to your door in 30 minutes. Hot, fresh, and delivered daily.
          </p>

          <div
            className="mt-8 flex animate-fade-up flex-wrap items-center gap-3"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-full gradient-tropical px-7 py-4 text-sm font-semibold text-white btn-glow"
            >
              Order Now
              <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1.5" />
            </a>
            <a
              href="#combos"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 text-sm font-semibold text-foreground shadow-soft btn-secondary"
            >
              <Sparkles className="h-4 w-4 text-tropical animate-glow" /> View Offers
            </a>
          </div>

          {/* Trust chips */}
          <div
            className="mt-8 flex animate-fade-up flex-wrap items-center gap-2 text-xs text-foreground/65"
            style={{ animationDelay: "0.45s" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-soft transition-all hover:scale-105 hover:shadow-glow cursor-default">
              <Truck className="h-3.5 w-3.5 text-tropical" /> Free delivery over KWD 599
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-soft transition-all hover:scale-105 hover:shadow-glow cursor-default">
              <Clock className="h-3.5 w-3.5 text-tropical" /> 30-min average
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-soft transition-all hover:scale-105 hover:shadow-glow cursor-default">
              <Star className="h-3.5 w-3.5 fill-mango text-mango" /> 4.9 · 12K orders
            </span>
          </div>

          {/* Stats */}
          <div
            className="mt-10 grid w-full max-w-lg animate-fade-up grid-cols-3 gap-3"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              { v: "50K+", l: "Happy Diners", d: "0.6s" },
              { v: "4.9★", l: "Avg. Rating", d: "0.7s" },
              { v: "30 min", l: "Hot Delivery", d: "0.8s" },
            ].map((s) => (
              <div key={s.l} className="animate-fade-up rounded-2xl bg-white p-4 text-center shadow-soft transition-all duration-500 hover:shadow-elegant hover:-translate-y-1.5" style={{ animationDelay: s.d }}>
                <div className="text-2xl font-bold text-gradient-tropical md:text-3xl">{s.v}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-foreground/55 md:text-xs">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right hero visual */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-square max-w-[520px]">
            {/* Decorative ring */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-mango/40 via-tropical/30 to-coral/40 blur-2xl" />
            <div className={`animate-scale absolute inset-0 rounded-[42%_58%_55%_45%/55%_45%_55%_45%] bg-white shadow-pop ring-tropical animate-bob overflow-hidden transition-all duration-1000 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
              <img
                src={hero}
                alt="Premium Filipino chicken inasal plate"
                onLoad={() => setIsLoaded(true)}
                className="h-full w-full object-cover transition duration-1000 hover:scale-110"
                width={520}
                height={520}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            {!isLoaded && (
              <div className="absolute inset-0 rounded-[42%_58%_55%_45%/55%_45%_55%_45%] bg-muted/20 animate-pulse" />
            )}

            {/* Floating review badge */}
            <div className="absolute -left-2 top-10 hidden animate-float rounded-2xl bg-white/95 p-3 shadow-pop backdrop-blur md:block">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-coral text-white">★</div>
                <div>
                  <div className="text-xs text-foreground/60">Top rated this week</div>
                  <div className="text-sm font-semibold">Chicken Inasal</div>
                </div>
              </div>
            </div>

            {/* Floating delivery chip */}
            <div className="absolute -right-2 bottom-12 animate-float rounded-2xl bg-white/95 p-3 shadow-pop backdrop-blur" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-tropical text-white">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-foreground/60">Hot delivery</div>
                  <div className="text-sm font-semibold">~28 minutes</div>
                </div>
              </div>
            </div>

            {/* Floating ingredient circles */}
            <div className="pointer-events-none absolute -bottom-6 left-1/4 h-16 w-16 animate-float rounded-full bg-lime/40 blur-xl" />
            <div className="pointer-events-none absolute -top-4 right-1/4 h-20 w-20 animate-float rounded-full bg-mango/50 blur-xl" style={{ animationDelay: "2s" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
