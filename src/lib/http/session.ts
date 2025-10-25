// src/lib/http/session.ts
import { cookies } from 'next/headers';
import { supabaseAnon } from '@/lib/supabaseServer';

export async function bindSessionFromCookies() {
  const jar = await cookies();                          // <- await is required in Next 15+
  const access = jar.get('sb-access-token')?.value;
  const refresh = jar.get('sb-refresh-token')?.value;
  if (!access || !refresh) return null;

  await supabaseAnon.auth.setSession({
    access_token: access,
    refresh_token: refresh,
  });

  const { data, error } = await supabaseAnon.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;                                     // { id, ... }
}
