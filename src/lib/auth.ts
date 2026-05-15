import { supabase } from "./supabase";

/**
 * Basic authentication foundation for the Admin Panel.
 * This handles logging in and out using Supabase Auth.
 */
export async function loginAdmin(email: string) {
  // We'll use Magic Link for simplicity, but password-based can be added later
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + "/admin",
    },
  });
  return { error };
}

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getAdminSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}
