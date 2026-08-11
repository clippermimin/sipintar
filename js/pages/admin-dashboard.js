(function() {
  function adminLayout(activeMenu, content) {
    const menuItems = [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
      { id: 'guru', icon: 'people', label: 'Guru', path: '/admin/guru' },
      { id: 'siswa', icon: 'school', label: 'Siswa', path: '/admin/siswa' },
      { id: 'kelas', icon: 'class', label: 'Kelas', path: '/admin/kelas' },
      { id: 'laporan', icon: 'description', label: 'Laporan Piket', path: '/admin/laporan' },
      { id: 'presensi', icon: 'how_to_reg', label: 'Rekap Presensi', path: '/admin/presensi' },
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
  
  async function render() {
    const stats = await window.APP_DATA.getAdminStats();
    const aktivitas = await window.APP_DATA.getAdminAktivitas();
    const absenSiswa = await window.APP_DATA.getSiswaAbsenHariIni();
    const absenGuru = await window.APP_DATA.getGuruAbsenHariIni();

    const statGrid = `
      <div class="stat-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px;">
        
        <div class="metric-card" style="background: white; padding: 24px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; transition: transform 0.2s;">
          <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #e3f2fd, transparent); border-radius: 0 20px 0 100%; opacity: 0.6;"></div>
          <div>
            <div style="font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Total Guru</div>
            <div class="metric-number animate-number" data-target="${stats.totalGuru}" style="font-size: 36px; font-weight: 800; color: #111827; line-height: 1;">0</div>
          </div>
          <div style="width: 56px; height: 56px; border-radius: 16px; background: #e3f2fd; color: #1a73e8; display: flex; align-items: center; justify-content: center; z-index: 1;">
            <span class="material-icons-outlined" style="font-size: 28px;">people</span>
          </div>
        </div>
        
        <div class="metric-card" style="background: white; padding: 24px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; transition: transform 0.2s;">
          <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #e8f5e9, transparent); border-radius: 0 20px 0 100%; opacity: 0.6;"></div>
          <div>
            <div style="font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Total Siswa</div>
            <div class="metric-number animate-number" data-target="${stats.totalSiswa}" style="font-size: 36px; font-weight: 800; color: #111827; line-height: 1;">0</div>
          </div>
          <div style="width: 56px; height: 56px; border-radius: 16px; background: #e8f5e9; color: #10b981; display: flex; align-items: center; justify-content: center; z-index: 1;">
            <span class="material-icons-outlined" style="font-size: 28px;">school</span>
          </div>
        </div>

        <div class="metric-card" style="background: white; padding: 24px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; transition: transform 0.2s;">
          <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #fff3e0, transparent); border-radius: 0 20px 0 100%; opacity: 0.6;"></div>
          <div>
            <div style="font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Laporan Piket</div>
            <div class="metric-number animate-number" data-target="${stats.laporanHariIni}" style="font-size: 36px; font-weight: 800; color: #111827; line-height: 1;">0</div>
          </div>
          <div style="width: 56px; height: 56px; border-radius: 16px; background: #fff3e0; color: #f59e0b; display: flex; align-items: center; justify-content: center; z-index: 1;">
            <span class="material-icons-outlined" style="font-size: 28px;">description</span>
          </div>
        </div>

        <div class="metric-card" style="background: white; padding: 24px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; transition: transform 0.2s;">
          <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #f3e8ff, transparent); border-radius: 0 20px 0 100%; opacity: 0.6;"></div>
          <div>
            <div style="font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Kehadiran Siswa</div>
            <div style="display: flex; align-items: baseline; gap: 4px;">
              <div class="metric-number animate-number" data-target="${stats.kehadiran}" style="font-size: 36px; font-weight: 800; color: #111827; line-height: 1;">0</div>
              <span style="font-size: 18px; font-weight: 700; color: #6b7280;">%</span>
            </div>
          </div>
          
          <div class="circular-progress" data-progress="${stats.kehadiran}" style="width: 64px; height: 64px; border-radius: 50%; background: conic-gradient(#8b5cf6 0deg, #f3f4f6 0deg); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;">
            <div style="position: absolute; inset: 5px; background: white; border-radius: 50%;"></div>
            <span class="material-icons-outlined" style="position: relative; z-index: 2; font-size: 24px; color: #8b5cf6;">trending_up</span>
          </div>
        </div>

        <div class="metric-card" style="background: white; padding: 24px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; transition: transform 0.2s;">
          <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: linear-gradient(135deg, #e0f2fe, transparent); border-radius: 0 20px 0 100%; opacity: 0.6;"></div>
          <div>
            <div style="font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Kehadiran Guru</div>
            <div style="display: flex; align-items: baseline; gap: 4px;">
              <div class="metric-number animate-number" data-target="${stats.kehadiranGuru}" style="font-size: 36px; font-weight: 800; color: #111827; line-height: 1;">0</div>
              <span style="font-size: 18px; font-weight: 700; color: #6b7280;">%</span>
            </div>
          </div>
          
          <div class="circular-progress-guru" data-progress="${stats.kehadiranGuru}" style="width: 64px; height: 64px; border-radius: 50%; background: conic-gradient(#0ea5e9 0deg, #f3f4f6 0deg); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;">
            <div style="position: absolute; inset: 5px; background: white; border-radius: 50%;"></div>
            <span class="material-icons-outlined" style="position: relative; z-index: 2; font-size: 24px; color: #0ea5e9;">how_to_reg</span>
          </div>
        </div>
      </div>
    `;

    let aktivitasHtml = '<div style="text-align: center; color: #999; font-size: 14px; padding: 16px;">Belum ada aktivitas</div>';
    
    if (aktivitas && aktivitas.length > 0) {
      aktivitasHtml = aktivitas.map(act => `
        <div class="list-item" style="display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #eee;">
          <div class="list-item-icon" style="width: 40px; height: 40px; border-radius: 50%; background: ${act.color}20; color: ${act.color}; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons-outlined">${act.icon}</span>
          </div>
          <div class="list-item-content" style="flex: 1;">
            <div class="list-item-title" style="font-weight: 500; font-size: 14px; color: #333;">${act.title}</div>
            <div class="list-item-subtitle" style="font-size: 12px; color: #666;">${act.subtitle}</div>
          </div>
          <div class="list-item-right" style="font-size: 12px; color: #999; text-align: right; min-width: 60px;">
            <div style="font-weight: 600; color: #6b7280; margin-bottom: 2px;">${act.dateStr}</div>
            <div style="font-size: 11px;">${act.timeStr}</div>
          </div>
        </div>
      `).join('');
    }

    const content = `
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Selamat Datang, Admin</h1>
        <p style="margin: 0; color: #666;">${await window.APP_DATA.getHariTanggal()}</p>
      </div>

      ${statGrid}

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 24px;">
        <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">Siswa Absen Hari Ini</h3>
            <span style="background: #fee2e2; color: #ef4444; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${absenSiswa.length} Siswa</span>
          </div>
          <div style="max-height: 300px; overflow-y: auto;">
            ${absenSiswa.length > 0 ? absenSiswa.map(a => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                <div>
                  <div style="font-weight: 500; color: #333; font-size: 14px;">${a.nama}</div>
                  <div style="font-size: 12px; color: #666; margin-top: 2px;">${a.kelas}</div>
                </div>
                <span style="font-size: 12px; font-weight: 600; color: #d97706; background: #fef3c7; padding: 4px 8px; border-radius: 4px;">${a.status}</span>
              </div>
            `).join('') : '<div style="text-align: center; color: #999; font-size: 14px; padding: 16px;">Tidak ada siswa absen hari ini 🎉</div>'}
          </div>
        </div>

        <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">Guru Absen Hari Ini</h3>
            <span style="background: #fee2e2; color: #ef4444; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${absenGuru.length} Guru</span>
          </div>
          <div style="max-height: 300px; overflow-y: auto;">
            ${absenGuru.length > 0 ? absenGuru.map(a => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                <div style="font-weight: 500; color: #333; font-size: 14px;">${a.nama}</div>
                <span style="font-size: 12px; font-weight: 600; color: #d97706; background: #fef3c7; padding: 4px 8px; border-radius: 4px;">${a.status}</span>
              </div>
            `).join('') : '<div style="text-align: center; color: #999; font-size: 14px; padding: 16px;">Seluruh guru hadir hari ini 🎉</div>'}
          </div>
        </div>

        <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #333;">Aktivitas Terbaru</h3>
          <div style="max-height: 300px; overflow-y: auto;">${aktivitasHtml}</div>
        </div>
      </div>
      
      ${window.Components.footer ? window.Components.footer() : ''}
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

    // Animation Logic
    const animateValue = (obj, start, end, duration) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        if (end % 1 !== 0) {
          obj.innerHTML = (progress * (end - start) + start).toFixed(1);
        } else {
          obj.innerHTML = Math.floor(progress * (end - start) + start);
        }
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          obj.innerHTML = end;
        }
      };
      window.requestAnimationFrame(step);
    };

    // Run animations
    document.querySelectorAll('.animate-number').forEach(el => {
      const target = parseFloat(el.getAttribute('data-target')) || 0;
      animateValue(el, 0, target, 1500);
    });

    const circle = document.querySelector('.circular-progress');
    if (circle) {
      const targetVal = parseFloat(circle.getAttribute('data-progress')) || 0;
      const targetDeg = targetVal * 3.6; // 100% = 360deg
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / 1500, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentDeg = easeOutQuart * targetDeg;
        circle.style.background = `conic-gradient(#8b5cf6 ${currentDeg}deg, #f3f4f6 ${currentDeg}deg)`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          circle.style.background = `conic-gradient(#8b5cf6 ${targetDeg}deg, #f3f4f6 ${targetDeg}deg)`;
        }
      };
      window.requestAnimationFrame(step);
    }

    const circleGuru = document.querySelector('.circular-progress-guru');
    if (circleGuru) {
      const targetVal = parseFloat(circleGuru.getAttribute('data-progress')) || 0;
      const targetDeg = targetVal * 3.6;
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / 1500, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentDeg = easeOutQuart * targetDeg;
        circleGuru.style.background = `conic-gradient(#0ea5e9 ${currentDeg}deg, #f3f4f6 ${currentDeg}deg)`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          circleGuru.style.background = `conic-gradient(#0ea5e9 ${targetDeg}deg, #f3f4f6 ${targetDeg}deg)`;
        }
      };
      window.requestAnimationFrame(step);
    }
  }

  window.Router.register('/admin/dashboard', render);
})();
