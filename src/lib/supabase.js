import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key-123456";

// Singleton Supabase Client to prevent Multiple GoTrueClient warnings
let supabase;

if (typeof window === "undefined") {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  if (!window.supabaseInstance) {
    window.supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  supabase = window.supabaseInstance;
}

export { supabase };

export const isSupabaseConfigured = () => {
  if (typeof window !== "undefined") {
    const forceLocal = localStorage.getItem("nilai_force_local") === "true";
    if (forceLocal) return false;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) return false;
  
  // Check if credentials are placeholders or mock values
  if (
    url.includes("mock-project") ||
    url.includes("masukkan-project-url-anda") ||
    url.includes("placeholder-url") ||
    key.includes("mock-anon-key") ||
    key.includes("masukkan-anon-public-key") ||
    key.includes("placeholder-anon-key")
  ) {
    return false;
  }
  
  return true;
};

