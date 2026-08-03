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

  async getGuruById(id) {
    if (!id) return null;
    const { data, error } = await window.supabase.from('profiles').select('*').eq('id', id).single();
    if (error || !data) {
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
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  },
  
  async getAllKelas() {
    const { data, error } = await window.supabase.from('kelas').select('*');
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  },
  
  async getSiswaByKelas(kelasId) {
    const { data, error } = await window.supabase.from('siswa').select('nama').eq('kelas_id', kelasId);
    if (error) {
      console.error(error);
      return [];
    }
    return (data || []).map(s => s.nama);
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
      
    if (error || !data) {
      console.error(error);
      return [];
    }
    return data.map(d => d.profiles).filter(Boolean);
  },
  
  async getGuruAbsenHariIni() {
    // To be implemented fully later, for now return empty
    return [];
  },
  
  async getWeeklyData() {
    // To be implemented from actual laporan_piket data
    return [
      { hari: 'Sen', value: 0 },
      { hari: 'Sel', value: 0 },
      { hari: 'Rab', value: 0 },
      { hari: 'Kam', value: 0 },
      { hari: 'Jum', value: 0 },
    ];
  },
  
  async submitLaporanPiket(laporanData) {
    // laporanData = { sesi, catatan, petugas_1, petugas_2, absensi: [{namaSiswa, kelas_id, status}], foto_url: '...' }
    
    // 1. Insert Laporan
    const { data: laporan, error: lapErr } = await window.supabase
      .from('laporan_piket')
      .insert({
        tanggal: new Date().toISOString().split('T')[0],
        sesi: laporanData.sesi,
        guru_id: laporanData.petugas_1,
        catatan: `[Petugas 1: ${laporanData.petugas_1}, Petugas 2: ${laporanData.petugas_2}] ` + laporanData.catatan,
        status: laporanData.status || 'Selesai',
        foto_url: laporanData.foto_url || null
      })
      .select()
      .single();
      
    if (lapErr) {
      console.error("Failed to submit laporan", lapErr);
      throw lapErr;
    }
    
    // 2. Insert Absensi Siswa
    if (laporanData.absensi && laporanData.absensi.length > 0) {
      const names = laporanData.absensi.map(a => a.namaSiswa);
      const { data: siswaData, error: siswaErr } = await window.supabase.from('siswa').select('id, nama').in('nama', names);
      
      if (siswaErr) console.error("Error fetching siswa IDs", siswaErr);
      
      const absensiInserts = laporanData.absensi.map(ab => {
        const s = siswaData?.find(sd => sd.nama === ab.namaSiswa);
        return {
          laporan_id: laporan.id,
          siswa_id: s ? s.id : null,
          status: ab.status
        };
      }).filter(a => a.siswa_id !== null);
      
      if (absensiInserts.length > 0) {
        const { error: absErr } = await window.supabase.from('absensi_piket').insert(absensiInserts);
        if (absErr) console.error("Failed to insert absensi", absErr);
      }
    }
    
    return laporan;
  },
  
  async submitIzinGuru(izinData) {
    // dummy submit for izin (future feature)
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
      
    if (error) {
      console.error(error);
      return [];
    }
    
    return data.map(d => ({
      id: d.id,
      tanggal: d.tanggal,
      sesi: d.sesi,
      petugas_nama: d.profiles?.nama || 'Unknown',
      siswaAbsen: 0, // Should be calculated with a join to absensi_piket
      status: d.status
    }));
  },
  
  async getRiwayatExport() {
    return [];
  },
  
  async getAktivitasGuru() {
    return [];
  }
};
