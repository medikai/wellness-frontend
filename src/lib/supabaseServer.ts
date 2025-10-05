// src/lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.PUBLIC_SUPABASE_URL!;
const anon = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.PRIVATE_SUPABASE_SERVICE_ROLE!;

// Admin client. Use ONLY on the server.
export const supabaseAdmin = createClient(url, service, {
  auth: { persistSession: false }
});

// Anonymous server client. We will attach a user session to it per-request when needed.
export const supabaseAnon = createClient(url, anon, {
  auth: { persistSession: false }
});
