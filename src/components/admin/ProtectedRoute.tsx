import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-charcoal">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-mango border-t-transparent"></div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
