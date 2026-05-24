"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft, ShieldAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Panel from "@/components/ui/Panel";
import { authHelper } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Mohon isi semua kolom input.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      await authHelper.signIn(email.trim(), password);
      setSuccessMsg("Masuk berhasil! Mengalihkan...");
      setTimeout(() => {
        router.push("/app");
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Gagal masuk. Periksa kembali email & password Anda.");
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
              PORTAL GURU
            </span>
            <h2 className="text-xl font-black text-[#2d3436] uppercase tracking-wide mt-1">
              Masuk ke NilaiApp
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
              {loading ? "Menghubungkan..." : "Masuk"}
            </Button>
          </form>

          {/* Link to Register */}
          <div className="text-center text-xs text-[#4a5568]">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#3b82f6] font-bold hover:underline">
              Daftar di sini
            </Link>
          </div>


        </Panel>
      </div>
    </div>
  );
}
