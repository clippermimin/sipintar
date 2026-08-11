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

  let _allPresensi = [];
  let _sortCol = 'waktu';
  let _sortDir = 'desc';

  async function render() {
    if (window.APP_STATE.role !== 'admin') { window.Router.navigate('/login'); return; }

    const statusColors = { 'Hadir': '#34C759', 'Sakit': '#FF9500', 'Izin Pribadi': '#007AFF', 'Dinas Luar': '#AF52DE', 'Cuti': '#FF3B30' };

    const content = `
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 8px; font-size: 24px; color: #333;">Rekap Presensi Guru</h1>
        <p style="margin: 0; color: #666;">Data kehadiran harian seluruh guru</p>
      </div>

      <div class="card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 24px;">
        <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 14px; color: #666;">Filter Tanggal</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 4px; text-transform: uppercase;">Dari</label>
            <input type="date" id="presensiStart" class="form-input">
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 4px; text-transform: uppercase;">Sampai</label>
            <input type="date" id="presensiEnd" class="form-input">
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 4px; text-transform: uppercase;">Status</label>
            <select id="presensiStatusFilter" class="form-input" style="min-width: 150px;">
              <option value="Semua">Semua Status</option>
              <option value="Hadir">Hadir</option>
              <option value="Sakit">Sakit</option>
              <option value="Izin Pribadi">Izin Pribadi</option>
              <option value="Dinas Luar">Dinas Luar</option>
              <option value="Cuti">Cuti</option>
            </select>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="btnApplyPresensi" class="btn btn-primary" style="padding: 10px 16px;">Terapkan</button>
            <button id="btnResetPresensi" class="btn btn-outline" style="padding: 10px 16px;">Reset</button>
          </div>
        </div>
      </div>

      <div id="presensiList" style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow-x: auto;">
        <p style="color: #666; text-align: center; padding: 32px 0;">Memuat data...</p>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <button id="btnExportPresensi" class="btn btn-outline" style="padding: 12px 24px; border-radius: 8px; border: 1px solid #1a73e8; color: #1a73e8; background: white; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
          <span class="material-icons-outlined">download</span> Export ke Excel
        </button>
      </div>

      <!-- Modal Detail Presensi -->
      <div id="modalDetailPresensi" class="modal-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center;">
        <div style="background: white; width: 100%; max-width: 500px; border-radius: 16px; padding: 24px; max-height: 90vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; font-size: 20px;">Detail Presensi</h3>
            <button class="btn-tutup-detail-presensi" style="background: none; border: none; cursor: pointer; color: #9ca3af;"><span class="material-icons-outlined">close</span></button>
          </div>
          <div id="detailPresensiContent" style="font-size: 14px; color: #333;">
            <p>Memuat detail...</p>
          </div>
          <div style="margin-top: 24px; text-align: right;">
            <button class="btn-tutup-detail-presensi btn btn-primary" style="padding: 10px 20px; border-radius: 8px; border: none; background: #2563eb; color: white; cursor: pointer;">Tutup</button>
          </div>
        </div>
      </div>
    `;

    window.Components.renderPage(adminLayout('presensi', content));
    
    setTimeout(async () => {
      bindDrawer();
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      document.getElementById('presensiStart').value = today;
      document.getElementById('presensiEnd').value = today;
      await loadAndRender(today, today);
      bindEvents(statusColors);
    }, 200);
  }

  async function loadAndRender(start, end) {
    document.getElementById('presensiList').innerHTML = '<p style="color:#666;text-align:center;padding:32px 0;">Memuat...</p>';
    _allPresensi = await window.APP_DATA.getRekapPresensi(start || null, end || null);
    applyFiltersAndRender();
  }

  function applyFiltersAndRender() {
    const statusFilter = document.getElementById('presensiStatusFilter').value;
    let filtered = [..._allPresensi];
    if (statusFilter !== 'Semua') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    filtered.sort((a, b) => {
      let valA, valB;
      if (_sortCol === 'guru') {
        valA = (a.profiles?.nama || '').toLowerCase();
        valB = (b.profiles?.nama || '').toLowerCase();
      } else if (_sortCol === 'waktu') {
        valA = new Date(a.tanggal + 'T' + (a.waktu || '00:00:00')).getTime();
        valB = new Date(b.tanggal + 'T' + (b.waktu || '00:00:00')).getTime();
      } else if (_sortCol === 'status') {
        valA = a.status.toLowerCase();
        valB = b.status.toLowerCase();
      } else {
        valA = a.tanggal;
        valB = b.tanggal;
      }
      
      if (valA < valB) return _sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return _sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    renderList(filtered);
  }

  function renderList(data) {
    const el = document.getElementById('presensiList');
    if (!data.length) {
      el.innerHTML = '<p style="color:#666;text-align:center;padding:32px 0;">Tidak ada data presensi yang sesuai.</p>';
      return;
    }
    const statusColors = { 'Hadir': '#34C759', 'Sakit': '#FF9500', 'Izin Pribadi': '#007AFF', 'Dinas Luar': '#AF52DE', 'Cuti': '#FF3B30' };
    
    let rowsHtml = data.map(p => {
      const color = statusColors[p.status] || '#8E8E93';
      const tglIndo = new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const avatarHtml = p.foto_url ? `<img src="${p.foto_url}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid ${color};">` : `<div style="width:36px;height:36px;border-radius:50%;background:#F2F2F7;display:flex;align-items:center;justify-content:center;"><span class="material-icons-outlined" style="color:#8E8E93;font-size:20px;">person</span></div>`;
      
      return `
        <tr style="border-bottom: 1px solid #f0f0f0; transition: background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
          <td style="padding: 12px 16px;">
            <div style="display:flex;align-items:center;gap:12px;">
              ${avatarHtml}
              <div>
                <div style="font-weight:600;font-size:14px;color:#333;">${p.profiles?.nama || '-'}</div>
                <div style="font-size:12px;color:#8E8E93;margin-top:2px;">${p.profiles?.nip || 'Tanpa NIP'}</div>
              </div>
            </div>
          </td>
          <td style="padding: 12px 16px; color: #666; font-size: 13px;">
            <div style="font-weight:500;color:#333;">${tglIndo}</div>
            <div style="color:#8E8E93;margin-top:2px;">${p.waktu ? p.waktu.substring(0,5) + ' WIB' : '-'}</div>
          </td>
          <td style="padding: 12px 16px;">
            <span style="background:${color}22;color:${color};padding:4px 10px;border-radius:12px;font-size:12px;font-weight:700;white-space:nowrap;">${p.status}</span>
          </td>
          <td style="padding: 12px 16px; color: #666; font-size: 13px; max-width: 250px;">
            <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${p.catatan || '-'}">${p.catatan || '-'}</div>
          </td>
          <td style="padding: 12px 16px; text-align: right; white-space: nowrap;">
            <button class="detail-presensi-btn" data-id="${p.id}" style="background:none;border:none;cursor:pointer;color:#1a73e8;padding:4px;" title="Detail"><span class="material-icons-outlined" style="pointer-events:none;">visibility</span></button>
            <button class="del-presensi-btn" data-id="${p.id}" style="background:none;border:none;cursor:pointer;color:#ea4335;padding:4px;" title="Hapus"><span class="material-icons-outlined" style="pointer-events:none;">delete</span></button>
          </td>
        </tr>
      `;
    }).join('');

    const getSortIcon = (col) => {
      if (_sortCol !== col) return '<span class="material-icons-outlined" style="font-size:14px;vertical-align:middle;color:#ccc;">unfold_more</span>';
      return `<span class="material-icons-outlined" style="font-size:14px;vertical-align:middle;">${_sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>`;
    };

    el.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead style="background: #f8f9fa; border-bottom: 2px solid #eee;">
          <tr>
            <th class="sort-col" data-col="guru" style="padding: 12px 16px; font-weight: 600; color: #555; font-size: 13px; text-transform: uppercase; cursor: pointer; user-select: none; transition: background 0.2s;" onmouseover="this.style.background='#f1f3f4'" onmouseout="this.style.background='transparent'">Guru ${getSortIcon('guru')}</th>
            <th class="sort-col" data-col="waktu" style="padding: 12px 16px; font-weight: 600; color: #555; font-size: 13px; text-transform: uppercase; cursor: pointer; user-select: none; transition: background 0.2s;" onmouseover="this.style.background='#f1f3f4'" onmouseout="this.style.background='transparent'">Waktu ${getSortIcon('waktu')}</th>
            <th class="sort-col" data-col="status" style="padding: 12px 16px; font-weight: 600; color: #555; font-size: 13px; text-transform: uppercase; cursor: pointer; user-select: none; transition: background 0.2s;" onmouseover="this.style.background='#f1f3f4'" onmouseout="this.style.background='transparent'">Status ${getSortIcon('status')}</th>
            <th style="padding: 12px 16px; font-weight: 600; color: #555; font-size: 13px; text-transform: uppercase;">Catatan</th>
            <th style="padding: 12px 16px; font-weight: 600; color: #555; font-size: 13px; text-transform: uppercase; text-align: right;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;

    document.querySelectorAll('.sort-col').forEach(th => {
      th.addEventListener('click', (e) => {
        const col = e.currentTarget.dataset.col;
        if (_sortCol === col) {
          _sortDir = _sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          _sortCol = col;
          _sortDir = 'asc';
        }
        applyFiltersAndRender();
      });
    });

    document.querySelectorAll('.detail-presensi-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const presensi = _allPresensi.find(p => p.id === id);
        if (presensi) showDetailPresensi(presensi);
      });
    });

    document.querySelectorAll('.del-presensi-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if(confirm('Yakin ingin menghapus data presensi ini?')) {
          const id = e.target.dataset.id;
          const { error } = await window.supabase.from('presensi').delete().eq('id', id);
          if (error) {
            window.Components.toast('Gagal menghapus presensi: ' + error.message, 'error');
          } else {
            window.Components.toast('Presensi berhasil dihapus');
            const s = document.getElementById('presensiStart').value;
            const end = document.getElementById('presensiEnd').value;
            await loadAndRender(s || null, end || null);
          }
        }
      });
    });
  }

  function showDetailPresensi(p) {
    const modal = document.getElementById('modalDetailPresensi');
    const content = document.getElementById('detailPresensiContent');
    const tglIndo = new Date(p.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    let photoHtml = '';
    if (p.foto_url) {
      photoHtml = `<div style="margin-top: 16px; text-align: center;"><img src="${p.foto_url}" style="max-width: 100%; max-height: 200px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></div>`;
    }
    
    let locationHtml = '';
    if (p.latitude && p.longitude) {
      locationHtml = `
        <div style="color: #666; font-weight: 500;">Lokasi</div>
        <div>: <a href="https://maps.google.com/?q=${p.latitude},${p.longitude}" target="_blank" style="color: #1a73e8; text-decoration: none;">Lihat di Peta</a></div>
      `;
    }

    content.innerHTML = `
      <div style="display: grid; grid-template-columns: 100px 1fr; gap: 8px;">
        <div style="color: #666; font-weight: 500;">Nama Guru</div>
        <div style="font-weight: 600;">: ${p.profiles?.nama || '-'}</div>
        <div style="color: #666; font-weight: 500;">Tanggal</div>
        <div>: ${tglIndo}</div>
        <div style="color: #666; font-weight: 500;">Waktu</div>
        <div>: ${p.waktu ? p.waktu.substring(0,8) + ' WIB' : '-'}</div>
        <div style="color: #666; font-weight: 500;">Status</div>
        <div>: <strong>${p.status}</strong></div>
        <div style="color: #666; font-weight: 500;">Catatan</div>
        <div>: ${p.catatan || '-'}</div>
        ${locationHtml}
      </div>
      ${photoHtml}
    `;
    
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  function bindDrawer() {
    const btnToggle = document.getElementById('btnToggleDrawer');
    const btnClose = document.getElementById('btnCloseDrawer');
    const overlay = document.getElementById('adminDrawerOverlay');
    const sidebar = document.getElementById('adminSidebar');
    if (btnToggle) btnToggle.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.remove('hidden'); });
    if (btnClose) btnClose.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });
  }

  function getLocalDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function bindEvents() {
    document.getElementById('btnApplyPresensi')?.addEventListener('click', async () => {
      const s = document.getElementById('presensiStart').value;
      const e = document.getElementById('presensiEnd').value;
      await loadAndRender(s, e);
    });

    document.getElementById('presensiStatusFilter')?.addEventListener('change', () => {
      applyFiltersAndRender();
    });

    document.getElementById('btnResetPresensi')?.addEventListener('click', async () => {
      document.getElementById('presensiStart').value = '';
      document.getElementById('presensiEnd').value = '';
      document.getElementById('presensiStatusFilter').value = 'Semua';
      await loadAndRender(null, null);
    });

    document.getElementById('btnExportPresensi')?.addEventListener('click', () => {
      if (!_allPresensi.length) { window.Components.toast('Tidak ada data untuk diekspor', 'error'); return; }
      const headers = ['Nama Guru', 'NIP', 'Tanggal', 'Waktu', 'Status', 'Catatan'];
      const rows = _allPresensi.map(p => [
        p.profiles?.nama || '-',
        p.profiles?.nip || '-',
        p.tanggal,
        p.waktu ? p.waktu.substring(0,5) : '-',
        p.status,
        p.catatan || '-'
      ]);
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws['!cols'] = [{wch:25},{wch:18},{wch:12},{wch:10},{wch:14},{wch:40}];
      XLSX.utils.book_append_sheet(wb, ws, 'Rekap Presensi');
      const s = document.getElementById('presensiStart').value || 'all';
      const e = document.getElementById('presensiEnd').value || 'all';
      XLSX.writeFile(wb, `Rekap_Presensi_${s}_${e}.xlsx`);
    });

    const modalDetailPresensi = document.getElementById('modalDetailPresensi');
    document.querySelectorAll('.btn-tutup-detail-presensi').forEach(btn => {
      btn.addEventListener('click', () => {
        modalDetailPresensi.classList.add('hidden');
        modalDetailPresensi.style.display = 'none';
      });
    });
  }

  window.Router.register('/admin/presensi', render);
})();
