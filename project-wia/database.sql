-- ==============================================================================
-- PROYEK: SMAUMU (SMAN UntukMu)
-- KOMPETISI: Web In Action (WIA) MIA 2026
-- TEMA: Designing Digital Futures – Powering Public Transparency
-- SKEMA BASIS DATA RELASIONAL (PostgreSQL 14+)
-- ==============================================================================
-- Aturan Arsitektur Data:
-- 1. Satu tabel satu entitas murni (3NF Normalization)
-- 2. Tanpa redundansi data / data ganda
-- 3. Relasi jelas: 'pengguna' berelasi 1-ke-banyak (1:N) terhadap:
--    - pendaftaran
--    - laporan_warga
--    - kuota_sekolah
--    - audit_log
-- ==============================================================================

-- Ekstensi UUID dan Cryptographic Hashing
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Hapus tabel jika sudah ada sebelumnya (Clean Slate)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS laporan_warga CASCADE;
DROP TABLE IF EXISTS pendaftaran CASCADE;
DROP TABLE IF EXISTS kuota_sekolah CASCADE;
DROP TABLE IF EXISTS sekolah CASCADE;
DROP TABLE IF EXISTS pengguna CASCADE;

-- ------------------------------------------------------------------------------
-- 1. ENTITAS PENGGUNA (Master Users & Actors)
-- ------------------------------------------------------------------------------
CREATE TABLE pengguna (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    kata_sandi_hash VARCHAR(255) NOT NULL,
    peran VARCHAR(30) NOT NULL CHECK (peran IN ('masyarakat', 'admin_instansi', 'verifikator_zonasi', 'auditor_publik')),
    nomor_induk_pegawai VARCHAR(30) DEFAULT NULL, -- Khusus Admin/Verifikator
    nomor_telepon VARCHAR(20),
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indeks untuk pencarian cepat pengguna
CREATE INDEX idx_pengguna_email ON pengguna(email);
CREATE INDEX idx_pengguna_peran ON pengguna(peran);

-- ------------------------------------------------------------------------------
-- 2. ENTITAS SEKOLAH (Master SMAN)
-- ------------------------------------------------------------------------------
CREATE TABLE sekolah (
    id SERIAL PRIMARY KEY,
    npsn VARCHAR(8) UNIQUE NOT NULL,
    nama_sekolah VARCHAR(150) NOT NULL,
    alamat TEXT NOT NULL,
    kelurahan VARCHAR(100) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    kota_kabupaten VARCHAR(100) NOT NULL,
    provinsi VARCHAR(100) DEFAULT 'DKI Jakarta',
    koordinat_lat DOUBLE PRECISION NOT NULL,
    koordinat_lng DOUBLE PRECISION NOT NULL,
    radius_zonasi_maks_meter NUMERIC(10, 2) DEFAULT 3500.00,
    kuota_total_daya_tampung INT NOT NULL,
    telepon VARCHAR(30),
    website VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sekolah_npsn ON sekolah(npsn);
CREATE INDEX idx_sekolah_kecamatan ON sekolah(kecamatan);

-- ------------------------------------------------------------------------------
-- 3. ENTITAS KUOTA_SEKOLAH (Relasi 1:N dari PENGGUNA Admin Instansi)
-- ------------------------------------------------------------------------------
CREATE TABLE kuota_sekolah (
    id SERIAL PRIMARY KEY,
    sekolah_id INT NOT NULL REFERENCES sekolah(id) ON DELETE CASCADE,
    pengguna_id INT NOT NULL REFERENCES pengguna(id) ON DELETE RESTRICT, -- Admin yang mengesahkan kuota
    jalur VARCHAR(50) NOT NULL CHECK (jalur IN ('zonasi', 'afirmasi', 'prestasi_akademik', 'prestasi_non_akademik', 'perpindahan_tugas')),
    persentase_kuota NUMERIC(5, 2) NOT NULL,
    total_kuota INT NOT NULL,
    kuota_terisi INT DEFAULT 0,
    pendaftar_total INT DEFAULT 0,
    burn_rate_per_jam NUMERIC(6, 2) DEFAULT 0.00, -- Laju pengisian pendaftar per jam
    perkiraan_kursi_penuh_jam NUMERIC(6, 1) DEFAULT NULL,
    status_jalur VARCHAR(20) DEFAULT 'buka' CHECK (status_jalur IN ('buka', 'kritis', 'hampir_penuh', 'tutup')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sekolah_jalur UNIQUE(sekolah_id, jalur)
);

CREATE INDEX idx_kuota_sekolah_jalur ON kuota_sekolah(jalur);
CREATE INDEX idx_kuota_sekolah_pengguna ON kuota_sekolah(pengguna_id);

-- ------------------------------------------------------------------------------
-- 4. ENTITAS PENDAFTARAN (Relasi 1:N dari PENGGUNA Masyarakat)
-- ------------------------------------------------------------------------------
CREATE TABLE pendaftaran (
    id SERIAL PRIMARY KEY,
    nomor_tiket VARCHAR(64) UNIQUE NOT NULL, -- Format TIKET-SMU-2026-XXXXX berenkripsi
    pengguna_id INT NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
    sekolah_id INT NOT NULL REFERENCES sekolah(id) ON DELETE RESTRICT,
    jalur VARCHAR(50) NOT NULL CHECK (jalur IN ('zonasi', 'afirmasi', 'prestasi_akademik', 'prestasi_non_akademik', 'perpindahan_tugas')),
    nama_siswa VARCHAR(150) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    nisn VARCHAR(10) NOT NULL,
    asal_sekolah_smp VARCHAR(150) NOT NULL,
    alamat_domisili TEXT NOT NULL,
    lama_tinggal_bulan INT NOT NULL, -- Lama tinggal di KK
    
    -- Dual-Truth Coordinate & Distance Metrics
    klaim_koordinat_lat DOUBLE PRECISION NOT NULL,
    klaim_koordinat_lng DOUBLE PRECISION NOT NULL,
    resmi_koordinat_lat DOUBLE PRECISION,
    resmi_koordinat_lng DOUBLE PRECISION,
    jarak_klaim_meter NUMERIC(10, 2) NOT NULL,
    jarak_resmi_gis_meter NUMERIC(10, 2),
    selisih_jarak_meter NUMERIC(10, 2) GENERATED ALWAYS AS (jarak_resmi_gis_meter - jarak_klaim_meter) STORED,
    geo_anomaly_status VARCHAR(30) DEFAULT 'aman' CHECK (geo_anomaly_status IN ('aman', 'peringatan_toleransi', 'anomali_kritis_fraud')),
    
    -- Academic / Dual-Truth Verification
    klaim_nilai_rapor NUMERIC(5, 2) NOT NULL,
    dapodik_nilai_rapor NUMERIC(5, 2),
    dual_truth_status VARCHAR(30) DEFAULT 'terverifikasi_cocok' CHECK (dual_truth_status IN ('terverifikasi_cocok', 'perbedaan_ringan', 'inkonsistensi_kritis')),
    
    -- File and Encryption
    dokumen_kk_url TEXT,
    dokumen_rapor_url TEXT,
    hash_tanda_terima VARCHAR(128) NOT NULL,
    
    -- Lifecycle Tracking
    status_tahapan VARCHAR(30) DEFAULT 'diajukan' CHECK (status_tahapan IN ('pilih_jalur', 'diajukan', 'verifikasi_gis', 'tinjauan_manual', 'lolos_sementara', 'tergeser', 'diterima_resmi')),
    catatan_verifikator TEXT,
    verifikator_id INT REFERENCES pengguna(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pendaftaran_nomor_tiket ON pendaftaran(nomor_tiket);
CREATE INDEX idx_pendaftaran_pengguna ON pendaftaran(pengguna_id);
CREATE INDEX idx_pendaftaran_sekolah ON pendaftaran(sekolah_id);
CREATE INDEX idx_pendaftaran_nik ON pendaftaran(nik);

-- ------------------------------------------------------------------------------
-- 5. ENTITAS LAPORAN_WARGA / CIVIC WHISTLEBLOWER (Relasi 1:N dari PENGGUNA)
-- ------------------------------------------------------------------------------
CREATE TABLE laporan_warga (
    id SERIAL PRIMARY KEY,
    kode_laporan VARCHAR(32) UNIQUE NOT NULL, -- Format WBL-2026-XXXXX
    pengguna_id INT REFERENCES pengguna(id) ON DELETE SET NULL, -- Nullable jika pelapor anonim penuh
    pendaftaran_id INT REFERENCES pendaftaran(id) ON DELETE SET NULL, -- Nomor tiket yang diadukan (jika ada)
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('numpang_kk', 'manipulasi_koordinat', 'sertifikat_palsu', 'pungli_kursi', 'anomali_jarak_tidak_masuk_akal', 'lainnya')),
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    lampiran_bukti_url TEXT,
    is_anonim BOOLEAN DEFAULT TRUE,
    nama_samaran VARCHAR(50) DEFAULT 'Warga Transparan',
    token_investigasi VARCHAR(64) NOT NULL, -- Token pelapor untuk memantau status secara anonim
    status VARCHAR(30) DEFAULT 'diterima' CHECK (status IN ('diterima', 'dalam_investigasi', 'bukti_valid_terverifikasi', 'ditolak_tidak_berdasar', 'selesai_ditindak')),
    tindak_lanjut_instansi TEXT,
    investigator_id INT REFERENCES pengguna(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_laporan_kode ON laporan_warga(kode_laporan);
CREATE INDEX idx_laporan_pengguna ON laporan_warga(pengguna_id);
CREATE INDEX idx_laporan_status ON laporan_warga(status);

-- ------------------------------------------------------------------------------
-- 6. ENTITAS AUDIT_LOG / IMMUTABLE CRYPTOGRAPHIC AUDIT LOG
-- ------------------------------------------------------------------------------
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    pengguna_id INT NOT NULL REFERENCES pengguna(id) ON DELETE RESTRICT,
    aksi VARCHAR(60) NOT NULL, -- Misal: 'VERIFIKASI_BERKAS', 'UBAH_STATUS_TIKET', 'UPDATE_KUOTA', 'PENYELESAIAN_LAPORAN'
    entitas_terkait VARCHAR(50) NOT NULL, -- 'pendaftaran', 'kuota_sekolah', 'laporan_warga'
    entitas_id INT NOT NULL,
    deskripsi_tindakan TEXT NOT NULL,
    data_lama JSONB,
    data_baru JSONB,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    user_agent TEXT,
    
    -- Cryptographic Tamper-Evident Hash Chain (SHA-256 Merkle Link)
    prev_hash VARCHAR(64) NOT NULL,
    curr_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_pengguna ON audit_log(pengguna_id);
CREATE INDEX idx_audit_log_entitas ON audit_log(entitas_terkait, entitas_id);
CREATE INDEX idx_audit_log_hash ON audit_log(curr_hash);

-- ------------------------------------------------------------------------------
-- SEED DATA AWAL (Contoh Representatif untuk Pengujian dan Penjurian)
-- ------------------------------------------------------------------------------

-- Master Pengguna
INSERT INTO pengguna (id, nama, email, kata_sandi_hash, peran, nomor_induk_pegawai, nomor_telepon) VALUES
(1, 'Admin Disdik WIA Pusat', 'admin.disdik@smaumu.go.id', '$2b$12$e0M2...hashSample', 'admin_instansi', '198503212008011002', '081234567890'),
(2, 'Dr. H. Bambang Soeprapto', 'verifikator.zonasi@smaumu.go.id', '$2b$12$e0M2...hashSample', 'verifikator_zonasi', '197906152005021004', '081398765432'),
(3, 'Ombudsman Publik Pelapor', 'auditor.bebas@ombudsman.go.id', '$2b$12$e0M2...hashSample', 'auditor_publik', '198811122012012001', '081512345678'),
(4, 'Siti Nurhaliza (Orang Tua Siswa)', 'siti.nurhaliza@gmail.com', '$2b$12$e0M2...hashSample', 'masyarakat', NULL, '085711223344'),
(5, 'Budi Wicaksono (Orang Tua Siswa)', 'budi.wicak@gmail.com', '$2b$12$e0M2...hashSample', 'masyarakat', NULL, '087899887766');

-- Master Sekolah SMAN
INSERT INTO sekolah (id, npsn, nama_sekolah, alamat, kelurahan, kecamatan, kota_kabupaten, koordinat_lat, koordinat_lng, radius_zonasi_maks_meter, kuota_total_daya_tampung, telepon, website) VALUES
(1, '20101567', 'SMAN 1 Jakarta (Boedoet)', 'Jl. Budi Utomo No.7, Ps. Baru', 'Pasar Baru', 'Sawah Besar', 'Jakarta Pusat', -6.166881, 106.837319, 3200.00, 288, '(021) 3865001', 'https://sman1jkt.sch.id'),
(2, '20102554', 'SMAN 8 Jakarta (Bukit Duri)', 'Jl. Taman Bukit Duri No.2, Bukit Duri', 'Bukit Duri', 'Tebet', 'Jakarta Selatan', -6.223400, 106.858712, 3500.00, 360, '(021) 8295455', 'https://sman8jkt.sch.id'),
(3, '20103289', 'SMAN 34 Jakarta (Pondok Labu)', 'Jl. Margasatwa No.1, Pondok Labu', 'Pondok Labu', 'Cilandak', 'Jakarta Selatan', -6.311740, 106.799320, 3800.00, 324, '(021) 7502345', 'https://sman34jkt.sch.id'),
(4, '20107812', 'SMAN 28 Jakarta (Pasar Minggu)', 'Jl. Ragunan No.14, Pasar Minggu', 'Pasar Minggu', 'Pasar Minggu', 'Jakarta Selatan', -6.289120, 106.835420, 3400.00, 288, '(021) 7800921', 'https://sman28jkt.sch.id'),
(5, '20104112', 'SMAN 70 Jakarta (Bulungan)', 'Jl. Bulungan Blok C No.1, Kramat Pela', 'Kramat Pela', 'Kebayoran Baru', 'Jakarta Selatan', -6.241512, 106.797821, 3500.00, 360, '(021) 7221234', 'https://sman70jkt.sch.id');

-- Master Kuota Sekolah
INSERT INTO kuota_sekolah (sekolah_id, pengguna_id, jalur, persentase_kuota, total_kuota, kuota_terisi, pendaftar_total, burn_rate_per_jam, perkiraan_kursi_penuh_jam, status_jalur) VALUES
(1, 1, 'zonasi', 50.00, 144, 118, 230, 8.4, 3.1, 'kritis'),
(1, 1, 'afirmasi', 20.00, 58, 41, 62, 2.1, 8.1, 'buka'),
(1, 1, 'prestasi_akademik', 20.00, 58, 54, 142, 6.5, 0.6, 'hampir_penuh'),
(1, 1, 'perpindahan_tugas', 10.00, 28, 12, 16, 0.8, 20.0, 'buka'),
(2, 1, 'zonasi', 50.00, 180, 164, 390, 14.2, 1.1, 'hampir_penuh'),
(2, 1, 'prestasi_akademik', 25.00, 90, 88, 310, 11.0, 0.2, 'hampir_penuh'),
(3, 1, 'zonasi', 50.00, 162, 110, 195, 7.3, 7.1, 'buka'),
(4, 1, 'zonasi', 50.00, 144, 98, 180, 6.2, 7.4, 'buka'),
(5, 1, 'zonasi', 50.00, 180, 150, 280, 9.8, 3.0, 'kritis');

-- Data Pendaftaran Sample (Mendukung Fitur Dual-Truth & Geo-Discrepancy)
INSERT INTO pendaftaran (
    id, nomor_tiket, pengguna_id, sekolah_id, jalur, nama_siswa, nik, nisn, asal_sekolah_smp,
    alamat_domisili, lama_tinggal_bulan, klaim_koordinat_lat, klaim_koordinat_lng,
    resmi_koordinat_lat, resmi_koordinat_lng, jarak_klaim_meter, jarak_resmi_gis_meter,
    geo_anomaly_status, klaim_nilai_rapor, dapodik_nilai_rapor, dual_truth_status,
    dokumen_kk_url, hash_tanda_terima, status_tahapan, catatan_verifikator, verifikator_id
) VALUES
(
    1, 'TIKET-SMU-2026-098214', 4, 1, 'zonasi', 'Aditya Pratama Putra', '3171012304090001', '0089123456', 'SMPN 1 Jakarta',
    'Jl. Budi Utomo No. 12, Sawah Besar, Jakarta Pusat', 26, -6.167200, 106.837800,
    -6.167210, 106.837820, 120.50, 124.20, 'aman', 88.50, 88.50, 'terverifikasi_cocok',
    '/documents/kk_sample_1.pdf', '0x7e8f12a884b2c1d3f9a77e5b12', 'diterima_resmi', 'Validasi NIK Dukcapil & Geocoding cocok sempurna', 2
),
(
    2, 'TIKET-SMU-2026-098215', 5, 2, 'zonasi', 'Reyhan Bagas Saputra', '3174021208090004', '0087654321', 'SMPN 115 Jakarta',
    'Jl. Bukit Duri Tanjakan No. 44, Tebet, Jakarta Selatan', 4, -6.224100, 106.859200,
    -6.234500, 106.871000, 310.00, 1680.00, 'anomali_kritis_fraud', 91.20, 85.00, 'inkonsistensi_kritis',
    '/documents/kk_sample_2.pdf', '0x99b1a03e1c6674d812ef65', 'tinjauan_manual', 'Geo-Discrepancy terdeteksi 1.370 meter! Diduga geser pin GPS & Numpang KK < 1 tahun', 2
);

-- Data Laporan Civic Whistleblower
INSERT INTO laporan_warga (
    id, kode_laporan, pengguna_id, pendaftaran_id, kategori, judul, deskripsi, lampiran_bukti_url,
    is_anonim, nama_samaran, token_investigasi, status, tindak_lanjut_instansi, investigator_id
) VALUES
(
    1, 'WBL-2026-88192', 5, 2, 'manipulasi_koordinat', 'Indikasi Pemalsuan Titik Rumah pada Pendaftaran SMAN 8',
    'Pendaftar dengan NIK 3174021208090004 mencantumkan rumah di Jl. Bukit Duri Tanjakan, padahal fakta lapangan keluarga tersebut tinggal di Rawamangun dan baru menumpang KK pada Mei 2026.',
    '/bukti/foto_rumah_rawamangun.jpg', TRUE, 'Mata Publik Tebet', 'TOKEN-WBL-7719-XPQ', 'dalam_investigasi',
    'Tim verifikator telah menerbitkan Surat Panggilan Verifikasi Lapangan dan menangguhkan status tiket pendaftar bersangkutan.', 2
);

-- Data Immutable Audit Log (Genesis Block & Subsequent Action)
INSERT INTO audit_log (
    id, pengguna_id, aksi, entitas_terkait, entitas_id, deskripsi_tindakan, data_lama, data_baru,
    ip_address, prev_hash, curr_hash
) VALUES
(
    1, 1, 'GENESIS_SYSTEM_INIT', 'sistem', 0, 'Inisialisasi Master Kuota & Regulasi Zonasi WIA 2026',
    '{}'::jsonb, '{"versi": "1.0", "status": "aktif"}'::jsonb,
    '10.0.0.1', '0000000000000000000000000000000000000000000000000000000000000000',
    'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0'
),
(
    2, 2, 'FLAG_GEO_DISCREPANCY', 'pendaftaran', 2, 'Pemberian Status Anomali Kritis (Selisih > 1km) pada Tiket TIKET-SMU-2026-098215',
    '{"status_tahapan": "diajukan", "geo_anomaly_status": "aman"}'::jsonb,
    '{"status_tahapan": "tinjauan_manual", "geo_anomaly_status": "anomali_kritis_fraud"}'::jsonb,
    '192.168.1.45', 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    'f9e8d7c6b5a43210feebda90124578efca09876543210fedcba9876543210fed'
);
