"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft, ShieldAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Panel from "@/components/ui/Panel";
import { authHelper } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [forceLocal, setForceLocal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setForceLocal(localStorage.getItem("nilai_force_local") === "true");
    }
  }, []);

  const handleForceLocalChange = (val) => {
    setForceLocal(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_force_local", val ? "true" : "false");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setErrorMsg("Mohon isi semua kolom input.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await authHelper.signUp(email.trim(), password);
      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke halaman masuk...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || "Gagal melakukan pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#e0e5ec] relative">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="secondary" className="px-4 py-2 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Halaman Utama
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 font-sans">
        <Panel variant="raised" className="border border-[#babecc]/80 shadow-floating p-8 bg-[#f0f2f5]" contentClassName="flex flex-col gap-6 w-full">
          {/* Header */}
          <div className="text-center border-b border-[#babecc]/40 pb-4">
            <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-white/60 shadow-card mx-auto mb-3 bevel-top">
              <GraduationCap className="w-7 h-7 text-[#3b82f6]" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#4a5568] uppercase block">
              REGISTRASI GURU
            </span>
            <h2 className="text-xl font-black text-[#2d3436] uppercase tracking-wide mt-1">
              Buat Akun Baru
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Alamat Email"
              type="email"
              placeholder="nama@sekolah.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              id="confirmPassword"
              label="Ulangi Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Offline Mode Checkbox */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2.5 select-none">
                <input
                  id="force-local-checkbox-reg"
                  type="checkbox"
                  checked={forceLocal}
                  onChange={(e) => handleForceLocalChange(e.target.checked)}
                  className="w-4 h-4 rounded border-[#babecc] text-[#3b82f6] focus:ring-[#3b82f6]/40 cursor-pointer"
                />
                <label 
                  htmlFor="force-local-checkbox-reg" 
                  className="text-xs font-semibold text-[#4a5568] cursor-pointer hover:text-[#2d3436]"
                >
                  Gunakan Mode Offline / Penyimpanan Lokal
                </label>
              </div>
              {forceLocal && (
                <div className="p-3 rounded-lg bg-[#e0e5ec]/50 border border-[#babecc]/40 text-[#4a5568] text-[10px] leading-relaxed">
                  ℹ️ <strong>Mode Offline Aktif</strong>: Pendaftaran akun baru disimpan langsung di browser Anda. Tidak membutuhkan database online Supabase. Cocok jika Anda terkendala verifikasi email atau limit Supabase.
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-red-100 border border-red-300 text-red-700 font-sans text-xs flex items-start gap-2.5 shadow-inner">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-lg bg-green-100 border border-green-300 text-green-700 font-sans text-xs flex items-start gap-2.5 shadow-inner animate-pulse">
                <div className="w-2 h-2 rounded-full led-green shrink-0 mt-1.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <Button type="submit" variant="accent" disabled={loading} className="w-full py-3 mt-2">
              {loading ? "Mendaftar..." : "Daftar Akun"}
            </Button>
          </form>

          {/* Link to Login */}
          <div className="text-center text-xs text-[#4a5568]">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="text-[#3b82f6] font-bold hover:underline">
              Masuk di sini
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}
