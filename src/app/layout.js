import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Metadata untuk SEO (Tanpa tipe : Metadata karena ini .js bukan .tsx)
export const metadata = {
  title: "NilaiApp - Sistem Penilaian Siswa Digital, Simpel & Cepat",
  description: "Kelola nilai siswa tanpa ribet! Input nilai digital, scan nilai tulisan tangan (OCR), hitung rata-rata & ranking otomatis, lalu ekspor ke Excel. Gratis untuk guru Indonesia.",
  keywords: ["penilaian siswa", "input nilai online", "scan nilai ocr", "excel nilai siswa", "ranking kelas otomatis", "aplikasi guru", "e-rapor simpel"],
  openGraph: {
    title: "NilaiApp - Kelola Nilai Siswa Tanpa Ribet",
    description: "Platform digital untuk guru memasukkan nilai, scan OCR, dan ekspor ke Excel secara otomatis.",
    url: "https://nilaiapp.com", // Ganti dengan domain Anda
    siteName: "NilaiApp",
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id" // DIUBAH ke "id" agar Google tahu ini website bahasa Indonesia
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-text relative" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}