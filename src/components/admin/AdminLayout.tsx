import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Utensils, Settings, LogOut, ChevronRight, 
  Menu as MenuIcon, X, ChevronDown, Store
} from "lucide-react";
import { logoutAdmin } from "@/lib/auth";
import { useAdmin } from "@/context/AdminContext";

export function AdminLayout({ children, title }: { children: React.ReactNode, title: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRestaurant, setActiveRestaurant, availableRestaurants } = useAdmin();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStoreSwitcherOpen, setIsStoreSwitcherOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  const navigation = [
    { name: "Menu", icon: Utensils, path: "/admin/menu" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-white selection:bg-mango/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0D0D0E] transition-transform lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-tropical text-white font-bold">A</div>
            <span className="text-lg font-bold tracking-tight">Admin</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 lg:hidden text-white/40">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Simplified Site Switcher */}
        <div className="p-4 border-b border-white/5">
          <button 
            onClick={() => setIsStoreSwitcherOpen(!isStoreSwitcherOpen)}
            className="flex w-full items-center justify-between rounded-xl bg-white/5 p-3 text-left hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-mango/10 text-mango font-bold text-xs">
                {activeRestaurant.logo}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-[10px] font-bold text-white/20 uppercase tracking-widest">Active Site</p>
                <p className="truncate text-sm font-semibold">{activeRestaurant.name}</p>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-white/20 transition-transform ${isStoreSwitcherOpen ? "rotate-180" : ""}`} />
          </button>

          {isStoreSwitcherOpen && (
            <div className="mt-2 space-y-1 rounded-xl bg-white/[0.02] p-1 border border-white/5">
              {availableRestaurants.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRestaurant(r);
                    setIsStoreSwitcherOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm transition-all ${
                    r.id === activeRestaurant.id 
                      ? "bg-white/5 text-mango font-bold" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-[10px]">{r.logo}</div>
                  {r.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="p-4 space-y-1 flex-1">
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
