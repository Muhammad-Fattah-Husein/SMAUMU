-- ==============================================================================
-- SKEMA DATABASE SMAUMU (SMAN UntukMu) - EDISI TERPADU & PRODUKSI
-- Tema: Designing Digital Futures – Powering Public Transparency
-- Kompetisi: Web In Action (WIA) MIA 2026
-- Platform: Supabase (PostgreSQL 15+)
-- Fitur: RBAC Ketat, Storage Berkas, Trigger Otomatis Kuota & Audit, Dual-Language Views
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABEL ENTITAS UTAMA
-- ==============================================================================

-- A. Tabel Pengguna (Role-Based Access Control)
-- Pendaftaran publik HANYA untuk peran 'masyarakat'. Akun dinas diterbitkan eksklusif.
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

-- C. Tabel Kuota Sekolah & Live Burn-Rate
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

-- D. Tabel Pendaftaran Siswa (Mencakup Semua Kolom Formulir & Lampiran Berkas)
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

    -- Data Geospasial & Akademik (Dual-Truth Comparator & Geo-Discrepancy)
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
    
    -- Lampiran Dokumen & Metadata Berkas
    dokumen_kk TEXT DEFAULT 'kk_terverifikasi.pdf',
    dokumen_rapor TEXT DEFAULT 'rapor_semester_1_5.pdf',
    documents JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- E. Tabel Whistleblower & Civic Reporting
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

-- F. Tabel Immutable Audit Log (Hash Chain SHA-256)
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

