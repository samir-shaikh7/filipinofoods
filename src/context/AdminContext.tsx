import React, { createContext, useContext, useState, useEffect } from "react";

export type Restaurant = {
  id: string;
  name: string;
  logo: string;
  slug: string;
};

const RESTAURANTS: Restaurant[] = [
  { id: "filipino-food", name: "Filipino Food", logo: "F", slug: "filipino" },
  { id: "lumpia-legend", name: "Lumpia Legend", logo: "L", slug: "lumpia" },
];

type AdminContextType = {
  activeRestaurant: Restaurant;
  setActiveRestaurant: (r: Restaurant) => void;
  availableRestaurants: Restaurant[];
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant>(() => {
    const saved = localStorage.getItem("active_restaurant_id");
    return RESTAURANTS.find(r => r.id === saved) || RESTAURANTS[0];
  });

  useEffect(() => {
    localStorage.setItem("active_restaurant_id", activeRestaurant.id);
  }, [activeRestaurant]);

  return (
    <AdminContext.Provider value={{ activeRestaurant, setActiveRestaurant, availableRestaurants: RESTAURANTS }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
