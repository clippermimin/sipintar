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
    
    // Fetch names of Petugas 1 and Petugas 2
    let p1Name = "Petugas 1";
    let p2Name = "Petugas 2";
    const { data: petugasData } = await window.supabase
      .from('profiles')
      .select('id, nama')
      .in('id', [laporanData.petugas_1, laporanData.petugas_2]);
      
    if (petugasData) {
      const p1 = petugasData.find(p => p.id === laporanData.petugas_1);
      const p2 = petugasData.find(p => p.id === laporanData.petugas_2);
      if (p1) p1Name = p1.nama;
      if (p2) p2Name = p2.nama;
    }

    // 1. Insert Laporan
    const { data: laporan, error: lapErr } = await window.supabase
      .from('laporan_piket')
      .insert({
        tanggal: new Date().toISOString().split('T')[0],
        sesi: laporanData.sesi,
        guru_id: laporanData.petugas_1,
        catatan: `[Petugas 1: ${p1Name}, Petugas 2: ${p2Name}] ` + laporanData.catatan,
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
      let absensiInserts = [];
      const needsLookup = laporanData.absensi.some(ab => ab.siswa_id === 'undefined' || ab.siswa_id === 'null' || !ab.siswa_id);
      
      let siswaData = [];
      if (needsLookup) {
        const names = laporanData.absensi.map(a => a.namaSiswa).filter(Boolean);
        if (names.length > 0) {
          const { data } = await window.supabase.from('siswa').select('id, nama').in('nama', names);
          siswaData = data || [];
        }
      }

      absensiInserts = laporanData.absensi.map(ab => {
        let sid = (ab.siswa_id === 'undefined' || ab.siswa_id === 'null' || !ab.siswa_id) ? null : ab.siswa_id;
        if (!sid && ab.namaSiswa) {
           const s = siswaData.find(sd => sd.nama === ab.namaSiswa);
           if (s) sid = s.id;
        }
        return {
          laporan_id: laporan.id,
          siswa_id: sid,
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
    // Wrapper ke submitPresensi untuk Izin/Sakit dari luar area
    return this.submitPresensi({
      status: izinData.jenis, // 'Sakit', 'Izin Pribadi', 'Dinas Luar', 'Cuti'
      catatan: izinData.alasan,
      foto_url: null,
      latitude: null,
      longitude: null
    });
  },

  async submitPresensi(data) {
    const guru = window.APP_STATE.currentGuru || {};
    const now = new Date();
    const getLocal = (d, type) => {
      if (type === 'date') return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (type === 'time') return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
    };

    let foto_url = null;
    // Upload foto jika ada (sudah berupa blob terkompresi)
    if (data.fotoBlob) {
      const fileName = `${guru.id}_${Date.now()}.jpg`;
      const { data: uploadData, error: uploadErr } = await window.supabase.storage
        .from('presensi-foto')
        .upload(fileName, data.fotoBlob, { contentType: 'image/jpeg', upsert: false });
      if (uploadErr) {
        console.error('Upload foto gagal:', uploadErr);
      } else {
        const { data: urlData } = window.supabase.storage.from('presensi-foto').getPublicUrl(fileName);
        foto_url = urlData?.publicUrl || null;
      }
    }

    const { data: result, error } = await window.supabase
      .from('presensi')
      .insert({
        guru_id: guru.id,
        tanggal: getLocal(now, 'date'),
        waktu: getLocal(now, 'time'),
        status: data.status,
        foto_url: foto_url,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        catatan: data.catatan || null
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getPresensiHariIni(guruId) {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const { data, error } = await window.supabase
      .from('presensi')
      .select('*')
      .eq('guru_id', guruId)
      .eq('tanggal', today)
      .maybeSingle();
    if (error) { console.error(error); return null; }
    return data;
  },

  async getPengaturanSekolah() {
    const { data, error } = await window.supabase
      .from('pengaturan_sekolah')
      .select('*')
      .limit(1)
      .single();
    if (error || !data) {
      // Default fallback jika tabel belum ada
      return { nama_sekolah: 'Sekolah', lat_sekolah: -6.2088, lng_sekolah: 106.8456, radius_meter: 200 };
    }
    return data;
  },

  async updatePengaturanSekolah(id, updateData) {
    const { data, error } = await window.supabase
      .from('pengaturan_sekolah')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getRekapPresensi(startDate, endDate) {
    let query = window.supabase
      .from('presensi')
      .select('*, profiles!guru_id(nama, nip)')
      .order('tanggal', { ascending: false })
      .order('waktu', { ascending: false });
    if (startDate) query = query.gte('tanggal', startDate);
    if (endDate) query = query.lte('tanggal', endDate);
    const { data, error } = await query;
    if (error) { console.error(error); return []; }
    return data || [];
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
    const guru = window.APP_STATE.currentGuru;
    if (!guru) return [];
    
    const { data } = await window.supabase
      .from('laporan_piket')
      .select('id, tanggal, sesi, created_at, status')
      .eq('guru_id', guru.id)
      .order('created_at', { ascending: false })
      .limit(3);
      
    if (!data) return [];
    
    return data.map(d => {
      const dateObj = new Date(d.created_at);
      const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':') + ' WIB';
      return {
        icon: 'assignment_turned_in',
        color: d.status === 'Selesai' ? 'success' : 'primary',
        title: `Laporan Piket ${d.sesi}`,
        subtitle: `Tanggal ${d.tanggal}`,
        time: timeStr
      };
    });
  },
  
  async getSiswaAbsenHariIni() {
    const today = (await window.APP_DATA.getHariTanggal()).tanggal || new Date().toISOString().split('T')[0];
    const { data, error } = await window.supabase
      .from('absensi_piket')
      .select(`
        status,
        siswa ( nama, kelas ( nama, jenjang, jurusan ) ),
        laporan_piket!inner ( tanggal )
      `)
      .eq('laporan_piket.tanggal', today);
      
    if (error) {
      console.error(error);
      return [];
    }
    
    return data.map(d => {
      const s = d.siswa || {};
      const k = s.kelas || {};
      const namaKelas = k.nama || `${k.jenjang} ${k.jurusan}`.trim() || 'Unknown';
      return {
        nama: s.nama || 'Unknown',
        kelas: namaKelas,
        status: d.status
      };
    });
  },
  
  async getLaporanPiketById(id) {
    const { data, error } = await window.supabase
      .from('laporan_piket')
      .select(`
        *,
        absensi_piket (
          siswa_id, status,
          siswa (nama, kelas_id)
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateLaporanPiket(id, laporanData) {
    // 1. Update Laporan Piket
    let p1Name = "Petugas 1";
    let p2Name = "Petugas 2";
    const { data: petugasData } = await window.supabase
      .from('profiles')
      .select('id, nama')
      .in('id', [laporanData.petugas_1, laporanData.petugas_2]);
      
    if (petugasData) {
      const p1 = petugasData.find(p => p.id === laporanData.petugas_1);
      const p2 = petugasData.find(p => p.id === laporanData.petugas_2);
      if (p1) p1Name = p1.nama;
      if (p2) p2Name = p2.nama;
    }

    const { error: lapErr } = await window.supabase
      .from('laporan_piket')
      .update({
        sesi: laporanData.sesi,
        guru_id: laporanData.petugas_1,
        catatan: `[Petugas 1: ${p1Name}, Petugas 2: ${p2Name}] ` + laporanData.catatan,
        status: laporanData.status || 'Selesai'
      })
      .eq('id', id);

    if (lapErr) throw lapErr;

    // 2. Refresh Absensi
    await window.supabase.from('absensi_piket').delete().eq('laporan_id', id);

    if (laporanData.absensi && laporanData.absensi.length > 0) {
      let absensiInserts = [];
      const needsLookup = laporanData.absensi.some(ab => ab.siswa_id === 'undefined' || ab.siswa_id === 'null' || !ab.siswa_id);
      
      let siswaData = [];
      if (needsLookup) {
        const names = laporanData.absensi.map(a => a.namaSiswa).filter(Boolean);
        if (names.length > 0) {
          const { data } = await window.supabase.from('siswa').select('id, nama').in('nama', names);
          siswaData = data || [];
        }
      }

      absensiInserts = laporanData.absensi.map(ab => {
        let sid = (ab.siswa_id === 'undefined' || ab.siswa_id === 'null' || !ab.siswa_id) ? null : ab.siswa_id;
        if (!sid && ab.namaSiswa) {
           const s = siswaData.find(sd => sd.nama === ab.namaSiswa);
           if (s) sid = s.id;
        }
        return {
          laporan_id: id,
          siswa_id: sid,
          status: ab.status
        };
      }).filter(a => a.siswa_id !== null);
      
      if (absensiInserts.length > 0) {
        await window.supabase.from('absensi_piket').insert(absensiInserts);
      }
    }
    
    return true;
  },

  async deleteLaporanPiket(id) {
    // Supabase cascade delete will automatically handle absensi_piket
    const { error } = await window.supabase.from('laporan_piket').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  
  async getExportData(startDate, endDate) {
    let query = window.supabase
      .from('laporan_piket')
      .select(`
        id, tanggal, sesi, catatan, status,
        profiles!guru_id (nama),
        absensi_piket (
          status,
          siswa (
            nama,
            kelas (
              nama, jenjang, jurusan
            )
          )
        )
      `)
      .order('tanggal', { ascending: true });

    if (startDate) {
      query = query.gte('tanggal', startDate);
    }
    if (endDate) {
      query = query.lte('tanggal', endDate);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching export data:', error);
      throw error;
    }

    return data || [];
  },

  async getAdminStats() {
    const { count: totalGuru } = await window.supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'guru');
    const { count: totalSiswa } = await window.supabase.from('siswa').select('*', { count: 'exact', head: true });
    
    const today = new Date().toISOString().split('T')[0];
    const { count: laporanHariIni } = await window.supabase.from('laporan_piket').select('*', { count: 'exact', head: true }).eq('tanggal', today);
    
    const { count: tidakHadir } = await window.supabase.from('absensi_piket').select('id, laporan_piket!inner(tanggal)', { count: 'exact', head: true }).eq('laporan_piket.tanggal', today);
    
    let kehadiran = '100%';
    if (totalSiswa > 0 && tidakHadir !== null) {
       const persentase = ((totalSiswa - tidakHadir) / totalSiswa) * 100;
       kehadiran = (persentase < 0 ? 0 : persentase).toFixed(1).replace('.0', '') + '%';
    }

    return { 
      totalGuru: totalGuru || 0, 
      totalSiswa: totalSiswa || 0, 
      laporanHariIni: laporanHariIni || 0, 
      kehadiran 
    };
  },

  async getAdminAktivitas() {
    const { data } = await window.supabase
      .from('laporan_piket')
      .select('id, tanggal, sesi, created_at, profiles!guru_id(nama)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!data) return [];
    
    return data.map(item => ({
      icon: 'description',
      color: '#1a73e8',
      title: 'Laporan Piket Masuk',
      subtitle: `Dilaporkan oleh ${item.profiles?.nama || 'Unknown'} (Sesi ${item.sesi})`,
      time: new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }));
  }
};
