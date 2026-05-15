import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export function PromoPopup() {
  const [promo, setPromo] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPromo() {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();

        if (data) {
          setPromo(data);
          // Show after a short delay
          setTimeout(() => setIsOpen(true), 2000);
        }
      } catch (err) {
        console.error("Error fetching promo:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPromo();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (loading || !promo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              mass: 0.8
            }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform-gpu max-h-[90vh] flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 rounded-full bg-white/60 p-2 text-foreground/50 backdrop-blur-md transition hover:bg-white/80 hover:text-foreground shadow-sm"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable Content Wrapper */}
            <div className="overflow-y-auto flex-1 premium-scrollbar">
              <div className="flex flex-col">
                {promo.image_url && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img 
                      src={promo.image_url} 
                      alt={promo.title} 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                  </div>
                )}
                
                <div className="p-6 md:p-8 text-center bg-atmosphere/30 backdrop-blur-sm">
                  <div className="mb-3 inline-block rounded-full bg-mango/20 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-tropical">
                    Special Offer
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground">{promo.title}</h2>
                  <p className="mt-3 text-sm font-medium text-foreground/60 leading-relaxed max-w-xs mx-auto">
                    {promo.description}
                  </p>
                  
                  <div className="mt-6 md:mt-8">
                    <a
                      href={promo.link_url || "#menu"}
                      onClick={handleClose}
                      className="inline-flex w-full items-center justify-center rounded-2xl gradient-tropical px-8 py-4 md:py-5 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {promo.button_text || "Order Now"}
                    </a>
                    <button 
                      onClick={handleClose}
                      className="mt-6 mb-2 text-xs font-bold uppercase tracking-widest text-foreground/30 hover:text-tropical transition"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
