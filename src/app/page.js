"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  FileSpreadsheet, 
  ScanLine, 
  CheckSquare, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Panel from "@/components/ui/Panel";
import { authHelper } from "@/lib/auth";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authHelper.getSessionUser().then((user) => {
      if (user) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#e0e5ec]">
      {/* Navigation Header */}
      <header className="w-full px-6 py-4 border-b border-[#babecc]/40 bg-[#f0f2f5]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="NilaiApp Home">
            <div className="w-10 h-10 rounded-xl bg-[#f0f2f5] flex items-center justify-center border border-white/60 shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] bevel-top">
              <GraduationCap className="w-6 h-6 text-[#3b82f6]" aria-hidden="true" />
            </div>
            <span className="font-sans font-extrabold text-xl tracking-wide text-[#2d3436] uppercase">
              Nilai<span className="text-[#3b82f6]">App</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-4" aria-label="Navigasi Utama">
            {isLoggedIn ? (
              <Link href="/app">
                <Button variant="accent" className="px-5 py-2">
                  Buka Aplikasi
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" className="px-4 py-2">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="accent" className="px-5 py-2">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 md:py-24 flex flex-col items-center">
        
        {/* Main Hero Card - H1 Hanya 1x di sini */}
        <Panel className="w-full max-w-4xl border border-[#babecc]/80 shadow-floating mb-16 p-8 md:p-12 text-center" variant="raised">
          <article className="max-w-2xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] font-sans text-xs font-bold uppercase tracking-wider">
              <CheckSquare className="w-4 h-4" aria-hidden="true" />
              Sistem Penilaian Siswa Simpel & Cepat
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-[#2d3436] uppercase tracking-tight leading-tight">
              Kelola Nilai Siswa <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]">
                Tanpa Ribet
              </span>
            </h1>
            
            <p className="text-[#4a5568] text-base md:text-lg leading-relaxed max-w-lg mx-auto">
              NilaiApp membantu guru memasukkan nilai siswa secara digital, menghitung rata-rata & ranking otomatis, melakukan scan nilai catatan kertas (OCR), hingga mengekspor data ke file Excel.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href={isLoggedIn ? "/app" : "/login"}>
                <Button variant="accent" className="gap-2 text-md px-6 py-3.5">
                  Mulai Input Nilai
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </article>
        </Panel>

        {/* Feature Cards Grid - Menggunakan H2 */}
        <section className="w-full text-center mb-10" aria-labelledby="fitur-utama">
          <span className="text-xs font-black tracking-widest text-[#4a5568] uppercase">KEMUDAHAN UNTUK GURU</span>
          <h2 id="fitur-utama" className="text-2xl md:text-3xl font-black uppercase text-[#2d3436] mt-1">FITUR UTAMA NILAIAPP</h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Feature 1 */}
          <Card liftOnHover={true} className="flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#f0f2f5] flex items-center justify-center shadow-card border border-white/60 bevel-top">
              <CheckSquare className="w-6 h-6 text-[#3b82f6]" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-lg uppercase tracking-wide text-[#2d3436]">Template Dinamis</h3>
            <p className="text-sm text-[#4a5568] leading-relaxed">
              Pilih template nilai siap pakai: dari template sederhana (Nama & Nilai) hingga template standar sekolah (Tugas, UTS, UAS, Rata-rata, & Ranking otomatis).
            </p>
          </Card>

          {/* Feature 2 */}
          <Card liftOnHover={true} className="flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#f0f2f5] flex items-center justify-center shadow-card border border-white/60 bevel-top">
              <ScanLine className="w-6 h-6 text-[#3b82f6]" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-lg uppercase tracking-wide text-[#2d3436]">Scan Nilai (OCR)</h3>
            <p className="text-sm text-[#4a5568] leading-relaxed">
              Foto catatan nilai tulisan tangan Anda, dan sistem akan membaca tulisan tersebut lalu mengubahnya langsung menjadi tabel data digital.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card liftOnHover={true} className="flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#f0f2f5] flex items-center justify-center shadow-card border border-white/60 bevel-top">
              <FileSpreadsheet className="w-6 h-6 text-[#3b82f6]" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-lg uppercase tracking-wide text-[#2d3436]">Ekspor ke Excel</h3>
            <p className="text-sm text-[#4a5568] leading-relaxed">
              Unduh seluruh rekap nilai siswa Anda menjadi file spreadsheet Excel (<code>.xlsx</code>) hanya dengan satu kali klik.
            </p>
          </Card>
        </div>

        {/* Dynamic Ranking Preview Banner */}
        <Panel className="w-full max-w-5xl mt-16 p-6 bg-[#f0f2f5]" contentClassName="flex flex-col md:flex-row items-center justify-between gap-4 w-full" variant="sunken">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#3b82f6]" aria-hidden="true" />
            <span className="text-sm font-semibold text-[#4a5568] uppercase tracking-wide">
              Menghitung Rata-Rata & Menentukan Peringkat Kelas Secara Otomatis
            </span>
          </div>
          <div className="flex gap-2" aria-label="Kolom nilai yang dihitung otomatis">
            <span className="px-2.5 py-1 rounded bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-mono font-bold">UTS</span>
            <span className="px-2.5 py-1 rounded bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-mono font-bold">UAS</span>
            <span className="px-2.5 py-1 rounded bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-mono font-bold">RATA-RATA</span>
            <span className="px-2.5 py-1 rounded bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-mono font-bold">RANK</span>
          </div>
        </Panel>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-[#babecc]/40 bg-[#f0f2f5] mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#4a5568] font-medium">
          <span itemScope itemType="https://schema.org/Organization">
            <span itemProp="name">NilaiApp</span> © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}