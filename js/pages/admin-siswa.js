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
        <div class="admin-content" style="flex: 1; margin-left: 260px; padding: 32px; min-height: 100vh; background: #f4f6f8;">
          ${content}
        </div>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          .admin-page { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }
          .admin-sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #5f6368; text-decoration: none; font-weight: 500; transition: background 0.2s; }
          .admin-sidebar-item:hover { background: #f1f3f4; color: #1a73e8; }
          .admin-sidebar-item.active { background: #e8f0fe; color: #1a73e8; border-right: 4px solid #1a73e8; }
          .modal-overlay:not(.hidden) { display: flex !important; }
          
          /* Table Styles */
          .mutqin-table { width: 100%; border-collapse: collapse; }
          .mutqin-table th { text-align: left; padding: 16px 20px; border-bottom: 2px solid #f0f0f0; color: #888; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .mutqin-table td { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; font-size: 14px; }
          .mutqin-table tr:last-child td { border-bottom: none; }
          .mutqin-table tbody tr:hover { background-color: #fafbfc; }
          
          /* Checkbox styling */
          .mutqin-checkbox { width: 18px; height: 18px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; accent-color: #1a73e8; }
          
          /* Badges and Buttons */
          .kelas-badge { background: #e3f2fd; color: #1976d2; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 12px; display: inline-block; }
          .action-btn { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 6px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: #666; transition: all 0.2s; }
          .action-btn:hover { background: #e8f0fe; color: #1a73e8; border-color: #c6dafc; }
          .action-btn.btn-delete:hover { background: #fce8e6; color: #ea4335; border-color: #fad2cf; }
          
          @keyframes spin { 100% { transform: rotate(360deg); } }
          
          @media (min-width: 769px) { .admin-mobile-header { display: none !important; } #adminDrawerOverlay { display: none !important; } #btnCloseDrawer { display: none !important; } }
          @media (max-width: 768px) { .admin-page { flex-direction: column; } .admin-content { margin-left: 0 !important; padding: 16px !important; } .admin-sidebar { transform: translateX(-100%); } .admin-sidebar.open { transform: translateX(0); } .mutqin-table { display: block; overflow-x: auto; white-space: nowrap; } }
        </style>
      </div>
    `;
  }
  
  let globalKelas = [];
  let globalSiswa = [];
  let currentSort = { column: 'nama', direction: 'asc' };
  let currentPage = 1;
  let itemsPerPage = 10;
  
  async function fetchAndRenderList() {
    const container = document.getElementById('siswaTableBody');
    if (!container) return;
    
    container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 24px; color:#666;">Memuat data...</td></tr>';
    
    const [resKelas, resSiswa] = await Promise.all([
      window.supabase.from('kelas').select('*').order('nama'),
      window.supabase.from('siswa').select('*, kelas(nama)').order('nama')
    ]);
    
    globalKelas = resKelas.data || [];
    globalSiswa = resSiswa.data || [];
    
    const kelasOptions = globalKelas.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
    document.getElementById('siswaKelas').innerHTML = kelasOptions;
    document.getElementById('filterKelas').innerHTML = `<option value="ALL">Semua Kelas</option>` + kelasOptions;
    document.getElementById('bulkKelas').innerHTML = `<option value="" disabled selected>Pilih Kelas Tujuan...</option>` + kelasOptions;
    
    renderTable();
  }

  function renderTable() {
    const container = document.getElementById('siswaTableBody');
    if (!container) return;

    const filterText = document.getElementById('searchSiswa').value.toLowerCase();
    const filterKelas = document.getElementById('filterKelas').value;
    
    let filtered = globalSiswa.filter(s => {
      const matchName = s.nama.toLowerCase().includes(filterText);
      const matchKelas = filterKelas === 'ALL' || s.kelas_id === filterKelas;
      return matchName && matchKelas;
    });

    filtered.sort((a, b) => {
      let valA = currentSort.column === 'nama' ? a.nama.toLowerCase() : (a.kelas?.nama || '').toLowerCase();
      let valB = currentSort.column === 'nama' ? b.nama.toLowerCase() : (b.kelas?.nama || '').toLowerCase();
      
      if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Update sort icons
    const thNamaIcon = document.getElementById('thNama').querySelector('.sort-icon');
    const thKelasIcon = document.getElementById('thKelas').querySelector('.sort-icon');
    if (thNamaIcon) thNamaIcon.innerHTML = currentSort.column === 'nama' ? (currentSort.direction === 'asc' ? '↑' : '↓') : '';
    if (thKelasIcon) thKelasIcon.innerHTML = currentSort.column === 'kelas' ? (currentSort.direction === 'asc' ? '↑' : '↓') : '';

    document.getElementById('siswaCountBadge').innerText = `${filtered.length} siswa terdaftar`;

    if (filtered.length === 0) {
      container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 32px; color:#999;">Tidak ada data siswa ditemukan.</td></tr>';
      renderPaginationControls(0);
      return;
    }

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    container.innerHTML = paginatedItems.map((s, i) => `
      <tr>
        <td style="width: 40px;"><input type="checkbox" class="mutqin-checkbox row-checkbox" value="${s.id}"></td>
        <td style="width: 50px; color: #888;">${startIndex + i + 1}</td>
        <td><div style="font-weight: 600; color: #202124;">${s.nama}</div></td>
        <td><div class="kelas-badge">${s.kelas?.nama || '-'}</div></td>
        <td style="width: 120px;">
          <div style="display: flex; gap: 8px;">
            <button class="action-btn edit-btn" data-id="${s.id}" data-nama="${s.nama}" data-kelas="${s.kelas_id}" title="Edit"><span class="material-icons-outlined" style="font-size: 18px; pointer-events: none;">edit</span></button>
            <button class="action-btn btn-delete del-btn" data-id="${s.id}" title="Hapus"><span class="material-icons-outlined" style="font-size: 18px; pointer-events: none;">delete</span></button>
          </div>
        </td>
      </tr>
    `).join('');

    // Pastikan "Check All" tidak terpilih di awal render ulang
    const checkAll = document.getElementById('checkAll');
    if (checkAll) checkAll.checked = false;

    bindTableEvents();
    updateFloatingBar();
    renderPaginationControls(filtered.length);
  }

  function renderPaginationControls(totalItems) {
    let paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) {
      const tableWrapper = document.querySelector('.mutqin-table').parentElement;
      paginationContainer = document.createElement('div');
      paginationContainer.id = 'paginationContainer';
      paginationContainer.style.display = 'flex';
      paginationContainer.style.justifyContent = 'space-between';
      paginationContainer.style.alignItems = 'center';
      paginationContainer.style.padding = '16px';
      paginationContainer.style.background = 'white';
      paginationContainer.style.borderTop = '1px solid #f3f4f6';
      paginationContainer.style.flexWrap = 'wrap';
      paginationContainer.style.gap = '16px';
      tableWrapper.appendChild(paginationContainer);
    }

    if (totalItems === 0) {
      paginationContainer.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    let paginationHtml = \`
      <div style="font-size: 14px; color: #6b7280;">
        Menampilkan \${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - \${Math.min(currentPage * itemsPerPage, totalItems)} dari \${totalItems} siswa
      </div>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <select id="itemsPerPageSelect" style="padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; background: white; cursor: pointer; outline: none;">
          <option value="10" \${itemsPerPage === 10 ? 'selected' : ''}>10 / halaman</option>
          <option value="20" \${itemsPerPage === 20 ? 'selected' : ''}>20 / halaman</option>
          <option value="50" \${itemsPerPage === 50 ? 'selected' : ''}>50 / halaman</option>
          <option value="100" \${itemsPerPage === 100 ? 'selected' : ''}>100 / halaman</option>
        </select>
        <div style="display: flex; gap: 4px;">
          <button class="action-btn" id="btnPrevPage" \${currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}><span class="material-icons-outlined" style="font-size: 18px;">chevron_left</span></button>
          <div style="padding: 6px 12px; font-size: 14px; font-weight: 500;">Halaman \${currentPage} dari \${totalPages}</div>
          <button class="action-btn" id="btnNextPage" \${currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}><span class="material-icons-outlined" style="font-size: 18px;">chevron_right</span></button>
        </div>
      </div>
    \`;

    paginationContainer.innerHTML = paginationHtml;

    document.getElementById('itemsPerPageSelect').addEventListener('change', (e) => {
      itemsPerPage = parseInt(e.target.value);
      currentPage = 1;
      renderTable();
    });

    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    
    if (btnPrevPage) {
      btnPrevPage.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderTable();
        }
      });
    }

    if (btnNextPage) {
      btnNextPage.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderTable();
        }
      });
    }
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
        document.getElementById('modalTitle').innerText = 'Edit Siswa';
        document.getElementById('siswaId').value = e.target.dataset.id;
        document.getElementById('siswaNama').value = e.target.dataset.nama;
        document.getElementById('siswaKelas').value = e.target.dataset.kelas;
        document.getElementById('modalSiswa').classList.remove('hidden');
      });
    });

    document.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if(confirm('Yakin ingin menghapus siswa ini?')) {
          const { error } = await window.supabase.from('siswa').delete().eq('id', e.target.dataset.id);
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
      document.getElementById('selectedCount').innerText = `${checked.length} siswa dipilih`;
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
          <h1 style="margin: 0 0 4px 0; font-size: 28px; color: #111827; font-weight: 700;">Data Siswa</h1>
          <div id="siswaCountBadge" style="color: #6b7280; font-size: 14px;">Memuat data...</div>
        </div>
        <div style="display: flex; gap: 12px;">
          <button id="btnImport" class="btn btn-outline" style="background: white; border: 1px solid #d1d5db; color: #374151; padding: 10px 16px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <span class="material-icons-outlined" style="font-size: 20px;">file_upload</span> Import Excel/CSV
          </button>
          <button id="btnTambahSiswa" class="btn btn-primary" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); cursor: pointer;">
            <span class="material-icons-outlined" style="font-size: 20px;">add</span> Tambah Siswa
          </button>
        </div>
      </div>
      <div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 250px; position: relative;">
          <span class="material-icons-outlined" style="position: absolute; left: 16px; top: 12px; color: #9ca3af; font-size: 20px;">search</span>
          <input type="text" id="searchSiswa" placeholder="Cari nama siswa..." style="width: 100%; padding: 12px 16px 12px 44px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; box-sizing: border-box; outline: none;">
        </div>
        <div style="min-width: 150px;">
          <select id="filterKelas" style="width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; background: white; cursor: pointer; outline: none;">
            <option value="ALL">Semua Kelas</option>
          </select>
        </div>
      </div>
      <div style="background: white; border-radius: 16px; border: 1px solid #f3f4f6; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); overflow: hidden;">
        <table class="mutqin-table">
          <thead style="background: #f9fafb;">
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="checkAll" class="mutqin-checkbox"></th>
              <th style="width: 50px;">#</th>
              <th id="thNama" style="cursor: pointer; user-select: none;">NAMA SISWA <span class="sort-icon" style="font-size:14px; margin-left:4px;"></span></th>
              <th id="thKelas" style="cursor: pointer; user-select: none;">KELAS <span class="sort-icon" style="font-size:14px; margin-left:4px;"></span></th>
              <th style="width: 120px;">AKSI</th>
            </tr>
          </thead>
          <tbody id="siswaTableBody"><tr><td colspan="5" style="text-align:center; padding: 24px; color:#666;">Memuat data...</td></tr></tbody>
        </table>
      </div>
      <div id="floatingActionBar" style="position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(100px); opacity: 0; transition: all 0.3s; background: #1f2937; color: white; padding: 16px 24px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); display: flex; align-items: center; gap: 24px; z-index: 90;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="material-icons-outlined" style="color: #60a5fa;">check_circle</span>
          <span id="selectedCount" style="font-weight: 600; font-size: 15px;">0 siswa dipilih</span>
        </div>
        <div style="width: 1px; height: 24px; background: #374151;"></div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <select id="bulkKelas" style="padding: 8px 12px; border-radius: 6px; border: 1px solid #4b5563; background: #374151; color: white; font-size: 14px; outline: none; cursor: pointer;">
            <option value="" disabled selected>Pilih Kelas Tujuan...</option>
          </select>
          <button id="btnBulkUpdate" class="btn btn-primary" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Pindah Kelas</button>
          <button id="btnBulkDelete" class="btn btn-outline" style="background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">Hapus</button>
        </div>
      </div>
      <div id="modalSiswa" class="modal-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center;">
        <div style="background: white; width: 100%; max-width: 450px; border-radius: 16px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 id="modalTitle" style="margin: 0; font-size: 20px;">Tambah Siswa</h3>
            <button class="btn-batal-modal" style="background: none; border: none; cursor: pointer; color: #9ca3af;"><span class="material-icons-outlined">close</span></button>
          </div>
          <form id="formSiswa">
            <input type="hidden" id="siswaId">
            <div class="form-group mb-4"><label style="font-weight: 600; display: block; margin-bottom: 8px;">Nama Lengkap</label><input type="text" id="siswaNama" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box;" required></div>
            <div class="form-group mb-5"><label style="font-weight: 600; display: block; margin-bottom: 8px;">Kelas</label><select id="siswaKelas" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box;" required></select></div>
            <div style="display: flex; gap: 12px; justify-content: flex-end;"><button type="button" class="btn-batal-modal" style="padding: 10px 20px; border-radius: 8px; border: 1px solid #d1d5db; background: white; cursor: pointer;">Batal</button><button type="submit" class="btn btn-primary" style="padding: 10px 20px; border-radius: 8px; border: none; background: #2563eb; color: white; cursor: pointer;">Simpan</button></div>
          </form>
        </div>
      </div>
      <div id="modalImport" class="modal-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center;">
        <div style="background: white; width: 100%; max-width: 600px; border-radius: 16px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 20px;">Import Data Siswa</h3>
            <button class="btn-batal-import" style="background: none; border: none; cursor: pointer; color: #9ca3af;"><span class="material-icons-outlined">close</span></button>
          </div>
          <form id="formImport">
            <textarea id="importText" rows="10" placeholder="Paste data (Nama [Tab] Kelas)..." style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box; resize: vertical;" required></textarea>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
              <span id="importPreview" style="font-size: 14px; color: #6b7280;"></span>
              <div style="display: flex; gap: 12px;"><button type="button" class="btn-batal-import" style="padding: 10px 20px; border-radius: 8px; border: 1px solid #d1d5db; background: white; cursor: pointer;">Batal</button><button type="submit" id="btnProsesImport" class="btn btn-primary" style="padding: 10px 20px; border-radius: 8px; border: none; background: #10b981; color: white; cursor: pointer;">Proses</button></div>
            </div>
          </form>
        </div>
      </div>
    `;

    const html = adminLayout('siswa', content);
    window.Components.renderPage(html);
    setTimeout(() => { bindEvents(); fetchAndRenderList(); }, 200);
  }

  function bindEvents() {
    const btnToggleDrawer = document.getElementById('btnToggleDrawer');
    const btnCloseDrawer = document.getElementById('btnCloseDrawer');
    const overlay = document.getElementById('adminDrawerOverlay');
    const sidebar = document.getElementById('adminSidebar');
    if (btnToggleDrawer) btnToggleDrawer.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.remove('hidden'); });
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.add('hidden'); });

    const modalSiswa = document.getElementById('modalSiswa');
    const modalImport = document.getElementById('modalImport');
    document.getElementById('btnTambahSiswa').addEventListener('click', () => { document.getElementById('modalTitle').innerText = 'Tambah Siswa'; document.getElementById('formSiswa').reset(); document.getElementById('siswaId').value = ''; modalSiswa.classList.remove('hidden'); });
    document.querySelectorAll('.btn-batal-modal').forEach(btn => btn.addEventListener('click', () => modalSiswa.classList.add('hidden')));
    document.getElementById('btnImport').addEventListener('click', () => { document.getElementById('formImport').reset(); document.getElementById('importPreview').innerText = ''; modalImport.classList.remove('hidden'); });
    document.querySelectorAll('.btn-batal-import').forEach(btn => btn.addEventListener('click', () => modalImport.classList.add('hidden')));

    document.getElementById('searchSiswa').addEventListener('input', () => { currentPage = 1; renderTable(); });
    document.getElementById('filterKelas').addEventListener('change', () => { currentPage = 1; renderTable(); });
    
    document.getElementById('thNama').addEventListener('click', () => handleSort('nama'));
    document.getElementById('thKelas').addEventListener('click', () => handleSort('kelas'));

    document.getElementById('formSiswa').addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('siswaId').value;
      const data = { nama: document.getElementById('siswaNama').value, kelas_id: document.getElementById('siswaKelas').value };
      let res;
      if (id) res = await window.supabase.from('siswa').update(data).eq('id', id);
      else res = await window.supabase.from('siswa').insert([data]);
      if (res.error) window.Components.toast('Gagal simpan', 'error');
      else { window.Components.toast('Berhasil disimpan'); modalSiswa.classList.add('hidden'); fetchAndRenderList(); }
    });

    document.getElementById('formImport').addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = document.getElementById('importText').value.trim();
      const inserts = text.split('\n').map(l => {
        const parts = l.split('\t');
        if (parts.length >= 2) {
          const k = globalKelas.find(x => x.nama.toLowerCase() === parts[1].trim().toLowerCase());
          return k ? { nama: parts[0].trim(), kelas_id: k.id } : null;
        }
        return null;
      }).filter(Boolean);
      if (inserts.length > 0) {
        const { error } = await window.supabase.from('siswa').insert(inserts);
        if (!error) { window.Components.toast('Import berhasil'); modalImport.classList.add('hidden'); fetchAndRenderList(); }
      }
    });

    document.getElementById('btnBulkDelete').addEventListener('click', async () => {
      const ids = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.value);
      if (ids.length && confirm(`Hapus ${ids.length} siswa?`)) {
        await window.supabase.from('siswa').delete().in('id', ids);
        fetchAndRenderList();
      }
    });

    document.getElementById('btnBulkUpdate').addEventListener('click', async () => {
      const ids = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.value);
      const kId = document.getElementById('bulkKelas').value;
      if (ids.length && kId) {
        await window.supabase.from('siswa').update({ kelas_id: kId }).in('id', ids);
        fetchAndRenderList();
      }
    });
  }

  window.Router.register('/admin/siswa', render);
})();
