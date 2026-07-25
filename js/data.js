window.APP_DATA = {
  // Constants
  jurusan: ['IPA', 'IPS', 'Perhotelan', 'TKJ'],
  jenjang: ['X', 'XI', 'XII'],
  
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
    // ID here is auth.user.id (UUID)
    const { data, error } = await window.supabase.from('profiles').select('*').eq('id', id).single();
    if (error) {
      console.error(error);
      return null;
    }
    return data;
  },
  
  async getKelasByFilter(jenjang, jurusan) {
    let query = window.supabase.from('kelas').select('*');
    if (jenjang) query = query.eq('jenjang', jenjang);
    if (jurusan) query = query.eq('jurusan', jurusan);
    
    const { data, error } = await query;
    if (error) return [];
    return data;
  },
  
  async getSiswaByKelas(kelasId) {
    const { data, error } = await window.supabase.from('siswa').select('nama').eq('kelas_id', kelasId);
    if (error) return [];
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
      
    if (error || !data) return false;
    return true;
  },
  
  async getPetugasPiketHariIni() {
    const hari = this.getHariIni();
    const { data, error } = await window.supabase
      .from('jadwal_piket')
      .select('guru_id, profiles(*)')
      .eq('hari', hari);
      
    if (error) return [];
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
    // laporanData = { sesi, catatan, foto_url, status, guru_id, absensi: [{namaSiswa, status}] }
    
    // 1. Insert Laporan
    const { data: laporan, error: lapErr } = await window.supabase
      .from('laporan_piket')
      .insert({
        tanggal: new Date().toISOString().split('T')[0],
        sesi: laporanData.sesi,
        guru_id: laporanData.guru_id,
        catatan: laporanData.catatan,
        foto_url: laporanData.foto_url,
        status: laporanData.status || 'Selesai'
      })
      .select()
      .single();
      
    if (lapErr) throw lapErr;
    
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
  
  async getLaporanPiket() {
    const { data, error } = await window.supabase
      .from('laporan_piket')
      .select('id, tanggal, sesi, status, profiles(nama)')
      .order('created_at', { ascending: false });
      
    if (error) return [];
    
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
