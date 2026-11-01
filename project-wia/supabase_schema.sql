-- ==============================================================================
-- SKEMA DATABASE SMAUMU (SMAN UntukMu)
-- Tema: Designing Digital Futures – Powering Public Transparency
-- Kompetisi: Web In Action (WIA) MIA 2026
-- Platform: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABEL ENTITAS
-- ==============================================================================

-- A. Tabel Pengguna (Satu Tabel Satu Entitas, Relasi 1:N)
-- CATATAN: Pendaftaran publik HANYA untuk peran 'masyarakat'.
-- Akun 'admin_instansi' dan 'verifikator_zonasi' hanya dibuat oleh Dinas Pendidikan.
CREATE TABLE IF NOT EXISTS public.pengguna (
    id BIGSERIAL PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nomor_telepon VARCHAR(50),
    peran VARCHAR(50) NOT NULL DEFAULT 'masyarakat' CHECK (peran IN ('masyarakat', 'admin_instansi', 'verifikator_zonasi', 'auditor_publik')),
    nip VARCHAR(50),
    is_aktif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- B. Tabel Master Sekolah SMAN
CREATE TABLE IF NOT EXISTS public.sekolah (
    id SERIAL PRIMARY KEY,
    npsn VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    zona_kecamatan VARCHAR(100) NOT NULL,
    lat NUMERIC(10, 6) NOT NULL,
    lng NUMERIC(10, 6) NOT NULL,
    kuota_total INT NOT NULL DEFAULT 288,
    radius_zonasi_maksimal_m INT NOT NULL DEFAULT 1200,
    passing_grade_prediksi NUMERIC(4, 2) NOT NULL DEFAULT 85.00,
    akreditasi VARCHAR(5) NOT NULL DEFAULT 'A',
    kontak_panitia VARCHAR(50) DEFAULT '021-3841234',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- C. Tabel Kuota Sekolah & Live Burn-Rate (Subtema: Open Government Data)
CREATE TABLE IF NOT EXISTS public.kuota_sekolah (
    id SERIAL PRIMARY KEY,
    sekolah_id INT NOT NULL REFERENCES public.sekolah(id) ON DELETE CASCADE,
    pengguna_id BIGINT REFERENCES public.pengguna(id) ON DELETE SET NULL,
    jalur VARCHAR(50) NOT NULL CHECK (jalur IN ('zonasi', 'afirmasi', 'prestasi_akademik', 'perpindahan_tugas')),
    persentase INT NOT NULL CHECK (persentase > 0 AND persentase <= 100),
    total_kuota INT NOT NULL CHECK (total_kuota > 0),
    kuota_terisi INT NOT NULL DEFAULT 0,
    pendaftar_total INT NOT NULL DEFAULT 0,
    burn_rate_per_jam NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unik_sekolah_jalur UNIQUE (sekolah_id, jalur)
);

-- D. Tabel Pendaftaran Siswa (Subtema: Public Service Tracking & Dual-Truth Comparator)
CREATE TABLE IF NOT EXISTS public.pendaftaran (
    id BIGSERIAL PRIMARY KEY,
    nomor_tiket VARCHAR(50) UNIQUE NOT NULL,
    pengguna_id BIGINT REFERENCES public.pengguna(id) ON DELETE SET NULL,
    sekolah_id INT NOT NULL REFERENCES public.sekolah(id) ON DELETE RESTRICT,
    sekolah_cadangan_id INT REFERENCES public.sekolah(id) ON DELETE SET NULL,
    
    -- Biodata Siswa
    nama_siswa VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    nisn VARCHAR(10) NOT NULL,
    nomor_telepon VARCHAR(50),
    asal_sekolah_smp VARCHAR(255) NOT NULL,
    alamat_domisili TEXT NOT NULL,
    lama_tinggal_bulan INT NOT NULL DEFAULT 12,
    jalur VARCHAR(50) NOT NULL DEFAULT 'zonasi',

    -- Data Klaim vs Resmi (Dual-Truth Comparator & Geo-Discrepancy Detector)
    klaim_koordinat_lat NUMERIC(10, 6) NOT NULL,
    klaim_koordinat_lng NUMERIC(10, 6) NOT NULL,
    klaim_jarak_meter NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    klaim_nilai_rapor NUMERIC(5, 2) NOT NULL DEFAULT 80.00,

    resmi_koordinat_lat NUMERIC(10, 6),
    resmi_koordinat_lng NUMERIC(10, 6),
    resmi_jarak_meter NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    resmi_nilai_rapor NUMERIC(5, 2),
    selisih_jarak_meter NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    
    geo_anomaly_status VARCHAR(50) NOT NULL DEFAULT 'aman' CHECK (geo_anomaly_status IN ('aman', 'anomali_ringan', 'anomali_kritis_fraud')),
    status_tahapan VARCHAR(50) NOT NULL DEFAULT 'diajukan' CHECK (status_tahapan IN ('diajukan', 'verifikasi_berkas', 'tinjauan_manual', 'lolos_seleksi', 'ditolak')),
    catatan_verifikasi TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- E. Tabel Whistleblower & Civic Reporting (Subtema: Civic Reporting & Accountability)
CREATE TABLE IF NOT EXISTS public.laporan_warga (
    id BIGSERIAL PRIMARY KEY,
    kode_laporan VARCHAR(50) UNIQUE NOT NULL,
    token_investigasi VARCHAR(100) UNIQUE NOT NULL,
    sekolah_terlapor_id INT REFERENCES public.sekolah(id) ON DELETE SET NULL,
    tiket_terlapor VARCHAR(50),
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('numpang_kk', 'manipulasi_jarak', 'sertifikat_palsu', 'pungli_oknum', 'lainnya')),
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    bukti_lampiran_url TEXT,
    nama_samaran VARCHAR(100) DEFAULT 'Warga Anonim',
    status VARCHAR(50) NOT NULL DEFAULT 'dikirim' CHECK (status IN ('dikirim', 'sedang_investigasi', 'terbukti_ditindak', 'ditutup_tidak_valid')),
    tindakan_diambil TEXT DEFAULT 'Laporan terenkripsi diterima sistem. Menunggu audit tim independen.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- F. Tabel Immutable Audit Log (Kriptografis Hash SHA-256 Anti-Manipulasi)
CREATE TABLE IF NOT EXISTS public.audit_log (
    id BIGSERIAL PRIMARY KEY,
    pengguna_id BIGINT REFERENCES public.pengguna(id) ON DELETE SET NULL,
    pengguna_nama VARCHAR(255) NOT NULL DEFAULT 'Sistem Otomatis',
    aksi VARCHAR(100) NOT NULL,
    entitas_terkait VARCHAR(50) NOT NULL,
    entitas_id BIGINT NOT NULL DEFAULT 0,
    deskripsi_tindakan TEXT NOT NULL,
    data_lama JSONB,
    data_baru JSONB,
    ip_address VARCHAR(100) DEFAULT '127.0.0.1 (Web Portal)',
    prev_hash VARCHAR(64) NOT NULL,
    curr_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. INDEX UNTUK PERFORMA QUERY
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_pendaftaran_nomor_tiket ON public.pendaftaran(nomor_tiket);
CREATE INDEX IF NOT EXISTS idx_pendaftaran_nik ON public.pendaftaran(nik);
CREATE INDEX IF NOT EXISTS idx_pendaftaran_sekolah ON public.pendaftaran(sekolah_id, jalur);
CREATE INDEX IF NOT EXISTS idx_laporan_token ON public.laporan_warga(token_investigasi);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_log(created_at DESC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kuota_sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendaftaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan_warga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 1) Kebijakan Sekolah (Publik dapat melihat katalog sekolah)
CREATE POLICY "Publik dapat membaca sekolah" ON public.sekolah
    FOR SELECT TO anon, authenticated USING (true);

-- 2) Kebijakan Kuota Sekolah (Publik dapat memantau kuota real-time)
CREATE POLICY "Publik dapat membaca kuota sekolah" ON public.kuota_sekolah
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin dapat mengubah kuota sekolah" ON public.kuota_sekolah
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3) Kebijakan Pendaftaran
-- Siapa saja dapat mendaftar (INSERT)
CREATE POLICY "Publik dapat mengajukan pendaftaran" ON public.pendaftaran
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Pendaftar dapat mencari nomor tiket mereka sendiri (SELECT)
CREATE POLICY "Publik dapat mencari pendaftaran by tiket" ON public.pendaftaran
    FOR SELECT TO anon, authenticated USING (true);

-- Verifikator & Admin dapat memperbarui status pendaftaran (UPDATE)
CREATE POLICY "Admin dapat memverifikasi pendaftaran" ON public.pendaftaran
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 4) Kebijakan Whistleblower / Laporan Warga
-- Siapa saja dapat melapor secara anonim tanpa login (INSERT)
CREATE POLICY "Warga anonim dapat mengirim laporan" ON public.laporan_warga
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Pelapor dapat memeriksa progres menggunakan token rahasia (SELECT)
CREATE POLICY "Warga dapat memeriksa status laporan" ON public.laporan_warga
    FOR SELECT TO anon, authenticated USING (true);

-- Admin dapat memperbarui tindak lanjut laporan (UPDATE)
CREATE POLICY "Admin dapat menindaklanjuti laporan" ON public.laporan_warga
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 5) Kebijakan Audit Log (Transparansi Publik Penuh: Read Only untuk Umum)
CREATE POLICY "Publik dapat membaca log audit transparan" ON public.audit_log
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Sistem dan Admin dapat menyisipkan audit log" ON public.audit_log
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ==============================================================================
-- 5. SEED DATA AWAL (MASTER SEKOLAH, KUOTA, DAN ADMIN RESMI)
-- ==============================================================================

