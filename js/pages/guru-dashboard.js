(function() {
  function render() {
    const guru = window.APP_STATE.currentGuru;
    const isPiket = window.APP_DATA.isJadwalPiket ? window.APP_DATA.isJadwalPiket(guru.id) : false;
    const isPresensiDone = window.APP_STATE.presensiDone;
    const hariTanggal = window.APP_DATA.getHariTanggal ? window.APP_DATA.getHariTanggal() : 'Senin, 1 Januari 2026';
    const aktivitas = window.APP_DATA.aktivitasGuru || [];

    let piketCardHtml = '';
    if (isPiket) {
      piketCardHtml = `
        <div class="card piket-card" style="border-left: 4px solid var(--warning, orange); margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="material-icons-outlined" style="color: var(--warning, orange);">assignment</span>
            <span style="font-weight: 500;">🔔 Hari ini Anda bertugas sebagai Guru Piket</span>
          </div>
          <button id="btnLanjutPiket" class="btn btn-secondary btn-full">Lanjutkan Laporan Piket</button>
        </div>
      `;
    }

    const html = `
      <div class="page guru-dashboard">
        ${window.Components.header({ title: 'Dashboard', subtitle: 'SIPINTER', notif: true, avatar: true, avatarText: guru.avatar })}
        <div class="page-content">
          
          <div class="greeting-section" style="margin-bottom: 1.5rem;">
            <h1 class="greeting-name" style="font-size: 1.5rem; font-weight: bold; font-family: 'Poppins', sans-serif;">Halo, ${guru.panggilan}!</h1>
            <p class="greeting-subtitle" style="color: var(--text-secondary, #666);">${hariTanggal}<br/>Selamat pagi, semoga harimu menyenangkan.</p>
          </div>

          <div class="card status-card" style="background: linear-gradient(135deg, var(--primary, #007bff), var(--primary-dark, #0056b3)); color: white; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="material-icons-outlined" style="font-size: 2.5rem; color: white;">
                ${isPresensiDone ? 'check_circle' : 'pending_actions'}
              </span>
              <div>
                <div style="font-size: 1.25rem; font-weight: bold;">
                  ${isPresensiDone ? 'Sudah Absen Masuk' : 'Belum Absen'}
                </div>
                <div style="opacity: 0.9;">
                  ${isPresensiDone ? '06:45 WIB' : 'Segera lakukan presensi'}
                </div>
              </div>
            </div>
          </div>

          <div class="card presensi-btn-card" id="btnPresensiSelfie" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; margin-bottom: 1rem; cursor: pointer; ${isPresensiDone ? 'opacity: 0.7;' : ''}">
            <span class="material-icons-outlined" style="font-size: 3rem; color: var(--primary, #007bff); margin-bottom: 0.5rem;">photo_camera</span>
            <span style="font-weight: 500;">Presensi Selfie</span>
          </div>

          ${piketCardHtml}

          <div class="section-title" style="margin-bottom: 1rem;">Aktivitas Terakhir</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem;">
            ${aktivitas.map(act => `
              <div class="card list-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem;">
                <div class="list-item-icon" style="background: ${act.color === 'success' ? '#e6f4ea' : '#e8f0fe'}; color: ${act.color === 'success' ? '#137333' : '#1a73e8'}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span class="material-icons-outlined">${act.icon}</span>
                </div>
                <div class="list-item-content" style="flex: 1;">
                  <div class="list-item-title" style="font-weight: 500;">${act.title}</div>
                  <div class="list-item-subtitle" style="font-size: 0.85rem; color: var(--text-secondary, #666);">${act.subtitle}</div>
                </div>
                <div class="list-item-right" style="font-size: 0.75rem; color: var(--text-secondary, #666);">
                  ${act.time}
                </div>
              </div>
            `).join('')}
          </div>

        </div>
        ${window.Components.bottomNavGuru('dashboard')}
        ${window.Components.footer()}
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

    const btnLanjutPiket = document.getElementById('btnLanjutPiket');
    if (btnLanjutPiket) {
      btnLanjutPiket.addEventListener('click', () => {
        window.Router.navigate('/guru/piket');
      });
    }
  }

  window.Router.register('/guru/dashboard', render);
})();
