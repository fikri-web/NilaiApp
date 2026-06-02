# 🎓 NilaiApp (e-Poin)
> **Sistem Administrasi Penilaian & Rekapitulasi Nilai Otomatis Terintegrasi untuk Pendidik Indonesia.**

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/Library-React%2019-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%204-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tesseract.js](https://img.shields.io/badge/OCR-Tesseract.js-5c2d91?style=for-the-badge&logo=javascript)](https://github.com/naptha/tesseract.js)

NilaiApp dirancang untuk membantu para guru dan tenaga pendidik melakukan rekapitulasi nilai, menghitung rata-rata, menjumlahkan nilai, menentukan ranking kelas, hingga mencetak rekap nilai langsung ke spreadsheet Excel secara instan dengan desain UI premium berbasis **Soft Neumorphism (Glassmorphism)**.

---

## ✨ Fitur Utama

### 1. 🗂️ 5 Pilihan Template Dinamis
Pilih struktur kolom tabel penilaian yang sesuai dengan kebutuhan pengisian administrasi kelas Anda:
* **Template Sederhana (Simple)**: Menampilkan kolom `No`, `Nama`, dan `Mata Pelajaran` (dengan sub-kolom penilaian `1`, `2`, `3`). Tanpa kolom rata-rata, jumlah, atau ranking. Siswa diurutkan berdasarkan urutan pembuatan data agar tetap di posisinya saat guru mengisi nilai.
* **Template Mapel (Dinamis)**: Menyediakan penilaian per-mata pelajaran dengan sub-kolom `1`, `2`, `3`, lengkap dengan kolom `Rata-rata`, `Jumlah`, dan `Ranking` yang terhitung otomatis. Siswa diurutkan berdasarkan nilai rata-rata tertinggi.
* **Template Rapor (Lengkap)**: Format rekap nilai lengkap mencakup 4 Nilai Harian (H1-H4), Rata-Rata Harian (RT), Ujian (UTS & UAS), Rata-Rata Ujian, Nilai Rapor Akhir (NR), serta deskripsi pencapaian otomatis beserta indikator Remedial (jika di bawah KKM).
* **Template Katalog (Leger)**: Rekap multi-mata pelajaran (Katalog/Leger lengkap). Anda bisa menambah atau menghapus mata pelajaran (misal: B. Arab, Akidah Akhlak, Fiqih) secara horizontal ke kanan. Di bawah setiap mata pelajaran tersedia 3 kolom nilai bertingkat (`1`, `2`, `3`). Dilengkapi rekap total rata-rata seluruh mapel, jumlah total, dan ranking kelas.
* **Template Kustom**: Buat sendiri kolom penilaian kustom Anda secara dinamis tanpa batas kolom.

### 2. 📸 Scan Nilai Otomatis (OCR)
Pindahkan nilai dari lembar kertas catatan manual atau buku nilai Anda ke dalam database secara otomatis:
* Mendukung deteksi gambar/foto buku nilai menggunakan mesin OCR **Tesseract.js**.
* Rapi terurai secara otomatis menjadi baris data nama siswa dan kolom-kolom nilai.
* Pratinjau tabel interaktif yang dapat diedit langsung sebelum disimpan ke database.
* Panduan format scan disediakan secara dinamis untuk masing-masing template yang dipilih.

### 3. 📊 Ekspor Excel Sekali Klik
Unduh seluruh rekap nilai siswa Anda menjadi berkas spreadsheet Excel (`.xlsx`) berkualitas tinggi:
* Menggunakan pustaka `xlsx-js-style` untuk menghasilkan layout tabel Excel profesional dengan warna tema yang harmonis, outline border rapi, text alignment yang tepat, serta cell merging bertingkat (untuk template Mapel & Katalog Leger).

### 4. 📴 Mode Offline & Penyimpanan Lokal
* NilaiApp dapat digunakan penuh baik secara online menggunakan backend **Supabase** atau secara offline lewat penyimpanan **LocalStorage** browser Anda. Akun lokal akan dibuat dan disimpan langsung di komputer Anda tanpa memerlukan database internet.

---

## 🛠️ Tech Stack & Dependencies

* **Frontend Framework**: Next.js v15 (App Router) & React v19
* **Styling**: Tailwind CSS v4 & Custom Soft Neumorphism CSS variables
* **Database & Auth**: Supabase JS Client (dengan opsi fallback LocalStorage otomatis)
* **OCR engine**: Tesseract.js
* **Spreadsheet processor**: xlsx (SheetJS) & xlsx-js-style (untuk cell styling)
* **Icons & Animations**: Lucide React & Framer Motion

---

## 🚀 Panduan Instalasi & Pengembangan

### 1. Kloning Repositori
```bash
git clone https://github.com/username/e-poin.git
cd e-poin
```

### 2. Instalasi Dependensi
Gunakan Node Package Manager (npm) untuk mengunduh modul dependensi:
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Environment Variables)
Salin berkas konfigurasi env lokal:
```bash
cp .env.local.example .env.local
```
Isi konfigurasi kunci Supabase Anda jika ingin mengaktifkan sinkronisasi database online:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(Catatan: Jika konfigurasi Supabase dikosongkan, NilaiApp akan otomatis aktif menggunakan penyimpanan aman di browser local secara offline).*

### 4. Menjalankan Server Lokal
Jalankan server pengembangan lokal:
```bash
npm run dev
```
Aplikasi Anda akan siap diakses pada URL [http://localhost:3000](http://localhost:3000).

### 5. Kompilasi Produksi (Production Build)
Untuk membangun bundel aplikasi produksi yang teroptimasi:
```bash
npm run build
npm run start
```

---

## 📂 Struktur Folder Proyek

```text
e-poin/
├── public/                 # Aset publik (gambar, favicon, logo)
├── src/
│   ├── app/                # Next.js App Router Pages
│   │   ├── app/            # Dashboard & Manajemen Nilai (/app)
│   │   │   ├── scan/       # Fitur Scan Buku Catatan Nilai (OCR)
│   │   │   └── page.jsx    # Halaman Utama Dashboard NilaiApp
│   │   ├── login/          # Autentikasi Pengguna (Masuk)
│   │   ├── register/       # Registrasi Akun Guru Baru
│   │   ├── layout.js       # Layout Global aplikasi
│   │   └── page.js         # Landing Page NilaiApp
│   ├── components/         # Komponen UI Reusable (Button, Card, Input, Panel)
│   └── lib/                # Konfigurasi Helper / Services
│       ├── auth.js         # Logika Autentikasi Supabase & Local fallback
│       ├── grades.js       # CRUD Data Nilai Supabase & Local fallback
│       └── supabase.js     # Inisialisasi Koneksi Supabase Client
├── tailwind.config.js      # Konfigurasi Tailwind CSS
├── package.json            # Daftar script & Dependensi npm
└── README.md               # Dokumentasi Proyek
```

---

## 🧑‍💻 Penulis & Lisensi

Dibuat dengan 💙 untuk membantu kemudahan administrasi para Guru dan Pendidik di seluruh Indonesia.

* **Lisensi**: MIT License
