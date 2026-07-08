import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Trash2, Search, X, Loader2, Save, 
  Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/components/site/Toast";

export function AdminGallery() {
  const { showToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    order_index: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => {
    setFormData({
      title: "",
      image_url: "",
      order_index: items.length
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('gallery').insert([formData]);
      if (error) throw error;
      showToast("Gallery image added successfully", "success");
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this image?")) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      showToast("Image removed from gallery", "info");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(i => 
      !q || (i.title && i.title.toLowerCase().includes(q.toLowerCase()))
    );
  }, [items, q]);

  return (
    <AdminLayout title="Gallery Management">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
         <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 group-focus-within:text-mango" />
            <input
              type="text"
              placeholder="Search images..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-12 pr-4 text-sm focus:border-mango/30 focus:outline-none"
            />
         </div>
         <button
           onClick={handleOpenModal}
           className="flex items-center justify-center gap-2 rounded-xl gradient-tropical px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-105 active:scale-95"
         >
           <Plus className="h-4 w-4" /> Add Image
         </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-mango/40" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-20 text-center text-white/20">No gallery images found.</div>
        ) : filteredItems.map((item) => (
          <div key={item.id} className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 shadow-xl transition-all duration-500 hover:shadow-glow">
            <img src={item.image_url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Order: {item.order_index}</p>
              <h4 className="text-sm font-bold text-white mb-3">{item.title || "Untitled"}</h4>
              <button 
                onClick={() => handleDelete(item.id)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/20 py-2 text-[10px] font-bold text-red-400 backdrop-blur-md transition hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0B]/90 backdrop-blur-md animate-fade-in" onClick={() => !saving && setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0D0D0E] shadow-2xl animate-scale-up p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Add to Gallery</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/40 transition hover:text-white" disabled={saving}><X /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Title (Optional)</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  placeholder="e.g. Fresh Inasal Grilling"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Gallery Image</label>
                <div className="flex flex-col gap-4">
                  {formData.image_url && (
                    <div className="relative aspect-square w-40 mx-auto overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                       <input
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        className="w-full rounded-xl border border-white/5 bg-white/5 p-4 pl-10 text-sm focus:border-mango/30 focus:outline-none"
                        placeholder="Image URL..."
                      />
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={saving || !formData.image_url}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-tropical py-4 text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
