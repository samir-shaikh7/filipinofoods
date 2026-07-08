import { supabase } from "./supabase";

/**
 * Basic authentication foundation for the Admin Panel.
 * This handles logging out using Supabase Auth.
 * Note: loginAdmin and getAdminSession were removed as they are unused —
 * AdminLogin.tsx uses supabase.auth.signInWithPassword directly,
 * and ProtectedRoute.tsx uses supabase.auth.getSession directly.
 */

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
