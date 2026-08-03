-- Schema untuk Aplikasi SIPINTER

-- 1. Tabel Profil (Menyimpan detail guru/admin/kepsek yang login)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('guru', 'admin', 'kepsek')),
  nama TEXT NOT NULL,
  nip TEXT UNIQUE,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tabel Kelas
CREATE TABLE kelas (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  jenjang TEXT NOT NULL CHECK (jenjang IN ('X', 'XI', 'XII')),
  jurusan TEXT NOT NULL CHECK (jurusan IN ('IPA', 'IPS', 'Perhotelan', 'TKJ'))
);

-- 3. Tabel Siswa
CREATE TABLE siswa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kelas_id TEXT REFERENCES kelas(id) ON DELETE CASCADE,
  nama TEXT NOT NULL
);

-- 4. Tabel Jadwal Piket
CREATE TABLE jadwal_piket (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hari TEXT NOT NULL CHECK (hari IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')),
  guru_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- 5. Tabel Laporan Piket
CREATE TABLE laporan_piket (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL,
  sesi TEXT NOT NULL CHECK (sesi IN ('Pagi', 'Siang')),
  guru_id UUID REFERENCES profiles(id),
  catatan TEXT,
  foto_url TEXT,
  status TEXT DEFAULT 'Selesai',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Tabel Absensi Piket (Siswa tidak hadir)
CREATE TABLE absensi_piket (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  laporan_id UUID REFERENCES laporan_piket(id) ON DELETE CASCADE,
  siswa_id UUID REFERENCES siswa(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Sakit', 'Izin', 'Alpha'))
);

-- Setup RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal_piket ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporan_piket ENABLE ROW LEVEL SECURITY;
ALTER TABLE absensi_piket ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users for now
CREATE POLICY "Allow read for authenticated" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated" ON kelas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated" ON siswa FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated" ON jadwal_piket FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated" ON laporan_piket FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for authenticated" ON absensi_piket FOR SELECT TO authenticated USING (true);

-- Allow insert/update for piket reports
CREATE POLICY "Allow insert for authenticated" ON laporan_piket FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow insert for authenticated" ON absensi_piket FOR INSERT TO authenticated WITH CHECK (true);

-- Allow admin to manage profiles (insert/update/delete)
CREATE POLICY "Allow insert profiles for authenticated" ON profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update profiles for authenticated" ON profiles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete profiles for authenticated" ON profiles FOR DELETE TO authenticated USING (true);

-- Allow admin to manage kelas (insert/update/delete)
CREATE POLICY "Allow insert kelas for authenticated" ON kelas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update kelas for authenticated" ON kelas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete kelas for authenticated" ON kelas FOR DELETE TO authenticated USING (true);

-- Allow admin to manage siswa (insert/update/delete)
CREATE POLICY "Allow insert siswa for authenticated" ON siswa FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update siswa for authenticated" ON siswa FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow delete siswa for authenticated" ON siswa FOR DELETE TO authenticated USING (true);

-- =============================================================
-- MIGRATION: Run this if upgrading from older schema
-- =============================================================
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nip TEXT UNIQUE;
-- DROP COLUMN IF EXISTS mapel;
-- DROP COLUMN IF EXISTS panggilan;


-- Dummy Data Kelas
INSERT INTO kelas (id, nama, jenjang, jurusan) VALUES
('x-ipa-1', 'X IPA 1', 'X', 'IPA'),
('x-ips-1', 'X IPS 1', 'X', 'IPS'),
('xi-ipa-1', 'XI IPA 1', 'XI', 'IPA'),
('xii-tkj-1', 'XII TKJ 1', 'XII', 'TKJ');

-- Dummy Data Siswa
INSERT INTO siswa (kelas_id, nama) VALUES
('x-ipa-1', 'Ahmad Fauzi'), ('x-ipa-1', 'Budi Santoso'),
('x-ips-1', 'Andi Saputra'), ('x-ips-1', 'Bella Oktavia');
