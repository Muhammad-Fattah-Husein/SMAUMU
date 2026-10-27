-- ========================================================
-- SMAUMU (SMA UntukMu) - Database Schema for Supabase
-- Civic-Tech SMAN Admission Quota Transparency Platform
-- (Idempotent: Aman dijalankan berkali-kali tanpa error)
-- ========================================================

-- 1. Enable UUID Extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create 'schools' table
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create 'admission_quotas' table
CREATE TABLE IF NOT EXISTS public.admission_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  track_name TEXT NOT NULL, -- Contoh: 'Zonasi', 'Prestasi', 'Afirmasi', 'Mutasi Orang Tua'
  total_seats INTEGER NOT NULL DEFAULT 0,
  filled_seats INTEGER NOT NULL DEFAULT 0,
  available_seats INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_schools_district ON public.schools(district);
CREATE INDEX IF NOT EXISTS idx_schools_admin_id ON public.schools(admin_id);
CREATE INDEX IF NOT EXISTS idx_quotas_school_id ON public.admission_quotas(school_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_quotas ENABLE ROW LEVEL SECURITY;

-- 5. Define RLS Policies (Drop terlebih dahulu jika sudah ada agar tidak bentrok)

-- Public Read Access: Siswa kelas 9 & publik dapat membaca seluruh data sekolah & kuota
DROP POLICY IF EXISTS "Public Read Schools" ON public.schools;
CREATE POLICY "Public Read Schools" 
  ON public.schools FOR SELECT 
  TO public 
  USING (true);

DROP POLICY IF EXISTS "Public Read Quotas" ON public.admission_quotas;
CREATE POLICY "Public Read Quotas" 
  ON public.admission_quotas FOR SELECT 
  TO public 
  USING (true);

-- Admin Update Access: Petugas admin SMAN hanya dapat memperbarui kuota sekolah yang ditugaskan ke admin_id mereka
DROP POLICY IF EXISTS "Admin Update Assigned School Quotas" ON public.admission_quotas;
CREATE POLICY "Admin Update Assigned School Quotas" 
  ON public.admission_quotas FOR UPDATE 
  TO authenticated 
  USING (
    school_id IN (
      SELECT id FROM public.schools WHERE admin_id = auth.uid()
    )
  )
  WITH CHECK (
    school_id IN (
      SELECT id FROM public.schools WHERE admin_id = auth.uid()
    )
  );

-- Admin Select & Update Schools Policy
DROP POLICY IF EXISTS "Admin Update Assigned School Profile" ON public.schools;
CREATE POLICY "Admin Update Assigned School Profile" 
  ON public.schools FOR UPDATE 
  TO authenticated 
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

-- 6. Enable Realtime on admission_quotas
-- Cek apakah tabel sudah terdaftar di publication agar tidak memunculkan error duplicate
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'admission_quotas'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.admission_quotas;
  END IF;
END $$;

-- ========================================================
-- 7. Initial Seed Data (Hanya ditambahkan jika tabel masih kosong)
-- ========================================================

DO $$
DECLARE
  sch1 UUID;
  sch2 UUID;
  sch3 UUID;
  sch4 UUID;
BEGIN
  -- Cek jika data SMAN 1 Jakarta belum ada, masukkan data awal
  IF NOT EXISTS (SELECT 1 FROM public.schools WHERE name = 'SMAN 1 Jakarta') THEN
    
    -- SMAN 1 Jakarta
    INSERT INTO public.schools (name, district, address)
    VALUES ('SMAN 1 Jakarta', 'Jakarta Pusat', 'Jl. Budi Utomo No. 7, Pasar Baru')
    RETURNING id INTO sch1;

    INSERT INTO public.admission_quotas (school_id, track_name, total_seats, filled_seats, available_seats) VALUES
      (sch1, 'Zonasi', 144, 138, 6),
      (sch1, 'Prestasi', 72, 70, 2),
      (sch1, 'Afirmasi', 48, 40, 8),
      (sch1, 'Mutasi Orang Tua', 16, 16, 0);

    -- SMAN 8 Jakarta
    INSERT INTO public.schools (name, district, address)
    VALUES ('SMAN 8 Jakarta', 'Jakarta Selatan', 'Jl. Taman Bukit Duri, Tebet')
    RETURNING id INTO sch2;

    INSERT INTO public.admission_quotas (school_id, track_name, total_seats, filled_seats, available_seats) VALUES
      (sch2, 'Zonasi', 160, 155, 5),
      (sch2, 'Prestasi', 80, 80, 0),
      (sch2, 'Afirmasi', 50, 42, 8),
      (sch2, 'Mutasi Orang Tua', 10, 9, 1);

    -- SMAN 3 Bandung
    INSERT INTO public.schools (name, district, address)
    VALUES ('SMAN 3 Bandung', 'Bandung Wetan', 'Jl. Belitung No. 8, Merdeka')
    RETURNING id INTO sch3;

    INSERT INTO public.admission_quotas (school_id, track_name, total_seats, filled_seats, available_seats) VALUES
      (sch3, 'Zonasi', 150, 130, 20),
      (sch3, 'Prestasi', 75, 60, 15),
      (sch3, 'Afirmasi', 50, 45, 5),
      (sch3, 'Mutasi Orang Tua', 15, 12, 3);

    -- SMAN 5 Surabaya
    INSERT INTO public.schools (name, district, address)
    VALUES ('SMAN 5 Surabaya', 'Genteng', 'Jl. Kusuma Bangsa No. 21')
    RETURNING id INTO sch4;

    INSERT INTO public.admission_quotas (school_id, track_name, total_seats, filled_seats, available_seats) VALUES
      (sch4, 'Zonasi', 160, 140, 20),
      (sch4, 'Prestasi', 80, 72, 8),
      (sch4, 'Afirmasi', 50, 38, 12);

  END IF;
END $$;
