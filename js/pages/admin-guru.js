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
          .admin-page { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }
          .admin-sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #5f6368; text-decoration: none; font-weight: 500; transition: background 0.2s; }
          .admin-sidebar-item:hover { background: #f1f3f4; color: #1a73e8; }
          .admin-sidebar-item.active { background: #e8f0fe; color: #1a73e8; border-right: 4px solid #1a73e8; }
          .modal-overlay:not(.hidden) { display: flex !important; }
          
          .mutqin-table { width: 100%; border-collapse: collapse; }
          .mutqin-table th { padding: 16px; text-align: left; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #f3f4f6; }
          .mutqin-table td { padding: 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; vertical-align: middle; }
          .mutqin-table tr:hover { background-color: #f9fafb; }
          .mutqin-checkbox { width: 18px; height: 18px; border-radius: 4px; border: 1px solid #d1d5db; cursor: pointer; }
          
          .kelas-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background: #e0f2fe; color: #0369a1; font-weight: 600; font-size: 13px; }
          .action-btn { background: white; border: 1px solid #e5e7eb; padding: 6px; border-radius: 6px; color: #6b7280; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
          .action-btn:hover { background: #f3f4f6; color: #111827; }
          .action-btn.del-btn:hover { color: #ef4444; border-color: #fca5a5; background: #fef2f2; }

          @media (min-width: 769px) { .admin-mobile-header { display: none !important; } #adminDrawerOverlay { display: none !important; } #btnCloseDrawer { display: none !important; } }
          @media (max-width: 768px) { .admin-page { flex-direction: column; } .admin-content { margin-left: 0 !important; padding: 16px !important; } .admin-sidebar { transform: translateX(-100%); } .admin-sidebar.open { transform: translateX(0); } }
        </style>
      </div>
    `;
  }
  
  let globalGuru = [];
  let currentSort = { column: 'nama', direction: 'asc' };
  
  async function fetchAndRenderList() {
    const container = document.getElementById('guruTableBody');
    if (!container) return;
    
    const { data: guruList, error } = await window.supabase
      .from('profiles')
      .select('*')
      .eq('role', 'guru');
      
    if (error) {
      console.error(error);
      container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 24px; color:red;">Gagal memuat data guru</td></tr>';
      return;
    }
    
    globalGuru = guruList || [];
    renderTable();
  }

  function renderTable() {
    const container = document.getElementById('guruTableBody');
    if (!container) return;

    const filterText = document.getElementById('searchGuru').value.toLowerCase();
    
    let filtered = globalGuru.filter(g => {
      const matchName = (g.nama || '').toLowerCase().includes(filterText);
      const matchNip = (g.nip || '').toLowerCase().includes(filterText);
      return matchName || matchNip;
    });

    filtered.sort((a, b) => {
      let valA = currentSort.column === 'nama' ? (a.nama || '').toLowerCase() : (a.nip || '').toLowerCase();
      let valB = currentSort.column === 'nama' ? (b.nama || '').toLowerCase() : (b.nip || '').toLowerCase();
      
      if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Update sort icons
    const thNamaIcon = document.getElementById('thNama').querySelector('.sort-icon');
    const thNipIcon = document.getElementById('thNip').querySelector('.sort-icon');
    if (thNamaIcon) thNamaIcon.innerHTML = currentSort.column === 'nama' ? (currentSort.direction === 'asc' ? '↑' : '↓') : '';
    if (thNipIcon) thNipIcon.innerHTML = currentSort.column === 'nip' ? (currentSort.direction === 'asc' ? '↑' : '↓') : '';

    document.getElementById('guruCountBadge').innerText = `${filtered.length} guru terdaftar`;

    if (filtered.length === 0) {
      container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 32px; color:#999;">Tidak ada data guru ditemukan.</td></tr>';
      return;
    }

    container.innerHTML = filtered.map((g, i) => `
      <tr>
        <td style="width: 40px;"><input type="checkbox" class="mutqin-checkbox row-checkbox" value="${g.id}"></td>
        <td style="width: 50px; color: #888;">${i + 1}</td>
        <td><div style="font-weight: 600; color: #202124;">${g.nama || '-'}</div></td>
        <td><div class="kelas-badge">${g.nip || '-'}</div></td>
        <td style="width: 120px;">
          <div style="display: flex; gap: 8px;">
            <button class="action-btn edit-btn" data-id="${g.id}" data-nama="${g.nama || ''}" data-nip="${g.nip || ''}" title="Edit"><span class="material-icons-outlined" style="font-size: 18px; pointer-events: none;">edit</span></button>
            <button class="action-btn btn-delete del-btn" data-id="${g.id}" title="Hapus"><span class="material-icons-outlined" style="font-size: 18px; pointer-events: none;">delete</span></button>
          </div>
        </td>
      </tr>
    `).join('');

    bindTableEvents();
    updateFloatingBar();
  }

  function bindTableEvents() {
    document.querySelectorAll('.row-checkbox').forEach(cb => {
      cb.addEventListener('change', updateFloatingBar);
    });

    const checkAll = document.getElementById('checkAll');
    if (checkAll) {
      const newCheckAll = checkAll.cloneNode(true);
      checkAll.parentNode.replaceChild(newCheckAll, checkAll);
      
      newCheckAll.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll('.row-checkbox').forEach(cb => {
          cb.checked = isChecked;
        });
        updateFloatingBar();
      });
    }

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.getElementById('modalTitle').innerText = 'Edit Guru';
        document.getElementById('guruId').value = e.target.dataset.id;
        document.getElementById('guruNama').value = e.target.dataset.nama;
        document.getElementById('guruNip').value = e.target.dataset.nip;
        document.getElementById('guruNip').disabled = true; // Can't easily update auth email here
        document.getElementById('formGroupPassword').style.display = 'none';
        document.getElementById('guruPassword').required = false;
        document.getElementById('modalGuru').classList.remove('hidden');
      });
    });

    document.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if(confirm('Yakin ingin menghapus guru ini?')) {
          const { error } = await window.supabase.from('profiles').delete().eq('id', e.target.dataset.id);
          if (error) window.Components.toast('Gagal hapus', 'error');
          else { window.Components.toast('Berhasil dihapus'); fetchAndRenderList(); }
        }
      });
    });
  }

  function updateFloatingBar() {
    const checked = document.querySelectorAll('.row-checkbox:checked');
    const bar = document.getElementById('floatingActionBar');
    if (checked.length > 0) {
      bar.style.transform = 'translateX(-50%) translateY(0)';
      bar.style.opacity = '1';
      document.getElementById('selectedCount').innerText = `${checked.length} guru dipilih`;
    } else {
      bar.style.transform = 'translateX(-50%) translateY(100px)';
      bar.style.opacity = '0';
    }
  }

  function handleSort(column) {
    if (currentSort.column === column) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = column;
      currentSort.direction = 'asc';
    }
    renderTable();
  }

  async function render() {
    const content = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="margin: 0 0 4px 0; font-size: 28px; color: #111827; font-weight: 700;">Data Guru</h1>
          <div id="guruCountBadge" style="color: #6b7280; font-size: 14px;">Memuat data...</div>
        </div>
        <div style="display: flex; gap: 12px;">
          <button id="btnImport" class="btn btn-outline" style="background: white; border: 1px solid #d1d5db; color: #374151; padding: 10px 16px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <span class="material-icons-outlined" style="font-size: 20px;">file_upload</span> Import Excel/CSV
          </button>
          <button id="btnTambahGuru" class="btn btn-primary" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); cursor: pointer;">
            <span class="material-icons-outlined" style="font-size: 20px;">add</span> Tambah Guru
          </button>
        </div>
      </div>
      <div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 250px; position: relative;">
          <span class="material-icons-outlined" style="position: absolute; left: 16px; top: 12px; color: #9ca3af; font-size: 20px;">search</span>
          <input type="text" id="searchGuru" placeholder="Cari nama guru atau NIP..." style="width: 100%; padding: 12px 16px 12px 44px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; box-sizing: border-box; outline: none;">
        </div>
      </div>
      <div style="background: white; border-radius: 16px; border: 1px solid #f3f4f6; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); overflow: hidden;">
        <table class="mutqin-table">
          <thead style="background: #f9fafb;">
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="checkAll" class="mutqin-checkbox"></th>
              <th style="width: 50px;">#</th>
              <th id="thNama" style="cursor: pointer; user-select: none;">NAMA GURU <span class="sort-icon" style="font-size:14px; margin-left:4px;"></span></th>
              <th id="thNip" style="cursor: pointer; user-select: none;">NIP <span class="sort-icon" style="font-size:14px; margin-left:4px;"></span></th>
              <th style="width: 120px;">AKSI</th>
            </tr>
          </thead>
          <tbody id="guruTableBody"><tr><td colspan="5" style="text-align:center; padding: 24px; color:#666;">Memuat data...</td></tr></tbody>
        </table>
      </div>
      <div id="floatingActionBar" style="position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(100px); opacity: 0; transition: all 0.3s; background: #1f2937; color: white; padding: 16px 24px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); display: flex; align-items: center; gap: 24px; z-index: 90;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="material-icons-outlined" style="color: #60a5fa;">check_circle</span>
          <span id="selectedCount" style="font-weight: 600; font-size: 15px;">0 guru dipilih</span>
        </div>
        <div style="width: 1px; height: 24px; background: #374151;"></div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <button id="btnBulkDelete" class="btn btn-outline" style="background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Hapus</button>
        </div>
      </div>
      
      <!-- Modal Form Guru -->
      <div id="modalGuru" class="modal-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center;">
        <div style="background: white; width: 100%; max-width: 450px; border-radius: 16px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 id="modalTitle" style="margin: 0; font-size: 20px;">Tambah Guru</h3>
            <button class="btn-batal-modal" style="background: none; border: none; cursor: pointer; color: #9ca3af;"><span class="material-icons-outlined">close</span></button>
          </div>
          <form id="formGuru">
            <input type="hidden" id="guruId">
            <div class="form-group mb-4">
              <label style="font-weight: 600; display: block; margin-bottom: 8px;">Nama Lengkap</label>
              <input type="text" id="guruNama" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box;" required>
            </div>
            <div class="form-group mb-4">
              <label style="font-weight: 600; display: block; margin-bottom: 8px;">NIP (Nomor Induk Pegawai)</label>
              <input type="text" id="guruNip" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box;" required pattern="[0-9]+" title="Hanya angka diperbolehkan">
            </div>
            <div class="form-group mb-5" id="formGroupPassword">
              <label style="font-weight: 600; display: block; margin-bottom: 8px;">Password (Opsional)</label>
              <input type="password" id="guruPassword" class="form-input" placeholder="Jika dikosongkan, password = NIP" minlength="6" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box;">
            </div>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button type="button" class="btn-batal-modal" style="padding: 10px 20px; border-radius: 8px; border: 1px solid #d1d5db; background: white; cursor: pointer;">Batal</button>
              <button type="submit" class="btn btn-primary" style="padding: 10px 20px; border-radius: 8px; border: none; background: #2563eb; color: white; cursor: pointer;">Simpan</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Import -->
      <div id="modalImport" class="modal-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center;">
        <div style="background: white; width: 100%; max-width: 600px; border-radius: 16px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 20px;">Import Data Guru</h3>
            <button class="btn-batal-import" style="background: none; border: none; cursor: pointer; color: #9ca3af;"><span class="material-icons-outlined">close</span></button>
          </div>
          <form id="formImport">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 13px; color: #475569;">
              <strong>Cara Import:</strong> Copy tabel dari Excel yang berisi dua kolom (Kolom 1: NIP, Kolom 2: Nama Guru), lalu paste ke kotak di bawah ini.
            </div>
            <textarea id="importText" style="width: 100%; height: 200px; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-family: monospace; font-size: 13px; box-sizing: border-box; white-space: pre;" placeholder="19800101\tBudi Santoso\n19900202\tSiti Aminah" required></textarea>
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px;">
              <button type="button" class="btn-batal-import" style="padding: 10px 20px; border-radius: 8px; border: 1px solid #d1d5db; background: white; cursor: pointer;">Batal</button>
              <button type="submit" class="btn btn-primary" style="padding: 10px 20px; border-radius: 8px; border: none; background: #2563eb; color: white; cursor: pointer;">Proses Import</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const html = adminLayout('guru', content);
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

    const modalGuru = document.getElementById('modalGuru');
    const formGuru = document.getElementById('formGuru');
    
    document.getElementById('btnTambahGuru').addEventListener('click', () => {
      document.getElementById('modalTitle').innerText = 'Tambah Guru';
      formGuru.reset();
      document.getElementById('guruId').value = '';
      document.getElementById('guruNip').disabled = false;
      document.getElementById('formGroupPassword').style.display = 'block';
      document.getElementById('guruPassword').required = false;
      modalGuru.classList.remove('hidden');
    });

    document.querySelectorAll('.btn-batal-modal').forEach(btn => btn.addEventListener('click', () => modalGuru.classList.add('hidden')));

    const modalImport = document.getElementById('modalImport');
    document.getElementById('btnImport').addEventListener('click', () => {
      document.getElementById('importText').value = '';
      modalImport.classList.remove('hidden');
    });
    document.querySelectorAll('.btn-batal-import').forEach(btn => btn.addEventListener('click', () => modalImport.classList.add('hidden')));

    document.getElementById('searchGuru').addEventListener('input', renderTable);
    document.getElementById('thNama').addEventListener('click', () => handleSort('nama'));
    document.getElementById('thNip').addEventListener('click', () => handleSort('nip'));

    formGuru.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('guruId').value;
      const data = {
        role: 'guru',
        nama: document.getElementById('guruNama').value,
        nip: document.getElementById('guruNip').value,
      };
      const pwdInput = document.getElementById('guruPassword').value;

      const submitBtn = formGuru.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Menyimpan...';
      submitBtn.disabled = true;
      
      let error;
      if (id) {
        const res = await window.supabase.from('profiles').update({ nama: data.nama }).eq('id', id);
        error = res.error;
      } else {
        try {
          const pwd = pwdInput.length >= 6 ? pwdInput : data.nip; // default to NIP
          const response = await fetch(`${window.supabaseUrl}/auth/v1/signup`, {
            method: 'POST',
            headers: { 'apikey': window.supabaseKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `${data.nip}@sipintar.com`, password: pwd })
          });

          const authData = await response.json();
          if (!response.ok) {
            throw new Error(authData.msg || authData.message || 'Gagal mendaftarkan auth guru');
          }

          data.id = authData.id || authData.user.id;
          const res = await window.supabase.from('profiles').insert([data]);
          error = res.error;
        } catch (err) {
          error = err;
        }
      }
      
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;

      if (error) {
        console.error(error);
        window.Components.toast(`Gagal menyimpan: ${error.message}`, 'error');
      } else {
        window.Components.toast('Berhasil disimpan');
        modalGuru.classList.add('hidden');
        fetchAndRenderList();
      }
    });

    document.getElementById('formImport').addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = document.getElementById('importText').value.trim();
      if (!text) return;
      
      const submitBtn = document.getElementById('formImport').querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Memproses...';
      submitBtn.disabled = true;
      
      const rows = text.split('\n');
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;
        
        const cols = row.split('\t');
        if (cols.length >= 2) {
          const nip = cols[0].trim();
          const nama = cols[1].trim();
          
          if (nip && nama) {
             try {
                const response = await fetch(`${window.supabaseUrl}/auth/v1/signup`, {
                  method: 'POST',
                  headers: { 'apikey': window.supabaseKey, 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: `${nip}@sipintar.com`, password: nip })
                });
                const authData = await response.json();
                if (response.ok) {
                   const userId = authData.id || authData.user?.id;
                   if (userId) {
                     const { error } = await window.supabase.from('profiles').insert([
                        { id: userId, nip: nip, nama: nama, role: 'guru' }
                     ]);
                     if (!error) successCount++;
                     else failCount++;
                   } else { failCount++; }
                } else { failCount++; }
             } catch(err) {
                failCount++;
             }
          }
        }
      }
      
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
      document.getElementById('importText').value = '';
      document.getElementById('modalImport').classList.add('hidden');
      
      window.Components.toast(`Import Selesai: ${successCount} sukses, ${failCount} gagal`);
      fetchAndRenderList();
    });

    document.getElementById('btnBulkDelete').addEventListener('click', async () => {
      const checked = document.querySelectorAll('.row-checkbox:checked');
      if (checked.length === 0) return;
      if (!confirm(`Yakin ingin menghapus ${checked.length} guru?`)) return;
      
      const ids = Array.from(checked).map(cb => cb.value);
      const btn = document.getElementById('btnBulkDelete');
      const originalText = btn.innerText;
      btn.innerText = 'Menghapus...';
      
      const { error } = await window.supabase.from('profiles').delete().in('id', ids);
      
      btn.innerText = originalText;
      if (error) {
        window.Components.toast('Gagal menghapus data massal', 'error');
      } else {
        window.Components.toast(`${checked.length} guru berhasil dihapus`);
        document.getElementById('checkAll').checked = false;
        fetchAndRenderList();
      }
    });
  }

  window.Router.register('/admin/guru', render);
})();
