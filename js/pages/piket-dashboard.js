(function() {
  async function render() {
    window.Components.showLoading();
    const guru = window.APP_STATE.currentGuru || {};
    const guruId = guru.id;
    
    // Fix Avatar Initials
    const namaGuru = guru.nama || 'Guru';
    const nameParts = namaGuru.trim().split(' ');
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
      : namaGuru.substring(0, 2).toUpperCase();

    // Fetch riwayat laporan dan daftar absen secara paralel agar loading lebih cepat
    const [laporanRes, absenSiswa] = await Promise.all([
      window.supabase
        .from('laporan_piket')
        .select('id, tanggal, sesi, status')
        .eq('guru_id', guruId)
        .order('created_at', { ascending: false })
        .limit(10),
      window.APP_DATA.getSiswaAbsenHariIni()
    ]);

    const laporanList = laporanRes.data;
    const siswaAbsenHariIni = absenSiswa ? absenSiswa.length : 0;

    window.Components.hideLoading();

    const laporan = laporanList || [];

    const riwayatHtml = laporan.length > 0
      ? laporan.map(lap => {
          const isDone = lap.status === 'Selesai';
          return `
            <div class="ios-list-item">
              <div class="ios-list-icon ${isDone ? 'success' : 'warning'}">
                <span class="material-icons-outlined" style="font-size: 20px;">${isDone ? 'check_circle' : 'pending'}</span>
              </div>
              <div class="ios-list-content">
                <div class="ios-list-title">Sesi ${lap.sesi}</div>
                <div class="ios-list-subtitle">${lap.tanggal}</div>
              </div>
              <div class="ios-list-right" style="color: ${isDone ? '#34C759' : '#FF9500'}; display: flex; align-items: center; gap: 12px;">
                <span>${lap.status}</span>
                <div style="display: flex; gap: 8px; margin-left: 8px;">
                  <button class="btn-edit-lap" data-id="${lap.id}" style="background: none; border: none; color: #007AFF; padding: 4px; cursor: pointer;">
                    <span class="material-icons-outlined" style="font-size: 18px;">edit</span>
                  </button>
                  <button class="btn-delete-lap" data-id="${lap.id}" style="background: none; border: none; color: #FF3B30; padding: 4px; cursor: pointer;">
                    <span class="material-icons-outlined" style="font-size: 18px;">delete</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')
      : '<div class="empty-state">Belum ada riwayat laporan</div>';

    const html = `
      <style>
        .ios-page {
          background: #F2F2F7;
          min-height: 100vh;
          padding-bottom: 80px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .ios-nav {
          padding: 48px 20px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(242, 242, 247, 0.8);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .ios-nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ios-back-btn {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          color: #007AFF;
          text-decoration: none;
          cursor: pointer;
        }
        .ios-nav-title {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .ios-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #E5E5EA;
          color: #1C1C1E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }
        .ios-main-card {
          margin: 8px 20px 24px;
          border-radius: 24px;
          background: linear-gradient(135deg, #FF9500 0%, #FF2D55 100%);
          padding: 24px;
          color: white;
          box-shadow: 0 10px 24px rgba(255, 149, 0, 0.3);
          position: relative;
          overflow: hidden;
        }
        .ios-main-card-bg {
          position: absolute;
          right: -20px;
          top: -20px;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
        }
        .ios-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 0 20px;
          margin-bottom: 24px;
        }
        .ios-stat-card {
          background: white;
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
          text-align: center;
        }
        .ios-stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #000;
          margin-bottom: 4px;
        }
        .ios-stat-label {
          font-size: 13px;
          color: #8E8E93;
          font-weight: 600;
          text-transform: uppercase;
        }
        .ios-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 0 20px;
          margin-bottom: 32px;
        }
        .ios-action-btn {
          background: white;
          border-radius: 24px;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          color: #1C1C1E;
          transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s;
          border: none;
          cursor: pointer;
        }
        .ios-action-btn:active {
          transform: scale(0.95);
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .ios-action-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ios-action-icon.orange { background: #FFF0E5; color: #FF9500; }
        .ios-action-icon.green { background: #E4F8EB; color: #34C759; }
        
        .ios-action-label {
          font-size: 14px;
          font-weight: 600;
          text-align: center;
        }
        
        .ios-section-header {
          padding: 0 20px 12px;
          font-size: 20px;
          font-weight: 700;
          color: #000;
          letter-spacing: -0.3px;
        }
        .ios-list {
          margin: 0 20px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
        }
        .ios-list-item {
          display: flex;
          align-items: center;
          padding: 16px;
          position: relative;
        }
        .ios-list-item:not(:last-child)::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 64px;
          right: 0;
          height: 1px;
          background: #E5E5EA;
        }
        .ios-list-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
        }
        .ios-list-icon.success { background: #E4F8EB; color: #34C759; }
        .ios-list-icon.warning { background: #FFF5E5; color: #FF9500; }
        
        .ios-list-content {
          flex: 1;
        }
        .ios-list-title {
          font-size: 15px;
          font-weight: 600;
          color: #000;
          margin-bottom: 2px;
        }
        .ios-list-subtitle {
          font-size: 13px;
          color: #8E8E93;
        }
        .ios-list-right {
          font-size: 13px;
          font-weight: 600;
        }
        .empty-state {
          padding: 32px 16px;
          text-align: center;
          color: #8E8E93;
          font-size: 14px;
        }
      </style>
      <div class="page ios-page">
        
        <div class="ios-nav">
          <div class="ios-nav-left">
            <a class="ios-back-btn" onclick="window.Router.navigate('/guru/dashboard')">
              <span class="material-icons-outlined">arrow_back</span>
            </a>
            <h1 class="ios-nav-title">Guru Piket</h1>
          </div>
          <div class="ios-avatar">${initials}</div>
        </div>

        <!-- Banner Card -->
        <div class="ios-main-card">
          <div class="ios-main-card-bg"></div>
          <div style="position: relative; z-index: 1; display: flex; align-items: center; gap: 16px;">
            <div style="width: 52px; height: 52px; border-radius: 16px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 28px;">📋</span>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: 700; margin-bottom: 2px;">Kelola Piket</div>
              <div style="font-size: 14px; opacity: 0.9;">Buat & pantau laporan harian</div>
            </div>
          </div>
        </div>

        <!-- Stat Grid -->
        <div class="ios-stat-grid">
          <div class="ios-stat-card">
            <div class="ios-stat-value" style="color: #FF3B30;">${siswaAbsenHariIni || 0}</div>
            <div class="ios-stat-label">Absen Hari Ini</div>
          </div>
          <div class="ios-stat-card">
            <div class="ios-stat-value" style="color: #007AFF;">${laporan.length}</div>
            <div class="ios-stat-label">Total Laporan</div>
          </div>
        </div>

        <!-- Action Widgets -->
        <div class="ios-grid">
          <button class="ios-action-btn" id="btnBuatLaporan">
            <div class="ios-action-icon orange">
              <span style="font-size: 28px;">📝</span>
            </div>
            <div class="ios-action-label">Buat<br/>Laporan Baru</div>
          </button>
          
          <button class="ios-action-btn" id="btnUnduhLaporan">
            <div class="ios-action-icon green">
              <span style="font-size: 28px;">📥</span>
            </div>
            <div class="ios-action-label">Unduh<br/>Rekap Excel</div>
          </button>
        </div>

        <!-- Siswa Absen List -->
        <div class="ios-section-header">Siswa Tidak Hadir Hari Ini</div>
        <div class="ios-list" style="margin-bottom: 24px;">
          ${absenSiswa.length > 0 ? absenSiswa.map(a => `
            <div class="ios-list-item">
              <div class="ios-list-content">
                <div class="ios-list-title">${a.nama}</div>
                <div class="ios-list-subtitle">${a.kelas}</div>
              </div>
              <div class="ios-list-right" style="color: #FF3B30;">
                ${a.status}
              </div>
            </div>
          `).join('') : '<div class="empty-state">Tidak ada siswa absen hari ini 🎉</div>'}
        </div>

        <!-- History List -->
        <div class="ios-section-header">Riwayat Laporan Saya</div>
        <div class="ios-list">
          ${riwayatHtml}
        </div>

        ${window.Components.bottomNavGuru ? window.Components.bottomNavGuru('piket') : ''}
      </div>
    `;
    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    const btnBuat = document.getElementById('btnBuatLaporan');
    if (btnBuat) btnBuat.addEventListener('click', () => window.Router.navigate('/guru/piket/laporan'));

    const btnUnduh = document.getElementById('btnUnduhLaporan');
    if (btnUnduh) btnUnduh.addEventListener('click', () => window.Router.navigate('/export'));

    document.querySelectorAll('.btn-edit-lap').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        window.Router.navigate(`/guru/piket/laporan?id=${id}`);
      });
    });

    document.querySelectorAll('.btn-delete-lap').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin menghapus laporan ini? Data yang dihapus tidak dapat dikembalikan.')) {
          try {
            window.Components.showLoading('Menghapus laporan...');
            await window.APP_DATA.deleteLaporanPiket(id);
            window.Components.hideLoading();
            window.Components.toast('Laporan berhasil dihapus', 'success');
            // Refresh dashboard
            render();
          } catch (err) {
            window.Components.hideLoading();
            console.error(err);
            window.Components.toast('Gagal menghapus laporan', 'error');
          }
        }
      });
    });
  }

  window.Router.register('/guru/piket', render);
})();
