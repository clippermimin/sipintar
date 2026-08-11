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
  
  async function fetchAndRenderList() {
    const { data: laporans, error } = await window.supabase
      .from('laporan_piket')
      .select('id, tanggal, sesi, status, catatan, created_at, profiles!guru_id(nama)')
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

      <!-- Modal Detail Laporan -->
      <div id="modalDetail" class="modal-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center;">
        <div style="background: white; width: 100%; max-width: 600px; border-radius: 16px; padding: 24px; max-height: 90vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; font-size: 20px;">Detail Laporan Piket</h3>
            <button class="btn-tutup-detail" style="background: none; border: none; cursor: pointer; color: #9ca3af;"><span class="material-icons-outlined">close</span></button>
          </div>
          <div id="detailContent" style="font-size: 14px; color: #333;">
            <p>Memuat detail...</p>
          </div>
          <div style="margin-top: 24px; text-align: right;">
            <button class="btn-tutup-detail btn btn-primary" style="padding: 10px 20px; border-radius: 8px; border: none; background: #2563eb; color: white; cursor: pointer;">Tutup</button>
          </div>
        </div>
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

    const modalDetail = document.getElementById('modalDetail');
    document.querySelectorAll('.btn-tutup-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        modalDetail.classList.add('hidden');
        modalDetail.style.display = 'none';
      });
    });
  }

  async function showDetailModal(laporan) {
    const modalDetail = document.getElementById('modalDetail');
    const detailContent = document.getElementById('detailContent');
    
    modalDetail.classList.remove('hidden');
    modalDetail.style.display = 'flex';
    detailContent.innerHTML = '<p>Memuat detail...</p>';

    const { data: absensi, error } = await window.supabase
      .from('absensi_piket')
      .select('*, siswa(nama, kelas(nama))')
      .eq('laporan_id', laporan.id);

    if (error) {
      detailContent.innerHTML = '<p style="color:red;">Gagal memuat detail absensi.</p>';
      return;
    }

    let absensiHtml = '<p style="color:#666; font-style:italic;">Semua siswa hadir.</p>';
    if (absensi && absensi.length > 0) {
      absensiHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
          <thead>
            <tr style="background: #f8f9fa; border-bottom: 2px solid #eee;">
              <th style="padding: 10px; text-align: left; font-size: 13px; color: #666;">Nama Siswa</th>
              <th style="padding: 10px; text-align: left; font-size: 13px; color: #666;">Kelas</th>
              <th style="padding: 10px; text-align: left; font-size: 13px; color: #666;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${absensi.map(a => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: 500;">${a.siswa?.nama || '-'}</td>
                <td style="padding: 10px;">${a.siswa?.kelas?.nama || '-'}</td>
                <td style="padding: 10px;">
                  <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; 
                    background: ${a.status === 'Sakit' ? '#e3f2fd' : (a.status === 'Izin' ? '#fff3e0' : '#fce8e6')};
                    color: ${a.status === 'Sakit' ? '#1976d2' : (a.status === 'Izin' ? '#f57c00' : '#d32f2f')};">
                    ${a.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    const timeString = laporan.created_at ? new Date(laporan.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';

    detailContent.innerHTML = `
      <div style="display: grid; grid-template-columns: 100px 1fr; gap: 8px; margin-bottom: 16px;">
        <div style="color: #666; font-weight: 500;">Tanggal</div>
        <div>: ${laporan.tanggal}</div>
        <div style="color: #666; font-weight: 500;">Waktu Dibuat</div>
        <div>: Pukul ${timeString}</div>
        <div style="color: #666; font-weight: 500;">Sesi</div>
        <div>: ${laporan.sesi}</div>
        <div style="color: #666; font-weight: 500;">Guru Piket</div>
        <div>: ${laporan.profiles?.nama || '-'}</div>
        <div style="color: #666; font-weight: 500;">Status</div>
        <div>: ${laporan.status}</div>
        <div style="color: #666; font-weight: 500;">Catatan</div>
        <div>: ${laporan.catatan || '-'}</div>
      </div>
      <h4 style="margin: 20px 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 8px;">Daftar Siswa Tidak Hadir</h4>
      ${absensiHtml}
    `;
  }

  function renderList(laporans) {
    const el = document.getElementById('laporanList');
    if (!el) return;
    if (!laporans.length) { el.innerHTML = '<p style="color:#666;text-align:center;padding:32px 0;">Tidak ada laporan untuk rentang tanggal ini.</p>'; return; }
    
    el.innerHTML = laporans.map(l => {
      const badgeHtml = l.status === 'Selesai' 
        ? `<span class="badge" style="background:#e8f5e9;color:#2e7d32;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:500;">Selesai</span>`
        : `<span class="badge" style="background:#fff3e0;color:#ef6c00;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:500;">Belum Selesai</span>`;
      
      const timeString = l.created_at ? new Date(l.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
      return `
        <div class="card" style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <div style="font-weight:500;font-size:16px;color:#333;">${l.tanggal} &bull; Sesi ${l.sesi}</div>
              <div style="font-size:13px;color:#666;margin-top:4px;">Dibuat pada: ${timeString ? `Pukul ${timeString}` : '-'}</div>
              <div style="font-size:13px;color:#666;margin-top:4px;">Petugas: ${l.profiles?.nama || '-'}</div>
              ${l.catatan ? `<div style="font-size:12px;color:#888;margin-top:4px;font-style:italic;">${l.catatan}</div>` : ''}
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
              ${badgeHtml}
              <div style="display:flex;gap:8px;">
                <button class="btn btn-outline detail-laporan-btn" data-id="${l.id}" style="padding:4px 8px;font-size:12px;border-radius:4px;border:1px solid #1a73e8;color:#1a73e8;background:white;cursor:pointer;">Detail</button>
                <button class="btn btn-outline del-laporan-btn" data-id="${l.id}" style="padding:4px 8px;font-size:12px;border-radius:4px;border:1px solid #ea4335;color:#ea4335;background:white;cursor:pointer;">Hapus</button>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    document.querySelectorAll('.detail-laporan-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const laporan = window._laporanAll.find(l => l.id === id);
        if (laporan) showDetailModal(laporan);
      });
    });

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
