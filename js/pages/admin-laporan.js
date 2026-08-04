(function() {
  function adminLayout(activeMenu, content) {
    const menuItems = [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
      { id: 'guru', icon: 'people', label: 'Guru', path: '/admin/guru' },
      { id: 'siswa', icon: 'school', label: 'Siswa', path: '/admin/siswa' },
      { id: 'kelas', icon: 'class', label: 'Kelas', path: '/admin/kelas' },
      { id: 'laporan', icon: 'description', label: 'Laporan Piket', path: '/admin/laporan' },
      { id: 'export', icon: 'download', label: 'Laporan Presensi', path: '/export' },
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
  
  async function fetchAndRenderList() {
    const { data: laporans, error } = await window.supabase
      .from('laporan_piket')
      .select('id, tanggal, sesi, status, catatan, profiles!guru_id(nama)')
      .order('created_at', { ascending: false });

    if (error) {
      window.Components.toast('Gagal memuat laporan', 'error');
      return;
    }

    window._laporanAll = laporans || [];
    applyFilters();
  }

  function applyFilters() {
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    
    let filtered = window._laporanAll || [];
    
    if (startDate) {
      filtered = filtered.filter(l => l.tanggal >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(l => l.tanggal <= endDate);
    }
    
    renderList(filtered);
  }

  async function render() {
    if (window.APP_STATE.role !== 'admin') {
      window.Router.navigate('/login');
      return;
    }
    const content = `
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Laporan Piket</h1>
        <p style="margin: 0; color: #666;">Daftar laporan hasil piket harian</p>
      </div>

      <div class="card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 24px;">
        <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 14px; color: #666;">Filter Rentang Tanggal</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 12px;">Dari Tanggal</label>
            <input type="date" id="filterStartDate" class="form-input">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="font-size: 12px;">Sampai Tanggal</label>
            <input type="date" id="filterEndDate" class="form-input">
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="btnApplyFilter" class="btn btn-primary" style="padding: 10px 16px;">Terapkan</button>
            <button id="btnResetFilter" class="btn btn-outline" style="padding: 10px 16px;">Reset</button>
          </div>
        </div>
      </div>

      <div id="laporanList" style="display: flex; flex-direction: column; gap: 4px;">
        <p style="color:#666;">Memuat laporan...</p>
      </div>

      <div style="margin-top: 32px; text-align: center;">
        <button id="btnExportLaporan" class="btn btn-outline" style="padding: 12px 24px; border-radius: 8px; border: 1px solid #1a73e8; color: #1a73e8; background: white; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
          <span class="material-icons-outlined">download</span> Export Laporan
        </button>
      </div>
    `;

    const html = adminLayout('laporan', content);
    window.Components.renderPage(html);
    setTimeout(() => {
      bindEvents();
      fetchAndRenderList();
    }, 200);
  }

  function bindEvents() {
    const btnToggleDrawer = document.getElementById('btnToggleDrawer');
    const btnCloseDrawer = document.getElementById('btnCloseDrawer');
    const overlay = document.getElementById('adminDrawerOverlay');
    const sidebar = document.getElementById('adminSidebar');

    if (btnToggleDrawer) btnToggleDrawer.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.remove('hidden'); });
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });

    document.getElementById('btnApplyFilter').addEventListener('click', applyFilters);
    document.getElementById('btnResetFilter').addEventListener('click', () => {
      document.getElementById('filterStartDate').value = '';
      document.getElementById('filterEndDate').value = '';
      applyFilters();
    });

    document.getElementById('btnExportLaporan')?.addEventListener('click', () => {
      window.Router.navigate('/export');
    });
  }

  function renderList(laporans) {
    const el = document.getElementById('laporanList');
    if (!el) return;
    if (!laporans.length) { el.innerHTML = '<p style="color:#666;text-align:center;padding:32px 0;">Tidak ada laporan untuk rentang tanggal ini.</p>'; return; }
    
    el.innerHTML = laporans.map(l => {
      const badgeHtml = l.status === 'Selesai' 
        ? `<span class="badge" style="background:#e8f5e9;color:#2e7d32;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:500;">Selesai</span>`
        : `<span class="badge" style="background:#fff3e0;color:#ef6c00;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:500;">Belum Selesai</span>`;
      
      return `
        <div class="card" style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <div style="font-weight:500;font-size:16px;color:#333;">${l.tanggal} &bull; Sesi ${l.sesi}</div>
              <div style="font-size:13px;color:#666;margin-top:4px;">Petugas: ${l.profiles?.nama || '-'}</div>
              ${l.catatan ? `<div style="font-size:12px;color:#888;margin-top:4px;font-style:italic;">${l.catatan}</div>` : ''}
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
              ${badgeHtml}
              <button class="btn btn-outline del-laporan-btn" data-id="${l.id}" style="padding:4px 8px;font-size:12px;border-radius:4px;border:1px solid #ea4335;color:#ea4335;background:white;cursor:pointer;">Hapus</button>
            </div>
          </div>
        </div>`;
    }).join('');

    document.querySelectorAll('.del-laporan-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if(confirm('Yakin ingin menghapus laporan ini beserta semua data absensinya?')) {
          const id = e.target.dataset.id;
          const { error } = await window.supabase.from('laporan_piket').delete().eq('id', id);
          if (error) {
            window.Components.toast('Gagal menghapus laporan: ' + error.message, 'error');
          } else {
            window.Components.toast('Laporan berhasil dihapus');
            fetchAndRenderList();
          }
        }
      });
    });
  }

  window.Router.register('/admin/laporan', render);
})();
