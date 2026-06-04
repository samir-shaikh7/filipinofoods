import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
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
import { AdminGallery } from "@/pages/admin/AdminGallery";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingButtons, MobileBottomNav } from "@/components/site/Floating";

import { ToastProvider } from "@/components/site/Toast";
import { ScrollToTop } from "@/components/site/ScrollToTop";

function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <Navbar />
      
      {/* Persisted Home Page (Mounted once, visually toggled to preserve state) */}
      <div style={{ display: isHome ? 'block' : 'none' }} className="flex-1 w-full">
        <HomePage />
      </div>

      {/* Dynamic Content (Product Page, Cart) */}
      {!isHome && (
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      )}

      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
    </>
  );
}

export function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <div className="flex min-h-screen flex-col w-full">
          <Routes>
            {/* Public Routes with Persistent Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={null} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>

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
                    <Route path="gallery" element={<AdminGallery />} />
                  </Routes>
                </ProtectedRoute>
              </AdminProvider>
            } />
          </Routes>
          <div className="h-24 md:hidden w-full" aria-hidden />
        </div>
      </Router>
      </ToastProvider>
    </CartProvider>
  );
}
