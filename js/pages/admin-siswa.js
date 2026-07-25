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
    // Generate some student lists by class
    const filterHtml = `
      <div class="chip-group" style="display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; padding-bottom: 8px;">
        <div class="chip active" style="padding: 6px 16px; border-radius: 16px; background: #1a73e8; color: white; font-size: 14px; cursor: pointer;">Semua</div>
        <div class="chip" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 14px; cursor: pointer;">X</div>
        <div class="chip" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 14px; cursor: pointer;">XI</div>
        <div class="chip" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 14px; cursor: pointer;">XII</div>
      </div>
    `;

    const kelasList = window.APP_DATA.kelas.slice(0, 3); // Just show 3 for demo
    
    let contentHtmlArr = await Promise.all(kelasList.map(async k => {
      const siswaList = (await window.APP_DATA.getSiswaByKelas(k.id)) || [];
      const siswaItems = siswaList.map((s, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #666;">
              ${i+1}
            </div>
            <span style="font-size: 14px; color: #333;">${s}</span>
          </div>
          <button class="btn btn-outline" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; border: 1px solid #ccc; background: white; cursor: pointer;" onclick="window.Components.toast('Demo: Edit siswa', 'info')">Edit</button>
        </div>
      `).join('');

      return `
        <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">Kelas ${k.nama}</h3>
            <a href="javascript:void(0)" class="action-link" style="color: #1a73e8; font-size: 14px; text-decoration: none;" onclick="window.Components.toast('Lihat semua siswa kelas ${k.nama}', 'info')">Lihat Semua</a>
          </div>
          <div>${siswaItems}</div>
        </div>
      `;
    }));
    let contentHtml = contentHtmlArr.join('');

    const content = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Kelola Siswa</h1>
          <span class="badge badge-success" style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">96 Siswa</span>
        </div>
      </div>
      
      ${filterHtml}

      <div class="search-bar" style="margin-bottom: 24px;">
        <div style="position: relative;">
          <span class="material-icons-outlined" style="position: absolute; left: 12px; top: 10px; color: #999;">search</span>
          <input type="text" class="form-input" placeholder="Cari nama siswa atau NIS..." style="width: 100%; padding: 10px 12px 10px 40px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">
        </div>
      </div>

      ${contentHtml}

      <button id="btnTambahSiswa" class="btn btn-primary" style="position: fixed; bottom: 24px; right: 24px; background: #1a73e8; color: white; border: none; padding: 12px 24px; border-radius: 24px; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(26,115,232,0.3); cursor: pointer; z-index: 90;">
        <span class="material-icons-outlined">add</span> Tambah Siswa
      </button>
    `;

    const html = adminLayout('siswa', content);
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

    document.getElementById('btnTambahSiswa').addEventListener('click', () => {
      window.Components.toast('Demo: Tambah Siswa Baru', 'info');
    });
  }

  window.Router.register('/admin/siswa', render);
})();