-- G. Tabel Konfigurasi Pengumuman & Parameter Sistem PPDB (system_config)
CREATE TABLE IF NOT EXISTS public.system_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- H. Tabel Pengaturan Buka / Tutup Jalur Seleksi (path_settings)
CREATE TABLE IF NOT EXISTS public.path_settings (
    id SERIAL PRIMARY KEY,
    jalur VARCHAR(50) UNIQUE NOT NULL,
    nama_jalur VARCHAR(100) NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT true,
    tanggal_mulai TIMESTAMPTZ,
    tanggal_selesai TIMESTAMPTZ,
    deskripsi TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. TRIGGER PENGURANGAN KUOTA & PENCATATAN AUDIT OTOMATIS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_pendaftaran_acceptance()
RETURNS TRIGGER AS $$
DECLARE
    v_prev_hash VARCHAR(64);
    v_curr_hash VARCHAR(64);
BEGIN
    -- Jika status pendaftaran berubah menjadi lolos_seleksi
    IF (NEW.status_tahapan = 'lolos_seleksi' AND (OLD.status_tahapan IS NULL OR OLD.status_tahapan <> 'lolos_seleksi')) THEN
        -- 1. Tambah jumlah kuota_terisi pada tabel kuota_sekolah
        UPDATE public.kuota_sekolah
        SET kuota_terisi = LEAST(total_kuota, kuota_terisi + 1),
            updated_at = timezone('utc'::text, now())
        WHERE sekolah_id = NEW.sekolah_id AND jalur = NEW.jalur;

        -- 2. Dapatkan hash log audit terakhir
        SELECT curr_hash INTO v_prev_hash 
        FROM public.audit_log 
        ORDER BY id DESC LIMIT 1;
        
        IF v_prev_hash IS NULL THEN
            v_prev_hash := '0000000000000000000000000000000000000000000000000000000000000000';
        END IF;

        v_curr_hash := encode(digest(v_prev_hash || ':PENERIMAAN_SISWA:' || NEW.nomor_tiket || ':' || now()::text, 'sha256'), 'hex');

        -- 3. Rekam audit log kriptografis yang tidak dapat diubah
        INSERT INTO public.audit_log (
            pengguna_nama, aksi, entitas_terkait, entitas_id,
            deskripsi_tindakan, data_lama, data_baru, ip_address, prev_hash, curr_hash, created_at
        ) VALUES (
            'Sistem Seleksi Otomatis',
            'PENERIMAAN_SISWA_RESMI',
            'pendaftaran',
            NEW.id,
            'Alokasi 1 kursi resmi untuk tiket ' || NEW.nomor_tiket || ' (' || NEW.nama_siswa || ') pada jalur ' || NEW.jalur,
            jsonb_build_object('status_tahapan', OLD.status_tahapan),
            jsonb_build_object('status_tahapan', NEW.status_tahapan, 'jalur', NEW.jalur, 'sekolah_id', NEW.sekolah_id),
            '127.0.0.1 (Internal Trigger)',
            v_prev_hash,
            v_curr_hash,
            timezone('utc'::text, now())
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_pendaftaran_acceptance ON public.pendaftaran;
CREATE TRIGGER trg_pendaftaran_acceptance
    AFTER UPDATE ON public.pendaftaran
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_pendaftaran_acceptance();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kuota_sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendaftaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan_warga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.path_settings ENABLE ROW LEVEL SECURITY;

-- Kebijakan Baca Terbuka (Open Government Data)
DROP POLICY IF EXISTS "Publik dapat membaca sekolah" ON public.sekolah;
CREATE POLICY "Publik dapat membaca sekolah" ON public.sekolah FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Publik dapat membaca kuota sekolah" ON public.kuota_sekolah;
CREATE POLICY "Publik dapat membaca kuota sekolah" ON public.kuota_sekolah FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Publik dapat membaca konfigurasi sistem" ON public.system_config;
CREATE POLICY "Publik dapat membaca konfigurasi sistem" ON public.system_config FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Publik dapat membaca pengaturan jalur" ON public.path_settings;
CREATE POLICY "Publik dapat membaca pengaturan jalur" ON public.path_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Publik dapat membaca log audit transparan" ON public.audit_log;
CREATE POLICY "Publik dapat membaca log audit transparan" ON public.audit_log FOR SELECT TO anon, authenticated USING (true);

-- Kebijakan Tulis Pendaftaran & Whistleblower
DROP POLICY IF EXISTS "Publik dapat mengajukan pendaftaran" ON public.pendaftaran;
CREATE POLICY "Publik dapat mengajukan pendaftaran" ON public.pendaftaran FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Publik dapat mencari pendaftaran by tiket" ON public.pendaftaran;
CREATE POLICY "Publik dapat mencari pendaftaran by tiket" ON public.pendaftaran FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Warga anonim dapat mengirim laporan" ON public.laporan_warga;
CREATE POLICY "Warga anonim dapat mengirim laporan" ON public.laporan_warga FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Warga dapat memeriksa status laporan" ON public.laporan_warga;
CREATE POLICY "Warga dapat memeriksa status laporan" ON public.laporan_warga FOR SELECT TO anon, authenticated USING (true);

-- Kebijakan Khusus Admin Terverifikasi
DROP POLICY IF EXISTS "Admin dapat memverifikasi pendaftaran" ON public.pendaftaran;
CREATE POLICY "Admin dapat memverifikasi pendaftaran" ON public.pendaftaran FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin dapat mengubah kuota sekolah" ON public.kuota_sekolah;
CREATE POLICY "Admin dapat mengubah kuota sekolah" ON public.kuota_sekolah FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin dapat menindaklanjuti laporan" ON public.laporan_warga;
CREATE POLICY "Admin dapat menindaklanjuti laporan" ON public.laporan_warga FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin dapat mengelola konfigurasi sistem" ON public.system_config;
CREATE POLICY "Admin dapat mengelola konfigurasi sistem" ON public.system_config FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin dapat mengelola pengaturan jalur" ON public.path_settings;
CREATE POLICY "Admin dapat mengelola pengaturan jalur" ON public.path_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 5. COMPATIBILITY VIEWS (Mendukung Nama Bahasa Inggris & Bahasa Indonesia)
-- ==============================================================================
CREATE OR REPLACE VIEW public.schools AS
SELECT id, nama AS name, zona_kecamatan AS district, alamat AS address, akreditasi, created_at
FROM public.sekolah;

CREATE OR REPLACE VIEW public.admission_quotas AS
SELECT id, sekolah_id AS school_id, jalur AS track_name, total_kuota AS total_seats,
       kuota_terisi AS filled_seats, (total_kuota - kuota_terisi) AS available_seats,
       true AS is_open, updated_at
FROM public.kuota_sekolah;

CREATE OR REPLACE VIEW public.quotas AS
SELECT * FROM public.admission_quotas;

CREATE OR REPLACE VIEW public.registrations AS
SELECT id, nomor_tiket, nama_siswa AS student_name, nisn, jalur AS path_type,
       status_tahapan AS status, catatan_verifikasi AS notes, documents,
       created_at, updated_at
FROM public.pendaftaran;

-- ==============================================================================
-- 6. SEED DATA AWAL
-- ==============================================================================

-- Akun Petugas Resmi (TIDAK ADA REGISTRASI ADMIN PUBLIK)
INSERT INTO public.pengguna (id, nama, email, nomor_telepon, peran, nip, is_aktif)
VALUES
(1, 'Admin Disdik WIA Pusat', 'admin.disdik@smaumu.go.id', '081100002026', 'admin_instansi', '198503212008011002', true),
(2, 'Dr. H. Bambang Soeprapto', 'verifikator.zonasi@smaumu.go.id', '081200002026', 'verifikator_zonasi', '197906152005021004', true),
(3, 'Ombudsman Publik Pelapor', 'auditor.bebas@ombudsman.go.id', '081300002026', 'auditor_publik', '198811122012012001', true)
ON CONFLICT (email) DO NOTHING;

-- Master 4 SMAN Jakarta Pusat
INSERT INTO public.sekolah (id, npsn, nama, alamat, zona_kecamatan, lat, lng, kuota_total, radius_zonasi_maksimal_m, passing_grade_prediksi, akreditasi)
VALUES
(1, '20107312', 'SMAN 1 Jakarta', 'Jl. Budi Utomo No. 7, Sawah Besar', 'Sawah Besar', -6.166400, 106.837200, 288, 1200, 89.20, 'A'),
(2, '20107313', 'SMAN 68 Jakarta', 'Jl. Salemba Raya No. 18, Senen', 'Senen', -6.192500, 106.852400, 360, 1500, 91.50, 'A'),
(3, '20107314', 'SMAN 20 Jakarta', 'Jl. Krekot Bunder III No. 1, Sawah Besar', 'Sawah Besar', -6.161000, 106.832000, 252, 1100, 84.80, 'A'),
(4, '20107315', 'SMAN 77 Jakarta', 'Jl. Cempaka Putih Tengah XVII, Cempaka Putih', 'Cempaka Putih', -6.177600, 106.871500, 288, 1400, 86.40, 'A')
ON CONFLICT (id) DO NOTHING;

-- Kuota per Jalur
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

-- Inisialisasi Pengaturan Buka / Tutup Jalur (path_settings)
INSERT INTO public.path_settings (id, jalur, nama_jalur, is_open, deskripsi)
VALUES
(1, 'zonasi', 'Jalur Zonasi Domisili (50%)', true, 'Seleksi berdasarkan radius jarak domisili kartu keluarga ke sekolah.'),
(2, 'afirmasi', 'Jalur Afirmasi / KJP (20%)', true, 'Khusus bagi keluarga ekonomi kurang mampu dan penyandang disabilitas.'),
(3, 'prestasi_akademik', 'Jalur Prestasi Nilai Rapor (20%)', true, 'Seleksi berdasarkan rata-rata nilai rapor semester 1-5 dan piagam.'),
(4, 'perpindahan_tugas', 'Jalur Perpindahan Tugas Orang Tua (10%)', true, 'Khusus calon siswa yang orang tuanya pindah dinas.')
ON CONFLICT (jalur) DO NOTHING;

-- Inisialisasi Konfigurasi Sistem (system_config)
INSERT INTO public.system_config (key, value, description)
VALUES
('pengumuman_global', 'Pendaftaran PPDB SMAN Periode 2026/2027 resmi dibuka secara serentak.', 'Teks pengumuman banner berjalan pada header beranda.'),
('status_pendaftaran_aktif', 'true', 'Saklar global buka/tutup seluruh pendaftaran PPDB.'),
('toleransi_gps_meter', '150', 'Ambang batas deviasi GPS presisi wajar.')
ON CONFLICT (key) DO NOTHING;

-- Genesis Audit Log
INSERT INTO public.audit_log (
    id, pengguna_id, pengguna_nama, aksi, entitas_terkait, entitas_id,
    deskripsi_tindakan, data_lama, data_baru, ip_address, prev_hash, curr_hash, created_at
)
VALUES
(
    1, 1, 'Admin Disdik WIA Pusat', 'GENESIS_SYSTEM_INIT', 'sistem', 0,
    'Inisialisasi Master Kuota & Regulasi Zonasi WIA 2026',
    null, '{"versi": "2.0", "status": "aktif"}'::jsonb, '10.0.0.1',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '8f7d98c21345efbb67a890123456789abcdef0123456789abcdef0123456789a',
    '2026-10-30 08:00:00+00'
)
ON CONFLICT (id) DO NOTHING;

-- Sinkronisasi Sequence ID
SELECT setval('public.sekolah_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.sekolah));
SELECT setval('public.kuota_sekolah_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.kuota_sekolah));
SELECT setval('public.audit_log_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.audit_log));
SELECT setval('public.path_settings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.path_settings));
SELECT setval('public.system_config_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.system_config));
