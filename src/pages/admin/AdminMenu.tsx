import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Edit2, Trash2, Search, X, Loader2, Save, 
  Image as ImageIcon, CheckCircle2, Star, Upload
} from "lucide-react";
const CATEGORIES = [
  { id: "bilao-packages", slug: "bilao-packages", name: "BILAO PACKAGES", icon: "🍱" },
  { id: "special-offer-deals", slug: "special-offer-deals", name: "SPECIAL OFFER DEALS", icon: "🏷️" },
  { id: "filipino-all-time-favorites", slug: "filipino-all-time-favorites", name: "Filipino All Time Favorites", icon: "⭐" },
  { id: "drinks", slug: "drinks", name: "Drinks", icon: "🧋" },
  { id: "fried-rice", slug: "fried-rice", name: "Fried Rice", icon: "🍚" },
  { id: "noodles", slug: "noodles", name: "Noodles", icon: "🍜" },
  { id: "alacarte-free-rice-drinks", slug: "alacarte-free-rice-drinks", name: "À La Carte / Free Rice & Drinks", icon: "🍛" },
  { id: "main-courses", slug: "main-courses", name: "Main Courses", icon: "🥘" },
  { id: "barkada-boodle", slug: "barkada-boodle", name: "BARKADA BOODLE", icon: "👨‍👩‍👧" },
  { id: "appetizers", slug: "appetizers", name: "Appetizers", icon: "🥟" },
  { id: "cutlery-party-set", slug: "cutlery-party-set", name: "Cutlery - Party Set", icon: "🍴" },
];
import { CURRENCY } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/site/Toast";

