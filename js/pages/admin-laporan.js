(function() {
  function adminLayout(activeMenu, content) {
    const menuItems = [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
      { id: 'guru', icon: 'people', label: 'Guru', path: '/admin/guru' },
      { id: 'siswa', icon: 'school', label: 'Siswa', path: '/admin/siswa' },
      { id: 'kelas', icon: 'class', label: 'Kelas', path: '/admin/kelas' },
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
    window.Components.showLoading();
    
    // Fetch laporan real dari Supabase
    const { data: laporans, error } = await window.supabase
      .from('laporan_piket')
      .select('id, tanggal, sesi, status, catatan, profiles!guru_id(nama)')
      .order('created_at', { ascending: false });

    window.Components.hideLoading();
    
    if (error) {
      window.Components.toast('Gagal memuat laporan', 'error');
      return;
    }

    const listHtml = (laporans || []).length > 0
      ? (laporans || []).map(l => {
          const badgeHtml = l.status === 'Selesai' 
            ? `<span class="badge" style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Selesai</span>`
            : `<span class="badge" style="background: #fff3e0; color: #ef6c00; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Belum Selesai</span>`;

          return `
            <div class="card laporan-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                  <div style="font-weight: 500; font-size: 16px; color: #333;">${l.tanggal} &bull; Sesi ${l.sesi}</div>
                  <div style="font-size: 13px; color: #666; margin-top: 4px;">Petugas: ${l.profiles?.nama || '-'}</div>
                  ${l.catatan ? `<div style="font-size: 12px; color: #888; margin-top: 4px; font-style: italic;">${l.catatan.substring(0, 60)}${l.catatan.length > 60 ? '...' : ''}</div>` : ''}
                </div>
                ${badgeHtml}
              </div>
            </div>
          `;
        }).join('')
      : '<p style="color:#666; text-align:center; padding: 32px 0;">Belum ada laporan masuk.</p>';

    const content = `
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Laporan Piket</h1>
        <p style="margin: 0; color: #666;">Daftar laporan hasil piket harian</p>
      </div>

      <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;">
        <button id="filterSemua" class="chip-btn active" style="padding: 6px 16px; border-radius: 16px; background: #1a73e8; color: white; border: none; font-size: 14px; cursor: pointer;">Semua</button>
        <button id="filterHariIni" class="chip-btn" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 14px; cursor: pointer;">Hari Ini</button>
        <button id="filterMingguIni" class="chip-btn" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 14px; cursor: pointer;">Minggu Ini</button>
      </div>

      <div id="laporanList" style="display: flex; flex-direction: column; gap: 4px;">
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
    // Store laporan data for filtering
    window._laporanAll = laporans || [];
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

    // Filter chips
    const today = new Date().toISOString().split('T')[0];
    const mondayOffset = new Date().getDay() === 0 ? -6 : 1 - new Date().getDay();
    const monday = new Date(Date.now() + mondayOffset * 86400000).toISOString().split('T')[0];

    const filterBtn = (id, filterFn) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chip-btn').forEach(b => {
          b.style.background = 'white'; b.style.color = '#666'; b.style.border = '1px solid #ddd';
        });
        btn.style.background = '#1a73e8'; btn.style.color = 'white'; btn.style.border = 'none';
        const filtered = filterFn ? (window._laporanAll || []).filter(filterFn) : (window._laporanAll || []);
        renderList(filtered);
      });
    };

    filterBtn('filterSemua', null);
    filterBtn('filterHariIni', l => l.tanggal === today);
    filterBtn('filterMingguIni', l => l.tanggal >= monday);

    document.getElementById('btnExportLaporan')?.addEventListener('click', () => {
      window.Router.navigate('/export');
    });
  }

  function renderList(laporans) {
    const el = document.getElementById('laporanList');
    if (!el) return;
    if (!laporans.length) { el.innerHTML = '<p style="color:#666;text-align:center;padding:32px 0;">Tidak ada laporan untuk filter ini.</p>'; return; }
    el.innerHTML = laporans.map(l => {
      const badgeHtml = l.status === 'Selesai' 
        ? `<span class="badge" style="background:#e8f5e9;color:#2e7d32;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:500;">Selesai</span>`
        : `<span class="badge" style="background:#fff3e0;color:#ef6c00;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:500;">Belum Selesai</span>`;
      return `
        <div class="card" style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:500;font-size:16px;color:#333;">${l.tanggal} &bull; Sesi ${l.sesi}</div>
            <div style="font-size:13px;color:#666;margin-top:4px;">Petugas: ${l.profiles?.nama || '-'}</div>
          </div>
          ${badgeHtml}
        </div>`;
    }).join('');
  }

  window.Router.register('/admin/laporan', render);
})();
