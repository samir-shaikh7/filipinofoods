import { useState, useEffect, useMemo, useCallback } from "react";
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

const getInitialState = (): AppState => {
  let state = {
    menu: [],
    categories: CATEGORIES,
    contact: STATIC_CONTACT,
    reviews: [],
    gallery: [],
    loading: false,
    error: null,
    lastFetch: 0
  };

  try {
    const cachedMenu = localStorage.getItem(`${CACHE_KEY}_menu`);
    if (cachedMenu) state.menu = JSON.parse(cachedMenu);
    
    const cachedCategories = localStorage.getItem(`${CACHE_KEY}_categories`);
    if (cachedCategories) state.categories = JSON.parse(cachedCategories);
    
    const cachedContact = localStorage.getItem(`${CACHE_KEY}_contact`);
    if (cachedContact) state.contact = JSON.parse(cachedContact);
    
    const cachedReviews = localStorage.getItem(`${CACHE_KEY}_reviews`);
    if (cachedReviews) state.reviews = JSON.parse(cachedReviews);
    
    const cachedGallery = localStorage.getItem(`${CACHE_KEY}_gallery`);
    if (cachedGallery) state.gallery = JSON.parse(cachedGallery);
    
    const cachedTime = localStorage.getItem(`${CACHE_KEY}_time`);
    if (cachedTime) state.lastFetch = parseInt(cachedTime, 10);
  } catch (e) {
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
        localStorage.setItem(`${CACHE_KEY}_categories`, JSON.stringify(activeCategories));
      }

      if (menuRes.data) {
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
        globalState.menu = normalized;
        localStorage.setItem(`${CACHE_KEY}_menu`, JSON.stringify(normalized));
      }

      if (settingsRes.data) {
        const s = settingsRes.data as any;
        const newContact = {
          whatsapp: s.whatsapp_number || STATIC_CONTACT.whatsapp,
          call: s.call_number || STATIC_CONTACT.call,
          email: s.support_email || STATIC_CONTACT.email,
          address: s.address || STATIC_CONTACT.address,
          openingHours: s.opening_hours || STATIC_CONTACT.openingHours,
          deliveryHours: s.delivery_hours || STATIC_CONTACT.deliveryHours,
          logo_url: s.logo_url || "/logo.jpeg"
        };
        globalState.contact = newContact;
        localStorage.setItem(`${CACHE_KEY}_contact`, JSON.stringify(newContact));
      }

      if (reviewsRes.data) {
        globalState.reviews = reviewsRes.data;
        localStorage.setItem(`${CACHE_KEY}_reviews`, JSON.stringify(reviewsRes.data));
      }

      if (galleryRes.data) {
        globalState.gallery = galleryRes.data;
        localStorage.setItem(`${CACHE_KEY}_gallery`, JSON.stringify(galleryRes.data));
      }

      globalState.lastFetch = Date.now();
      localStorage.setItem(`${CACHE_KEY}_time`, globalState.lastFetch.toString());
      
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
  const [state, setState] = useState(globalState);

  useEffect(() => {
    // Subscriber logic
    const handler = () => setState({ ...globalState });
    listeners.add(handler);
    
    // Trigger fetch on mount if cache is missing or expired
    fetchGlobalData();
    
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const refresh = useCallback(() => fetchGlobalData(true), []);

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