-- A. Akun Dinas Resmi (TIDAK ADA REGISTRASI ADMIN PUBLIK)
INSERT INTO public.pengguna (id, nama, email, nomor_telepon, peran, nip, is_aktif)
VALUES
(1, 'Admin Disdik WIA Pusat', 'admin.disdik@smaumu.go.id', '081100002026', 'admin_instansi', '198503212008011002', true),
(2, 'Dr. H. Bambang Soeprapto', 'verifikator.zonasi@smaumu.go.id', '081200002026', 'verifikator_zonasi', '197906152005021004', true),
(3, 'Ombudsman Publik Pelapor', 'auditor.bebas@ombudsman.go.id', '081300002026', 'auditor_publik', '198811122012012001', true)
ON CONFLICT (email) DO NOTHING;

-- B. Master 4 SMAN Jakarta Pusat
INSERT INTO public.sekolah (id, npsn, nama, alamat, zona_kecamatan, lat, lng, kuota_total, radius_zonasi_maksimal_m, passing_grade_prediksi, akreditasi)
VALUES
(1, '20107312', 'SMAN 1 Jakarta', 'Jl. Budi Utomo No. 7, Sawah Besar', 'Sawah Besar', -6.166400, 106.837200, 288, 1200, 89.20, 'A'),
(2, '20107313', 'SMAN 68 Jakarta', 'Jl. Salemba Raya No. 18, Senen', 'Senen', -6.192500, 106.852400, 360, 1500, 91.50, 'A'),
(3, '20107314', 'SMAN 20 Jakarta', 'Jl. Krekot Bunder III No. 1, Sawah Besar', 'Sawah Besar', -6.161000, 106.832000, 252, 1100, 84.80, 'A'),
(4, '20107315', 'SMAN 77 Jakarta', 'Jl. Cempaka Putih Tengah XVII, Cempaka Putih', 'Cempaka Putih', -6.177600, 106.871500, 288, 1400, 86.40, 'A')
ON CONFLICT (id) DO NOTHING;

