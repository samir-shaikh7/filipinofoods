import { Instagram, Facebook } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";
import { Link } from "react-router-dom";
import { resolveImage } from "@/lib/utils";

export function Footer() {
  const { config } = useAppData();
  const { contact } = config;

  return (
    <footer className="bg-dark-section pt-16 pb-16 md:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-xl shadow-soft">
              <img src={resolveImage(contact.logo_url || "/logo.jpeg", 256)} alt="Filipino Food Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">Filipino Food</span>
          </div>
          <p className="mt-4 text-sm text-white/65">
            Premium Filipino flavours. Tropical-modern cooking. Hot, fresh, delivered fast.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Facebook, href: "https://www.facebook.com/FilipinoFoodKuwait/", bg: "bg-[#1877F2]" },
              { Icon: Instagram, href: "https://www.instagram.com/filipinofoodkuwait/", bg: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" },
            ].map(({ Icon, href, bg }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${bg}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-coral">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {["Home", "Menu", "About", "Contact"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-mango">{l}</a>
              </li>
            ))}

          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-coral">We deliver to</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {["Kuwait City", "Salmiya", "Farwaniya", "Hawally", "Jahra (Express)"].map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-coral">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{contact.address}</li>
            <li>{contact.call}</li>
            <li>{contact.email}</li>
            <li>Open {contact.openingHours}</li>
          </ul>
        </div>
      </div>


      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-4 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Filipino Food
      </div>
    </footer>
  );
}
