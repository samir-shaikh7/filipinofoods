import React, { createContext, useContext, useState } from "react";

export type Restaurant = {
  id: string;
  name: string;
  logo: string;
  slug: string;
};

const RESTAURANT: Restaurant = { id: "filipino-food", name: "Filipino Food", logo: "F", slug: "filipino" };

type AdminContextType = {
  activeRestaurant: Restaurant;
  availableRestaurants: Restaurant[];
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeRestaurant] = useState<Restaurant>(RESTAURANT);

  return (
    <AdminContext.Provider value={{ activeRestaurant, availableRestaurants: [RESTAURANT] }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