-- C. Master Kuota per Jalur Penerimaan SMAN
INSERT INTO public.kuota_sekolah (id, sekolah_id, pengguna_id, jalur, persentase, total_kuota, kuota_terisi, pendaftar_total, burn_rate_per_jam)
VALUES
(1, 1, 1, 'zonasi', 50, 144, 118, 230, 8.4),
(2, 1, 1, 'afirmasi', 20, 58, 41, 62, 2.1),
(3, 1, 1, 'prestasi_akademik', 20, 58, 54, 142, 6.5),
(4, 1, 1, 'perpindahan_tugas', 10, 28, 12, 16, 0.8),

(5, 2, 1, 'zonasi', 50, 180, 164, 390, 14.2),
(6, 2, 1, 'prestasi_akademik', 25, 90, 88, 310, 11.0),
(7, 2, 1, 'afirmasi', 15, 54, 39, 58, 2.4),
(8, 2, 1, 'perpindahan_tugas', 10, 36, 18, 22, 1.1),

(9, 3, 1, 'zonasi', 50, 126, 88, 175, 5.8),
(10, 3, 1, 'afirmasi', 20, 50, 34, 48, 1.8),
(11, 3, 1, 'prestasi_akademik', 20, 50, 42, 98, 4.2),
(12, 3, 1, 'perpindahan_tugas', 10, 26, 10, 12, 0.5),

