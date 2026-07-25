(function() {
  function adminLayout(activeMenu, content) {
    const menuItems = [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
      { id: 'guru', icon: 'people', label: 'Guru', path: '/admin/guru' },
      { id: 'siswa', icon: 'school', label: 'Siswa', path: '/admin/siswa' },
      { id: 'kelas', icon: 'class', label: 'Kelas', path: '/admin/kelas' },
      { id: 'jadwal', icon: 'event_note', label: 'Jadwal Piket', path: '/admin/jadwal' },
      { id: 'laporan', icon: 'description', label: 'Laporan', path: '/admin/laporan' },
      { id: 'export', icon: 'download', label: 'Export', path: '/export' },
      { id: 'setting', icon: 'settings', label: 'Pengaturan', path: '#' },
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
            <a href="javascript:void(0)" onclick="window.APP_STATE.role = null; window.APP_STATE.currentGuru = null; window.Router.navigate('/login')" class="admin-sidebar-item" style="color: #EA4335;">
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
    const filterChips = `
      <div class="chip-group" style="display: flex; gap: 8px; margin-bottom: 24px;">
        <div class="chip active" style="padding: 6px 16px; border-radius: 16px; background: #1a73e8; color: white; font-size: 14px; cursor: pointer;">Semua</div>
        <div class="chip" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 14px; cursor: pointer;">Hari Ini</div>
        <div class="chip" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 14px; cursor: pointer;">Minggu Ini</div>
        <div class="chip" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 14px; cursor: pointer;">Bulan Ini</div>
      </div>
    `;

    const laporans = window.APP_DATA.laporanPiket || [];
    const listHtmlArr = await Promise.all(laporans.map(async l => {
      const guru = await window.APP_DATA.getGuruById(l.petugas);
      const badgeHtml = l.status === 'Selesai' 
        ? `<span class="badge" style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Selesai</span>`
        : `<span class="badge" style="background: #fff3e0; color: #ef6c00; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Belum Selesai</span>`;

      return `
        <div class="card laporan-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 12px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <div style="font-weight: 500; font-size: 16px; color: #333;">${l.tanggal} • ${l.sesi}</div>
              <div style="font-size: 13px; color: #666; margin-top: 4px;">Petugas: ${guru ? guru.nama : l.petugas}</div>
              <div style="font-size: 13px; color: #666; margin-top: 2px;"><span class="material-icons-outlined" style="font-size: 14px; vertical-align: middle;">location_on</span> ${l.gedung}</div>
            </div>
            ${badgeHtml}
          </div>
          <div style="display: flex; gap: 16px; border-top: 1px solid #eee; padding-top: 12px;">
            <div style="font-size: 13px; color: #555;">
              <span class="material-icons-outlined" style="font-size: 16px; vertical-align: middle; color: #d32f2f;">person_off</span>
              Siswa Absen: <strong>${l.siswaAbsen}</strong>
            </div>
            <div style="font-size: 13px; color: #555;">
              <span class="material-icons-outlined" style="font-size: 16px; vertical-align: middle; color: #f57c00;">person_off</span>
              Guru Absen: <strong>${l.guruAbsen}</strong>
            </div>
          </div>
        </div>
      `;
    }));
    const listHtml = listHtmlArr.join('');

    const content = `
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Laporan Piket</h1>
        <p style="margin: 0; color: #666;">Daftar laporan hasil piket harian</p>
      </div>

      ${filterChips}

      <div style="display: flex; flex-direction: column; gap: 4px;">
        ${listHtml}
      </div>

      <div style="margin-top: 32px; text-align: center;">
        <button id="btnExportLaporan" class="btn btn-outline" style="padding: 12px 24px; border-radius: 8px; border: 1px solid #1a73e8; color: #1a73e8; background: white; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
          <span class="material-icons-outlined">download</span> Export Semua Laporan
        </button>
      </div>
    `;

    const html = adminLayout('laporan', content);
    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    const btnToggleDrawer = document.getElementById('btnToggleDrawer');
    const btnCloseDrawer = document.getElementById('btnCloseDrawer');
    const overlay = document.getElementById('adminDrawerOverlay');
    const sidebar = document.getElementById('adminSidebar');

    if (btnToggleDrawer) btnToggleDrawer.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.remove('hidden'); });
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });

    document.querySelectorAll('.laporan-card').forEach(card => {
      card.addEventListener('click', () => {
        window.Components.toast('Demo: Detail laporan', 'info');
      });
    });

    document.getElementById('btnExportLaporan').addEventListener('click', () => {
      window.Components.toast('Mengarahkan ke halaman Export...', 'info');
      setTimeout(() => window.Router.navigate('/export'), 1000);
    });
  }

  window.Router.register('/admin/laporan', render);
})();
