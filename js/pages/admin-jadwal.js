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
  
  function render() {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const colors = ['#e3f2fd', '#e8f5e9', '#fff3e0', '#f3e5f5', '#ffebee', '#e0f7fa'];
    
    const jadwalHtml = days.map((day, index) => {
      const guruIds = window.APP_DATA.jadwalPiket[day] || [];
      const gurus = guruIds.map(id => window.APP_DATA.getGuruById(id)).filter(Boolean);
      
      const guruListHtml = gurus.map(g => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: white; border-radius: 8px; margin-bottom: 8px; border: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="avatar" style="width: 32px; height: 32px; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
              ${g.nama.substring(0,2).toUpperCase()}
            </div>
            <span style="font-size: 14px; color: #333;">${g.nama}</span>
          </div>
          <button class="btn-remove-guru" style="background: none; border: none; color: #d32f2f; cursor: pointer; padding: 4px;"><span class="material-icons-outlined" style="font-size: 18px;">close</span></button>
        </div>
      `).join('');

      return `
        <div class="card" style="background: ${colors[index]}; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #333; text-align: center; border-bottom: 2px solid rgba(0,0,0,0.05); padding-bottom: 8px;">${day}</h3>
          <div style="min-height: 100px;">
            ${guruListHtml}
          </div>
          <button class="btn-tambah-jadwal" style="width: 100%; padding: 8px; margin-top: 8px; border: 1px dashed rgba(0,0,0,0.2); background: transparent; border-radius: 8px; color: #666; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span class="material-icons-outlined" style="font-size: 16px;">add</span> Tambah Guru
          </button>
        </div>
      `;
    }).join('');

    const content = `
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Jadwal Guru Piket</h1>
        <p style="margin: 0; color: #666;">Semester Genap 2026/2027</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
        ${jadwalHtml}
      </div>
    `;

    const html = adminLayout('jadwal', content);
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

    document.querySelectorAll('.btn-remove-guru').forEach(btn => {
      btn.addEventListener('click', () => {
        window.Components.toast('Demo: Guru dihapus dari jadwal', 'info');
      });
    });

    document.querySelectorAll('.btn-tambah-jadwal').forEach(btn => {
      btn.addEventListener('click', () => {
        window.Components.toast('Demo: Tambah Guru ke Jadwal', 'info');
      });
    });
  }

  window.Router.register('/admin/jadwal', render);
})();
