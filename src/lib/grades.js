import { supabase, isSupabaseConfigured } from "./supabase";

export const gradesHelper = {
  async getGrades(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("nilai")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const allGrades = JSON.parse(localStorage.getItem("nilai_grades") || "[]");
      return allGrades.filter((g) => g.user_id === userId);
    }
  },

  async addGrade(userId, grade) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("nilai")
        .insert([{ ...grade, user_id: userId }])
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const allGrades = JSON.parse(localStorage.getItem("nilai_grades") || "[]");
      const newGrade = {
        id: "grade_" + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        ...grade,
        created_at: new Date().toISOString()
      };
      allGrades.unshift(newGrade);
      localStorage.setItem("nilai_grades", JSON.stringify(allGrades));
      return newGrade;
    }
  },

  async deleteGrade(userId, gradeId) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("nilai")
        .delete()
        .eq("id", gradeId)
        .eq("user_id", userId);
      if (error) throw error;
      return true;
    } else {
      let allGrades = JSON.parse(localStorage.getItem("nilai_grades") || "[]");
      allGrades = allGrades.filter((g) => !(g.id === gradeId && g.user_id === userId));
      localStorage.setItem("nilai_grades", JSON.stringify(allGrades));
      return true;
    }
  },

  async clearGrades(userId) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("nilai")
        .delete()
        .eq("user_id", userId);
      if (error) throw error;
      return true;
    } else {
      let allGrades = JSON.parse(localStorage.getItem("nilai_grades") || "[]");
      allGrades = allGrades.filter((g) => g.user_id !== userId);
      localStorage.setItem("nilai_grades", JSON.stringify(allGrades));
      return true;
    }
  },

  async updateGrade(userId, gradeId, updatedFields) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("nilai")
        .update(updatedFields)
        .eq("id", gradeId)
        .eq("user_id", userId)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const allGrades = JSON.parse(localStorage.getItem("nilai_grades") || "[]");
      const idx = allGrades.findIndex((g) => g.id === gradeId && g.user_id === userId);
      if (idx !== -1) {
        allGrades[idx] = { ...allGrades[idx], ...updatedFields };
        localStorage.setItem("nilai_grades", JSON.stringify(allGrades));
        return allGrades[idx];
      }
      throw new Error("Data tidak ditemukan");
    }
  }
};

