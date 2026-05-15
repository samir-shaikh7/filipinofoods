import { useState, useEffect, useMemo, useCallback } from "react";
const CATEGORIES = [
  { id: "bilao-packages", slug: "bilao-packages", name: "BILAO PACKAGES", icon: "🍱" },
  { id: "special-offer-deals", slug: "special-offer-deals", name: "SPECIAL OFFER DEALS", icon: "🏷️" },
  { id: "filipino-all-time-favorites", slug: "filipino-all-time-favorites", name: "Filipino All Time Favorites", icon: "⭐" },
  { id: "drinks", slug: "drinks", name: "Drinks", icon: "🧋" },
  { id: "fried-rice", slug: "fried-rice", name: "Fried Rice", icon: "🍚" },
  { id: "noodles", slug: "noodles", name: "Noodles", icon: "🍜" },
  { id: "alacarte-free-rice-drinks", slug: "alacarte-free-rice-drinks", name: "À La Carte / Free Rice & Drinks", icon: "🍛" },
  { id: "main-courses", slug: "main-courses", name: "Main Courses", icon: "🥘" },
  { id: "barkada-boodle", slug: "barkada-boodle", name: "BARKADA BOODLE", icon: "👨‍👩‍👧" },
  { id: "appetizers", slug: "appetizers", name: "Appetizers", icon: "🥟" },
  { id: "cutlery-party-set", slug: "cutlery-party-set", name: "Cutlery - Party Set", icon: "🍴" },
];
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
  const [categories, setCategories] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_categories`);
      return cached ? JSON.parse(cached) : CATEGORIES;
    } catch { return CATEGORIES; }
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

      // 1. Fetch Menu Items, Categories & Settings in parallel
      const [menuRes, categoriesRes, settingsRes] = await Promise.all([
        supabase.from('menu_items').select('*').order('name'),
        supabase.from('categories').select('*').order('order_index', { ascending: true }),
        supabase.from('settings').select('*').eq('id', 'main_config').maybeSingle()
      ]);

      let activeCategories = CATEGORIES;
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        activeCategories = categoriesRes.data;
        setCategories(activeCategories);
        localStorage.setItem(`${CACHE_KEY}_categories`, JSON.stringify(activeCategories));
      }

      if (menuRes.error) {
        console.warn("Menu fetch failed:", menuRes.error.message);
      } else if (menuRes.data) {
        const normalized = menuRes.data.map((item: any) => {
          const categoryMatch = activeCategories.find(c =>
            c.id === item.section_id ||
            c.id === item.category ||
            c.name === item.section_name ||
            c.name === item.category ||
            c.slug === item.section_slug
          ) || activeCategories[0];

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
      categories: categories,
      bestSellers: activeMenu.filter(item => item.isFeatured),
      config: {
        contact: contact || STATIC_CONTACT,
        currency: CURRENCY,
      },
      loading,
      error,
      refresh: () => fetchData(true)
    };
  }, [menu, categories, contact, loading, error, fetchData]);

  return appData;
}
