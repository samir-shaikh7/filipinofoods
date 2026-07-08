import { createContext, useContext } from "react";

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

// Static value — no need for useState since it never changes.
// This avoids unnecessary re-renders from state setter allocation.
const contextValue: AdminContextType = {
  activeRestaurant: RESTAURANT,
  availableRestaurants: [RESTAURANT],
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
