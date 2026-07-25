window.APP_DATA = {
  // Constants
  jurusan: ['IPA', 'IPS', 'Perhotelan', 'TKJ'],
  jenjang: ['X', 'XI', 'XII'],
  
  // Dummy Fallbacks for Demo
  dummyGuru: [
    { id: 'd-guru-1', nama: 'Budi Santoso, S.Pd', mapel: 'Matematika', panggilan: 'Pak Budi', role: 'guru', avatar: 'BS' },
    { id: 'd-guru-2', nama: 'Siti Aminah, M.Pd', mapel: 'Biologi', panggilan: 'Bu Siti', role: 'guru', avatar: 'SA' },
    { id: 'd-guru-3', nama: 'Agus Prasetyo, S.Pd', mapel: 'Fisika', panggilan: 'Pak Agus', role: 'guru', avatar: 'AP' },
    { id: 'd-admin-1', nama: 'Tata Usaha', mapel: '-', panggilan: 'Admin', role: 'admin', avatar: 'AD' }
  ],
  dummyKelas: [
    { id: 'x-ipa-1', nama: 'X IPA 1', jenjang: 'X', jurusan: 'IPA' },
    { id: 'x-ips-1', nama: 'X IPS 1', jenjang: 'X', jurusan: 'IPS' },
    { id: 'x-pht-1', nama: 'X PHT 1', jenjang: 'X', jurusan: 'Perhotelan' },
    { id: 'xi-ipa-1', nama: 'XI IPA 1', jenjang: 'XI', jurusan: 'IPA' },
    { id: 'xii-tkj-1', nama: 'XII TKJ 1', jenjang: 'XII', jurusan: 'TKJ' },
  ],
  dummySiswa: [
    'Ahmad Fauzi', 'Budi Santoso', 'Citra Kirana', 'Dewi Lestari', 'Eko Prasetyo', 'Fajar Ramadhan', 'Gita Gutawa', 'Hadi Sucipto'
  ],
  dummyLaporan: [
    { id: 'lap-1', tanggal: new Date().toISOString().split('T')[0], sesi: 'Pagi', status: 'Selesai', petugas_nama: 'Budi Santoso, S.Pd', siswaAbsen: 2 },
    { id: 'lap-2', tanggal: new Date(Date.now() - 86400000).toISOString().split('T')[0], sesi: 'Siang', status: 'Selesai', petugas_nama: 'Siti Aminah, M.Pd', siswaAbsen: 0 },
  ],
  
  // Auth
  async login(email, password) {
    const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Fetch profile
    const { data: profile, error: profileError } = await window.supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) throw profileError;
    return profile;
  },
  
  async logout() {
    await window.supabase.auth.signOut();
  },

  // Helper methods now async
  async getGuruById(id) {
    if (!id || id.startsWith('d-')) return this.dummyGuru.find(g => g.id === id) || this.dummyGuru[0];
    const { data, error } = await window.supabase.from('profiles').select('*').eq('id', id).single();
    if (error || !data) {
      console.error(error);
      return this.dummyGuru[0];
    }
    return data;
  },
  
  async getKelasByFilter(jenjang, jurusan) {
    let query = window.supabase.from('kelas').select('*');
    if (jenjang) query = query.eq('jenjang', jenjang);
    if (jurusan) query = query.eq('jurusan', jurusan);
    
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return this.dummyKelas.filter(k => (!jenjang || k.jenjang === jenjang) && (!jurusan || k.jurusan === jurusan));
    }
    return data;
  },
  
  async getAllKelas() {
    const { data, error } = await window.supabase.from('kelas').select('*');
    if (error || !data || data.length === 0) {
      return this.dummyKelas;
    }
    return data;
  },
  
  async getSiswaByKelas(kelasId) {
    const { data, error } = await window.supabase.from('siswa').select('nama').eq('kelas_id', kelasId);
    if (error || !data || data.length === 0) return this.dummySiswa;
    return data.map(s => s.nama);
  },
  
  getHariIni() {
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return hari[new Date().getDay()];
  },
  
  getTanggalFormatted() {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date();
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  },
  
  getHariTanggal() {
    return `${this.getHariIni()}, ${this.getTanggalFormatted()}`;
  },
  
  async isJadwalPiket(guruId) {
    const hari = this.getHariIni();
    const { data, error } = await window.supabase
      .from('jadwal_piket')
      .select('id')
      .eq('hari', hari)
      .eq('guru_id', guruId)
      .single();
      
    if (error || !data) return true; // Demo fallback: Always true so client can see the Piket tab
    return true;
  },
  
  async getPetugasPiketHariIni() {
    const hari = this.getHariIni();
    const { data, error } = await window.supabase
      .from('jadwal_piket')
      .select('guru_id, profiles(*)')
      .eq('hari', hari);
      
    if (error || !data || data.length === 0) {
      // Return current guru + one dummy
      const cg = window.APP_STATE.currentGuru;
      return [cg, this.dummyGuru[1]].filter(Boolean);
    }
    return data.map(d => d.profiles);
  },
  
  async getGuruAbsenHariIni() {
    // Dummy async fallback (can be implemented later)
    return [
      { guru: { nama: 'Siti Aminah, M.Pd' }, alasan: 'Sakit - Biologi Kls 11', pengganti: 'Diganti: A. Rani' },
      { guru: { nama: 'Agus Prasetyo, S.Pd' }, alasan: 'Izin - Matematika Kls 12', pengganti: null },
    ];
  },
  
  async getWeeklyData() {
    // Dummy async fallback for charts
    return [
      { hari: 'Sen', value: 95 },
      { hari: 'Sel', value: 88 },
      { hari: 'Rab', value: 92 },
      { hari: 'Kam', value: 97 },
      { hari: 'Jum', value: 85 },
    ];
  },
  
  async submitLaporanPiket(laporanData) {
    // laporanData = { sesi, catatan, petugas_1, petugas_2, absensi: [{namaSiswa, kelas_id, status}] }
    
    // 1. Insert Laporan
    const { data: laporan, error: lapErr } = await window.supabase
      .from('laporan_piket')
      .insert({
        tanggal: new Date().toISOString().split('T')[0],
        sesi: laporanData.sesi,
        guru_id: laporanData.petugas_1, // Using petugas_1 as main guru_id for backward compatibility
        catatan: `[Petugas 1: ${laporanData.petugas_1}, Petugas 2: ${laporanData.petugas_2}] ` + laporanData.catatan,
        status: laporanData.status || 'Selesai'
      })
      .select()
      .single();
      
    if (lapErr) {
      console.warn("Real supabase failed, using dummy submit");
      return { id: 'dummy-lap', ...laporanData };
    }
    
    // 2. Insert Absensi Siswa
    if (laporanData.absensi && laporanData.absensi.length > 0) {
      // First, get the siswa IDs based on names (simplified for this prototype, usually we pass IDs directly)
      const names = laporanData.absensi.map(a => a.namaSiswa);
      const { data: siswaData } = await window.supabase.from('siswa').select('id, nama').in('nama', names);
      
      const absensiInserts = laporanData.absensi.map(ab => {
        const s = siswaData?.find(sd => sd.nama === ab.namaSiswa);
        return {
          laporan_id: laporan.id,
          siswa_id: s ? s.id : null,
          status: ab.status
        };
      }).filter(a => a.siswa_id !== null);
      
      if (absensiInserts.length > 0) {
        await window.supabase.from('absensi_piket').insert(absensiInserts);
      }
    }
    
    return laporan;
  },
  
  async submitIzinGuru(izinData) {
    // dummy submit for izin
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ id: 'izin-' + Date.now(), status: 'Menunggu Konfirmasi', ...izinData });
      }, 800);
    });
  },
  
  async getLaporanPiket() {
    const { data, error } = await window.supabase
      .from('laporan_piket')
      .select('id, tanggal, sesi, status, profiles(nama)')
      .order('created_at', { ascending: false });
      
    if (error || !data || data.length === 0) return this.dummyLaporan;
    
    return data.map(d => ({
      id: d.id,
      tanggal: d.tanggal,
      sesi: d.sesi,
      petugas_nama: d.profiles?.nama,
      siswaAbsen: 0, // calculate later
      status: d.status
    }));
  },
  
  async getRiwayatExport() {
    return [
      { nama: 'Rekap_Kehadiran_Okt23.xlsx', waktu: 'Hari ini, 09:41', size: '2.4 MB' },
      { nama: 'Detail_Absen_Kelas_X.xlsx', waktu: 'Kemarin, 14:20', size: '1.1 MB' },
    ];
  },
  
  async getAktivitasGuru() {
    return [
      { icon: 'login', title: 'Absensi Masuk Berhasil', subtitle: 'Melalui Pemindai Wajah', time: '06:45', color: 'success' },
      { icon: 'update', title: 'Jadwal Diperbarui', subtitle: 'Admin mengubah jadwal mengajar Anda.', time: 'Kemarin', color: 'primary' },
    ];
  }
};
