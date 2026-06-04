import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/context/AdminContext";
import {
  Phone, MessageSquare, Save,
  Loader2, Image as ImageIcon, Upload, X, Shield, Grid
} from "lucide-react";

import { useToast } from "@/components/site/Toast";

export function AdminSettings() {
  const { activeRestaurant } = useAdmin();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState({
    whatsapp_number: "",
    call_number: "",
    support_email: "",
    logo_url: ""
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
        logo_url: data.logo_url || ""
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `brand/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      setSettings(prev => ({ ...prev, logo_url: data.publicUrl }));
      showToast("Logo uploaded successfully", "success");
    } catch (error: any) {
      showToast('Error uploading logo: ' + error.message, "error");
    } finally {
      setUploading(false);
    }
  };

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
        {/* Branding Section */}
        <div className="rounded-2xl border border-white/5 bg-[#0D0D0E]/80 p-8 shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-mango" /> Branding Assets
          </h3>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Site Logo (Navbar & Footer)</label>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-white/5 border border-white/10 group">
                <img
                  src={settings.logo_url || "/logo.jpeg"}
                  alt="Logo Preview"
                  className="h-full w-full object-contain p-2"
                />
                {settings.logo_url && (
                  <button
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, logo_url: "" }))}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="relative">
                  <input
                    value={settings.logo_url}
                    onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 pl-12 text-sm focus:border-mango/30 focus:outline-none"
                    placeholder="Paste Logo URL or Upload..."
                  />
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
                </div>

                <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold transition hover:bg-white/10 active:scale-95">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin text-mango" /> : <Upload className="h-4 w-4 text-mango" />}
                  <span>Upload New Logo</span>
                  <input type="file" className="sr-only" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Recommended: Square PNG/JPEG with white or transparent background.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="rounded-2xl border border-white/5 bg-[#0D0D0E]/80 p-8 shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-mango" /> Contact Info
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">WhatsApp Number</label>
              <input
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                placeholder="965XXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Call Number</label>
              <input
                value={settings.call_number}
                onChange={(e) => setSettings({ ...settings, call_number: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                placeholder="+965 XXXX XXXX"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-sm focus:border-mango/30 focus:outline-none"
                placeholder="hello@filipinofoodkuwait.com"
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

