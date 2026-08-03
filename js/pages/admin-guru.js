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
        
        <!-- Modal Form Guru -->
        <div id="modalGuru" class="modal-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: none; align-items: center; justify-content: center;">
          <div style="background: white; width: 100%; max-width: 400px; border-radius: 12px; padding: 24px;">
            <h3 id="modalTitle" style="margin-top: 0;">Tambah Guru</h3>
            <form id="formGuru">
              <input type="hidden" id="guruId">
              <div class="form-group mb-3">
                <label class="form-label">Nama Lengkap</label>
                <input type="text" id="guruNama" class="form-input" required>
              </div>
              <div class="form-group mb-4">
                <label class="form-label">NIP (Nomor Induk Pegawai)</label>
                <input type="text" id="guruNip" class="form-input" required pattern="[0-9]+" title="Hanya angka diperbolehkan">
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
  
  async function render() {
    window.Components.showLoading();
    
    // Fetch data from Supabase
    const { data: guruList, error } = await window.supabase
      .from('profiles')
      .select('*')
      .eq('role', 'guru')
      .order('nama');
      
    window.Components.hideLoading();
    
    if (error) {
      window.Components.toast('Gagal memuat data guru', 'error');
      return;
    }
    
    let guruHtml = (guruList || []).map(g => `
      <div class="card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
        <div class="avatar" style="width: 48px; height: 48px; border-radius: 50%; background: #e3f2fd; color: #1976d2; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">
          ${g.nama.substring(0, 2).toUpperCase()}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 500; font-size: 16px; color: #333;">${g.nama}</div>
          <div style="font-size: 13px; color: #666; margin-top: 4px;">NIP: ${g.nip || '-'}</div>
        </div>
        <button class="btn btn-outline edit-btn" data-id="${g.id}" data-nama="${g.nama}" data-nip="${g.nip || ''}" style="padding: 6px 12px; border: 1px solid #1a73e8; color: #1a73e8; border-radius: 6px; background: white; cursor: pointer;">Edit</button>
        <button class="btn btn-outline del-btn" data-id="${g.id}" style="padding: 6px 12px; border: 1px solid #ea4335; color: #ea4335; border-radius: 6px; background: white; cursor: pointer;">Hapus</button>
      </div>
    `).join('');

    if (!guruList || guruList.length === 0) {
      guruHtml = '<p style="color: #666;">Belum ada data guru.</p>';
    }

    const content = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #333;">Kelola Guru</h1>
          <span class="badge badge-primary" style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${(guruList||[]).length} Guru</span>
        </div>
      </div>
      
      <div class="search-bar" style="margin-bottom: 24px;">
        <div style="position: relative;">
          <span class="material-icons-outlined" style="position: absolute; left: 12px; top: 10px; color: #999;">search</span>
          <input type="text" class="form-input" placeholder="Cari nama guru atau mata pelajaran..." style="width: 100%; padding: 10px 12px 10px 40px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
        ${guruHtml}
      </div>
      
      <button id="btnTambahGuru" class="btn btn-primary" style="position: fixed; bottom: 24px; right: 24px; background: #1a73e8; color: white; border: none; padding: 12px 24px; border-radius: 24px; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(26,115,232,0.3); cursor: pointer; z-index: 90;">
        <span class="material-icons-outlined">add</span> Tambah Guru
      </button>
    `;

    const html = adminLayout('guru', content);
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

    const modal = document.getElementById('modalGuru');
    const form = document.getElementById('formGuru');
    
    document.getElementById('btnTambahGuru').addEventListener('click', () => {
      document.getElementById('modalTitle').innerText = 'Tambah Guru';
      form.reset();
      document.getElementById('guruId').value = '';
      modal.classList.remove('hidden');
    });

    document.getElementById('btnBatal').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        document.getElementById('modalTitle').innerText = 'Edit Guru';
        document.getElementById('guruId').value = id;
        document.getElementById('guruNama').value = e.target.dataset.nama;
        document.getElementById('guruNip').value = e.target.dataset.nip;
        // Jika edit, NIP di-disable agar tidak repot ubah email auth (opsional, tapi disarankan)
        document.getElementById('guruNip').disabled = true;
        modal.classList.remove('hidden');
      });
    });
    
    document.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if(confirm('Yakin ingin menghapus guru ini?')) {
          const id = e.target.dataset.id;
          window.Components.showLoading();
          const { error } = await window.supabase.from('profiles').delete().eq('id', id);
          window.Components.hideLoading();
          if (error) {
            window.Components.toast('Gagal menghapus data', 'error');
          } else {
            window.Components.toast('Berhasil dihapus');
            render();
          }
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('guruId').value;
      const data = {
        role: 'guru',
        nama: document.getElementById('guruNama').value,
        nip: document.getElementById('guruNip').value,
      };

      window.Components.showLoading();
      
      let error;
      if (id) {
        // Edit (hanya nama, NIP tidak diubah karena terkait Auth Email)
        const res = await window.supabase.from('profiles').update({ nama: data.nama }).eq('id', id);
        error = res.error;
      } else {
        // Create auth user without logging admin out
        // Use a temporary client with persistSession: false
        const supabaseUrl = 'YOUR_SUPABASE_URL_HERE'; // It's accessible via window.supabase.supabaseUrl ? No, we can get it from script tag if possible, or just use fetch?
        // Actually, we can just use the global supabase client if we temporarily store the session and restore it, 
        // OR better, create tempClient using window.supabase keys if they are exposed.
        // Let's assume window.supabase.supabaseUrl exists or we have to use fetch to the API.
        // A simpler hack: Since Supabase v2, signUp doesn't log you in IF you set email confirmation to true, 
        // but if it's false, it does. 
        // We will just do a standard API call via fetch to create the user, avoiding the client library's state modification.
        
        try {
          const { data: { session } } = await window.supabase.auth.getSession();
          if (!session) throw new Error('Tidak ada sesi admin aktif');

          const response = await fetch(`${window.supabaseUrl}/auth/v1/signup`, {
            method: 'POST',
            headers: {
              'apikey': window.supabaseKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: `${data.nip}@sipintar.com`,
              password: data.nip
            })
          });

          const authData = await response.json();
          if (!response.ok) {
            throw new Error(authData.msg || authData.message || 'Gagal mendaftarkan auth guru');
          }

          // Then insert profile
          data.id = authData.id || authData.user.id;
          const res = await window.supabase.from('profiles').insert([data]);
          error = res.error;
        } catch (err) {
          error = err;
        }
      }
      
      window.Components.hideLoading();
      if (error) {
        console.error(error);
        const errorMsg = error.message || 'Pastikan setup Auth/FK';
        window.Components.toast(`Gagal menyimpan: ${errorMsg}`, 'error');
      } else {
        window.Components.toast('Berhasil disimpan');
        modal.classList.add('hidden');
        render();
      }
    });
  }

  window.Router.register('/admin/guru', render);
})();
