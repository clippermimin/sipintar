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
        <!-- Modal Form Kelas -->
        <div id="modalKelas" class="modal-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center;">
          <div style="background: white; width: 100%; max-width: 400px; border-radius: 12px; padding: 24px;">
            <h3 id="modalTitleKelas" style="margin-top: 0;">Tambah Kelas</h3>
            <form id="formKelas">
              <input type="hidden" id="kelasId">
              <div class="form-group mb-3">
                <label class="form-label">Nama Kelas (misal: X IPA 1)</label>
                <input type="text" id="kelasNama" class="form-input" required placeholder="X IPA 1">
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Jenjang</label>
                <select id="kelasJenjang" class="form-input" required>
                  <option value="">-- Pilih Jenjang --</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>
              <div class="form-group mb-4">
                <label class="form-label">Jurusan</label>
                <select id="kelasJurusan" class="form-input" required>
                  <option value="">-- Pilih Jurusan --</option>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                  <option value="Perhotelan">Perhotelan</option>
                  <option value="TKJ">TKJ</option>
                </select>
              </div>
              <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button type="button" id="btnBatalKelas" class="btn btn-outline">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
        <style>
          .admin-page { display: flex; min-height: 100vh; }
          .admin-sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #5f6368; text-decoration: none; font-weight: 500; transition: background 0.2s; }
          .admin-sidebar-item:hover { background: #f1f3f4; color: #1a73e8; }
          .admin-sidebar-item.active { background: #e8f0fe; color: #1a73e8; border-right: 4px solid #1a73e8; }
          .modal-overlay:not(.hidden) { display: flex !important; }
          @media (min-width: 769px) { .admin-mobile-header { display: none !important; } #adminDrawerOverlay { display: none !important; } #btnCloseDrawer { display: none !important; } }
          @media (max-width: 768px) { .admin-page { flex-direction: column; } .admin-content { margin-left: 0 !important; padding: 16px !important; } .admin-sidebar { transform: translateX(-100%); } .admin-sidebar.open { transform: translateX(0); } }
        </style>
      </div>
    `;
  }
  
  async function fetchAndRenderList() {
    const container = document.getElementById('kelasListContainer');
    if (!container) return;
    
    const { data: kelasList, error } = await window.supabase
      .from('kelas')
      .select('*, siswa(count)')
      .order('jenjang')
      .order('nama');

    if (error) {
      window.Components.toast('Gagal memuat data kelas', 'error');
      return;
    }

    const jurusanColors = {
      'IPA': { bg: '#e8f5e9', text: '#2e7d32' },
      'IPS': { bg: '#fff3e0', text: '#ef6c00' },
      'Perhotelan': { bg: '#e3f2fd', text: '#1565c0' },
      'TKJ': { bg: '#f3e5f5', text: '#7b1fa2' },
    };

    const jenjangOrder = ['X', 'XI', 'XII'];
    const groups = {};
    (kelasList || []).forEach(k => {
      if (!groups[k.jenjang]) groups[k.jenjang] = [];
      groups[k.jenjang].push(k);
    });

    let listHtml = '';
    if ((kelasList || []).length === 0) {
      listHtml = '<p style="color:#666; grid-column: 1 / -1;">Belum ada data kelas.</p>';
    } else {
      const renderCard = (k) => {
        const color = jurusanColors[k.jurusan] || { bg: '#f5f5f5', text: '#333' };
        const jumlahSiswa = k.siswa?.[0]?.count ?? 0;
        return `
          <div class="card kelas-card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.2s; position: relative;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="margin: 0; font-size: 18px; color: #333;">${k.nama}</h3>
              <span class="badge" style="background: ${color.bg}; color: ${color.text}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${k.jurusan}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; color: #666; font-size: 14px; margin-bottom: 12px;">
              <span class="material-icons-outlined" style="font-size: 18px;">people</span>
              <span>${jumlahSiswa} Siswa</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline edit-kelas-btn" data-id="${k.id}" data-nama="${k.nama}" data-jenjang="${k.jenjang}" data-jurusan="${k.jurusan}" style="padding: 6px 12px; border: 1px solid #1a73e8; color: #1a73e8; border-radius: 6px; background: white; cursor: pointer; font-size: 13px;">Edit</button>
              <button class="btn btn-outline del-kelas-btn" data-id="${k.id}" style="padding: 6px 12px; border: 1px solid #ea4335; color: #ea4335; border-radius: 6px; background: white; cursor: pointer; font-size: 13px;">Hapus</button>
            </div>
          </div>
        `;
      };

      const renderGroup = (jenjangTitle, items) => {
        if (!items || items.length === 0) return '';
        let html = `<div style="grid-column: 1 / -1; margin-top: 16px; margin-bottom: 8px;">
          <h2 style="margin: 0; font-size: 20px; color: #1a73e8; border-bottom: 2px solid #e8f0fe; padding-bottom: 8px;">Kelas ${jenjangTitle}</h2>
        </div>`;
        html += items.map(renderCard).join('');
        return html;
      };

      jenjangOrder.forEach(jenjang => {
        listHtml += renderGroup(jenjang, groups[jenjang]);
      });

      const knownJenjang = new Set(jenjangOrder);
      const otherJenjangs = Object.keys(groups).filter(j => !knownJenjang.has(j)).sort();
      otherJenjangs.forEach(jenjang => {
        listHtml += renderGroup(jenjang, groups[jenjang]);
      });
    }

    container.innerHTML = listHtml;
    document.getElementById('kelasCountBadge').innerText = `${(kelasList || []).length} Kelas`;
    
    // Rebind inner events
    document.querySelectorAll('.edit-kelas-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const b = e.target;
        document.getElementById('modalTitleKelas').innerText = 'Edit Kelas';
        document.getElementById('kelasId').value = b.dataset.id;
        document.getElementById('kelasNama').value = b.dataset.nama;
        document.getElementById('kelasJenjang').value = b.dataset.jenjang;
        document.getElementById('kelasJurusan').value = b.dataset.jurusan;
        document.getElementById('modalKelas').classList.remove('hidden');
      });
    });

    document.querySelectorAll('.del-kelas-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        if (confirm('Yakin ingin menghapus kelas ini? Semua data siswa dalam kelas ini juga akan terhapus!')) {
          const { error } = await window.supabase.from('kelas').delete().eq('id', e.target.dataset.id);
          if (error) {
            window.Components.toast('Gagal menghapus kelas', 'error');
          } else {
            window.Components.toast('Kelas berhasil dihapus');
            fetchAndRenderList(); // Refresh data smoothly
          }
        }
      });
    });
  }

  async function render() {
    const content = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Kelola Kelas</h1>
          <span id="kelasCountBadge" class="badge" style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">... Kelas</span>
        </div>
      </div>

      <div id="kelasListContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">
        <p style="color:#666;">Memuat data kelas...</p>
      </div>

      <button id="btnTambahKelas" class="btn btn-primary" style="position: fixed; bottom: 24px; right: 24px; background: #1a73e8; color: white; border: none; padding: 12px 24px; border-radius: 24px; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(26,115,232,0.3); cursor: pointer; z-index: 90;">
        <span class="material-icons-outlined">add</span> Tambah Kelas
      </button>
    `;

    const html = adminLayout('kelas', content);
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

    const modal = document.getElementById('modalKelas');
    const form = document.getElementById('formKelas');

    document.getElementById('btnTambahKelas').addEventListener('click', () => {
      document.getElementById('modalTitleKelas').innerText = 'Tambah Kelas';
      form.reset();
      document.getElementById('kelasId').value = '';
      modal.classList.remove('hidden');
    });

    document.getElementById('btnBatalKelas').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const id = document.getElementById('kelasId').value;
      const nama = document.getElementById('kelasNama').value.trim();
      const jenjang = document.getElementById('kelasJenjang').value;
      const jurusan = document.getElementById('kelasJurusan').value;
      const kelasId = id || nama.toLowerCase().replace(/\s+/g, '-');
      const data = { id: kelasId, nama, jenjang, jurusan };

      // Change button text to show progress
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Menyimpan...';
      submitBtn.disabled = true;

      let error;
      if (id) {
        const res = await window.supabase.from('kelas').update({ nama, jenjang, jurusan }).eq('id', id);
        error = res.error;
      } else {
        const res = await window.supabase.from('kelas').insert([data]);
        error = res.error;
      }
      
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;

      if (error) {
        window.Components.toast('Gagal menyimpan: ' + (error.message || ''), 'error');
      } else {
        window.Components.toast('Kelas berhasil disimpan');
        modal.classList.add('hidden');
        fetchAndRenderList(); // Refresh data smoothly
      }
    });
  }

  window.Router.register('/admin/kelas', render);
})();
