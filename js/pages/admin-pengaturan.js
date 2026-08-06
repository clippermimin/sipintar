(function() {
  function adminLayout(activeMenu, content) {
    const menuItems = [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
      { id: 'guru', icon: 'people', label: 'Guru', path: '/admin/guru' },
      { id: 'siswa', icon: 'school', label: 'Siswa', path: '/admin/siswa' },
      { id: 'kelas', icon: 'class', label: 'Kelas', path: '/admin/kelas' },
      { id: 'laporan', icon: 'description', label: 'Laporan Piket', path: '/admin/laporan' },
      { id: 'presensi', icon: 'how_to_reg', label: 'Rekap Presensi', path: '/admin/presensi' },
      { id: 'export', icon: 'download', label: 'Laporan Presensi', path: '/export' },
      { id: 'pengaturan', icon: 'settings', label: 'Pengaturan', path: '/admin/pengaturan' },
    ];
    let menuHtml = menuItems.map(item => `
      <a href="javascript:void(0)" onclick="window.Router.navigate('${item.path}')" class="admin-sidebar-item ${activeMenu === item.id ? 'active' : ''}">
        <span class="material-icons-outlined">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    `).join('');
    return `
      <div class="admin-page">
        <div class="admin-mobile-header" style="display: flex; align-items: center; padding: 16px; background: white; border-bottom: 1px solid #e0e0e0; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="btnToggleDrawer" class="btn-icon" style="background: none; border: none; padding: 4px;"><span class="material-icons-outlined">menu</span></button>
            <h2 style="margin: 0; font-size: 18px; color: #1a73e8; display: flex; align-items: center; gap: 8px;">🎓 SIPINTER</h2>
          </div>
          <div class="avatar" style="width: 32px; height: 32px; background: #e0f2f1; color: #00897b; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">AD</div>
        </div>
        <div id="adminDrawerOverlay" class="admin-drawer-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100;"></div>
        <div id="adminSidebar" class="admin-sidebar" style="position: fixed; top: 0; left: 0; bottom: 0; width: 260px; background: white; border-right: 1px solid #e0e0e0; z-index: 101; display: flex; flex-direction: column; transition: transform 0.3s ease;">
          <div class="admin-sidebar-header" style="padding: 24px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee;">
            <h2 style="margin: 0; font-size: 20px; color: #1a73e8; display: flex; align-items: center; gap: 8px;">🎓 SIPINTER</h2>
            <button id="btnCloseDrawer" class="btn-icon" style="background: none; border: none; padding: 4px;"><span class="material-icons-outlined">close</span></button>
          </div>
          <div class="admin-sidebar-menu" style="flex: 1; overflow-y: auto; padding: 16px 0;">
            ${menuHtml}
          </div>
          <div style="padding: 16px 0; border-top: 1px solid #eee;">
            <a href="javascript:void(0)" onclick="window.APP_DATA.logout()" class="admin-sidebar-item" style="color: #EA4335;">
              <span class="material-icons-outlined">logout</span>
              <span>Keluar</span>
            </a>
          </div>
        </div>
        <div class="admin-content" style="flex: 1; margin-left: 260px; padding: 24px; min-height: 100vh; background: #f8f9fa;">
          ${content}
        </div>
        <style>
          .admin-page { display: flex; min-height: 100vh; }
          .admin-sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #5f6368; text-decoration: none; font-weight: 500; transition: background 0.2s; }
          .admin-sidebar-item:hover { background: #f1f3f4; color: #1a73e8; }
          .admin-sidebar-item.active { background: #e8f0fe; color: #1a73e8; border-right: 4px solid #1a73e8; }
          @media (min-width: 769px) { .admin-mobile-header { display: none !important; } #adminDrawerOverlay { display: none !important; } #btnCloseDrawer { display: none !important; } }
          @media (max-width: 768px) { .admin-page { flex-direction: column; } .admin-content { margin-left: 0 !important; padding: 16px !important; } .admin-sidebar { transform: translateX(-100%); } .admin-sidebar.open { transform: translateX(0); } }
        </style>
      </div>
    `;
  }

  async function render() {
    if (window.APP_STATE.role !== 'admin') { window.Router.navigate('/login'); return; }
    window.Components.showLoading('Memuat pengaturan...');

    const pengaturan = await window.APP_DATA.getPengaturanSekolah();

    window.Components.hideLoading();

    const content = `
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 8px; font-size: 24px; color: #333;">Pengaturan Sekolah</h1>
        <p style="margin: 0; color: #666;">Konfigurasi lokasi dan radius presensi guru</p>
      </div>

      <div class="card" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); max-width: 680px;">
        <h3 style="margin: 0 0 20px; font-size: 16px; color: #333; display: flex; align-items: center; gap: 8px;">
          <span class="material-icons-outlined" style="color: #1a73e8;">location_on</span> Lokasi Presensi
        </h3>

        <form id="pengaturan-form">
          <input type="hidden" id="pg-id" value="${pengaturan.id || ''}">

          <div style="margin-bottom: 16px;">
            <label class="form-label" style="display: block; font-size: 13px; font-weight: 600; color: #666; margin-bottom: 6px;">Nama Sekolah</label>
            <input type="text" id="pg-nama" class="form-input" value="${pengaturan.nama_sekolah || ''}" placeholder="Nama Sekolah" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label class="form-label" style="display: block; font-size: 13px; font-weight: 600; color: #666; margin-bottom: 6px;">Latitude Sekolah</label>
              <input type="number" id="pg-lat" class="form-input" value="${pengaturan.lat_sekolah || ''}" step="any" placeholder="-6.2088" required>
              <p style="font-size: 11px; color: #999; margin: 4px 0 0;">Contoh: -6.2088</p>
            </div>
            <div>
              <label class="form-label" style="display: block; font-size: 13px; font-weight: 600; color: #666; margin-bottom: 6px;">Longitude Sekolah</label>
              <input type="number" id="pg-lng" class="form-input" value="${pengaturan.lng_sekolah || ''}" step="any" placeholder="106.8456" required>
              <p style="font-size: 11px; color: #999; margin: 4px 0 0;">Contoh: 106.8456</p>
            </div>
          </div>

          <div style="background: #EEF4FF; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; display: flex; gap: 12px; align-items: flex-start;">
            <span class="material-icons-outlined" style="color: #1a73e8; margin-top: 2px; font-size: 18px;">info</span>
            <div>
              <div style="font-size: 13px; font-weight: 600; color: #1a73e8; margin-bottom: 4px;">Cara mendapatkan koordinat</div>
              <div style="font-size: 12px; color: #444; line-height: 1.5;">Buka <a href="https://maps.google.com" target="_blank" style="color: #1a73e8;">Google Maps</a>, klik kanan pada titik sekolah → salin koordinat yang muncul.</div>
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <label class="form-label" style="display: block; font-size: 13px; font-weight: 600; color: #666; margin-bottom: 6px;">
              Radius Presensi: <span id="radiusLabel" style="color: #1a73e8;">${pengaturan.radius_meter || 200} meter</span>
            </label>
            <input type="range" id="pg-radius" min="50" max="1000" step="25" value="${pengaturan.radius_meter || 200}" style="width: 100%; accent-color: #1a73e8;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #999; margin-top: 4px;">
              <span>50m (ketat)</span><span>500m</span><span>1000m (longgar)</span>
            </div>
            <p style="font-size: 12px; color: #666; margin-top: 8px;">Guru yang berada dalam radius ini dari titik sekolah akan diterima presensinya.</p>
          </div>

          <div style="background: #F8F9FA; border-radius: 10px; padding: 14px 16px; margin-bottom: 24px;">
            <div style="font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px;">📍 Verifikasi Lokasi</div>
            <div style="font-size: 12px; color: #666;">
              Koordinat saat ini: <strong>${pengaturan.lat_sekolah || '-'}, ${pengaturan.lng_sekolah || '-'}</strong><br>
              <a href="https://maps.google.com/?q=${pengaturan.lat_sekolah || 0},${pengaturan.lng_sekolah || 0}" 
                 target="_blank" style="color: #1a73e8; font-size: 12px; margin-top: 4px; display: inline-block;">
                 🗺️ Lihat di Google Maps
              </a>
            </div>
          </div>

          <button type="submit" id="btnSimpanPengaturan" class="btn btn-primary" style="padding: 12px 28px; border-radius: 10px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            <span class="material-icons-outlined">save</span> Simpan Pengaturan
          </button>
        </form>
      </div>
    `;

    const html = adminLayout('pengaturan', content);
    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    const btnToggle = document.getElementById('btnToggleDrawer');
    const btnClose = document.getElementById('btnCloseDrawer');
    const overlay = document.getElementById('adminDrawerOverlay');
    const sidebar = document.getElementById('adminSidebar');
    if (btnToggle) btnToggle.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.remove('hidden'); });
    if (btnClose) btnClose.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });

    // Radius slider label
    document.getElementById('pg-radius')?.addEventListener('input', (e) => {
      document.getElementById('radiusLabel').textContent = e.target.value + ' meter';
    });

    // Form submit
    document.getElementById('pengaturan-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnSimpanPengaturan');
      btn.innerHTML = '<span class="material-icons-outlined" style="animation: spin 1s linear infinite;">refresh</span> Menyimpan...';
      btn.disabled = true;
      try {
        const id = document.getElementById('pg-id').value;
        const savedData = await window.APP_DATA.updatePengaturanSekolah(id, {
          nama_sekolah: document.getElementById('pg-nama').value,
          lat_sekolah: parseFloat(document.getElementById('pg-lat').value),
          lng_sekolah: parseFloat(document.getElementById('pg-lng').value),
          radius_meter: parseInt(document.getElementById('pg-radius').value)
        });
        document.getElementById('pg-id').value = savedData.id;
        window.Components.toast('Pengaturan berhasil disimpan!', 'success');
      } catch (err) {
        window.Components.toast('Gagal menyimpan: ' + (err.message || err), 'error');
      } finally {
        btn.innerHTML = '<span class="material-icons-outlined">save</span> Simpan Pengaturan';
        btn.disabled = false;
      }
    });
  }

  window.Router.register('/admin/pengaturan', render);
})();
