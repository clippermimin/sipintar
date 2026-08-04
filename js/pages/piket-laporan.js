(function() {
  let kelasList = [];
  let allGuru = [];
  let blockCounter = 0;
  
  async function render() {
    window.Components.showLoading();
    
    const guru = window.APP_STATE.currentGuru || {};
    const namaGuru = guru.nama || 'Guru';
    const nameParts = namaGuru.trim().split(' ');
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
      : namaGuru.substring(0, 2).toUpperCase();
      
    const hariTanggal = window.APP_DATA.getHariTanggal ? await window.APP_DATA.getHariTanggal() : 'Senin, 1 Januari 2026';
    kelasList = await window.APP_DATA.getAllKelas();
    
    const { data: guruData } = await window.supabase.from('profiles').select('*').eq('role', 'guru').order('nama');
    allGuru = guruData || [];

    window.Components.hideLoading();

    const html = `
      <style>
        .ios-page {
          background: #F2F2F7;
          min-height: 100vh;
          padding-bottom: 80px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .ios-nav {
          padding: 48px 20px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(242, 242, 247, 0.8);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .ios-nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ios-back-btn {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          color: #007AFF;
          text-decoration: none;
          cursor: pointer;
        }
        .ios-nav-title {
          font-size: 24px;
          font-weight: 800;
          color: #000;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .ios-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #E5E5EA;
          color: #1C1C1E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }
        
        .ios-form-group {
          margin: 0 20px 24px;
        }
        .ios-form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #8E8E93;
          text-transform: uppercase;
          margin-bottom: 8px;
          margin-left: 12px;
        }
        .ios-form-card {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
        }
        .ios-input {
          width: 100%;
          background: #F2F2F7;
          border: none;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 16px;
          font-family: inherit;
          color: #000;
          outline: none;
          appearance: none;
        }
        .ios-input:focus {
          box-shadow: 0 0 0 2px rgba(0,122,255,0.3);
        }
        
        .ios-radio-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .ios-radio-card {
          position: relative;
        }
        .ios-radio-card input {
          display: none;
        }
        .ios-radio-card label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #F2F2F7;
          border-radius: 12px;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          color: #8E8E93;
          cursor: pointer;
          transition: 0.2s;
        }
        .ios-radio-card input:checked + label {
          background: #FF9500;
          color: white;
          box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
        }
        
        .ios-btn-primary {
          background: #007AFF;
          color: white;
          border: none;
          border-radius: 14px;
          padding: 16px;
          font-size: 17px;
          font-weight: 700;
          width: 100%;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(0,122,255,0.2);
        }
        .ios-btn-primary:active {
          transform: scale(0.96);
        }
        .ios-btn-outline {
          background: transparent;
          color: #007AFF;
          border: 2px dashed #007AFF;
          border-radius: 14px;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          width: 100%;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ios-btn-outline:active {
          transform: scale(0.96);
          background: rgba(0,122,255,0.05);
        }
        
        .kelas-block {
          background: white;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
          border: 1px solid #E5E5EA;
        }
        .siswa-list {
          margin-top: 12px;
          background: #F2F2F7;
          border-radius: 12px;
          padding: 8px;
          max-height: 250px;
          overflow-y: auto;
        }
        .absen-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: white;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .absen-item:last-child {
          margin-bottom: 0;
        }
      </style>
      
      <div class="page ios-page">
        <!-- Header -->
        <div class="ios-nav">
          <div class="ios-nav-left">
            <a class="ios-back-btn" onclick="window.Router.navigate('/guru/piket')">
              <span class="material-icons-outlined">arrow_back</span>
            </a>
            <h1 class="ios-nav-title">Laporan Piket</h1>
          </div>
          <div class="ios-avatar">${initials}</div>
        </div>
        
        <div style="padding: 0 24px 16px;">
          <div style="font-size: 14px; color: #8E8E93; font-weight: 600; text-transform: uppercase;">${hariTanggal}</div>
        </div>

        <form id="piket-form">
          <!-- Petugas Piket -->
          <div class="ios-form-group">
            <label class="ios-form-label">Petugas Piket</label>
            <div class="ios-form-card">
              <div style="margin-bottom: 12px;">
                <div style="font-size: 13px; font-weight: 600; color: #8E8E93; margin-bottom: 4px;">Petugas 1</div>
                <select id="petugas-1" class="ios-input" required>
                  <option value="" disabled selected>-- Pilih Petugas 1 --</option>
                  ${allGuru.map(g => `<option value="${g.id}">${g.nama}</option>`).join('')}
                </select>
              </div>
              <div>
                <div style="font-size: 13px; font-weight: 600; color: #8E8E93; margin-bottom: 4px;">Petugas 2</div>
                <select id="petugas-2" class="ios-input" required>
                  <option value="" disabled selected>-- Pilih Petugas 2 --</option>
                  ${allGuru.map(g => `<option value="${g.id}">${g.nama}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Sesi Piket -->
          <div class="ios-form-group">
            <label class="ios-form-label">Sesi</label>
            <div class="ios-radio-grid">
              <div class="ios-radio-card">
                <input type="radio" name="sesi" id="sesi-pagi" value="Pagi" checked>
                <label for="sesi-pagi">
                  <span style="font-size: 20px;">☀️</span> Pagi
                </label>
              </div>
              <div class="ios-radio-card">
                <input type="radio" name="sesi" id="sesi-siang" value="Siang">
                <label for="sesi-siang">
                  <span style="font-size: 20px;">🌇</span> Siang
                </label>
              </div>
            </div>
          </div>
          
          <div style="margin: 32px 20px 24px; text-align: center; border-bottom: 1px solid #E5E5EA;"></div>

          <!-- Container Kelas -->
          <div class="ios-form-group">
            <label class="ios-form-label" style="display: flex; justify-content: space-between; align-items: center;">
              Laporan Kelas
              <span style="font-size: 11px; color: #FF3B30; font-weight: 700;">*HANYA SISWA ABSEN</span>
            </label>
            
            <div id="kelas-blocks-container">
              <!-- Dynamically injected class blocks -->
            </div>
            
            <button type="button" id="btn-add-kelas" class="ios-btn-outline">
              <span class="material-icons-outlined">add</span>
              Tambah Kelas
            </button>
          </div>

          <!-- Catatan -->
          <div class="ios-form-group">
            <label class="ios-form-label">Catatan Tambahan</label>
            <div class="ios-form-card">
              <textarea id="catatan" class="ios-input" rows="4" style="background: transparent; padding: 0;" placeholder="Contoh: Alhamdulillah sesi berjalan dengan baik lancar"></textarea>
            </div>
          </div>
          
          <div style="padding: 0 20px 40px;">
            <button type="submit" id="btn-simpan" class="ios-btn-primary">
              <span class="material-icons-outlined">save</span>
              Simpan Laporan
            </button>
          </div>
        </form>
      </div>
    `;
    
    window.Components.renderPage(html);
    
    // Auto set Petugas 1 to current user
    if (guru.id) {
      setTimeout(() => {
        const p1 = document.getElementById('petugas-1');
        if (p1) p1.value = guru.id;
      }, 100);
    }
    
    setTimeout(() => {
      bindEvents();
      addKelasBlock(); // Add first block by default
    }, 200);
  }
  
  function addKelasBlock() {
    blockCounter++;
    const blockId = `kelas-block-${blockCounter}`;
    
    const blockHtml = `
      <div id="${blockId}" class="kelas-block">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="font-weight: 700; color: #1C1C1E;">Kelas ${blockCounter}</div>
          ${blockCounter > 1 ? `
          <button type="button" class="btn-remove-block" data-target="${blockId}" style="background:none; border:none; color: #FF3B30; padding: 4px; border-radius: 50%; display: flex; align-items: center; cursor: pointer;">
            <span class="material-icons-outlined">close</span>
          </button>` : ''}
        </div>
        
        <select class="ios-input select-kelas-dinamis" data-block="${blockId}" required>
          <option value="" disabled selected>-- Pilih Kelas --</option>
          ${kelasList.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')}
        </select>
        
        <div class="siswa-container" id="siswa-container-${blockId}" style="display: none; margin-top: 12px;">
          <div class="siswa-list" id="siswa-list-${blockId}">
            <!-- Checkboxes will be injected here -->
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('kelas-blocks-container').insertAdjacentHTML('beforeend', blockHtml);
    
    if (blockCounter > 1) {
      document.querySelector(`#${blockId} .btn-remove-block`).addEventListener('click', function() {
        document.getElementById(blockId).remove();
      });
    }
    
    document.querySelector(`#${blockId} .select-kelas-dinamis`).addEventListener('change', async function(e) {
      const kelasId = e.target.value;
      const container = document.getElementById(`siswa-container-${blockId}`);
      const list = document.getElementById(`siswa-list-${blockId}`);
      
      list.innerHTML = '<div style="text-align:center; padding: 12px; color: #8E8E93; font-size: 13px;">Memuat siswa...</div>';
      container.style.display = 'block';
      
      const { data: siswaData, error } = await window.supabase
        .from('siswa')
        .select('id, nama')
        .eq('kelas_id', kelasId)
        .order('nama');
        
      if (error || !siswaData || siswaData.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding: 12px; color: #8E8E93; font-size: 13px;">Tidak ada data siswa</div>';
        return;
      }
      
      list.innerHTML = siswaData.map((s, idx) => `
        <div class="absen-item">
          <label style="display: flex; align-items: center; gap: 12px; flex: 1; font-size: 14px; font-weight: 500; cursor: pointer;">
            <input type="checkbox" class="absen-checkbox" data-nama="${s.nama}" data-kelas="${kelasId}" data-idx="${idx}" style="width: 18px; height: 18px; accent-color: #FF3B30;">
            ${s.nama}
          </label>
          <select id="status-${blockId}-${idx}" class="ios-input" style="width: 100px; padding: 6px 8px; font-size: 13px; background: #F2F2F7;">
            <option value="Sakit">Sakit</option>
            <option value="Izin">Izin</option>
            <option value="Alpa" selected>Alpa</option>
            <option value="Dispensasi">Dispensasi</option>
          </select>
        </div>
      `).join('');
    });
  }
  
  function bindEvents() {
    document.getElementById('btn-add-kelas').addEventListener('click', addKelasBlock);
    
    document.getElementById('piket-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const p1 = document.getElementById('petugas-1').value;
      const p2 = document.getElementById('petugas-2').value;
      
      if (!p1 || !p2) {
        window.Components.toast('Petugas 1 dan 2 harus dipilih', 'error');
        return;
      }
      if (p1 === p2) {
        window.Components.toast('Petugas 1 dan 2 tidak boleh sama', 'error');
        return;
      }
      
      const btnSimpan = document.getElementById('btn-simpan');
      btnSimpan.innerHTML = '<span class="material-icons-outlined" style="animation: spin 1s linear infinite;">refresh</span> Menyimpan...';
      btnSimpan.disabled = true;

      try {
        const checkboxes = document.querySelectorAll('.absen-checkbox:checked');
        const absensi = Array.from(checkboxes).map(cb => {
          const idx = cb.getAttribute('data-idx');
          const blockId = cb.closest('.kelas-block').id;
          const status = document.getElementById(`status-${blockId}-${idx}`).value;
          return {
            namaSiswa: cb.getAttribute('data-nama'),
            kelas_id: cb.getAttribute('data-kelas'),
            status: status
          };
        });
        
        const data = {
          sesi: document.querySelector('input[name="sesi"]:checked').value,
          catatan: document.getElementById('catatan').value,
          petugas_1: p1,
          petugas_2: p2,
          absensi: absensi,
          foto_url: null,
          status: 'Selesai'
        };
        
        await window.APP_DATA.submitLaporanPiket(data);
        window.Components.toast('Laporan berhasil disimpan!', 'success');
        
        setTimeout(() => {
          window.Router.navigate('/guru/dashboard');
        }, 1500);
      } catch (error) {
        console.error(error);
        window.Components.toast(error.message || 'Gagal menyimpan laporan', 'error');
        btnSimpan.innerHTML = '<span class="material-icons-outlined">save</span> Simpan Laporan';
        btnSimpan.disabled = false;
      }
    });
  }
  
  window.Router.register('/guru/piket/laporan', render);
})();
