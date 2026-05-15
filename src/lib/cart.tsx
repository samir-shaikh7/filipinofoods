import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from "react";

// --- BUSINESS CONFIGURATION ---
// These will be managed by the admin panel later


export const CURRENCY = "KD ";

// --- TYPES ---
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Supports local asset import or remote URL
  category: string;
  section_id?: string;
  section_slug?: string;
  section_name?: string;
  veg?: boolean;
  spice?: 1 | 2 | 3;
  rating?: number;
  badge?: string; // e.g., "Bestseller", "New", "Save 20%"
  isAvailable: boolean; // For future stock management
  isFeatured: boolean; // For BestSellers section
};

export type CartLine = MenuItem & { qty: number };

type CartCtx = {
  items: CartLine[];
  add: (m: MenuItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [items, setItems] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem("filipino_food_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  // Persist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("filipino_food_cart", JSON.stringify(items));
  }, [items]);

  const add = useCallback((m: MenuItem) =>
    setItems((prev) => {
      const found = prev.find((p) => p.id === m.id);
      if (found) return prev.map((p) => (p.id === m.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...m, qty: 1 }];
    }), []);

  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const setQty = useCallback((id: string, qty: number) =>
    setItems((p) =>
      qty <= 0 ? p.filter((i) => i.id !== id) : p.map((i) => (i.id === id ? { ...i, qty } : i))
    ), []);
  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, add, remove, setQty, clear, total, count, open, setOpen }),
    [items, add, remove, setQty, clear, total, count, open]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

export type CheckoutDetails = {
  name: string;
  phone: string;
  address: string;
  landmark: string;
  notes: string;
  locationUrl: string;
  paymentMethod: "cod" | "gcash" | "bank";
};

// --- UTILS ---
import { formatPrice } from "./utils";

export function buildWhatsAppLink(items: CartLine[], subtotal: number, details: CheckoutDetails, whatsappNumber: string) {
  const delivery = subtotal >= 15 ? 0 : 0.5;
  const total = subtotal + delivery;

  const lines = items.map((i) => `${i.qty}x ${i.name} - ${CURRENCY}${formatPrice(i.price * i.qty)}`).join("%0A");
  const pm = details.paymentMethod === "cod" ? "Cash on Delivery" : details.paymentMethod === "gcash" ? "G-Cash" : "Payment Link";
  
  const msg = `Hello Filipino Food Restaurant,%0A%0AI want to place an order:%0A%0A${lines}%0A%0A---%0AOrder Breakdown:%0ASubtotal: ${CURRENCY}${formatPrice(subtotal)}%0ADelivery: ${delivery === 0 ? "FREE" : CURRENCY + formatPrice(delivery)}%0A*Total Amount: ${CURRENCY}${formatPrice(total)}*%0A%0APayment Method: ${pm}%0A%0ACustomer Details:%0AName: ${details.name}%0APhone: ${details.phone}%0A%0ADelivery Address:%0A${details.address}%0ALandmark: ${details.landmark}%0ANotes: ${details.notes}%0A%0ALive Location:%0A${details.locationUrl || "Not provided"}%0A%0APlease confirm my order.`;
  
  const cleanNumber = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${msg}`;
}
