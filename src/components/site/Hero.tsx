import React from "react";
import hero from "@/assets/logo.jpeg";
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
            Best shared with family! Indulge in the authentic taste of home with our freshly prepared Bilao dishes — perfect for celebrations, weekends, family gatherings, or simply satisfying your Filipino food cravings anytime.
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
              href="#special-offer-deals"
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
              <Truck className="h-3.5 w-3.5 text-tropical" /> Fast Delivery Across Kuwait
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
          <div className="relative mx-auto w-full max-w-[500px]">
            {/* Forced 1:1 Aspect Ratio Wrapper */}
            <div className="relative w-full overflow-hidden rounded-full bg-white shadow-pop ring-1 ring-white/10" style={{ aspectRatio: "1 / 1" }}>
              {/* Spinning content container */}
              <div className={`h-full w-full animate-spin-slow transition-all duration-1000 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                <img
                  src={hero}
                  alt="Premium Filipino chicken inasal plate"
                  onLoad={() => setIsLoaded(true)}
                  className="h-full w-full object-cover"
                  width={520}
                  height={520}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>

              {!isLoaded && (
                <div className="absolute inset-0 rounded-full bg-muted/20 animate-pulse" />
              )}
            </div>

            {/* Decorative ring (outside the spinning part to stay stable) */}
            <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-tr from-mango/40 via-tropical/30 to-coral/40 blur-2xl opacity-50" />


          </div>
        </div>
      </div>
    </section>
  );
}
