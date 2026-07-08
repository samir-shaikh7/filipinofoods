import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { CartProvider } from "@/lib/cart";
import HomePage from "@/pages/HomePage";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingButtons, MobileBottomNav } from "@/components/site/Floating";

import { ToastProvider } from "@/components/site/Toast";
import { ScrollToTop } from "@/components/site/ScrollToTop";

// Lazy-loaded routes: These pages are only loaded when navigated to,
// reducing initial JS bundle size for the critical home page render path.
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));

// Admin routes are lazy-loaded as they are rarely accessed by regular users.
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminMenu = lazy(() => import("@/pages/admin/AdminMenu").then(m => ({ default: m.AdminMenu })));
const AdminCategories = lazy(() => import("@/pages/admin/AdminCategories").then(m => ({ default: m.AdminCategories })));
const AdminPromotions = lazy(() => import("@/pages/admin/AdminPromotions").then(m => ({ default: m.AdminPromotions })));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const AdminReviews = lazy(() => import("@/pages/admin/AdminReviews").then(m => ({ default: m.AdminReviews })));
const AdminGallery = lazy(() => import("@/pages/admin/AdminGallery").then(m => ({ default: m.AdminGallery })));
const ProtectedRoute = lazy(() => import("@/components/admin/ProtectedRoute").then(m => ({ default: m.ProtectedRoute })));
const AdminProvider = lazy(() => import("@/context/AdminContext").then(m => ({ default: m.AdminProvider })));

// Minimal fallback spinner for lazy-loaded routes
function RouteFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-tropical border-t-transparent" />
    </div>
  );
}

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
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
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
            <Route path="/admin/login" element={
              <Suspense fallback={<RouteFallback />}>
                <AdminLogin />
              </Suspense>
            } />
            <Route path="/admin/*" element={
              <Suspense fallback={<RouteFallback />}>
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
              </Suspense>
            } />
          </Routes>
          <div className="h-24 md:hidden w-full" aria-hidden />
        </div>
      </Router>
      </ToastProvider>
    </CartProvider>
  );
}
