import { supabase, isSupabaseConfigured } from "./supabase";

export const authHelper = {
  async signUp(email, password) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      // Also write to local storage as a robust fallback
      if (data.user && typeof window !== "undefined") {
        const sessionUser = { id: data.user.id, email: data.user.email };
        localStorage.setItem("nilai_session", JSON.stringify(sessionUser));
      }
      return data.user;
    } else {
      const users = JSON.parse(localStorage.getItem("nilai_users") || "[]");
      if (users.find((u) => u.email === email)) {
        throw new Error("Email sudah terdaftar.");
      }
      const newUser = { id: "user_" + Math.random().toString(36).substr(2, 9), email };
      users.push({ ...newUser, password });
      localStorage.setItem("nilai_users", JSON.stringify(users));
      return newUser;
    }
  },

  async signIn(email, password) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Write to local storage as a robust fallback
      if (data.user && typeof window !== "undefined") {
        const sessionUser = { id: data.user.id, email: data.user.email };
        localStorage.setItem("nilai_session", JSON.stringify(sessionUser));
      }
      return data.user;
    } else {
      const users = JSON.parse(localStorage.getItem("nilai_users") || "[]");
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) {
        throw new Error("Email atau password salah.");
      }
      const sessionUser = { id: user.id, email: user.email };
      localStorage.setItem("nilai_session", JSON.stringify(sessionUser));
      return sessionUser;
    }
  },

  async signOut() {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error("Supabase signOut error:", e);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("nilai_session");
    }
  },

  async getSessionUser() {
    // 1. Try Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          // Keep localStorage sync'd
          const sessionUser = { id: session.user.id, email: session.user.email };
          if (typeof window !== "undefined") {
            localStorage.setItem("nilai_session", JSON.stringify(sessionUser));
          }
          return session.user;
        }
      } catch (e) {
        console.error("Supabase getSession error:", e);
      }
    }
    
    // 2. Fallback to LocalStorage session
    if (typeof window !== "undefined") {
      const sessionStr = localStorage.getItem("nilai_session");
      return sessionStr ? JSON.parse(sessionStr) : null;
    }
    return null;
  }
};

