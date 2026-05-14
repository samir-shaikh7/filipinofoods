import { Instagram, Facebook, Lock } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";
import { Link } from "react-router-dom";

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
            <li className="pt-2">
              <Link to="/admin" className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50 transition hover:bg-white/10 hover:text-mango">
                <Lock className="h-3 w-3" /> Admin Panel
              </Link>
            </li>
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
            <li>{contact.address}</li>
            <li>{contact.call}</li>
            <li>{contact.email}</li>
            <li>Open {contact.openingHours}</li>
          </ul>
        </div>
      </div>


      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-4 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Filipino Food Restaurant — Crafted with love in Kuwait.
      </div>
      <div className="mt-4 pt-4 text-center text-sm opacity-90 font-semibold mb-4 flex justify-center items-center gap-2">
        <a href="https://instagram.com/sam.digitalagency"
          target="_blank">
          <span>Design & Developed By:</span>
        </a>
        <a
          href="https://instagram.com/sam.digitalagency"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-pink-500 hover:underline"
        >
          Sam Digital Agency
          <Instagram size={18} />
        </a>
      </div>
    </footer>
  );
}
