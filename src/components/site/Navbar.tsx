import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/lib/cart";
import { useAppData } from "@/hooks/use-app-data";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#menu", label: "Menu" },
  { href: "/#bestsellers", label: "Specials" },
  { href: "/#about", label: "About" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const { config } = useAppData();
  const { contact } = config;
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(t);
    }
  }, [count]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "py-2" : "py-5"}`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className="flex items-center justify-between rounded-[2rem] px-5 py-2.5 glass shadow-soft border-white/50 backdrop-blur-xl"
        >
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3"
          >
            <div className="h-10 w-10 overflow-hidden rounded-full shadow-soft transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <img src={contact.logo_url || "/logo.jpeg"} alt="Filipino Food Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-tropical">Filipino Food</span>
          </Link>

          <ul className="hidden items-center gap-2 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  onClick={() => {
                    if (l.label === "Home") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="relative rounded-full px-4 py-2 text-sm font-semibold text-foreground/70 transition-all duration-300 hover:text-tropical group/link"
                >
                  {l.label}
                  <span className="absolute bottom-1.5 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-tropical transition-all duration-300 group-hover/link:w-1/3" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="relative rounded-xl bg-muted/40 p-2.5 text-mango transition-all duration-300 hover:bg-tropical/10 hover:text-tropical active:scale-95"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className={`absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full gradient-coral px-1 text-[10px] font-bold text-white shadow-soft transition-transform duration-300 ${pulse ? "scale-110" : "scale-100"}`}>
                  {count}
                </span>
              )}
            </button>
            <Link
              to="/#menu"
              className="hidden rounded-full gradient-tropical px-7 py-3 text-sm font-bold text-white shadow-glow btn-glow md:inline-flex"
            >
              Order Now
            </Link>
            <button
              className="rounded-xl bg-muted/40 p-2.5 lg:hidden text-mango transition-all active:scale-95"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-md animate-fade-in" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-80 max-w-full bg-white p-6 shadow-elegant animate-slide-in-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-xl shadow-soft">
                  <img src={contact.logo_url || "/logo.jpeg"} alt="Filipino Food" className="h-full w-full object-cover" />
                </div>
                <span className="font-display text-lg font-bold tracking-tight">Filipino Food</span>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-mango/15" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-8 space-y-1">
              {LINKS.map((l, i) => (
                <li key={l.href} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}>
                  <Link
                    to={l.href}
                    onClick={() => {
                      setOpen(false);
                      if (l.label === "Home") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-foreground/85 transition hover:bg-mango/15 hover:text-tropical active:scale-[0.98]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/#menu"
              onClick={() => setOpen(false)}
              className="mt-6 flex w-full items-center justify-center rounded-full gradient-tropical px-5 py-3 font-semibold text-white shadow-soft"
            >
              Order Now
            </Link>
          </aside>
        </div>
      )}
    </header>
  );
}
