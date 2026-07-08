import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Edit2, Trash2, X, Loader2, Save, 
  Megaphone, CheckCircle2, Image as ImageIcon, Eye, EyeOff
} from "lucide-react";
import { useToast } from "@/components/site/Toast";

export function AdminPromotions() {
  const { showToast } = useToast();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    button_text: "Order Now",
    is_active: false
  });

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleOpenModal = (promo: any = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        title: promo.title,
        description: promo.description || "",
        image_url: promo.image_url || "",
        link_url: promo.link_url || "",
        button_text: promo.button_text || "Order Now",
        is_active: promo.is_active || false
      });
    } else {
      setEditingPromo(null);
      setFormData({
        title: "",
        description: "",
        image_url: "",
        link_url: "",
        button_text: "Order Now",
        is_active: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPromo) {
        const { error } = await supabase.from('promotions').update(formData).eq('id', editingPromo.id);
        if (error) throw error;
        showToast("Promotion updated successfully", "success");
      } else {
        const { error } = await supabase.from('promotions').insert([formData]);
        if (error) throw error;
        showToast("Promotion created successfully", "success");
      }

      setIsModalOpen(false);
      fetchPromotions();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    try {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
      showToast("Promotion deleted", "info");
      fetchPromotions();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const toggleStatus = async (promo: any) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: !promo.is_active })
        .eq('id', promo.id);
      
      if (error) throw error;
      showToast(`Promotion ${!promo.is_active ? 'activated' : 'deactivated'}`, "success");
      fetchPromotions();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  return (
    <AdminLayout title="Promotion Management">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">Active Pop-ups</h2>
          <p className="text-xs text-white/20 mt-1">Manage special offers that appear to users</p>
        </div>
        <button
           onClick={() => handleOpenModal()}
           className="flex items-center justify-center gap-2 rounded-xl gradient-tropical px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-105 active:scale-95"
         >
           <Plus className="h-4 w-4" /> New Promotion
         </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-mango/40" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl text-white/20">
            No promotions found. Create one to get started.
          </div>
        ) : promotions.map((promo) => (
          <div key={promo.id} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0D0D0E]/80 backdrop-blur-sm transition-all hover:border-white/10">
            <div className="aspect-[16/9] overflow-hidden bg-white/5">
              {promo.image_url ? (
                <img src={promo.image_url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/10">
                  <Megaphone className="h-10 w-10" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => toggleStatus(promo)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-2xl transition-all duration-300 ${
                    promo.is_active 
                      ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                      : "bg-black/60 text-white/40 border border-white/10 hover:bg-black/80"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full animate-pulse ${promo.is_active ? "bg-white" : "bg-white/20"}`} />
                  {promo.is_active ? "Live" : "Offline"}
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-lg leading-tight group-hover:text-mango transition-colors">{promo.title}</h3>
                <div 
                  onClick={() => toggleStatus(promo)}
                  className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 ${promo.is_active ? "bg-green-500" : "bg-white/10"}`}
                >
                  <div className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform duration-300 ${promo.is_active ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </div>
              <p className="mt-2 text-sm text-white/40 line-clamp-2 leading-relaxed">{promo.description}</p>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(promo)} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-mango hover:bg-white/10 transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(promo.id)} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {promo.is_active ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-white/10" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0B]/90 backdrop-blur-md animate-fade-in" onClick={() => !saving && setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0D0D0E] shadow-2xl animate-scale-up p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">{editingPromo ? "Edit Promotion" : "New Promotion"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/40 transition hover:text-white" disabled={saving}><X /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  placeholder="e.g. Weekend Special Feast"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  placeholder="What's the special offer?"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Button Text</label>
                  <input
                    value={formData.button_text}
                    onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                    placeholder="e.g. Order Now"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Link URL (Optional)</label>
                  <input
                    value={formData.link_url}
                    onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                    placeholder="e.g. /#menu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Promotion Image</label>
                <div className="flex flex-col gap-4">
                  {formData.image_url && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-card bg-white/5">
                      <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, image_url: ""})}
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                       <input
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        className="w-full rounded-xl border border-white/5 bg-white/5 p-4 pl-10 text-sm focus:border-mango/30 focus:outline-none"
                        placeholder="Paste image URL..."
                      />
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${formData.is_active ? "bg-green-500 border-green-500" : "border-white/10"}`}>
                    <input type="checkbox" className="sr-only" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                    {formData.is_active && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-xs font-bold text-white/60">Active (Visible to users)</span>
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-tropical py-4 text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {editingPromo ? "Update Promotion" : "Create Promotion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
