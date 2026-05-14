import { Instagram, Facebook } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";

export function Footer() {
  const { config } = useAppData();
  const { contact } = config;

  return (
    <footer className="bg-dark-section pt-16 pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-xl shadow-soft">
              <img src="/logo.jpeg" alt="Filipino Food Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">Filipino Food</span>
          </div>
          <p className="mt-4 text-sm text-white/65">
            Premium Filipino flavours. Tropical-modern cooking. Hot, fresh, delivered fast.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Facebook, href: "https://www.facebook.com/FilipinoFoodKuwait/" },
              { Icon: Instagram, href: "https://www.instagram.com/filipinofoodkuwait/" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full glass-dark transition-all duration-300 hover:gradient-tropical hover:text-white hover:scale-110 active:scale-95"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-mango">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {["Home", "Menu", "Gallery", "About", "Contact"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-mango">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-mango">We deliver to</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {["Kuwait City", "Salmiya", "Farwaniya", "Hawally", "Jahra (Express)"].map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-mango">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Salmiya, Kuwait City, Kuwait</li>
            <li>+965 6399 9999</li>
            <li>hello@filipinofoodkuwait.com</li>
            <li>Open 10:00 AM - 11:00 PM</li>
          </ul>
        </div>
      </div>

      {/* Google Maps Embed - Kuwait Location */}
      <div className="mx-auto mt-16 max-w-7xl px-4">
        <div className="h-64 w-full overflow-hidden rounded-[2.5rem] shadow-elegant grayscale transition-all duration-700 hover:grayscale-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55633.9114256722!2d48.0360706!3d29.3400569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9c850901e9d1%3A0x64c8d17957e84993!2sSalmiya%2C%20Kuwait!5e0!3m2!1sen!2skw!4v1715600000000!5m2!1sen!2skw"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-4 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Filipino Food Restaurant — Crafted with love in Kuwait.
      </div>
    </footer>
  );
}
