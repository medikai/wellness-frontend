// src/lib/auth/loginWithEmail.ts
import { supabaseAnon } from "@/lib/supabaseServer";

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session) {
    throw new Error(error?.message ?? 'Invalid credentials');
  }

  // Bind session for RPCs in this request lifecycle
  supabaseAnon.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token
  });

  const { data: profile, error: profileErr } =
    await supabaseAnon.rpc('get_profile');

  if (profileErr) {
    throw new Error(profileErr.message);
  }

  return {
    session: data.session,
    profile
  };
}
