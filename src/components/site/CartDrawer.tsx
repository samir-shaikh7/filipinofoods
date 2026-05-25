import { useState, useCallback, useEffect } from "react";
import { Minus, Plus, Trash2, X, MessageCircle, MapPin, ArrowLeft, Loader2, CheckCircle2, Banknote, Wallet, Building2, AlertCircle } from "lucide-react";
import { buildWhatsAppLink, CURRENCY, useCart, CheckoutDetails } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useAppData } from "@/hooks/use-app-data";

export function CartDrawer() {
  const { open, setOpen, items, setQty, remove, total, clear } = useCart();
  const { config } = useAppData();
  const { contact } = config;
  const [isCheckout, setIsCheckout] = useState(false);
  const [locating, setLocating] = useState(false);

  const [form, setForm] = useState<CheckoutDetails>({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    notes: "",
    locationUrl: "",
    paymentMethod: "cod",
  });

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setIsCheckout(false), 300); // reset after animation
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const url = `https://maps.google.com/?q=${lat},${lon}`;

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          if (data && data.display_name) {
            setForm((p) => ({ ...p, locationUrl: url, address: data.display_name }));
          } else {
            setForm((p) => ({ ...p, locationUrl: url }));
          }
        } catch (e) {
          console.error("Geocoding failed", e);
          setForm((p) => ({ ...p, locationUrl: url }));
        }

        setLocating(false);
      },
      (err) => {
        console.error(err);
        alert("Could not get location. Please check your permissions or enter address manually.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submitOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      alert("Please fill in all required fields (Name, Phone, Address).");
      return;
    }

    const whatsappNum = contact?.whatsapp || "639999999999";
    const link = buildWhatsAppLink(items, total, form, whatsappNum);
    window.open(link, "_blank");
  };

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-charcoal/40 backdrop-blur-md transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"
          }`}
        onClick={handleClose}
      />

      <aside
        className={`absolute right-0 top-0 flex h-screen max-h-screen w-full max-w-md flex-col bg-background shadow-elegant transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <header className="flex shrink-0 items-center justify-between gradient-tropical p-5 text-white shadow-soft relative z-20">
          <div className="flex items-center gap-3">
            {isCheckout && (
              <button onClick={() => setIsCheckout(false)} className="rounded-full bg-white/15 p-1.5 hover:bg-white/25 transition">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-semibold">{isCheckout ? "Checkout Details" : "Your Order"}</h3>
              {!isCheckout && <p className="text-xs text-white/80">{items.length} item{items.length === 1 ? "" : "s"}</p>}
            </div>
          </div>
          <button onClick={handleClose} className="rounded-full bg-white/15 p-2 hover:bg-white/25 transition" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 relative overflow-hidden bg-muted/30 min-h-0">
          <div className={`absolute inset-0 w-full transition-transform duration-300 flex flex-col min-h-0 ${isCheckout ? "-translate-x-full" : "translate-x-0"}`}>
            {/* Cart Items View */}
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6">
                <div className="mb-4 text-7xl drop-shadow-sm animate-bob">🥭</div>
                <h3 className="text-xl font-semibold text-foreground/80 mb-1">Your cart is empty</h3>
                <p className="text-sm text-foreground/50 max-w-[200px]">Add some delicious flavours from our menu to get started.</p>
                <a
                  href="#menu"
                  onClick={handleClose}
                  className="mt-8 inline-block rounded-full gradient-tropical px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:scale-105"
                >
                  Browse Menu
                </a>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden min-h-0">
                <ul className="flex-1 overflow-y-auto p-4 space-y-4 premium-scrollbar">
                  {items.map((i, idx) => (
                    <li
                      key={i.id}
                      className="group relative flex items-center gap-4 rounded-[2rem] bg-white p-3 shadow-card transition-all duration-500 hover:shadow-elegant animate-slide-in-right"
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-sm">
                        <img src={i.image} alt={i.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>

                      <div className="flex flex-1 flex-col justify-center pr-8">
                        <h4 className="font-semibold text-foreground/90 leading-tight line-clamp-1">
                          {i.name}{i.variantName ? ` - ${i.variantName}` : ''}
                        </h4>
                        <div className="mt-1 text-sm font-bold text-tropical">{CURRENCY}{formatPrice(i.price * i.qty)}</div>

                        <div className="mt-2 flex w-fit items-center gap-2 rounded-full bg-muted/60 p-1">
                          <button
                            onClick={() => setQty(i.id, i.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition hover:text-coral active:scale-90"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold">{i.qty}</span>
                          <button
                            onClick={() => setQty(i.id, i.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition hover:text-tropical active:scale-90"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => remove(i.id)}
                        className="absolute right-4 top-4 p-1.5 text-foreground/20 hover:text-coral transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="shrink-0 p-4">
                  <div className="rounded-[2.5rem] bg-white p-6 shadow-elegant border border-white/50">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-xs font-bold text-foreground/50">
                        <span>Subtotal</span>
                        <span className="text-foreground">{CURRENCY}{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-foreground/50">
                        <span>Delivery</span>
                        <span className={total >= 15 ? "text-emerald-500" : "text-foreground"}>
                          {total >= 15 ? "FREE" : `${CURRENCY}${formatPrice(0.5)}`}
                        </span>
                      </div>
                      <div className="h-px w-full bg-muted/40 my-3" />
                      <div className="flex items-center justify-between text-xl font-black">
                        <span>Total</span>
                        <span className="text-gradient-tropical">
                          {CURRENCY}{formatPrice(total + (total >= 15 ? 0 : 0.5))}
                        </span>
                      </div>

                      {total < 15 && total >= 5 && (
                        <div className="mt-4 rounded-xl bg-mango/10 p-3">
                          <p className="text-center text-[10px] font-bold text-mango/80 leading-tight">
                            Add {CURRENCY}{formatPrice(15 - total)} more for <span className="underline">free delivery</span>.
                          </p>
                        </div>
                      )}

                      {total < 5 && (
                        <div className="mt-4 rounded-xl bg-red-500/10 p-3 border border-red-500/20">
                          <p className="text-center text-[10px] font-bold text-red-500 leading-tight">
                            Minimum order amount is {CURRENCY}5.000.
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setIsCheckout(true)}
                      disabled={total < 5}
                      className="flex w-full items-center justify-center gap-2 rounded-full gradient-tropical py-[18px] text-base font-bold text-white btn-glow shadow-glow disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    >
                      Proceed to Checkout
                    </button>
                    <button onClick={clear} className="w-full mt-4 text-[11px] font-bold uppercase tracking-wider text-foreground/30 hover:text-coral transition-colors duration-300">
                      Empty Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`absolute inset-0 w-full transition-transform duration-300 bg-white ${isCheckout ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}>
            {/* Checkout Form */}
            <form id="checkout-form" onSubmit={submitOrder} className="p-6 space-y-6">
              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-tropical mb-4">Customer Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1.5 block">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition focus:bg-white focus:border-tropical focus:ring-1 focus:ring-tropical" placeholder="Juan Dela Cruz" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1.5 block">Phone Number *</label>
                    <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition focus:bg-white focus:border-tropical focus:ring-1 focus:ring-tropical" placeholder="09XX XXX XXXX" />
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-tropical mb-4 flex items-center justify-between">
                  Delivery Details
                  <button type="button" onClick={handleLocation} disabled={locating} className="flex items-center gap-1.5 rounded-full bg-tropical/10 px-3 py-1 text-[10px] font-bold text-tropical transition hover:bg-tropical/20 disabled:opacity-50">
                    {locating ? <Loader2 className="h-3 w-3 animate-spin" /> : form.locationUrl ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <MapPin className="h-3 w-3" />}
                    {locating ? "Locating..." : form.locationUrl ? "Location Added" : "Share Live Location"}
                  </button>
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1.5 block">Complete Address *</label>
                    <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full resize-none rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition focus:bg-white focus:border-tropical focus:ring-1 focus:ring-tropical" rows={3} placeholder="House/Unit No., Street, Barangay, City" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1.5 block">Landmark (Optional)</label>
                    <input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className="w-full rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition focus:bg-white focus:border-tropical focus:ring-1 focus:ring-tropical" placeholder="e.g. Near 7-Eleven" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground/70 mb-1.5 block">Delivery Notes (Optional)</label>
                    <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition focus:bg-white focus:border-tropical focus:ring-1 focus:ring-tropical" placeholder="e.g. Extra spicy, please ring bell" />
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold uppercase tracking-wider text-tropical mb-4">Payment Method</h4>
                <div className="grid gap-3">
                  {[
                    { id: "cod", title: "Cash on Delivery", desc: "Pay with cash at your doorstep", icon: Banknote },
                    { id: "gcash", title: "G-Cash", desc: "Digital wallet transfer", icon: Wallet },
                    { id: "bank", title: "Payment Link", desc: "BDO / BPI / UnionBank", icon: Building2 },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: m.id as any })}
                      className={`group relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${form.paymentMethod === m.id
                        ? "border-tropical bg-tropical/5 shadow-soft ring-1 ring-tropical"
                        : "border-border bg-white hover:border-tropical/50 hover:bg-tropical/5"
                        }`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${form.paymentMethod === m.id ? "gradient-tropical text-white" : "bg-muted text-foreground/40 group-hover:text-tropical"
                        }`}>
                        <m.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{m.title}</div>
                        <div className="text-[11px] text-foreground/50">{m.desc}</div>
                      </div>
                      {form.paymentMethod === m.id && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full gradient-tropical text-white shadow-pop">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Conditional Info Boxes */}
                {form.paymentMethod !== "cod" && (
                  <div className="mt-4 animate-fade-in space-y-3 rounded-2xl bg-atmosphere p-4 border border-border/50 shadow-inner">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 shrink-0 text-tropical mt-0.5" />
                      <div className="text-[11px] leading-relaxed text-foreground/60">
                        {form.paymentMethod === "gcash" ? (
                          <>
                            <div className="font-bold text-foreground mb-1 uppercase tracking-wider">GCash Instructions:</div>
                            Please transfer to <span className="font-bold text-tropical">{contact.whatsapp}</span> (Filipino Food).
                            Send the screenshot on WhatsApp after placing the order.
                          </>
                        ) : (
                          <>
                            <div className="font-bold text-foreground mb-1 uppercase tracking-wider">Bank Instructions:</div>
                            <div className="font-medium text-foreground">BDO: 0012 3456 7890</div>
                            <div className="font-medium text-foreground">BPI: 9876 5432 10</div>
                            Account Name: <span className="font-bold text-tropical text-xs">Filipino Food Inc.</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </form>

            {/* Sticky bottom CTA for checkout */}
            <div className="sticky bottom-0 border-t border-border/50 bg-white/95 p-5 backdrop-blur-md pb-8">
              <button
                type="button"
                onClick={() => submitOrder()}
                className="flex w-full items-center justify-center gap-2 rounded-full gradient-tropical py-4 text-base font-semibold text-white btn-glow shadow-glow transition active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                Place Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
