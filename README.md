# SMAUMU (SMAN UntukMu)
**Portal Transparansi Penerimaan Siswa Baru SMAN Berbasis Real-Time Data & Civic Accountability**  
*Kompetisi Web In Action (WIA) MIA 2026*  
*Tema: Designing Digital Futures – Powering Public Transparency*

---

## Judul & Deskripsi
**SMAUMU (SMAN UntukMu)** adalah portal transparansi penerimaan siswa baru SMAN berbasis pengolahan data real-time, komparasi validitas, dan pelacakan publik. Aplikasi ini dirancang untuk menyelesaikan sengketa daya tampung sekolah dan praktik manipulasi zonasi dengan mengintegrasikan empat subtema utama:
1. **Open Government Data**: Dashboard *Live Quota Burn-Rate* yang memvisualisasikan ketersediaan kursi serta laju pengisian pendaftar per jam secara transparan.
2. **Public Service Tracking**: Alur pendaftaran terpadu dengan formulir multi-langkah (*Pilih Jalur, Isi Formulir, Pantau Status, Terima Hasil*) dengan penerbitan nomor tiket berenkripsi dan tanda terima digital ber-QR hash.
3. **Civic Reporting & Accountability**: Fitur *Civic Whistleblower* anonim untuk melaporkan praktik kecurangan (numpang KK, manipulasi jarak, pemalsuan sertifikat) yang terhubung langsung ke sistem verifikasi dinas, serta *Immutable Audit Log* berbasis cryptographic hash chain (SHA-256 Merkle chain).
4. **Data-Driven Decision Support**: *Dual-Truth Comparator* untuk menyandingkan data klaim pendaftar vs basis data resmi Dukcapil/Dapodik, *Geo-Discrepancy Detector* berbasis formula Haversine, *Passing-Grade Simulator*, serta *Interactive Zonasi Heatmap* dengan *Blank-Spot Advisor*.

---

## Teknologi Utama
- **Frontend & Static Host**: Next.js 14, React 18, Tailwind CSS untuk antarmuka modern responsif di seluruh perangkat (Mobile, Tablet, Desktop), siap di-deploy ke **GitHub Pages** (Static HTML Export `output: 'export'`).
- **Backend & Cloud Database**: **Supabase** (PostgreSQL 15+, Supabase Auth, Row Level Security / RLS, Realtime Subscriptions).
- **Icons & Visuals**: Lucide React, Google Web Fonts (*Plus Jakarta Sans* & *JetBrains Mono*).
- **Palet Warna "Modern Civic & Youth"**: Biru Navy Formal (`#1E3A8A`), Royal Blue Modern (`#2563EB`), Putih/Abu Terang (`#F8FAFC` & `#FFFFFF`), Aksen Pink/Magenta Dinamis (`#EC4899`), Slate (`#64748B`), dan Emerald (`#10B981`).
- **Geospasial & Algoritma**: Spatial Haversine Distance Engine, GIS Geodesic Discrepancy Detector, Probabilistic Acceptance Calculator.
- **Keamanan & Kriptografi**: SHA-256 Tamper-Evident Merkle Hash Chain, Tokenized Anonymous Whistleblower Tracking, AES-style ticket codes.
- **Automated CI/CD**: GitHub Actions workflow (`.github/workflows/deploy.yml`) untuk build dan deploy otomatis ke GitHub Pages.

---

## Sistem Autentikasi & Hak Akses
1. **Pendaftaran Akun Masyarakat / Calon Siswa (`/register`)**:
   - Terbuka untuk umum bagi calon siswa dan wali murid.
   - Mengumpulkan seluruh parameter yang dibutuhkan oleh seluruh modul portal:
     - **Akun & Kontak**: Nama lengkap siswa, email, kata sandi, no. telepon/WA, nama orang tua/wali.
     - **Kependudukan & Asal Sekolah**: NIK (16 digit), NISN (10 digit), SMP asal.
     - **Domisili & Geospasial**: Alamat domisili lengkap, lama tinggal di KK (bulan), koordinat GPS Lintang/Bujur (dengan tombol deteksi GPS real-time & preset lokasi).
     - **Akademik & Prestasi**: Rata-rata nilai rapor semester 1–5, sertifikat/piagam prestasi.
     - **Pilihan Sekolah**: Jalur seleksi (Zonasi, Afirmasi, Prestasi, Mutasi) serta pilihan SMAN 1 dan SMAN Cadangan.
   - Langsung menerbitkan **Nomor Tiket Resmi** dan menyimpan profil akun ke database Supabase (atau demo storage).
2. **Ketiadaan Registrasi Admin (Kebijakan Keamanan Ketat)**:
   - Sesuai prinsip *Zero-Trust Governance*, **tidak ada menu pendaftaran admin untuk publik**.
   - Hak akses petugas instansi (`admin_instansi`, `verifikator_zonasi`, `auditor_publik`) diterbitkan eksklusif oleh Dinas Pendidikan melalui file SQL database resmi (`supabase_schema.sql`).
