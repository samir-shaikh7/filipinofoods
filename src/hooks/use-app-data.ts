import { useState, useEffect, useMemo, useCallback } from "react";
import { MENU as STATIC_MENU, CATEGORIES } from "@/lib/menu-data";
import { CURRENCY as DEFAULT_CURRENCY } from "@/lib/cart";
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

const CURRENCY = "KWD ";

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

      // 1. Fetch Menu Items
      const { data: dbMenu, error: menuErr } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');

      if (menuErr) {
        console.warn("Menu fetch failed:", menuErr.message);
      } else if (dbMenu) {
        const normalized = dbMenu.map((item: any) => {
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
            section_id: item.section_id || categoryMatch.id,
            section_slug: item.section_slug || categoryMatch.slug,
            section_name: item.section_name || categoryMatch.name,
            category: item.category || categoryMatch.id
          };
        });
        setMenu(normalized);
        localStorage.setItem(`${CACHE_KEY}_menu`, JSON.stringify(normalized));
      }

      // 2. Fetch Settings
      const { data: dbSettings, error: setErr } = await (supabase
        .from('settings')
        .select('*')
        .eq('id', 'main_config')
        .maybeSingle() as any);

      if (setErr) {
        console.warn("Settings fetch failed:", setErr.message);
      } else if (dbSettings) {
        const s = dbSettings as any;
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
    const mergedMenu = [...STATIC_MENU];

    if (Array.isArray(menu)) {
      menu.forEach(dbItem => {
        const index = mergedMenu.findIndex(s => s.name.toLowerCase().trim() === dbItem.name.toLowerCase().trim());
        if (index !== -1) {
          mergedMenu[index] = { ...mergedMenu[index], ...dbItem };
        } else {
          mergedMenu.push(dbItem);
        }
      });
    }

    const normalizedMenu = mergedMenu.map((item: any) => {
      if (!item) return item;
      const categoryMatch = CATEGORIES.find(c => {
        const normalize = (s: string) => String(s || "").toLowerCase().trim().replace(/[–—]/g, "-").replace(/\s*\/\s*/g, "/");

        const itemId = normalize(item.section_id);
        const itemCat = normalize(item.category);
        const itemName = normalize(item.section_name);
        const itemSlug = normalize(item.section_slug);

        const catId = normalize(c.id);
        const catName = normalize(c.name);
        const catSlug = normalize(c.slug);

        return catId === itemId ||
          catId === itemCat ||
          catName === itemName ||
          catName === itemCat ||
          catSlug === itemSlug;
      }) || CATEGORIES[0];

      return {
        ...item,
        spice: item.spice_level ?? item.spice ?? 1,
        isAvailable: item.is_available ?? item.isAvailable ?? true,
        isFeatured: item.is_featured ?? item.isFeatured ?? false,
        section_id: categoryMatch.id,
        section_slug: categoryMatch.slug,
        section_name: categoryMatch.name,
        category: categoryMatch.id
      };
    });

    const uniqueMenu: any[] = [];
    const seenIds = new Set();

    normalizedMenu.forEach(item => {
      if (!item || !item.id) return;
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueMenu.push(item);
      }
    });

    const activeMenu = uniqueMenu.filter(item => item && item.isAvailable);

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