export function AdminMenu() {
  const { showToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => [
    { id: "all", name: "All Dishes" },
    ...(dbCategories.length > 0 ? dbCategories : CATEGORIES)
  ], [dbCategories]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    badge: "",
    spice_level: 1,
    rating: 5.0,
    is_available: true,
    is_featured: false,
    veg: false,
    variants: [] as { id: string; name: string; price: number }[]
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsRes, catsRes] = await Promise.all([
        supabase.from('menu_items').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('order_index', { ascending: true })
      ]);

      if (itemsRes.error) throw itemsRes.error;
      
      const activeCats: any[] = catsRes.data && catsRes.data.length > 0 ? catsRes.data : CATEGORIES;
      setDbCategories(catsRes.data || []);

      const normalized = (itemsRes.data || []).map((item: any) => {
        const categoryMatch = activeCats.find((c: any) => 
          c.id === item.section_id || 
          c.id === item.category ||
          c.name === item.section_name ||
          c.name === item.category ||
          c.slug === item.section_slug
        ) || activeCats[0];

        return {
          ...item,
          category: categoryMatch.id,
          section_id: categoryMatch.id,
          section_name: categoryMatch.name,
          section_slug: categoryMatch.slug,
        };
      });
      setItems(normalized);
      
      if (!formData.category && activeCats.length > 0) {
        setFormData(prev => ({ ...prev, category: activeCats[0].id }));
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, formData.category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (item: any = null) => {
    const activeCats = dbCategories.length > 0 ? dbCategories : CATEGORIES;
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        price: String(item.price),
        badge: item.badge || "",
        variants: item.variants || []
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: activeCats[0]?.id || "",
        image: "",
        badge: "",
        spice_level: 1,
        rating: 5.0,
        is_available: true,
        is_featured: false,
        veg: false,
        variants: []
      });
    }
    setIsModalOpen(true);
  };
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `menu/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      showToast("Image uploaded successfully", "success");
    } catch (error: any) {
      showToast('Error uploading image: ' + error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const activeCats = dbCategories.length > 0 ? dbCategories : CATEGORIES;
      const selectedSection = activeCats.find(c => c.id === formData.category) || activeCats[0];
      
      const dataToSave = {
        ...formData,
        price: Number(parseFloat(String(formData.price))),
        category: selectedSection?.id,
        section_id: selectedSection?.id,
        section_slug: selectedSection?.slug,
        section_name: selectedSection?.name
      };

      if (editingItem) {
        const { error } = await supabase.from('menu_items').update(dataToSave).eq('id', editingItem.id);
        if (error) throw error;
        showToast("Item updated successfully", "success");
      } else {
        const { error } = await supabase.from('menu_items').insert([dataToSave]);
        if (error) throw error;
        showToast("Item created successfully", "success");
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
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      showToast("Item deleted successfully", "info");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = !q || i.name.toLowerCase().includes(q.toLowerCase()) || 
                           i.description.toLowerCase().includes(q.toLowerCase());
      const matchesCategory = activeCategory === "all" || i.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, q, activeCategory]);

  return (
    <AdminLayout title="Menu Management">
      <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
        <div className="flex gap-2 min-w-max">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat.id 
                  ? "bg-mango text-black shadow-glow" 
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
         <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 group-focus-within:text-mango" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-12 pr-4 text-sm focus:border-mango/30 focus:outline-none"
            />
         </div>
         <button
           onClick={() => handleOpenModal()}
           className="flex items-center justify-center gap-2 rounded-xl gradient-tropical px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:scale-105 active:scale-95"
         >
           <Plus className="h-4 w-4" /> Add Item
         </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0D0D0E]/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-white/20">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-mango/40" />
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-white/20">No items found.</td>
                </tr>
              ) : filteredItems.map((item) => (
                <tr key={item.id} className="group hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-white/5" />
                      <div>
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="text-[10px] text-white/20 uppercase font-bold">
                          {categories.find(c => c.id === item.category)?.name || item.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm">{CURRENCY}{formatPrice(item.price)}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold uppercase ${item.is_available ? "text-green-400 bg-green-500/5" : "text-red-400 bg-red-500/5"}`}>
                       <div className={`h-1 w-1 rounded-full ${item.is_available ? "bg-green-400" : "bg-red-400"}`} />
                       {item.is_available ? "In Stock" : "Sold Out"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(item)} className="p-2 hover:text-mango transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0D0D0E] shadow-2xl animate-scale-up p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">{editingItem ? "Edit Item" : "Add New Item"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/40 transition hover:text-white" disabled={saving}><X /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Item Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  placeholder="e.g. Chicken Inasal"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Price ({CURRENCY.trim()})</label>
                  <input
                    required type="number" step="0.001"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Rating (0-5)</label>
                  <input
                    required type="number" step="0.1" min="0" max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none text-white appearance-none"
                  >
                    {(dbCategories.length > 0 ? dbCategories : CATEGORIES).map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-[#0D0D0E] text-white">{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Description</label>
                <textarea
                  required rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                  placeholder="Describe the dish..."
                />
              </div>

              <div className="space-y-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Product Variants (Optional)</label>
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      variants: [...(prev.variants || []), { id: crypto.randomUUID(), name: "", price: 0 }] 
                    }))}
                    className="flex items-center gap-1 text-xs font-bold text-tropical hover:text-mango transition"
                  >
                    <Plus className="h-3 w-3" /> Add Variant
                  </button>
                </div>
                {formData.variants && formData.variants.length > 0 && (
                  <div className="space-y-3">
                    {formData.variants.map((variant, idx) => (
                      <div key={variant.id} className="flex items-center gap-3">
                        <input
                          placeholder="e.g. 4 Sticks"
                          value={variant.name}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[idx].name = e.target.value;
                            setFormData({...formData, variants: newVariants});
                          }}
                          className="flex-1 rounded-xl border border-white/5 bg-white/5 p-3 text-sm focus:border-mango/30 focus:outline-none"
                        />
                        <input
                          type="number"
                          step="0.001"
                          placeholder="Price"
                          value={variant.price || ""}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[idx].price = parseFloat(e.target.value);
                            setFormData({...formData, variants: newVariants});
                          }}
                          className="w-24 rounded-xl border border-white/5 bg-white/5 p-3 text-sm focus:border-mango/30 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newVariants = formData.variants.filter((_, i) => i !== idx);
                            setFormData({...formData, variants: newVariants});
                          }}
                          className="p-3 text-white/20 hover:text-red-400 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <p className="text-[10px] text-white/40 italic">Note: The base price above is still used as a display fallback if variants exist.</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Item Image</label>
                <div className="flex flex-col gap-4">
                  {formData.image && (
                    <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-[2rem] border border-white/10 shadow-card bg-white/5">
                      <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, image: ""})}
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                       <input
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full rounded-xl border border-white/5 bg-white/5 p-4 pl-10 text-sm focus:border-mango/30 focus:outline-none"
                        placeholder="Paste URL or Upload..."
                      />
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    </div>
                    
                    <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-6 py-4 text-sm font-bold transition hover:bg-white/10 active:scale-95">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin text-mango" /> : <Upload className="h-4 w-4 text-mango" />}
                      <span className="hidden sm:inline">Upload</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${formData.is_available ? "bg-mango border-mango" : "border-white/10"}`}>
                    <input type="checkbox" className="sr-only" checked={formData.is_available} onChange={(e) => setFormData({...formData, is_available: e.target.checked})} />
                    {formData.is_available && <CheckCircle2 className="h-3 w-3 text-black" />}
                  </div>
                  <span className="text-xs font-bold text-white/60">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${formData.is_featured ? "bg-tropical border-tropical" : "border-white/10"}`}>
                    <input type="checkbox" className="sr-only" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} />
                    {formData.is_featured && <Star className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-xs font-bold text-white/60">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${formData.veg ? "bg-green-500 border-green-500" : "border-white/10"}`}>
                    <input type="checkbox" className="sr-only" checked={formData.veg} onChange={(e) => setFormData({...formData, veg: e.target.checked})} />
                    {formData.veg && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-xs font-bold text-white/60">Vegetarian</span>
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-tropical py-4 text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {editingItem ? "Update Item" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