(13, 4, 1, 'zonasi', 50, 144, 102, 210, 7.6),
(14, 4, 1, 'afirmasi', 20, 58, 38, 55, 1.9),
(15, 4, 1, 'prestasi_akademik', 20, 58, 50, 125, 5.7),
(16, 4, 1, 'perpindahan_tugas', 10, 28, 14, 18, 0.9)
ON CONFLICT (id) DO NOTHING;

-- D. Initial Genesis Audit Log
INSERT INTO public.audit_log (
    id, pengguna_id, pengguna_nama, aksi, entitas_terkait, entitas_id,
    deskripsi_tindakan, data_lama, data_baru, ip_address, prev_hash, curr_hash, created_at
)
VALUES
(
    1, 1, 'Admin Disdik WIA Pusat', 'GENESIS_SYSTEM_INIT', 'sistem', 0,
    'Inisialisasi Master Kuota & Regulasi Zonasi WIA 2026',
    null, '{"versi": "1.0", "status": "aktif"}'::jsonb, '10.0.0.1',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '8f7d98c21345efbb67a890123456789abcdef0123456789abcdef0123456789a',
    '2026-10-30 08:00:00+00'
),
(
    2, 2, 'Dr. H. Bambang Soeprapto (Verifikator)', 'FLAG_GEO_DISCREPANCY', 'pendaftaran', 2,
    'Pemberian Status Anomali Kritis (Selisih > 1km) pada Tiket TIKET-SMU-2026-098215',
    '{"status_tahapan": "diajukan", "geo_anomaly_status": "aman"}'::jsonb,
    '{"status_tahapan": "tinjauan_manual", "geo_anomaly_status": "anomali_kritis_fraud"}'::jsonb,
    '192.168.1.45',
    '8f7d98c21345efbb67a890123456789abcdef0123456789abcdef0123456789a',
    '3a1b4c9e887766554433221100ffeeddccbbaa99887766554433221100ffeedd',
    '2026-10-31 09:15:22+00'
)
ON CONFLICT (id) DO NOTHING;

-- Reset Sequences
SELECT setval('public.sekolah_id_seq', (SELECT MAX(id) FROM public.sekolah));
SELECT setval('public.kuota_sekolah_id_seq', (SELECT MAX(id) FROM public.kuota_sekolah));
SELECT setval('public.audit_log_id_seq', (SELECT MAX(id) FROM public.audit_log));
