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
  live_banner TEXT DEFAULT '',
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
  is_open BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create 'quota_audit_logs' table for Quota Audit Trail
CREATE TABLE IF NOT EXISTS public.quota_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  quota_id UUID REFERENCES public.admission_quotas(id) ON DELETE SET NULL,
  track_name TEXT NOT NULL,
  previous_seats INTEGER NOT NULL,
  new_seats INTEGER NOT NULL,
  previous_is_open BOOLEAN DEFAULT true,
  new_is_open BOOLEAN DEFAULT true,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create 'registrations' table for Student PPDB Applications
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  nisn VARCHAR(10) NOT NULL,
  path_type TEXT NOT NULL, -- 'Zonasi', 'Prestasi', 'Afirmasi', 'Mutasi Orang Tua'
  documents JSONB DEFAULT '[]'::jsonb, -- Berkas pendaftaran (KK, Ijazah/SKL, Dokumen Jalur)
  status TEXT NOT NULL DEFAULT 'Menunggu Verifikasi', -- 'Menunggu Verifikasi', 'Diterima', 'Ditolak'
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migration checks if columns were created earlier
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS live_banner TEXT DEFAULT '';
ALTER TABLE public.admission_quotas ADD COLUMN IF NOT EXISTS is_open BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Aturan 1 Siswa 1 Pendaftaran (Unique per student_id and nisn)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_registration_nisn') THEN
    ALTER TABLE public.registrations ADD CONSTRAINT unique_registration_nisn UNIQUE (nisn);
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;


-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_schools_district ON public.schools(district);
CREATE INDEX IF NOT EXISTS idx_schools_admin_id ON public.schools(admin_id);
CREATE INDEX IF NOT EXISTS idx_quotas_school_id ON public.admission_quotas(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_school_id ON public.quota_audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.quota_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_school_id ON public.registrations(school_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student_id ON public.registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

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

-- Quota Audit Logs Policies
ALTER TABLE public.quota_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Audit Logs" ON public.quota_audit_logs;
CREATE POLICY "Public Read Audit Logs" 
  ON public.quota_audit_logs FOR SELECT 
  TO public 
  USING (true);

DROP POLICY IF EXISTS "Admin Insert Audit Logs" ON public.quota_audit_logs;
CREATE POLICY "Admin Insert Audit Logs" 
  ON public.quota_audit_logs FOR INSERT 
  TO authenticated 
  WITH CHECK (
    school_id IN (
      SELECT id FROM public.schools WHERE admin_id = auth.uid()
    )
  );

-- Table permissions for PostgREST schema cache
GRANT ALL ON TABLE public.schools TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.admission_quotas TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.quota_audit_logs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.registrations TO anon, authenticated, service_role;

-- Registrations Policies
DROP POLICY IF EXISTS "Student Select Own Registrations" ON public.registrations;
CREATE POLICY "Student Select Own Registrations"
  ON public.registrations FOR SELECT
  TO authenticated, anon
  USING (
    student_id = auth.uid() OR
    school_id IN (SELECT id FROM public.schools WHERE admin_id = auth.uid()) OR
    auth.uid() IS NULL
  );

DROP POLICY IF EXISTS "Student Insert Registration" ON public.registrations;
CREATE POLICY "Student Insert Registration"
  ON public.registrations FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Update Registration Status" ON public.registrations;
CREATE POLICY "Admin Update Registration Status"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (
    school_id IN (SELECT id FROM public.schools WHERE admin_id = auth.uid())
  )
  WITH CHECK (
    school_id IN (SELECT id FROM public.schools WHERE admin_id = auth.uid())
  );

-- 6. Enable Realtime on admission_quotas, quota_audit_logs, and registrations
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

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'quota_audit_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.quota_audit_logs;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'registrations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;
  END IF;
END $$;

-- Reload PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';

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
