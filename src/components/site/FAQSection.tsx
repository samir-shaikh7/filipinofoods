import { Plus, Minus } from "lucide-react";
import React, { useState } from "react";

const FAQS = [
  {
    q: "Do you deliver Filipino food across Kuwait?",
    a: "Authentic Filipino favorites delivered anywhere in Kuwait! Enjoy sizzling Sisig, smoky BBQ, hearty Bulalo, crispy Lumpia, and Bilao Specials made fresh daily with the taste of home in every bite.\n\nFrom Kuwait City to Salmiya, Farwaniya, and beyond — we bring hot, flavorful Filipino meals straight to your doorstep anywhere in Kuwait."
  },
  {
    q: "Is your food cooked fresh every day?",
    a: "Absolutely. We pride ourselves on using fresh, high-quality ingredients. Our lumpia is rolled fresh every morning, and our meats are marinated using traditional family recipes to ensure authentic Pinoy taste."
  },
  {
    q: "How can I order? Do I need an account?",
    a: "Ordering is easy and account-free! Just browse our menu, add items to your cart, and click 'Place Order via WhatsApp'. You'll be connected directly with our team to confirm your delivery details."
  },
  {
    q: "Do you offer catering for parties in Kuwait?",
    a: "Yes, we specialize in 'Barkada Boodle' and party bilao packages perfect for gatherings, birthdays, and office lunches. You can view our Party Set category in the menu for options."
  },
  {
    q: "What are your delivery hours in Kuwait?",
    a: "We are open for delivery from 10:00 AM to 11:00 PM daily. For group orders or catering, we recommend ordering at least 2 hours in advance."
  }
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-24 py-20 md:py-28 bg-white/50">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-tropical">
            Got Questions?
          </div>
          <h2 className="text-4xl font-semibold md:text-5xl">
            Frequently Asked <span className="text-gradient-tropical italic">Questions</span>
          </h2>
          <p className="mt-4 text-foreground/60">
            Everything you need to know about the best Filipino food delivery in Kuwait.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              className="group rounded-3xl bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-soft"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="font-bold text-foreground/80 md:text-lg">{faq.q}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${open === i ? "gradient-tropical text-white rotate-180" : "bg-muted text-foreground/30"}`}>
                  {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>
              {open === i && (
                <div className="p-4 pt-0 text-foreground/60 leading-relaxed animate-fade-in whitespace-pre-line">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": FAQS.map((f) => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.a,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
