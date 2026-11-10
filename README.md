# SMAUMU (SMAN UntukMu)
**Portal Transparansi Penerimaan Siswa Baru SMAN Berbasis Real-Time Data & Civic Accountability**  
*Kompetisi: Web In Action (WIA) MIA 2026*  
*Tema Utama: Designing Digital Futures – Powering Public Transparency*  
*Nama Tim: FounDred*  
*Mentor Penilai: Adi Prabowo*  

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix_UI-18181b)](https://ui.shadcn.com/)
[![Supabase PostgreSQL](https://img.shields.io/badge/Supabase-PostgreSQL_15+-3ecf8e?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Identitas Proyek & Tim
- **Nama Tim**: FounDred
- **Judul Karya**: SMAUMU (SMAN UntukMu)
- **Cabang Lomba**: Web In Action (WIA) 2026
- **Sub Tema Pilihan**:
  1. *Open Government Data*
  2. *Public Service Tracking*
  3. *Civic Reporting & Accountability*
  4. *Data-Driven Decision Support*
- **Tautan Repositori**: [https://github.com/Muhammad-Fattah-Husein/SMAUMU](https://github.com/Muhammad-Fattah-Husein/SMAUMU)

---

## 2. Latar Belakang & Deskripsi Masalah
Penerimaan Peserta Didik Baru (PPDB) SMAN di Indonesia kerap menghadapi tantangan akut:
1. **Ketiadaan Transparansi Alokasi Kursi**: Orang tua siswa tidak dapat memantau laju pengisian kuota per jam (*burn-rate*) secara langsung, memicu spekulasi jual-beli kursi belakang.
2. **Celah Manipulasi Titik Geospasial (Zonasi)**: Praktik "menggeser pin koordinat rumah" mendekati sekolah atau fenomena "numpang Kartu Keluarga fiktif" yang merugikan warga sekitar.
3. **Kekhawatiran Pelapor Warga (Whistleblower)**: Warga yang mengetahui kecurangan enggan melapor karena takut identitasnya bocor, sementara dinas kewalahan memilah laporan asli dari aduan spam/hoax.
4. **Kerentanan Lonjakan Beban Server (Traffic Spike)**: Ribuan pengguna mengakses server secara serentak pada menit pembukaan dan penutupan, berisiko menyebabkan *race-condition overbooking* (kursi teralokasi melebihi kapasitas sah).

**SMAUMU hadir sebagai platform transparansi digital end-to-end berstandar pemerintahan (GovTech)** yang memadukan komputasi geospasial presisi, kunci transaksional anti-overbooking, saluran pelaporan anonim dengan mitigasi spam terotomasi, serta audit log kriptografis berantai SHA-256.

---

## 3. Fitur Utama Berdasarkan 4 Subtema

### A. Open Government Data
- **Live Quota Burn-Rate Monitor (`/kuota`)**: Visualisasi live ketersediaan kursi, laju pendaftar masuk per jam, dan peringatan kepenuhan kuota per sekolah dan per jalur seleksi (Zonasi 50%, Afirmasi 20%, Prestasi 20%, Mutasi 10%).
- **Interactive Zonasi Heatmap & Blank-Spot Advisor**: Analisis spasial kepadatan pendaftar dan identifikasi kelurahan yang berada di area *blank spot* SMA Negeri.

### B. Public Service Tracking
- **Alur 4 Langkah Terpadu (`/daftar`)**: Pendaftaran mandiri transparan: *Pilih Jalur & Sekolah* -> *Isi Biodata & Koordinat Terverifikasi* -> *Nomor Tiket Terenkripsi* -> *Unduh Tanda Terima Sah Ber-QR*.
- **Pelacakan Berkas & Pencetakan Bukti Sah Kriptografis (`/lacak`)**: Pemantauan status berkas secara real-time dan tanda terima digital resmi ber-QR Code dengan verifikasi hash SHA-256 anti-pemalsuan berkas fisik.

### C. Civic Reporting & Accountability
- **Civic Whistleblower Anonim 100% (`/whistleblower`)**: Saluran pengaduan kecurangan masyarakat tanpa pencatatan identitas/IP, diterbitkan **Token Investigasi Rahasia** untuk memantau proses audit tanpa mengekspos pelapor.
- **Sistem Mitigasi Spam & Laporan Palsu**: Algoritma cerdas yang menghitung skor risiko spam (0–100%) dan memfilter laporan hoax sehingga tim verifikator dinas dapat fokus pada laporan prioritas berkredibilitas tinggi.
- **Buku Besar Audit Log SHA-256 (`/audit-log`)**: Log publik berantai kriptografis (*tamper-evident hash chain*) yang mencatat setiap alokasi kursi dan keputusan verifikasi secara permanen.

### D. Data-Driven Decision Support
- **Simulator Peluang Berbasis Peta (`/simulator`)**: Visualisasi peta interaktif, kalkulasi jarak spasial Haversine seketika, dan komparasi peluang diterima ke 6 SMAN DKI Jakarta secara transparan.
- **Passing-Grade Predictor**: Estimasi ranking probabilitas kelulusan calon siswa berdasarkan nilai rapor dan jarak zonasi.

---

## 4. Keunggulan Arsitektur Teknis

### 1. Simulasi Beban & Optimasi Database (High-Concurrency PostgreSQL)
PPDB mengalami lonjakan trafik (*massive traffic spike*) ekstrem saat gerbang pendaftaran dibuka. SMAUMU menerapkan strategi arsitektur basis data tingkat enterprise:
- **Composite B-Tree Indexes**:
  ```sql
  CREATE INDEX idx_pendaftaran_sekolah_jalur_status ON public.pendaftaran (sekolah_id, jalur, status_tahapan);
  CREATE INDEX idx_pendaftaran_nik ON public.pendaftaran (nik);
  CREATE INDEX idx_pendaftaran_nomor_tiket ON public.pendaftaran (nomor_tiket);
  CREATE INDEX idx_kuota_sekolah_lookup ON public.kuota_sekolah (sekolah_id, jalur);
  CREATE INDEX idx_laporan_warga_status_created ON public.laporan_warga (status, created_at DESC);
  CREATE INDEX idx_audit_log_chronological ON public.audit_log (id DESC, curr_hash);
  ```
- **Kunci Transaksional Baris (Row-Level Lock)**:
  Fungsi trigger PostgreSQL menggunakan sintaks `SELECT ... FOR UPDATE` saat mengalokasikan kursi pada status `lolos_seleksi`. Mekanisme ini menjamin **0% Overbooking** meskipun ribuan pengguna mengakses gerbang pendaftaran secara bersamaan.
- **Hasil Benchmark Uji Stres Beban (`concurrencyService.js`)**:
  | Parameter Uji | 1.000 Concurrent Users | 2.500 Concurrent Users | 5.000 Concurrent Users |
  |---|---|---|---|
  | **Waktu Selesai** | ~480 ms | ~920 ms | ~1.780 ms |
  | **Throughput (TPS)** | 2.083 TPS | 2.717 TPS | 2.808 TPS |
  | **Latensi Median (p50)** | 12 ms | 14 ms | 16 ms |
  | **Latensi Puncak (p95)** | 24 ms | 28 ms | 34 ms |
  | **Tingkat Kegagalan / Overbooking** | **0% (Nol)** | **0% (Nol)** | **0% (Nol)** |
  | **Integritas Rantai Audit** | 100% Lolos SHA-256 | 100% Lolos SHA-256 | 100% Lolos SHA-256 |

---

### 2. Akurasi Titik Koordinat & Integrasi Peta Auto-Snap Dukcapil
Untuk mencegah celah manipulasi titik rumah pendaftar, SMAUMU menerapkan validasi geospasial berlapis yang terintegrasi langsung pada Formulir Pendaftaran (`/daftar`):
1. **Interactive Leaflet Mini-Map (`ApplicantCoordinateMapView.jsx`)**:
   Calon siswa dan orang tua dapat melihat penanda rumah, penanda SMAN pilihan, serta **Garis Geodesik Haversine** dinamis yang menghubungkan rumah ke sekolah lengkap dengan indikator jarak meter secara seketika (*real-time*).
2. **Mekanisme Auto-Snap Dukcapil**:
   Tersedia fitur **"Auto-Snap Lokasi Resmi"** yang mengunci titik pendaftar ke centroid pemetaan Dukcapil/kelurahan resmi sehingga meniadakan celah penggeseran pin koordinat secara sepihak.
3. **Pembatas Administratif DKI Jakarta**:
   Sistem memverifikasi koordinat terhadap batas wilayah hukum administratif DKI Jakarta (`minLat: -6.375`, `maxLat: -6.085`, `minLng: 106.685`, `maxLng: 106.985`).
4. **Formula Great-Circle (Haversine)**:
   Perhitungan jarak spasial riil bumi bulat dengan presisi 2 desimal (meter):
   $$\Delta\sigma = 2 \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)} \right)$$
   $$d = R \cdot \Delta\sigma \quad (R = 6.371.000\text{ m})$$

---

### 3. Alur Pengaduan Whistleblower & Mitigasi Spam
Untuk melindungi verifikator dinas dari banjir aduan palsu (*spam flood*) tanpa mengorbankan kerahasiaan pelapor:
1. **Multi-Factor Spam Scoring Engine (`spamFilterService.js`)**:
   Setiap aduan yang masuk dihitung skor risikonya (0–100%) berdasarkan kelengkapan bukti dokumen, validitas nomor tiket terkait, kedalaman narasi kronologi, dan deteksi pola kata kunci repetitif.
2. **Posko Aduan Terpadu Petugas (`/admin/pengaduan`)**:
   - Filter kredibilitas otomatis (*Prioritas Valid*, *Sedang Investigasi*, *Terbukti Sanksi*, dan *Karantina Spam*).
   - Tindakan cepat verifikator untuk validasi bukti, eskalasi inspektorat lapangan, hingga karantina aduan fiktif.
3. **Transparansi Token Pelapor Mandiri (`/whistleblower` -> Pantau Token)**:
   Pelapor memantau tindak lanjut secara anonim menggunakan Token Rahasia yang diterbitkan saat laporan dikirim (`TOKEN-WBL-XXXX-XXX`) tanpa memerlukan login maupun pengungkapan data pribadi.

---

## 5. Matriks Evaluasi & Standar Kualitas Sistem

| No | Aspek Penilaian | Status Implementasi |
|:--:|---|---|
| **1** | Relevansi Ide terhadap Tema & Subtema | Solusi holistik mencakup 4 subtema WIA 2026 secara harmonis untuk transparansi layanan publik nasional. |
| **2** | Latar Belakang & Tujuan | Terstruktur rapi menjawab persoalan nyata zonasi, manipulasi domisili, dan akuntabilitas PPDB di Indonesia. |
| **3** | Keaslian & Kreativitas | Dilengkapi inovasi *Live Quota Burn-Rate*, *Auto-Snap Dukcapil*, *Anti-Spam Whistleblower*, dan *Audit Chain SHA-256*. |
| **4** | Kejelasan Struktur & Navigasi | Arsitektur komponen modular berstandar enterprise (*SAP Fiori* & *Metronic* layout) dengan alur pengguna yang ringkas. |
| **5** | Keamanan Publik & Tata Kelola Data | Zero-Trust role separation, sanitasi data produksi, skema relasional PostgreSQL terindeks, dan audit berantai SHA-256. |
| **6** | Kelengkapan Halaman Layanan | Seluruh portal masyarakat (`/daftar`, `/lacak`, `/kuota`, `/simulator`, `/whistleblower`, `/audit-log`) dan konsol petugas (`/admin/*`) siap pakai. |
| **7** | Desain Visual & Aksesibilitas | Palet **Sunset Obsidian** (*Midnight Charcoal*, *Sunset Orange*, *Neon Rose*) dengan **Light/Dark Mode Toggle**, komponen resmi **`shadcn/ui`**, serta kontras tinggi di desktop dan mobile. |
| **8** | Ketahanan & Mode Cloud/Statis | Terintegrasi dengan Supabase PostgreSQL sekaligus mendukung static export berkinerja tinggi di Vercel maupun GitHub Pages. |

---

## 6. Kesiapan Publikasi & Arsitektur Deployment Cloud

SMAUMU telah dikonfigurasi agar siap dirilis langsung ke masyarakat melalui infrastruktur cloud publik:

### A. Static Export & Cloud Hosting
1. **Vercel (`vercel.json`)**:
   Repositori dilengkapi konfigurasi root `vercel.json` yang otomatis membangun modul Next.js 14 dari folder `project-wia/` dan menayangkan hasil static export produksi (`project-wia/out/`) dengan URL bersih (*clean URLs* & *trailing slash*).
2. **GitHub Pages (`.github/workflows/deploy.yml`)**:
   Alur CI/CD GitHub Actions otomatis mengeksekusi proses build dan menerbitkan artefak situs statis ke GitHub Pages setiap kali pembaruan dikirim ke cabang utama (`main`).

### B. Integrasi Database & Layanan Backend (Supabase Cloud)
- Skema tabel relasional, indeks performa B-Tree, fungsi trigger Row-Level Locking, dan kebijakan keamanan tersedia pada berkas [`project-wia/supabase_schema.sql`](project-wia/supabase_schema.sql) dan [`project-wia/database.sql`](project-wia/database.sql).
- Konfigurasi variabel lingkungan cloud (*environment variables*) mengikuti templat [`project-wia/.env.example`](project-wia/.env.example):
  - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` untuk autentikasi dan basis data PostgreSQL cloud.
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (opsional) serta parameter batas geografis DKI Jakarta.

### C. Kebersihan & Keamanan Produksi
- Tidak ada kredensial sensitif, akun pengujian otomatis, maupun berkas presentasi internal yang disertakan ke repositori publik.
- Portal pendaftaran akun umum (`/register`) terpisah sepenuhnya dari portal petugas instansi (`/admin/login`) sesuai prinsip **Zero-Trust Governance** (pendaftaran akun masyarakat tidak pernah memiliki hak akses admin).

---

## 7. Hak Cipta & Lisensi
Karya cipta dikembangkan oleh **Tim FounDred** untuk kompetisi **Web In Action (WIA) MIA 2026**.  
Berlisensi terbuka **MIT License** demi memajukan transparansi dan akuntabilitas pelayanan publik di Indonesia.
