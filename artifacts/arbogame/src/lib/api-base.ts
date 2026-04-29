import { createClient } from '@supabase/supabase-js';

export const API_BASE = `${import.meta.env.BASE_URL}api`;

// Supabase client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pbhzmtdebffxybflyuqp.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function objectUrl(objectPath: string | null | undefined): string | undefined {
  if (!objectPath) return undefined;
  if (objectPath.startsWith("http")) return objectPath;
  return `${API_BASE}/storage${objectPath}`;
}
