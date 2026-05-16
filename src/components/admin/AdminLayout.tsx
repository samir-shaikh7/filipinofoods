import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Utensils, Settings, LogOut, ChevronRight, 
  Menu as MenuIcon, X, ChevronDown, Store,
  Layers, Megaphone, MessageSquare, Grid
} from "lucide-react";
import { logoutAdmin } from "@/lib/auth";
import { useAdmin } from "@/context/AdminContext";

export function AdminLayout({ children, title }: { children: React.ReactNode, title: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  const navigation = [
    { name: "Menu", icon: Utensils, path: "/admin/menu" },
    { name: "Categories", icon: Layers, path: "/admin/categories" },
    { name: "Promotions", icon: Megaphone, path: "/admin/promotions" },
    { name: "Reviews", icon: MessageSquare, path: "/admin/reviews" },
    { name: "Gallery", icon: Grid, path: "/admin/gallery" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-white selection:bg-mango/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0D0D0E] transition-transform lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-tropical text-white font-bold">F</div>
            <span className="text-lg font-bold tracking-tight">Filipino Food</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 lg:hidden text-white/40">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/admin/menu" && location.pathname === "/admin");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-mango text-black shadow-glow" 
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/20 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 min-w-0 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-[#0A0A0B]/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-lg bg-white/5 p-2 text-white/40 lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-white/20 uppercase tracking-widest">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3" />
               <span className="text-white">{title}</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10" />
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 animate-fade-in max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
