import { useState, useEffect, useMemo, useCallback } from "react";
import { CATEGORIES } from "@/lib/menu-data";
import { CURRENCY } from "@/lib/cart";
import { supabase } from "@/lib/supabase";

const CACHE_KEY = "filipino_food_app_data_cache";

const STATIC_CONTACT = {
  address: "Salmiya, Kuwait City, Kuwait",
  call: "+965 6399 9999",
  email: "hello@filipinofoodkuwait.com",
  openingHours: "10:00 AM - 11:00 PM",
  whatsapp: "96563999999",
  deliveryHours: "Till 10:30 PM",
};

export function useAppData() {
  const [menu, setMenu] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_menu`);
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  const [contact, setContact] = useState<any>(() => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_contact`);
      return cached ? JSON.parse(cached) : STATIC_CONTACT;
    } catch { return STATIC_CONTACT; }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      if (!isSilent) setLoading(true);

      // 1. Fetch Menu Items & Settings in parallel
      const [menuRes, settingsRes] = await Promise.all([
        supabase.from('menu_items').select('*').order('name'),
        supabase.from('settings').select('*').eq('id', 'main_config').maybeSingle()
      ]);

      if (menuRes.error) {
        console.warn("Menu fetch failed:", menuRes.error.message);
      } else if (menuRes.data) {
        const normalized = menuRes.data.map((item: any) => {
          const categoryMatch = CATEGORIES.find(c =>
            c.id === item.section_id ||
            c.id === item.category ||
            c.name === item.section_name ||
            c.name === item.category
          ) || CATEGORIES[0];

          return {
            ...item,
            spice: item.spice_level ?? 1,
            isAvailable: item.is_available ?? true,
            isFeatured: item.is_featured ?? false,
            section_id: categoryMatch.id,
            section_slug: categoryMatch.slug,
            section_name: categoryMatch.name,
            category: categoryMatch.id
          };
        });
        setMenu(normalized);
        localStorage.setItem(`${CACHE_KEY}_menu`, JSON.stringify(normalized));
      }

      if (settingsRes.error) {
        console.warn("Settings fetch failed:", settingsRes.error.message);
      } else if (settingsRes.data) {
        const s = settingsRes.data as any;
        const newContact = {
          whatsapp: s.whatsapp_number || STATIC_CONTACT.whatsapp,
          call: s.call_number || STATIC_CONTACT.call,
          email: s.support_email || STATIC_CONTACT.email,
          address: s.address || STATIC_CONTACT.address,
          openingHours: s.opening_hours || STATIC_CONTACT.openingHours,
          deliveryHours: s.delivery_hours || STATIC_CONTACT.deliveryHours
        };
        setContact(newContact);
        localStorage.setItem(`${CACHE_KEY}_contact`, JSON.stringify(newContact));
      }
    } catch (err: any) {
      console.error("Critical error in useAppData:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const appData = useMemo(() => {
    const activeMenu = menu.filter(item => item && item.isAvailable);

    return {
      menu: activeMenu,
      categories: CATEGORIES,
      bestSellers: activeMenu.filter(item => item.isFeatured),
      config: {
        contact: contact || STATIC_CONTACT,
        currency: CURRENCY,
      },
      loading,
      error,
      refresh: () => fetchData(true)
    };
  }, [menu, contact, loading, error, fetchData]);

  return appData;
}