3. **Kredensial Petugas Resmi Instansi (Demo Juri)**:
   - **Admin Instansi**: `admin.disdik@smaumu.go.id` / `admin12345`
   - **Verifikator Zonasi**: `verifikator.zonasi@smaumu.go.id` / `verif12345`
   - **Auditor Ombudsman**: `auditor.bebas@ombudsman.go.id` / `audit12345`

---

## Cara Menjalankan Secara Lokal

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/organisasi-tim/project-wia.git
   cd project-wia
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment (`.env`)**:
   Salin file template `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   # Pada Windows:
   copy .env.example .env
   ```
   *(Opsional)* Masukkan URL dan Anon Key proyek Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   *Catatan: Jika kunci Supabase tidak diisi, aplikasi otomatis berjalan dalam mode fallback offline/demo storage sehingga seluruh fitur tetap dapat diuji tanpa hambatan.*

4. **Jalankan Server Lokal**:
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

5. **Uji Static Export untuk GitHub Pages**:
   ```bash
   npm run build
   ```
   File hasil build HTML statis akan tercipta di folder `out/`.

---

## Panduan Pemasangan: GitHub Pages (Frontend) & Supabase (Backend)

### A. Konfigurasi Backend di Supabase
1. Buka [Supabase Dashboard](https://supabase.com) dan buat proyek baru (*New Project*).
2. Buka menu **SQL Editor**, salin seluruh isi file [`supabase_schema.sql`](supabase_schema.sql), lalu klik tombol **Run**.
3. Script akan otomatis membangun:
   - Seluruh tabel relasional (`pengguna`, `sekolah`, `kuota_sekolah`, `pendaftaran`, `laporan_warga`, `audit_log`).
   - Aturan keamanan Row Level Security (RLS).
   - Data awal master 4 SMAN Jakarta Pusat, alokasi kuota per jalur, dan akun petugas dinas resmi.
4. Buka menu **Project Settings** > **API**, salin **Project URL** dan **Project API Keys (anon public)**.

### B. Konfigurasi Frontend di GitHub Pages
1. Push repositori ini ke GitHub:
   ```bash
   git add .
   git commit -m "feat: setup SMAUMU frontend for GitHub Pages and Supabase backend"
   git push origin main
   ```
2. Di repositori GitHub Anda:
   - Masuk ke **Settings** > **Secrets and variables** > **Actions**.
   - Tambahkan Secret:
     - `NEXT_PUBLIC_SUPABASE_URL`: URL proyek Supabase Anda.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Kunci anonim Supabase Anda.
3. Buka **Settings** > **Pages**:
   - Di bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
4. GitHub Actions workflow (`.github/workflows/deploy.yml`) akan otomatis menjalankan build dan menerbitkan website ke GitHub Pages (`https://<username>.github.io/<repo-name>/`).

---

## Progres Saat Ini
- [x] **Halaman Beranda Interaktif (`/`)**: Hero banner modern civic, ringkasan transparansi kuota, alur 4 langkah, dan pelacak tiket cepat.
- [x] **Halaman Registrasi User Lengkap (`/register`)**: Pendaftaran akun masyarakat dengan seluruh input kependudukan, geospasial, akademik, dan preferensi SMAN (tanpa opsi registrasi admin).
- [x] **Halaman Login Pengguna (`/login`) & Login Petugas (`/admin/login`)**: Autentikasi peran terpisah dengan pengamanan level institusi.
- [x] **Dual-Truth Comparator (`/komparator`)**: Komparasi data pendaftar vs catatan resmi Dukcapil dan Geo-Discrepancy Spatial Engine.
- [x] **Live Quota Burn-Rate & Heatmap (`/kuota`)**: Monitoring kuota real-time, grafik keterisian, dan Blank-Spot Advisor.
- [x] **Passing-Grade Simulator (`/simulator`)**: Simulasi probabilitas kelulusan berbasis data nilai rapor dan piagam.
- [x] **Sistem Formulir Terpadu (`/daftar`)**: Pendaftaran 4 tahap otomatis terhubung dengan profil akun.
- [x] **Cek Status Tiket (`/lacak`)**: Pelacakan riwayat dan status tahapan verifikasi transparan.
- [x] **Civic Whistleblower (`/whistleblower`)**: Pengaduan kecurangan anonim dengan Token Investigasi kriptografis.
- [x] **Immutable Public Audit Log (`/audit-log`)**: Log publik rantai SHA-256 dengan tombol verifikasi integritas live.
- [x] **Dashboard Internal Admin Instansi (`/admin/*`)**: Kelola permohonan, verifikasi anomali zonasi, data master kuota, export data laporan (CSV/JSON), dan konfigurasi regulasi.
- [x] **Halaman Informasi Umum**: Tentang Aplikasi, Kebijakan Privasi, Syarat & Ketentuan, Profil Sekolah, dan Pusat Bantuan.
- [x] **Kompatibilitas Penuh**: Static Export GitHub Pages (`output: 'export'`) & Backend Supabase PostgreSQL.

---

## Lisensi & Hak Cipta
Dikembangkan untuk kompetisi **Web In Action (WIA) MIA 2026** di bawah lisensi terbuka demi transparansi pelayanan publik Indonesia.
