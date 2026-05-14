import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/context/AdminContext";
import { 
  Phone, MessageSquare, Mail, Save, 
  Loader2, Info
} from "lucide-react";

import { useToast } from "@/components/site/Toast";

export function AdminSettings() {
  const { activeRestaurant } = useAdmin();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    whatsapp_number: "",
    call_number: "",
    support_email: "",
    address: "",
    opening_hours: "",
    delivery_hours: ""
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'main_config')
        .maybeSingle();

      if (data) setSettings({
        whatsapp_number: data.whatsapp_number || "",
        call_number: data.call_number || "",
        support_email: data.support_email || "",
        address: data.address || "",
        opening_hours: data.opening_hours || "",
        delivery_hours: data.delivery_hours || ""
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [activeRestaurant.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 'main_config', ...settings });

      if (!error) {
        showToast("Settings updated successfully", "success");
      } else {
        showToast(error.message, "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout title="Settings">
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mango" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Settings">
      <form onSubmit={handleSave} className="max-w-4xl space-y-8 pb-10">
        <div className="rounded-2xl border border-white/5 bg-[#0D0D0E]/80 p-8 shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-mango" /> Contact Info
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">WhatsApp Number</label>
              <input
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({...settings, whatsapp_number: e.target.value})}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                placeholder="965XXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Call Number</label>
              <input
                value={settings.call_number}
                onChange={(e) => setSettings({...settings, call_number: e.target.value})}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                placeholder="+965 XXXX XXXX"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({...settings, support_email: e.target.value})}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                placeholder="hello@filipinofoodkuwait.com"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0D0D0E]/80 p-8 shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Info className="h-5 w-5 text-mango" /> Business Details
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Physical Address</label>
              <input
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                placeholder="Salmiya, Kuwait City, Kuwait"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Opening Hours</label>
              <input
                value={settings.opening_hours}
                onChange={(e) => setSettings({...settings, opening_hours: e.target.value})}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                placeholder="10:00 AM - 11:00 PM"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Delivery Hours</label>
              <input
                value={settings.delivery_hours}
                onChange={(e) => setSettings({...settings, delivery_hours: e.target.value})}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                placeholder="Till 10:30 PM"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl gradient-tropical px-10 py-4 text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Changes
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
