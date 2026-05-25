import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Edit2, Trash2, Search, X, Loader2, Save, 
  Star, CheckCircle2
} from "lucide-react";
import { useToast } from "@/components/site/Toast";

export function AdminReviews() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    text: "",
    rating: 5,
    is_active: true
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        text: item.text,
        rating: item.rating,
        is_active: item.is_active
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        text: "",
        rating: 5,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        const { error } = await supabase.from('reviews').update(formData).eq('id', editingItem.id);
        if (error) throw error;
        showToast("Review updated successfully", "success");
      } else {
        const { error } = await supabase.from('reviews').insert([formData]);
        if (error) throw error;
        showToast("Review created successfully", "success");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      showToast("Review deleted successfully", "info");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => 
      !q || 
      r.name.toLowerCase().includes(q.toLowerCase()) || 
      r.text.toLowerCase().includes(q.toLowerCase())
    );
  }, [reviews, q]);

  return (
    <AdminLayout title="Review Management">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
         <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 group-focus-within:text-mango" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-12 pr-4 text-sm focus:border-mango/30 focus:outline-none"
            />
         </div>
         <button
           onClick={() => handleOpenModal()}
           className="flex items-center justify-center gap-2 rounded-xl gradient-tropical px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-105 active:scale-95"
         >
           <Plus className="h-4 w-4" /> Add Review
         </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0D0D0E]/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-white/20">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Review Text</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-mango/40" />
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-white/20">No reviews found.</td>
                </tr>
              ) : filteredReviews.map((review) => (
                <tr key={review.id} className="group hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-tropical text-sm font-bold text-white shadow-soft">
                        {review.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold">{review.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-2 text-xs text-white/60 max-w-md">{review.text}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-mango">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-sm font-bold">{review.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold uppercase ${review.is_active ? "text-green-400 bg-green-500/5" : "text-white/20 bg-white/5"}`}>
                       <div className={`h-1 w-1 rounded-full ${review.is_active ? "bg-green-400" : "bg-white/20"}`} />
                       {review.is_active ? "Active" : "Hidden"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(review)} className="p-2 hover:text-mango transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(review.id)} className="p-2 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0B]/90 backdrop-blur-md animate-fade-in" onClick={() => !saving && setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0D0D0E] shadow-2xl animate-scale-up p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">{editingItem ? "Edit Review" : "Add New Review"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/40 transition hover:text-white" disabled={saving}><X /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Customer Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  placeholder="e.g. Liza M."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, rating: s})}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${formData.rating >= s ? "bg-mango text-black" : "bg-white/5 text-white/20"}`}
                    >
                      <Star className={`h-4 w-4 ${formData.rating >= s ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Review Text</label>
                <textarea
                  required rows={4}
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  placeholder="Write the customer's feedback..."
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${formData.is_active ? "bg-mango border-mango" : "border-white/10"}`}>
                  <input type="checkbox" className="sr-only" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                  {formData.is_active && <CheckCircle2 className="h-3 w-3 text-black" />}
                </div>
                <span className="text-xs font-bold text-white/60">Display on Website</span>
              </label>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-tropical py-4 text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {editingItem ? "Update Review" : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
