(function() {
  async function render() {
    const guru = window.APP_STATE.currentGuru || {};
    
    // Fix Avatar Initials
    const namaGuru = guru.nama || 'Guru';
    const nameParts = namaGuru.trim().split(' ');
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
      : namaGuru.substring(0, 2).toUpperCase();
    guru.avatar = initials;

    // Dynamic Greeting
    const hour = new Date().getHours();
    let greeting = 'Selamat Pagi';
    if (hour >= 11 && hour < 15) greeting = 'Selamat Siang';
    else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore';
    else if (hour >= 18) greeting = 'Selamat Malam';

    const isPresensiDone = window.APP_STATE.presensiDone;
    const hariTanggal = window.APP_DATA.getHariTanggal ? await window.APP_DATA.getHariTanggal() : 'Senin, 1 Januari 2026';
    const aktivitas = window.APP_DATA.getAktivitasGuru ? await window.APP_DATA.getAktivitasGuru() : [];
    
    const html = `
      <style>
        .ios-dashboard {
          background: #F2F2F7;
          min-height: 100vh;
          padding-bottom: 80px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .ios-header {
          padding: 48px 20px 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .ios-greeting-subtitle {
          font-size: 13px;
          color: #8E8E93;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .ios-greeting-title {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          letter-spacing: -0.5px;
          margin: 0;
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .ios-main-card {
          margin: 8px 20px 24px;
          border-radius: 24px;
          background: linear-gradient(135deg, #007AFF 0%, #0056D6 100%);
          padding: 24px;
          color: white;
          box-shadow: 0 10px 24px rgba(0, 122, 255, 0.3);
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
        .ios-main-card-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .ios-main-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ios-main-icon .material-icons-outlined {
          font-size: 28px;
          color: white;
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
          text-decoration: none;
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
        .ios-action-icon.blue { background: #E5F1FF; color: #007AFF; }
        .ios-action-icon.purple { background: #F2E6FF; color: #AF52DE; }
        
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
        .ios-list-icon.primary { background: #E5F1FF; color: #007AFF; }
        
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
          color: #8E8E93;
          font-weight: 500;
        }
        .empty-state {
          padding: 32px 16px;
          text-align: center;
          color: #8E8E93;
          font-size: 14px;
        }
      </style>
      <div class="page ios-dashboard">
        
        <!-- Header -->
        <div class="ios-header">
          <div>
            <div class="ios-greeting-subtitle">${hariTanggal}</div>
            <h1 class="ios-greeting-title">${greeting}, ${namaGuru.split(' ')[0]}</h1>
          </div>
          <div class="ios-avatar">${guru.avatar}</div>
        </div>

        <!-- Main Status Card -->
        <div class="ios-main-card">
          <div class="ios-main-card-bg"></div>
          <div class="ios-main-card-content">
            <div class="ios-main-icon">
              <span class="material-icons-outlined">${isPresensiDone ? 'check' : 'sensor_door'}</span>
            </div>
            <div>
              <div style="font-size: 18px; font-weight: 700; margin-bottom: 2px;">
                ${isPresensiDone ? 'Presensi Selesai' : 'Belum Presensi'}
              </div>
              <div style="font-size: 14px; opacity: 0.9; font-weight: 400;">
                ${isPresensiDone ? 'Anda sudah absen masuk.' : 'Silakan ketuk tombol di bawah.'}
              </div>
            </div>
          </div>
        </div>

        <!-- Action Widgets -->
        <div class="ios-grid">
          <button class="ios-action-btn" id="btnPresensiSelfie" ${isPresensiDone ? 'style="opacity: 0.7;"' : ''}>
            <div class="ios-action-icon blue">
              <span class="material-icons-outlined" style="font-size: 24px;">photo_camera</span>
            </div>
            <div class="ios-action-label">Presensi<br/>Selfie</div>
          </button>
          
          <button class="ios-action-btn" id="btnBuatLaporanDashboard">
            <div class="ios-action-icon purple">
              <span class="material-icons-outlined" style="font-size: 24px;">edit_document</span>
            </div>
            <div class="ios-action-label">Laporan<br/>Piket</div>
          </button>
        </div>

        <!-- Recent Activity -->
        <div class="ios-section-header">Aktivitas Terakhir</div>
        <div class="ios-list">
          ${aktivitas.length > 0 ? aktivitas.map(act => `
            <div class="ios-list-item">
              <div class="ios-list-icon ${act.color === 'success' ? 'success' : 'primary'}">
                <span class="material-icons-outlined" style="font-size: 20px;">${act.icon}</span>
              </div>
              <div class="ios-list-content">
                <div class="ios-list-title">${act.title}</div>
                <div class="ios-list-subtitle">${act.subtitle}</div>
              </div>
              <div class="ios-list-right">
                ${act.time.split(' ')[0]}
              </div>
            </div>
          `).join('') : '<div class="empty-state">Belum ada aktivitas.</div>'}
        </div>

        ${window.Components.bottomNavGuru('dashboard')}
      </div>
    `;
    
    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    const btnPresensi = document.getElementById('btnPresensiSelfie');
    if (btnPresensi) {
      btnPresensi.addEventListener('click', () => {
        window.Router.navigate('/guru/presensi');
      });
    }
    
    const btnLaporan = document.getElementById('btnBuatLaporanDashboard');
    if (btnLaporan) {
      btnLaporan.addEventListener('click', () => {
        window.Router.navigate('/guru/piket/laporan');
      });
    }
  }

  window.Router.register('/guru/dashboard', render);
})();
