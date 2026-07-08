import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { CURRENCY } from "@/lib/cart";
import { supabase } from "@/lib/supabase";

const CACHE_KEY = "filipino_food_app_data_cache";
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

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

const STATIC_CONTACT = {
  address: "Salmiya, Kuwait City, Kuwait",
  call: "+965 6399 9999",
  email: "hello@filipinofoodkuwait.com",
  openingHours: "10:00 AM - 11:00 PM",
  whatsapp: "96563999999",
  deliveryHours: "Till 10:30 PM",
};

// Singleton State
type AppState = {
  menu: any[];
  categories: any[];
  contact: any;
  reviews: any[];
  gallery: any[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
};

/**
 * Reads cached data from localStorage with a single read + JSON.parse
 * instead of 6 separate reads. Reduces localStorage access overhead.
 */
const getInitialState = (): AppState => {
  const state: AppState = {
    menu: [],
    categories: CATEGORIES,
    contact: STATIC_CONTACT,
    reviews: [],
    gallery: [],
    loading: false,
    error: null,
    lastFetch: 0,
  };

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.menu?.length) state.menu = parsed.menu;
      if (parsed.categories?.length) state.categories = parsed.categories;
      if (parsed.contact) state.contact = parsed.contact;
      if (parsed.reviews?.length) state.reviews = parsed.reviews;
      if (parsed.gallery?.length) state.gallery = parsed.gallery;
      if (parsed.lastFetch) state.lastFetch = parsed.lastFetch;
    }
  } catch {
    console.warn("Failed to parse cached data");
  }
  
  // If we don't have menu items, we must load
  if (!state.menu || state.menu.length === 0) {
    state.loading = true;
  }
  
  return state;
};

let globalState = getInitialState();
let fetchPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

/**
 * Persists all cached data in a single localStorage.setItem call
 * instead of 6 separate calls. This is both faster and more atomic.
 */
const persistCache = () => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      menu: globalState.menu,
      categories: globalState.categories,
      contact: globalState.contact,
      reviews: globalState.reviews,
      gallery: globalState.gallery,
      lastFetch: globalState.lastFetch,
    }));
  } catch {
    // localStorage might be full; silently fail
    console.warn("Failed to persist cache to localStorage");
  }
};

const fetchGlobalData = async (force = false) => {
  if (!supabase) {
    globalState.loading = false;
    globalState.error = "Supabase not initialized";
    notify();
    return;
  }

  // Deduplicate concurrent requests
  if (fetchPromise && !force) return fetchPromise;

  // Cache TTL check
  if (!force && Date.now() - globalState.lastFetch < CACHE_TTL && globalState.menu.length > 0) {
    return;
  }

  globalState.loading = true;
  globalState.error = null;
  notify();

  fetchPromise = (async () => {
    try {
      const [menuRes, categoriesRes, settingsRes, reviewsRes, galleryRes] = await Promise.all([
        supabase.from('menu_items').select('*').order('name'),
        supabase.from('categories').select('*').order('order_index', { ascending: true }),
        supabase.from('settings').select('*').eq('id', 'main_config').maybeSingle(),
        supabase.from('reviews').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('gallery').select('*').order('order_index', { ascending: true })
      ]);

      let activeCategories = CATEGORIES;
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        activeCategories = categoriesRes.data;
        globalState.categories = activeCategories;
      }

      if (menuRes.data) {
        // Pre-build a lookup map for O(1) category matching instead of O(n) .find() per item
        const categoryMap = new Map<string, any>();
        for (const c of activeCategories) {
          categoryMap.set(c.id, c);
          categoryMap.set(c.name, c);
          categoryMap.set(c.slug, c);
        }

        const normalized = menuRes.data.map((item: any) => {
          const categoryMatch = 
            categoryMap.get(item.section_id) ||
            categoryMap.get(item.category) ||
            categoryMap.get(item.section_name) ||
            categoryMap.get(item.section_slug) ||
            activeCategories[0];

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
        globalState.menu = normalized;
      }

      if (settingsRes.data) {
        const s = settingsRes.data as any;
        globalState.contact = {
          whatsapp: s.whatsapp_number || STATIC_CONTACT.whatsapp,
          call: s.call_number || STATIC_CONTACT.call,
          email: s.support_email || STATIC_CONTACT.email,
          address: s.address || STATIC_CONTACT.address,
          openingHours: s.opening_hours || STATIC_CONTACT.openingHours,
          deliveryHours: s.delivery_hours || STATIC_CONTACT.deliveryHours,
          logo_url: s.logo_url || "/logo.jpeg"
        };
      }

      if (reviewsRes.data) {
        globalState.reviews = reviewsRes.data;
      }

      if (galleryRes.data) {
        globalState.gallery = galleryRes.data;
      }

      globalState.lastFetch = Date.now();
      
      // Single localStorage write instead of 6 separate writes
      persistCache();
      
    } catch (err: any) {
      console.error("Critical error in fetchGlobalData:", err.message);
      globalState.error = err.message;
    } finally {
      globalState.loading = false;
      notify();
    }
  })();

  try {
    await fetchPromise;
  } finally {
    fetchPromise = null;
  }
};

export function useAppData() {
  const [, forceUpdate] = useState(0);
  const stateRef = useRef(globalState);

  useEffect(() => {
    // Subscriber logic — uses a ref + numeric counter to avoid 
    // creating a new state object on every notification
    const handler = () => {
      stateRef.current = globalState;
      forceUpdate(c => c + 1);
    };
    listeners.add(handler);
    
    // Trigger fetch on mount if cache is missing or expired
    fetchGlobalData();
    
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const refresh = useCallback(() => fetchGlobalData(true), []);

  const state = stateRef.current;

  const appData = useMemo(() => {
    const activeMenu = state.menu.filter(item => item && item.isAvailable);

    return {
      menu: activeMenu,
      categories: state.categories,
      bestSellers: activeMenu.filter(item => item.isFeatured),
      reviews: state.reviews,
      gallery: state.gallery,
      config: {
        contact: state.contact || STATIC_CONTACT,
        currency: CURRENCY,
      },
      loading: state.loading,
      error: state.error,
      refresh
    };
  }, [state.menu, state.categories, state.contact, state.reviews, state.gallery, state.loading, state.error, refresh]);

  return appData;
}
