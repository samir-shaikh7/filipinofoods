import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 selection:bg-mango/30 text-foreground font-sans">
      <div className="relative w-full max-w-md">
        {/* Background Blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-mango/20 blur-[80px] animate-pulse" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-tropical/10 blur-[80px] animate-pulse" />

        <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-elegant md:p-12">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-tropical text-white text-2xl font-bold shadow-soft">
              F
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Portal</h1>
            <p className="mt-2 text-sm text-foreground/40">Secure access to Filipino Food Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/20 transition-colors group-focus-within:text-tropical" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-black/5 bg-black/5 py-4 pl-12 pr-4 text-sm transition-all focus:border-tropical/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-tropical/5 text-foreground"
                  placeholder="admin@filipino.ph"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/20 transition-colors group-focus-within:text-tropical" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-black/5 bg-black/5 py-4 pl-12 pr-4 text-sm transition-all focus:border-tropical/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-tropical/5 text-foreground"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 p-4 text-center text-xs font-medium text-red-500 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl gradient-tropical py-4 text-sm font-bold text-white shadow-glow transition-all hover:scale-[1.02] hover:shadow-glow/50 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Login to System
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/20">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
