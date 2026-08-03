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
        
        <!-- Modal Form Siswa -->
        <div id="modalSiswa" class="modal-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center;">
          <div style="background: white; width: 100%; max-width: 400px; border-radius: 12px; padding: 24px;">
            <h3 id="modalTitle" style="margin-top: 0;">Tambah Siswa</h3>
            <form id="formSiswa">
              <input type="hidden" id="siswaId">
              <div class="form-group mb-3">
                <label class="form-label">Nama Lengkap</label>
                <input type="text" id="siswaNama" class="form-input" required>
              </div>
              <div class="form-group mb-4">
                <label class="form-label">Kelas</label>
                <select id="siswaKelas" class="form-input" required></select>
              </div>
              <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button type="button" id="btnBatal" class="btn btn-outline">Batal</button>
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
  
  let globalKelas = [];

  async function fetchAndRenderList() {
    const container = document.getElementById('siswaListContainer');
    if (!container) return;
    
    // Fetch kelas and siswa
    const { data: kelasList } = await window.supabase.from('kelas').select('*').order('nama');
    const { data: siswaList } = await window.supabase.from('siswa').select('*, kelas(nama)').order('nama');
    
    globalKelas = kelasList || [];
    const siswaArr = siswaList || [];
    
    document.getElementById('siswaCountBadge').innerText = `${siswaArr.length} Siswa`;

    let contentHtmlArr = (kelasList || []).map(k => {
      const siswaInKelas = siswaArr.filter(s => s.kelas_id === k.id);
      if (siswaInKelas.length === 0) return '';
      
      const siswaItems = siswaInKelas.map((s, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #666;">
              ${i+1}
            </div>
            <span style="font-size: 14px; color: #333;">${s.nama}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline edit-btn" data-id="${s.id}" data-nama="${s.nama}" data-kelas="${s.kelas_id}" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; border: 1px solid #ccc; background: white; cursor: pointer;">Edit</button>
            <button class="btn btn-outline del-btn" data-id="${s.id}" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; border: 1px solid #ea4335; color: #ea4335; background: white; cursor: pointer;">Hapus</button>
          </div>
        </div>
      `).join('');

      return `
        <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">Kelas ${k.nama}</h3>
            <span style="color: #666; font-size: 14px;">${siswaInKelas.length} Siswa</span>
          </div>
          <div>${siswaItems}</div>
        </div>
      `;
    });
    
    let contentHtml = contentHtmlArr.join('');
    if (!contentHtml) contentHtml = '<p>Belum ada data siswa.</p>';

    container.innerHTML = contentHtml;

    // Update select options
    const selectKelas = document.getElementById('siswaKelas');
    if (selectKelas) {
      selectKelas.innerHTML = globalKelas.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
    }

    // Rebind inner events
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
          if (error) {
            window.Components.toast('Gagal menghapus data', 'error');
          } else {
            window.Components.toast('Berhasil dihapus');
            fetchAndRenderList();
          }
        }
      });
    });
  }

  async function render() {
    const content = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Kelola Siswa</h1>
          <span id="siswaCountBadge" class="badge badge-success" style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">... Siswa</span>
        </div>
      </div>
      
      <div class="search-bar" style="margin-bottom: 24px;">
        <div style="position: relative;">
          <span class="material-icons-outlined" style="position: absolute; left: 12px; top: 10px; color: #999;">search</span>
          <input type="text" class="form-input" placeholder="Cari nama siswa atau NIS..." style="width: 100%; padding: 10px 12px 10px 40px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">
        </div>
      </div>

      <div id="siswaListContainer">
        <p style="color:#666;">Memuat data siswa...</p>
      </div>

      <button id="btnTambahSiswa" class="btn btn-primary" style="position: fixed; bottom: 24px; right: 24px; background: #1a73e8; color: white; border: none; padding: 12px 24px; border-radius: 24px; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(26,115,232,0.3); cursor: pointer; z-index: 90;">
        <span class="material-icons-outlined">add</span> Tambah Siswa
      </button>
    `;

    const html = adminLayout('siswa', content);
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

    const modal = document.getElementById('modalSiswa');
    const form = document.getElementById('formSiswa');

    document.getElementById('btnTambahSiswa').addEventListener('click', () => {
      document.getElementById('modalTitle').innerText = 'Tambah Siswa';
      form.reset();
      document.getElementById('siswaId').value = '';
      modal.classList.remove('hidden');
    });

    document.getElementById('btnBatal').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('siswaId').value;
      const data = {
        nama: document.getElementById('siswaNama').value,
        kelas_id: document.getElementById('siswaKelas').value,
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Menyimpan...';
      submitBtn.disabled = true;

      let error;
      if (id) {
        const res = await window.supabase.from('siswa').update(data).eq('id', id);
        error = res.error;
      } else {
        const res = await window.supabase.from('siswa').insert([data]);
        error = res.error;
      }
      
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;

      if (error) {
        window.Components.toast('Gagal menyimpan', 'error');
      } else {
        window.Components.toast('Berhasil disimpan');
        modal.classList.add('hidden');
        fetchAndRenderList();
      }
    });
  }

  window.Router.register('/admin/siswa', render);
})();
