import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppData } from "@/hooks/use-app-data";
import { useAdmin } from "@/context/AdminContext";
import { 
  Utensils, Star, Activity, Package, TrendingUp, 
  Users, AlertCircle, CheckCircle2, ArrowUpRight 
} from "lucide-react";

export function AdminDashboard() {
  const { menu, bestSellers } = useAppData();
  const { activeRestaurant } = useAdmin();

  const stats = [
    { label: "Total Dishes", value: menu.length, icon: Utensils, color: "text-mango", trend: "+12%" },
    { label: "Featured Items", value: menu.filter(m => m.is_featured).length, icon: Star, color: "text-tropical", trend: "+5%" },
    { label: "Out of Stock", value: menu.filter(m => !m.is_available).length, icon: AlertCircle, color: "text-red-400", trend: "0%" },
    { label: "System Uptime", value: "99.9%", icon: Activity, color: "text-green-400", trend: "Stable" },
  ];

  return (
    <AdminLayout title="System Dashboard">
      {/* Quick Actions Bar */}
      <div className="mb-10 flex flex-wrap gap-4">
         <button className="flex items-center gap-2 rounded-2xl bg-mango/10 px-6 py-3 text-sm font-bold text-mango transition hover:bg-mango/20">
           <TrendingUp className="h-4 w-4" /> View Analytics
         </button>
         <button className="flex items-center gap-2 rounded-2xl bg-white/5 px-6 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10">
           <Package className="h-4 w-4" /> Export Report
         </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div 
            key={stat.label} 
            className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0D0D0E] p-8 transition-all hover:bg-white/[0.04] hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-2xl bg-white/5 p-4 ${stat.color} shadow-inner`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                {stat.trend} <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-white/20">{stat.label}</p>
              <h3 className="mt-1 text-4xl font-bold tracking-tight">{stat.value}</h3>
            </div>
            {/* Decoration */}
            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-current opacity-[0.03] blur-3xl ${stat.color}`} />
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
           {/* Main Status Card */}
           <div className="rounded-[3rem] border border-white/5 bg-gradient-to-br from-[#0D0D0E] to-[#0A0A0B] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-2xl font-bold">Restaurant Health</h3>
                    <p className="text-sm text-white/40 mt-1">Status overview for {activeRestaurant.name}</p>
                 </div>
                 <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-xs font-bold text-green-400 ring-1 ring-green-500/20">
                    <CheckCircle2 className="h-4 w-4" /> All Systems Online
                 </div>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                 <div className="space-y-4 rounded-3xl bg-white/[0.02] p-6 ring-1 ring-white/5">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/20">Menu Status</p>
                    <div className="flex items-end justify-between">
                       <span className="text-3xl font-bold">{menu.filter(m => m.is_available).length}</span>
                       <span className="text-[10px] font-medium text-white/40">Active Dishes</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5">
                       <div className="h-full w-[85%] rounded-full gradient-tropical shadow-glow" />
                    </div>
                 </div>

                 <div className="space-y-4 rounded-3xl bg-white/[0.02] p-6 ring-1 ring-white/5">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/20">Customer Traffic</p>
                    <div className="flex items-end justify-between">
                       <span className="text-3xl font-bold">1.2k</span>
                       <span className="text-[10px] font-medium text-white/40">Visitors today</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5">
                       <div className="h-full w-[65%] rounded-full gradient-gold shadow-glow" />
                    </div>
                 </div>

                 <div className="space-y-4 rounded-3xl bg-white/[0.02] p-6 ring-1 ring-white/5">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/20">Category Coverage</p>
                    <div className="flex items-end justify-between">
                       <span className="text-3xl font-bold">{new Set(menu.map(m => m.section_id)).size}</span>
                       <span className="text-[10px] font-medium text-white/40">Active groups</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5">
                       <div className="h-full w-[95%] rounded-full gradient-coral shadow-glow" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Quick Edit Section */}
           <div className="rounded-[3rem] border border-white/5 bg-[#0D0D0E] p-10">
              <h3 className="text-xl font-bold mb-6">Popular Items Quick Toggle</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                 {menu.slice(0, 4).map(item => (
                   <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05] ring-1 ring-white/5">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 overflow-hidden rounded-xl bg-white/5">
                            <img src={item.image} alt="" className="h-full w-full object-cover" />
                         </div>
                         <span className="text-sm font-semibold truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <div className="flex h-6 w-11 items-center rounded-full bg-mango/10 p-1 cursor-pointer">
                         <div className="h-4 w-4 rounded-full bg-mango shadow-glow ml-auto" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* Team / Activity Feed */}
           <div className="rounded-[3rem] border border-white/5 bg-[#0D0D0E] p-10 h-full">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Users className="h-5 w-5 text-tropical" /> Team Updates
              </h3>
              <div className="space-y-10 relative before:absolute before:left-3 before:top-2 before:h-[calc(100%-20px)] before:w-px before:bg-white/5">
                 {[
                   { u: "Samir", action: "Updated Menu", item: "Bilao Package 1", time: "2m ago" },
                   { u: "Admin", action: "Changed Settings", item: "WhatsApp Number", time: "1h ago" },
                   { u: "System", action: "Auto-Featured", item: "Barkada Feast", time: "4h ago" },
                   { u: "Samir", action: "Added Category", item: "Desserts", time: "1d ago" },
                 ].map((act, i) => (
                   <div key={i} className="relative pl-10">
                      <div className="absolute left-0 top-1 h-6 w-6 rounded-lg bg-white/5 border border-white/10 shadow-lg flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:text-mango">
                         {act.u[0]}
                      </div>
                      <p className="text-xs font-bold"><span className="text-mango">{act.u}</span> {act.action}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{act.item}</p>
                      <p className="text-[10px] text-white/20 mt-1 italic">{act.time}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
