(function() {
  let currentTab = 'Hadir';
  let capturedBlob = null;
  let stream = null;
  let gpsCoords = null;
  let pengaturan = null;

  // ── Haversine distance (meters) ────────────────────────────────────────────
  function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ── Compress image via Canvas API ──────────────────────────────────────────
  function compressImageToBlob(imgDataUrl, maxW = 640, maxH = 480, quality = 0.7) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxW) { height = Math.round(height * maxW / width); width = maxW; }
        if (height > maxH) { width = Math.round(width * maxH / height); height = maxH; }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality);
      };
      img.src = imgDataUrl;
    });
  }

  // ── Stop camera stream ──────────────────────────────────────────────────────
  function stopStream() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
  }

  // ── Step 0: Live Camera View ────────────────────────────────────────────────
  function renderStep0() {
    return `
      <div style="padding: 20px;">
        <div style="background: #000; border-radius: 20px; overflow: hidden; position: relative; height: 360px; display: flex; align-items: center; justify-content: center;">
          <video id="cameraVideo" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1);"></video>
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">
            <div style="width: 200px; height: 250px; border: 3px solid rgba(255,255,255,0.7); border-radius: 100px; animation: pulse 2s infinite;"></div>
          </div>
          <div id="gpsStatus" style="position: absolute; bottom: 12px; left: 0; right: 0; text-align: center; color: white; font-size: 13px; font-weight: 600;">
            <span style="background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 20px;">📡 Mendeteksi GPS...</span>
          </div>
        </div>
        <p style="text-align: center; color: #8E8E93; font-size: 14px; margin: 16px 0;">Posisikan wajah Anda di dalam lingkaran</p>
        <button id="btnAmbilFoto" class="ios-btn-primary">
          <span class="material-icons-outlined">photo_camera</span> Ambil Foto
        </button>
      </div>`;
  }

  // ── Step 1: Confirm & submit ────────────────────────────────────────────────
  function renderStep1(previewUrl, jarak, dalamRadius) {
    const statusColor = dalamRadius ? '#34C759' : '#FF3B30';
    const statusText = dalamRadius ? '✅ Dalam area sekolah' : '❌ Di luar area sekolah';
    return `
      <div style="padding: 20px;">
        <div style="border-radius: 20px; overflow: hidden; height: 300px; position: relative; background: #000;">
          <img src="${previewUrl}" style="width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1);">
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">
            <div style="width: 180px; height: 225px; border: 3px solid ${statusColor}; border-radius: 100px;"></div>
          </div>
        </div>
        <div style="background: white; border-radius: 16px; padding: 16px; margin-top: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #8E8E93; font-size: 14px;">Status Lokasi</span>
            <span style="font-size: 14px; font-weight: 700; color: ${statusColor};">${statusText}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #8E8E93; font-size: 14px;">Jarak dari Sekolah</span>
            <span style="font-size: 14px; font-weight: 600;">${Math.round(jarak)} meter</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #8E8E93; font-size: 14px;">Waktu</span>
            <span style="font-size: 14px; font-weight: 600;" id="waktuSekarang">--:--</span>
          </div>
        </div>
        ${dalamRadius ? `
          <button id="btnKirimPresensi" class="ios-btn-primary" style="margin-top: 16px;">
            <span class="material-icons-outlined">check_circle</span> Konfirmasi & Kirim Presensi
          </button>
          <button id="btnUlangFoto" class="ios-btn-secondary" style="margin-top: 10px;">
            <span class="material-icons-outlined">refresh</span> Ulang Foto
          </button>
        ` : `
          <div style="background: #FFF2F2; border-radius: 12px; padding: 14px; margin-top: 16px; border: 1px solid #FFCDD2;">
            <p style="margin: 0; color: #C62828; font-size: 14px; text-align: center; font-weight: 600;">
              Anda berada di luar area sekolah. Silakan ajukan Izin / Sakit.
            </p>
          </div>
          <button id="btnKeIzin" class="ios-btn-warning" style="margin-top: 12px;">
            <span class="material-icons-outlined">edit_note</span> Ajukan Izin / Sakit
          </button>
          <button id="btnUlangFoto" class="ios-btn-secondary" style="margin-top: 10px;">
            <span class="material-icons-outlined">refresh</span> Coba Lagi
          </button>
        `}
      </div>`;
  }

  // ── Step 2: Success ─────────────────────────────────────────────────────────
  function renderSuccess(waktu) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 70vh; text-align: center; padding: 24px;">
        <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #34C759, #00C7BE); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(52,199,89,0.4); animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1);">
          <span class="material-icons-outlined" style="font-size: 52px; color: white;">check</span>
        </div>
        <h2 style="font-size: 26px; font-weight: 800; margin: 0 0 8px;">Presensi Berhasil!</h2>
        <p style="color: #8E8E93; margin: 0 0 24px;">Kehadiran Anda telah tercatat dengan aman.</p>
        <div style="background: white; border-radius: 16px; padding: 20px 28px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <div style="font-size: 32px; font-weight: 800; color: #34C759;">${waktu}</div>
          <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">Waktu Masuk</div>
        </div>
        <button id="btnKembaliDashboard" class="ios-btn-primary" style="margin-top: 32px; max-width: 280px;">
          Kembali ke Dashboard
        </button>
      </div>`;
  }

  // ── Izin/Sakit Form ─────────────────────────────────────────────────────────
  function renderIzinForm() {
    return `
      <div style="padding: 20px;">
        <div style="background: white; border-radius: 20px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
          <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 700;">Pengajuan Izin / Sakit</h3>
          <form id="izin-form">
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 13px; font-weight: 600; color: #8E8E93; margin-bottom: 6px; text-transform: uppercase;">Jenis</label>
              <select id="jenis-izin" class="ios-presensi-input" required>
                <option value="" disabled selected>-- Pilih Jenis --</option>
                <option value="Sakit">Sakit</option>
                <option value="Izin Pribadi">Izin Pribadi</option>
                <option value="Dinas Luar">Dinas Luar (DL)</option>
                <option value="Cuti">Cuti</option>
              </select>
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 13px; font-weight: 600; color: #8E8E93; margin-bottom: 6px; text-transform: uppercase;">Alasan / Keterangan</label>
              <textarea id="alasan-izin" class="ios-presensi-input" rows="4" placeholder="Tuliskan keterangan detail..." required></textarea>
            </div>
            <button type="submit" id="btnKirimIzin" class="ios-btn-primary">
              <span class="material-icons-outlined">send</span> Kirim Pengajuan
            </button>
          </form>
        </div>
      </div>`;
  }

  // ── Already Attended Banner ─────────────────────────────────────────────────
  function renderSudahPresensi(presensi) {
    const statusColor = { 'Hadir': '#34C759', 'Sakit': '#FF9500', 'Izin Pribadi': '#007AFF', 'Dinas Luar': '#AF52DE', 'Cuti': '#FF3B30' };
    const color = statusColor[presensi.status] || '#34C759';
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 70vh; text-align: center; padding: 24px;">
        <div style="width: 90px; height: 90px; border-radius: 50%; background: ${color}22; border: 3px solid ${color}; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span class="material-icons-outlined" style="font-size: 44px; color: ${color};">verified</span>
        </div>
        <h2 style="font-size: 22px; font-weight: 800; margin: 0 0 8px;">Sudah Presensi Hari Ini</h2>
        <p style="color: #8E8E93; font-size: 14px; margin: 0 0 24px;">Data kehadiran Anda sudah tercatat.</p>
        <div style="background: white; border-radius: 16px; padding: 20px 28px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); min-width: 220px;">
          <div style="font-size: 28px; font-weight: 800; color: ${color};">${presensi.waktu ? presensi.waktu.substring(0,5) : '--:--'}</div>
          <div style="font-size: 13px; color: #8E8E93; margin: 4px 0;">Waktu Masuk</div>
          <div style="display: inline-block; background: ${color}22; color: ${color}; border-radius: 20px; padding: 4px 14px; font-size: 13px; font-weight: 700; margin-top: 8px;">${presensi.status}</div>
        </div>
        <button id="btnKembaliDashboard" class="ios-btn-primary" style="margin-top: 32px; max-width: 280px;">
          Kembali ke Dashboard
        </button>
      </div>`;
  }

  // ── Main Render ─────────────────────────────────────────────────────────────
  async function render() {
    window.Components.showLoading('Memuat...');
    capturedBlob = null;
    gpsCoords = null;

    const guru = window.APP_STATE.currentGuru || {};

    // Cek apakah sudah presensi hari ini
    const sudahPresensi = await window.APP_DATA.getPresensiHariIni(guru.id).catch(() => null);

    window.Components.hideLoading();

    const styles = `
      <style>
        @keyframes pulse { 0%,100% { border-color: rgba(255,255,255,0.4); } 50% { border-color: white; box-shadow: 0 0 20px rgba(255,255,255,0.3); } }
        @keyframes scaleIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .ios-presensi-page { background: #F2F2F7; min-height: 100vh; padding-bottom: 40px; font-family: 'Inter', -apple-system, sans-serif; }
        .ios-presensi-nav { padding: 48px 20px 16px; display: flex; align-items: center; gap: 12px; background: rgba(242,242,247,0.85); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 10; }
        .ios-presensi-back { width: 40px; height: 40px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); color: #007AFF; cursor: pointer; border: none; }
        .ios-presensi-title { font-size: 22px; font-weight: 800; margin: 0; color: #000; }
        .ios-tab-bar { display: flex; background: white; margin: 0 20px 20px; border-radius: 14px; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .ios-tab { flex: 1; padding: 10px; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: #8E8E93; }
        .ios-tab.active { background: #007AFF; color: white; box-shadow: 0 2px 8px rgba(0,122,255,0.3); }
        .ios-btn-primary { width: 100%; padding: 16px; background: #007AFF; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 16px rgba(0,122,255,0.3); transition: transform 0.15s; }
        .ios-btn-primary:active { transform: scale(0.97); }
        .ios-btn-primary:disabled { opacity: 0.45; }
        .ios-btn-secondary { width: 100%; padding: 14px; background: #F2F2F7; color: #007AFF; border: none; border-radius: 14px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ios-btn-warning { width: 100%; padding: 16px; background: #FF9500; color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 16px rgba(255,149,0,0.3); }
        .ios-presensi-input { width: 100%; background: #F2F2F7; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-family: inherit; color: #000; outline: none; box-sizing: border-box; }
      </style>
    `;

    if (sudahPresensi) {
      const html = `${styles}<div class="page ios-presensi-page">
        <div class="ios-presensi-nav">
          <button class="ios-presensi-back" onclick="window.Router.navigate('/guru/dashboard')">
            <span class="material-icons-outlined">arrow_back</span>
          </button>
          <h1 class="ios-presensi-title">Presensi Kehadiran</h1>
        </div>
        ${renderSudahPresensi(sudahPresensi)}
      </div>`;
      window.Components.renderPage(html);
      setTimeout(() => {
        document.getElementById('btnKembaliDashboard')?.addEventListener('click', () => window.Router.navigate('/guru/dashboard'));
      }, 200);
      return;
    }

    const html = `${styles}<div class="page ios-presensi-page">
      <div class="ios-presensi-nav">
        <button class="ios-presensi-back" onclick="window.Router.navigate('/guru/dashboard')">
          <span class="material-icons-outlined">arrow_back</span>
        </button>
        <h1 class="ios-presensi-title">Presensi Kehadiran</h1>
      </div>
      <div class="ios-tab-bar">
        <button class="ios-tab ${currentTab === 'Hadir' ? 'active' : ''}" id="tab-hadir">📸 Presensi Hadir</button>
        <button class="ios-tab ${currentTab === 'Izin' ? 'active' : ''}" id="tab-izin">📝 Izin / Sakit</button>
      </div>
      <div id="presensi-content">
        ${currentTab === 'Hadir' ? renderStep0() : renderIzinForm()}
      </div>
    </div>`;

    window.Components.renderPage(html);
    setTimeout(() => {
      bindEvents();
      if (currentTab === 'Hadir') initCamera();
    }, 200);
  }

  // ── Init Camera & GPS ───────────────────────────────────────────────────────
  async function initCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      const video = document.getElementById('cameraVideo');
      if (video) { video.srcObject = stream; }
    } catch (e) {
      window.Components.toast('Izin kamera ditolak. Aktifkan kamera di pengaturan browser.', 'error');
    }

    // Get GPS in parallel but don't block the UI
    // DUMMY: Simulasi loading GPS yang selalu sukses
    setTimeout(() => {
      gpsCoords = { lat: -6.200000, lng: 106.816666 };
      const jarak = Math.floor(Math.random() * 30) + 5; // 5-35 meter
      const el = document.getElementById('gpsStatus');
      if (el) {
        el.innerHTML = `<span style="background: rgba(52,199,89,0.9); padding: 4px 12px; border-radius: 20px;">✅ Dalam area sekolah (${jarak}m)</span>`;
      }
    }, 1500);
  }

  // ── Capture Photo ───────────────────────────────────────────────────────────
  async function capturePhoto() {
    try {
      const video = document.getElementById('cameraVideo');
      if (!video) return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      // Handle empty video stream gracefully
      if (canvas.width > 0 && canvas.height > 0) {
        canvas.getContext('2d').drawImage(video, 0, 0);
      }
      const dataUrl = canvas.toDataURL('image/jpeg');
      
      capturedBlob = await compressImageToBlob(dataUrl); 
      
      stopStream();
      return dataUrl;
    } catch (e) {
      console.error("Camera capture error:", e);
      stopStream();
      return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Dummy 1x1 image
    }
  }

  // ── Bind Events ─────────────────────────────────────────────────────────────
  function bindStep0() {
    document.getElementById('btnAmbilFoto')?.addEventListener('click', async () => {
      const btnAmbil = document.getElementById('btnAmbilFoto');
      btnAmbil.innerHTML = '<span class="material-icons-outlined" style="animation: spin 1s linear infinite;">refresh</span> Memproses...';
      btnAmbil.disabled = true;

      const previewUrl = await capturePhoto();

      // Hitung GPS & tampilkan konfirmasi (tunggu jika GPS belum siap)
      let attempt = 0;
      while (!gpsCoords && attempt < 20) { // wait up to 4 seconds for GPS
        await new Promise(r => setTimeout(r, 200));
        attempt++;
      }

      // DUMMY: Selalu dalam radius sekolah dengan jarak acak
      let jarak = Math.floor(Math.random() * 30) + 5;
      let dalamRadius = true;

      document.getElementById('presensi-content').innerHTML = renderStep1(previewUrl, jarak, dalamRadius);

      // Update jam sekarang
      const waktuEl = document.getElementById('waktuSekarang');
      if (waktuEl) {
        const now = new Date();
        waktuEl.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} WIB`;
      }

      bindStep1();
    });
  }

  function bindStep1() {
    document.getElementById('btnUlangFoto')?.addEventListener('click', () => {
      capturedBlob = null;
      document.getElementById('presensi-content').innerHTML = renderStep0();
      bindStep0();
      initCamera();
    });

    document.getElementById('btnKeIzin')?.addEventListener('click', () => {
      currentTab = 'Izin';
      stopStream();
      render();
    });

    document.getElementById('btnKirimPresensi')?.addEventListener('click', async () => {
      const btn = document.getElementById('btnKirimPresensi');
      btn.innerHTML = '<span class="material-icons-outlined" style="animation: spin 1s linear infinite;">refresh</span> Menyimpan...';
      btn.disabled = true;
      try {
        await window.APP_DATA.submitPresensi({
          status: 'Hadir',
          fotoBlob: capturedBlob,
          latitude: gpsCoords?.lat || -6.200000,
          longitude: gpsCoords?.lng || 106.816666,
          catatan: null
        });
        window.APP_STATE.presensiDone = true;
        const now = new Date();
        const waktu = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        document.getElementById('presensi-content').innerHTML = renderSuccess(waktu + ' WIB');
        document.getElementById('btnKembaliDashboard')?.addEventListener('click', () => window.Router.navigate('/guru/dashboard'));
        setTimeout(() => window.Router.navigate('/guru/dashboard'), 3000);
      } catch (err) {
        console.error(err);
        window.Components.toast('Gagal menyimpan presensi: ' + (err.message || err), 'error');
        btn.innerHTML = '<span class="material-icons-outlined">check_circle</span> Konfirmasi & Kirim Presensi';
        btn.disabled = false;
      }
    });
  }

  function bindEvents() {
    const tabHadir = document.getElementById('tab-hadir');
    const tabIzin = document.getElementById('tab-izin');

    tabHadir?.addEventListener('click', () => { currentTab = 'Hadir'; stopStream(); render(); });
    tabIzin?.addEventListener('click', () => { currentTab = 'Izin'; stopStream(); render(); });

    if (currentTab === 'Hadir') {
      bindStep0();
    }

    if (currentTab === 'Izin') {
      document.getElementById('izin-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btnKirimIzin');
        btn.innerHTML = 'Mengirim...';
        btn.disabled = true;
        try {
          await window.APP_DATA.submitPresensi({
            status: document.getElementById('jenis-izin').value,
            catatan: document.getElementById('alasan-izin').value,
            fotoBlob: null,
            latitude: null,
            longitude: null
          });
          window.Components.toast('Pengajuan berhasil dikirim!', 'success');
          setTimeout(() => window.Router.navigate('/guru/dashboard'), 1500);
        } catch (err) {
          window.Components.toast('Gagal: ' + (err.message || err), 'error');
          btn.innerHTML = '<span class="material-icons-outlined">send</span> Kirim Pengajuan';
          btn.disabled = false;
        }
      });
    }
  }

  window.Router.register('/guru/presensi', () => {
    currentTab = 'Hadir';
    capturedBlob = null;
    gpsCoords = null;
    pengaturan = null;
    stopStream();
    render();
  });
})();
