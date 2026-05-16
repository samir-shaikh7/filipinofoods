import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Edit2, Trash2, Search, X, Loader2, Save, 
  Layers, CheckCircle2
} from "lucide-react";
import { useToast } from "@/components/site/Toast";

export function AdminCategories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "🍱",
    order_index: 0
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        icon: category.icon || "🍱",
        order_index: category.order_index || 0
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        icon: "🍱",
        order_index: categories.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const dataToSave = { ...formData, slug };

      if (editingCategory) {
        const { error } = await supabase.from('categories').update(dataToSave).eq('id', editingCategory.id);
        if (error) throw error;
        showToast("Category updated successfully", "success");
      } else {
        const { error } = await supabase.from('categories').insert([dataToSave]);
        if (error) throw error;
        showToast("Category created successfully", "success");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? Deleting a category might affect how items are displayed. It's better to rename it instead.")) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      showToast("Category deleted successfully", "info");
      fetchCategories();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(q.toLowerCase()) || 
    c.slug.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AdminLayout title="Category Management">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
         <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 group-focus-within:text-mango" />
            <input
              type="text"
              placeholder="Search categories..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-12 pr-4 text-sm focus:border-mango/30 focus:outline-none"
            />
         </div>
         <button
           onClick={() => handleOpenModal()}
           className="flex items-center justify-center gap-2 rounded-xl gradient-tropical px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-105 active:scale-95"
         >
           <Plus className="h-4 w-4" /> Add Category
         </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0D0D0E]/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-white/20">
                <th className="px-6 py-4">Icon</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Order</th>
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
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-white/20">No categories found.</td>
                </tr>
              ) : filteredCategories.map((cat) => (
                <tr key={cat.id} className="group hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{cat.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/40">{cat.slug}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/40">{cat.order_index}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(cat)} className="p-2 hover:text-mango transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
          <div className="relative w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#0D0D0E] shadow-2xl animate-scale-up p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">{editingCategory ? "Edit Category" : "Add New Category"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/40 transition hover:text-white" disabled={saving}><X /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Category Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  placeholder="e.g. Main Courses"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Slug (URL friendly)</label>
                  <input
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                    placeholder="e.g. main-courses"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Icon (Emoji)</label>
                  <input
                    required
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                    placeholder="e.g. 🥘"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Order Index</label>
                <input
                  required type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-tropical py-4 text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
