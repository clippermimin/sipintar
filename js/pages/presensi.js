(function() {
  let currentStep = 0;
  
  async function render() {
    let content = '';
    const hariTanggal = window.APP_DATA.getHariTanggal ? await window.APP_DATA.getHariTanggal() : 'Sabtu, 25 Juli 2026';

    if (currentStep === 0) {
      content = `
        <div class="page-content" style="padding-top: 1rem;">
          ${window.Components.stepIndicator ? window.Components.stepIndicator(4, 0) : ''}
          <div class="camera-frame" style="background: #111; border-radius: 12px; height: 350px; position: relative; margin: 2rem 0; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <div class="face-placeholder" style="width: 200px; height: 250px; border: 2px dashed rgba(255,255,255,0.5); border-radius: 100px; position: relative; animation: pulse 2s infinite;"></div>
            <style>
              @keyframes pulse {
                0% { border-color: rgba(255,255,255,0.3); }
                50% { border-color: rgba(255,255,255,0.8); box-shadow: 0 0 15px rgba(255,255,255,0.2); }
                100% { border-color: rgba(255,255,255,0.3); }
              }
            </style>
          </div>
          <p style="text-align: center; color: var(--text-secondary, #666); margin-bottom: 2rem;">Posisikan wajah Anda di dalam lingkaran</p>
          <button id="btnAmbilFoto" class="btn btn-primary btn-full btn-lg">Ambil Foto</button>
        </div>
      `;
    } else if (currentStep === 1) {
      content = `
        <div class="page-content" style="padding-top: 1rem;">
          ${window.Components.stepIndicator ? window.Components.stepIndicator(4, 1) : ''}
          <div class="camera-frame" style="background: #111; border-radius: 12px; height: 350px; position: relative; margin: 2rem 0; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <div class="face-placeholder" style="width: 200px; height: 250px; border: 2px solid #34a853; border-radius: 100px; background: rgba(52, 168, 83, 0.2); display: flex; align-items: center; justify-content: center;">
              <span class="material-icons-outlined" style="color: #34a853; font-size: 4rem;">check_circle</span>
            </div>
            <div style="position: absolute; bottom: 1rem; width: 100%; text-align: center; color: white; background: rgba(0,0,0,0.5); padding: 0.5rem 0;">
              Foto berhasil diambil
            </div>
          </div>
          <button id="btnVerifikasiLokasi" class="btn btn-primary btn-full btn-lg">Verifikasi Lokasi</button>
        </div>
      `;
    } else if (currentStep === 2) {
      content = `
        <div class="page-content" style="padding-top: 1rem;">
          ${window.Components.stepIndicator ? window.Components.stepIndicator(4, 2) : ''}
          
          <div class="card location-verify" style="background: #e6f4ea; border: 1px solid #34a853; margin: 2rem 0; padding: 1.5rem; text-align: center; border-radius: 12px;">
            <span class="material-icons-outlined" style="color: #34a853; font-size: 3rem; margin-bottom: 0.5rem;">check_circle</span>
            <div style="color: #137333; font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">Lokasi berhasil diverifikasi</div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #137333;">
              <span class="material-icons-outlined">place</span>
              <span>SMA Negeri 1 Surabaya</span>
            </div>
            <div style="font-size: 0.85rem; color: #137333; margin-top: 0.5rem;">Jarak: 15 meter dari titik sekolah</div>
          </div>
          
          <div class="card" style="margin-bottom: 2rem; padding: 1rem;">
            <div style="margin-bottom: 0.5rem;"><strong>Tanggal:</strong> ${hariTanggal}</div>
            <div style="margin-bottom: 0.5rem;"><strong>Waktu:</strong> 06:45 WIB</div>
            <div><strong>Status:</strong> Masuk</div>
          </div>

          <button id="btnKirimPresensi" class="btn btn-primary btn-full btn-lg">Kirim Presensi</button>
        </div>
      `;
    } else if (currentStep === 3) {
      content = `
        <div class="page-content success-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; text-align: center;">
          <span class="material-icons-outlined success-icon" style="color: #34a853; font-size: 6rem; margin-bottom: 1rem; animation: scaleIn 0.5s ease-out;">check_circle</span>
          <style>
            @keyframes scaleIn {
              0% { transform: scale(0); opacity: 0; }
              80% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
          </style>
          <h2 class="success-title" style="font-size: 1.75rem; margin-bottom: 0.5rem;">Presensi Berhasil!</h2>
          <p class="success-subtitle" style="color: var(--text-secondary, #666); margin-bottom: 1.5rem;">Presensi masuk Anda telah tercatat</p>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; width: 100%; max-width: 300px; margin-bottom: 2rem;">
            <strong>06:45 WIB</strong><br/>
            <span style="font-size: 0.9rem; color: var(--text-secondary, #666);">${hariTanggal}</span>
          </div>
          <button id="btnKembaliDashboard" class="btn btn-primary btn-full btn-lg" style="max-width: 300px;">Kembali ke Dashboard</button>
        </div>
      `;
    }

    const html = `
      <div class="page presensi-page">
        ${currentStep < 3 ? window.Components.header({ title: 'Presensi Selfie', subtitle: 'SIPINTER', back: true, backPath: '/guru/dashboard' }) : ''}
        ${content}
      </div>
    `;
    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    if (currentStep === 0) {
      document.getElementById('btnAmbilFoto')?.addEventListener('click', () => {
        if (window.Components.showLoading) window.Components.showLoading();
        setTimeout(() => {
          if (window.Components.hideLoading) window.Components.hideLoading();
          currentStep = 1;
          render();
        }, 1000);
      });
    } else if (currentStep === 1) {
      document.getElementById('btnVerifikasiLokasi')?.addEventListener('click', () => {
        if (window.Components.showLoading) window.Components.showLoading('Memverifikasi lokasi...');
        setTimeout(() => {
          if (window.Components.hideLoading) window.Components.hideLoading();
          currentStep = 2;
          render();
        }, 1500);
      });
    } else if (currentStep === 2) {
      document.getElementById('btnKirimPresensi')?.addEventListener('click', () => {
        if (window.Components.showLoading) window.Components.showLoading('Mengirim presensi...');
        setTimeout(() => {
          if (window.Components.hideLoading) window.Components.hideLoading();
          if (window.APP_STATE) window.APP_STATE.presensiDone = true;
          currentStep = 3;
          render();
          
          setTimeout(() => {
            if (currentStep === 3) window.Router.navigate('/guru/dashboard');
          }, 2500);
        }, 1000);
      });
    } else if (currentStep === 3) {
      document.getElementById('btnKembaliDashboard')?.addEventListener('click', () => {
        window.Router.navigate('/guru/dashboard');
      });
    }
  }

  window.Router.register('/guru/presensi', () => {
    currentStep = 0;
    render();
  });
})();
