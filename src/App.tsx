import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/lib/cart";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";

import { AdminProvider } from "@/context/AdminContext";

// Admin Pages
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminMenu } from "@/pages/admin/AdminMenu";
import { AdminCategories } from "@/pages/admin/AdminCategories";
import { AdminPromotions } from "@/pages/admin/AdminPromotions";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { AdminReviews } from "@/pages/admin/AdminReviews";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingButtons, MobileBottomNav } from "@/components/site/Floating";

import { ToastProvider } from "@/components/site/Toast";
import { ScrollToTop } from "@/components/site/ScrollToTop";

export function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <div className="flex min-h-screen flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><div className="flex-1"><HomePage /></div><Footer /><FloatingButtons /><MobileBottomNav /></>} />
            <Route path="/product/:id" element={<><Navbar /><div className="flex-1"><ProductPage /></div><Footer /><FloatingButtons /><MobileBottomNav /></>} />
            <Route path="/cart" element={<><Navbar /><div className="flex-1"><CartPage /></div><Footer /><FloatingButtons /><MobileBottomNav /></>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <AdminProvider>
                <ProtectedRoute>
                  <Routes>
                    <Route index element={<AdminMenu />} />
                    <Route path="menu" element={<AdminMenu />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="promotions" element={<AdminPromotions />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="reviews" element={<AdminReviews />} />
                  </Routes>
                </ProtectedRoute>
              </AdminProvider>
            } />
          </Routes>
          <div className="h-24 md:hidden" aria-hidden />
        </div>
      </Router>
      </ToastProvider>
    </CartProvider>
  );
}
