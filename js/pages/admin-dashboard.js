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
        <!-- Mobile Header -->
        <div class="admin-mobile-header" style="display: flex; align-items: center; padding: 16px; background: white; border-bottom: 1px solid #e0e0e0; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="btnToggleDrawer" class="btn-icon" style="background: none; border: none; padding: 4px;"><span class="material-icons-outlined">menu</span></button>
            <h2 style="margin: 0; font-size: 18px; color: #1a73e8; display: flex; align-items: center; gap: 8px;">🎓 SIPINTER</h2>
          </div>
          <div class="avatar" style="width: 32px; height: 32px; background: #e0f2f1; color: #00897b; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">AD</div>
        </div>

        <!-- Drawer Overlay (Mobile) -->
        <div id="adminDrawerOverlay" class="admin-drawer-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100;"></div>

        <!-- Sidebar -->
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

        <!-- Main Content -->
        <div class="admin-content" style="flex: 1; margin-left: 260px; padding: 24px; min-height: 100vh; background: #f8f9fa;">
          ${content}
        </div>
        
        <style>
          .admin-page { display: flex; min-height: 100vh; }
          .admin-sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #5f6368; text-decoration: none; font-weight: 500; transition: background 0.2s; }
          .admin-sidebar-item:hover { background: #f1f3f4; color: #1a73e8; }
          .admin-sidebar-item.active { background: #e8f0fe; color: #1a73e8; border-right: 4px solid #1a73e8; }
          
          @media (min-width: 769px) {
            .admin-mobile-header { display: none !important; }
            #adminDrawerOverlay { display: none !important; }
            #btnCloseDrawer { display: none !important; }
          }
          @media (max-width: 768px) {
            .admin-page { flex-direction: column; }
            .admin-content { margin-left: 0 !important; padding: 16px !important; }
            .admin-sidebar { transform: translateX(-100%); }
            .admin-sidebar.open { transform: translateX(0); }
          }
        </style>
      </div>
    `;
  }
  
  function render() {
    const statGrid = `
      <div class="stat-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
        <div class="stat-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #e3f2fd; color: #1976d2; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons-outlined">people</span>
          </div>
          <div>
            <div class="stat-card-value" style="font-size: 24px; font-weight: bold; color: #333;">6</div>
            <div class="stat-card-label" style="font-size: 14px; color: #666;">Total Guru</div>
          </div>
        </div>
        <div class="stat-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #e8f5e9; color: #388e3c; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons-outlined">school</span>
          </div>
          <div>
            <div class="stat-card-value" style="font-size: 24px; font-weight: bold; color: #333;">96</div>
            <div class="stat-card-label" style="font-size: 14px; color: #666;">Total Siswa</div>
          </div>
        </div>
        <div class="stat-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #fff3e0; color: #f57c00; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons-outlined">description</span>
          </div>
          <div>
            <div class="stat-card-value" style="font-size: 24px; font-weight: bold; color: #333;">2</div>
            <div class="stat-card-label" style="font-size: 14px; color: #666;">Laporan Hari Ini</div>
          </div>
        </div>
        <div class="stat-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #f3e5f5; color: #7b1fa2; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons-outlined">trending_up</span>
          </div>
          <div>
            <div class="stat-card-value" style="font-size: 24px; font-weight: bold; color: #333;">98%</div>
            <div class="stat-card-label" style="font-size: 14px; color: #666;">Kehadiran</div>
          </div>
        </div>
      </div>
    `;

    const aktivitasHtml = (window.APP_DATA.aktivitasGuru || []).map(act => `
      <div class="list-item" style="display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #eee;">
        <div class="list-item-icon" style="width: 40px; height: 40px; border-radius: 50%; background: ${act.color}20; color: ${act.color}; display: flex; align-items: center; justify-content: center;">
          <span class="material-icons-outlined">${act.icon}</span>
        </div>
        <div class="list-item-content" style="flex: 1;">
          <div class="list-item-title" style="font-weight: 500; font-size: 14px; color: #333;">${act.title}</div>
          <div class="list-item-subtitle" style="font-size: 12px; color: #666;">${act.subtitle}</div>
        </div>
        <div class="list-item-right" style="font-size: 12px; color: #999;">
          ${act.time}
        </div>
      </div>
    `).join('');

    const quickAccess = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        <button onclick="window.Router.navigate('/admin/guru')" class="btn btn-outline" style="padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; border: 1px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer;">
          <span class="material-icons-outlined" style="font-size: 24px; color: #1a73e8;">people</span>
          Kelola Guru
        </button>
        <button onclick="window.Router.navigate('/admin/siswa')" class="btn btn-outline" style="padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; border: 1px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer;">
          <span class="material-icons-outlined" style="font-size: 24px; color: #388e3c;">school</span>
          Kelola Siswa
        </button>
        <button onclick="window.Router.navigate('/admin/jadwal')" class="btn btn-outline" style="padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; border: 1px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer;">
          <span class="material-icons-outlined" style="font-size: 24px; color: #f57c00;">event_note</span>
          Jadwal Piket
        </button>
        <button onclick="window.Router.navigate('/export')" class="btn btn-outline" style="padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; border: 1px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer;">
          <span class="material-icons-outlined" style="font-size: 24px; color: #7b1fa2;">download</span>
          Export Laporan
        </button>
      </div>
    `;

    const content = `
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Selamat Datang, Admin</h1>
        <p style="margin: 0; color: #666;">${window.APP_DATA.getHariTanggal()}</p>
      </div>

      ${statGrid}

      <div style="display: grid; grid-template-columns: 1fr; gap: 24px; @media(min-width: 768px) { grid-template-columns: 2fr 1fr; }">
        <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #333;">Aktivitas Terbaru</h3>
          <div>${aktivitasHtml}</div>
        </div>

        <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #333;">Akses Cepat</h3>
          ${quickAccess}
        </div>
      </div>
      
      ${window.Components.footer ? window.Components.footer() : '<div class="mt-5 text-center text-secondary prototype-footer">SIPINTER Prototype v1.0 &copy; 2026</div>'}
    `;

    const html = adminLayout('dashboard', content);
    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    const btnToggleDrawer = document.getElementById('btnToggleDrawer');
    const btnCloseDrawer = document.getElementById('btnCloseDrawer');
    const overlay = document.getElementById('adminDrawerOverlay');
    const sidebar = document.getElementById('adminSidebar');

    if (btnToggleDrawer) {
      btnToggleDrawer.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.remove('hidden');
      });
    }
    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
      });
    }
  }

  window.Router.register('/admin/dashboard', render);
})();
