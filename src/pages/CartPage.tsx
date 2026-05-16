import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, MessageCircle, MapPin, Loader2, CheckCircle2, Banknote, Wallet, Building2, AlertCircle, ShoppingBag } from "lucide-react";
import { buildWhatsAppLink, CURRENCY, useCart, CheckoutDetails } from "@/lib/cart";
import { resolveImage, formatPrice } from "@/lib/utils";
import { useAppData } from "@/hooks/use-app-data";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, setQty, remove, total, clear } = useCart();
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isCheckout]);

  const handleLocation = () => {
    setLocating(true);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // increased timeout for mobile stability
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

        try {
          // Add User-Agent as required by Nominatim usage policy to avoid 403 errors
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            { headers: { 'User-Agent': 'FilipinoFoodApp/1.0' } }
          );

          if (!response.ok) throw new Error('Geocoding service unavailable');

          const data = await response.json();
          const readableAddress = data.display_name || `Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;

          setForm((prev) => ({
            ...prev,
            locationUrl: mapsUrl,
            address: prev.address || readableAddress // Don't overwrite if user already typed something
          }));
        } catch (error) {
          console.warn("Geocoding failed, falling back to coordinates only:", error);
          setForm((prev) => ({
            ...prev,
            locationUrl: mapsUrl
          }));
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        console.error("Geolocation Error:", err);
        let msg = "Could not get your location.";
        if (err.code === 1) msg = "Location permission denied. Please allow location access in your browser settings.";
        else if (err.code === 3) msg = "Location request timed out. Please try again or enter address manually.";

        alert(msg);
        setLocating(false);
      },
      geoOptions
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

    // Clear cart and redirect after a small delay
    setTimeout(() => {
      clear();
      navigate("/");
    }, 500);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-atmosphere px-4 text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-soft">
          <ShoppingBag className="h-14 w-14 text-tropical/30" />
        </div>
        <h1 className="text-3xl font-black mb-2">Your cart is empty</h1>
        <p className="text-foreground/50 max-w-sm mb-10">Looks like you haven't added anything to your cart yet. Browse our menu to find something delicious.</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full gradient-tropical px-10 py-4 text-lg font-bold text-white shadow-glow transition hover:scale-105 active:scale-95"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-atmosphere pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => isCheckout ? setIsCheckout(false) : navigate("/")}
            className="flex items-center gap-2 text-foreground/50 transition hover:text-tropical"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold">{isCheckout ? "Back to Cart" : "Continue Shopping"}</span>
          </button>

          <div className="hidden sm:flex items-center gap-4">
            <div className={`h-2 w-2 rounded-full ${!isCheckout ? "bg-tropical" : "bg-border"}`} />
            <div className="h-px w-8 bg-border" />
            <div className={`h-2 w-2 rounded-full ${isCheckout ? "bg-tropical" : "bg-border"}`} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <h1 className="text-4xl font-black mb-8 leading-tight">
              {isCheckout ? "Complete your Order" : "Your Shopping Cart"}
            </h1>

            {!isCheckout ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-[2.5rem] bg-white p-4 shadow-card transition hover:shadow-elegant">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[1.5rem] shadow-sm">
                      <img src={resolveImage(item.image)} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="text-lg font-bold line-clamp-1">{item.name}</h3>
                      <p className="text-sm font-bold text-tropical mt-1">{CURRENCY}{formatPrice(item.price * item.qty)}</p>

                      <div className="mt-4 flex w-fit items-center gap-3 rounded-2xl bg-muted/50 p-1.5">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition hover:text-coral active:scale-90"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-lg font-black text-tropical">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl gradient-tropical text-white shadow-soft transition active:scale-90"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-foreground/20 transition hover:bg-coral/10 hover:text-coral"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={clear}
                  className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/30 hover:text-coral transition mx-auto sm:mx-0"
                >
                  Clear all items
                </button>
              </div>
            ) : (
              <form id="checkout-form" onSubmit={submitOrder} className="space-y-8 animate-fade-in">
                {/* Personal Information */}
                <div className="rounded-[2.5rem] bg-white p-8 shadow-card">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-tropical text-white text-xs">1</span>
                    Personal Details
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Full Name</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border-none bg-muted/40 px-6 py-4 text-sm font-bold outline-none ring-2 ring-transparent transition focus:bg-white focus:ring-tropical" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Phone Number</label>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border-none bg-muted/40 px-6 py-4 text-sm font-bold outline-none ring-2 ring-transparent transition focus:bg-white focus:ring-tropical" placeholder="e.g. +965 6XXX XXXX" />
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="rounded-[2.5rem] bg-white p-8 shadow-card">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-tropical text-white text-xs">2</span>
                      Delivery Location
                    </h2>
                    <button type="button" onClick={handleLocation} disabled={locating} className="flex items-center gap-2 rounded-full bg-tropical/10 px-4 py-2 text-xs font-bold text-tropical transition hover:bg-tropical/20 disabled:opacity-50">
                      {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                      {locating ? "Locating..." : "Use Live Location"}
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Complete Address</label>
                      <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} className="w-full resize-none rounded-2xl border-none bg-muted/40 px-6 py-4 text-sm font-bold outline-none ring-2 ring-transparent transition focus:bg-white focus:ring-tropical" placeholder="Street name, Building, Floor/Unit No." />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Landmark (Optional)</label>
                        <input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className="w-full rounded-2xl border-none bg-muted/40 px-6 py-4 text-sm font-bold outline-none ring-2 ring-transparent transition focus:bg-white focus:ring-tropical" placeholder="e.g. Near Blue Gate" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Order Notes</label>
                        <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-2xl border-none bg-muted/40 px-6 py-4 text-sm font-bold outline-none ring-2 ring-transparent transition focus:bg-white focus:ring-tropical" placeholder="e.g. Extra sauce" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="rounded-[2.5rem] bg-white p-8 shadow-card">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-tropical text-white text-xs">3</span>
                    Select Payment Method
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { id: "cod", title: "Cash on Delivery", icon: Banknote, desc: "Safe & Simple" },
                      { id: "gcash", title: "G-Cash", icon: Wallet, desc: "Quick & Easy" },
                      { id: "bank", title: "Payment Link", icon: Building2, desc: "Secure Pay" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: m.id as any })}
                        className={`group relative flex flex-col items-center gap-3 rounded-3xl border-2 p-6 text-center transition-all duration-300 ${form.paymentMethod === m.id
                          ? "border-tropical bg-tropical/5 shadow-soft"
                          : "border-muted bg-white hover:border-tropical/20"
                          }`}
                      >
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-all duration-500 ${form.paymentMethod === m.id ? "gradient-tropical text-white rotate-6 scale-110" : "bg-muted text-foreground/30 group-hover:text-tropical"}`}>
                          <m.icon className="h-7 w-7" />
                        </div>
                        <div>
                          <div className="text-sm font-black">{m.title}</div>
                          <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">{m.desc}</div>
                        </div>
                        {form.paymentMethod === m.id && (
                          <div className="absolute top-3 right-3 h-4 w-4 rounded-full gradient-tropical ring-4 ring-white" />
                        )}
                      </button>
                    ))}
                  </div>


                </div>
              </form>
            )}
          </div>

          {/* Sticky Summary Area */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-elegant border border-white/50">
              <h2 className="text-2xl font-black mb-8">Order summary</h2>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between font-bold text-foreground/60">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-foreground">{CURRENCY}{formatPrice(total)}</span>
                </div>

                <div className="flex justify-between font-bold text-foreground/60">
                  <span className="text-sm">Delivery</span>
                  <span className={total >= 15 ? "text-emerald-500" : "text-foreground"}>
                    {total >= 15 ? "FREE" : `${CURRENCY}${formatPrice(0.5)}`}
                  </span>
                </div>

                <div className="h-px w-full bg-border my-6" />

                <div className="flex justify-between items-end">
                  <span className="text-xl font-black">Total</span>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-gradient-tropical leading-none">
                      {CURRENCY}{formatPrice(total + (total >= 15 ? 0 : 0.5))}
                    </span>
                  </div>
                </div>

                {total < 15 && total >= 5 && (
                  <div className="mt-6 rounded-2xl bg-mango/10 p-4">
                    <p className="text-center text-xs font-bold text-mango/80">
                      Add {CURRENCY}{formatPrice(15 - total)} more for <span className="text-mango underline">free delivery</span>.
                    </p>
                  </div>
                )}

                {total < 5 && (
                  <div className="mt-6 rounded-2xl bg-red-500/10 p-4 border border-red-500/20">
                    <p className="text-center text-xs font-bold text-red-500">
                      Minimum order amount is {CURRENCY}5.000.
                    </p>
                  </div>
                )}
              </div>

              {!isCheckout ? (
                <button
                  onClick={() => setIsCheckout(true)}
                  disabled={total < 5}
                  className="flex w-full items-center justify-center gap-3 rounded-full gradient-tropical py-5 text-lg font-bold text-white shadow-glow transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  Checkout Now <ArrowLeft className="h-5 w-5 rotate-180" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => submitOrder()}
                  disabled={total < 5}
                  className="flex w-full items-center justify-center gap-3 rounded-full gradient-tropical py-5 text-lg font-bold text-white shadow-glow transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  <MessageCircle className="h-6 w-6" />
                  Order on WhatsApp
                </button>
              )}

              <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">
                Secure WhatsApp Ordering
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
