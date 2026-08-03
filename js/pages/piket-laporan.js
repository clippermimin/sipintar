(function() {
  let kelasList = [];
  let allGuru = [];
  let blockCounter = 0;
  
  async function render() {
    const headerHtml = window.Components.header({ 
      title: 'Laporan Piket', 
      subtitle: 'Input Laporan Baru', 
      back: true, 
      backPath: '/guru/dashboard' 
    });
    
    const hariTanggal = await window.APP_DATA.getHariTanggal();
    kelasList = await window.APP_DATA.getAllKelas();
    
    const { data: guruData } = await window.supabase.from('profiles').select('*').eq('role', 'guru').order('nama');
    allGuru = guruData || [];

    const html = `
      ${headerHtml}
      <div class="page with-header">
        <div class="p-4 pb-24">
          <div class="card mb-4">
            <div class="card-header bg-primary text-white" style="border-radius: var(--radius-xl) var(--radius-xl) 0 0; padding: 16px;">
              <h2 style="font-size: 16px; margin: 0;">Form Laporan Absensi</h2>
              <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 13px;">${hariTanggal}</p>
            </div>
            
            <div class="p-4">
              <form id="piket-form">
                
                <!-- Petugas Piket -->
                <div class="form-group mb-4" style="background: #f8f9fa; padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
                  <label class="form-label" style="font-weight: 600;">Petugas Piket 1</label>
                  <select id="petugas-1" class="form-input mb-3" required>
                    <option value="" disabled selected>-- Pilih Petugas 1 --</option>
                    ${allGuru.map(g => `<option value="${g.id}">${g.nama}</option>`).join('')}
                  </select>
                  
                  <label class="form-label" style="font-weight: 600;">Petugas Piket 2</label>
                  <select id="petugas-2" class="form-input" required>
                    <option value="" disabled selected>-- Pilih Petugas 2 --</option>
                    ${allGuru.map(g => `<option value="${g.id}">${g.nama}</option>`).join('')}
                  </select>
                </div>

                <!-- Sesi Piket -->
                <div class="form-group mb-4">
                  <label class="form-label" style="font-weight: 600;">Sesi Piket</label>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="radio-card">
                      <input type="radio" name="sesi" id="sesi-pagi" value="Pagi" checked>
                      <label for="sesi-pagi">
                        <span class="material-icons-outlined">wb_sunny</span>
                        <span>Pagi</span>
                      </label>
                    </div>
                    <div class="radio-card">
                      <input type="radio" name="sesi" id="sesi-siang" value="Siang">
                      <label for="sesi-siang">
                        <span class="material-icons-outlined">wb_twilight</span>
                        <span>Siang</span>
                      </label>
                    </div>
                  </div>
                </div>

                <hr style="margin: 24px 0; border: none; border-top: 1px dashed var(--border);" />

                <!-- Container Multi-Kelas -->
                <div id="kelas-blocks-container">
                  <!-- Kelas blocks will be appended here -->
                </div>

                <button type="button" id="btn-add-kelas" class="btn btn-outline btn-full mb-4" style="border-style: dashed; padding: 12px;">
                  <span class="material-icons-outlined" style="margin-right: 8px;">add_circle_outline</span>
                  Tambah Kelas
                </button>

                <!-- Catatan -->
                <div class="form-group mb-4 mt-4">
                  <label class="form-label" style="font-weight: 600;">Catatan Umum</label>
                  <textarea id="catatan" class="form-input" rows="3" placeholder="Tuliskan catatan kejadian penting selama piket..." required></textarea>
                </div>
                
                <button type="submit" id="btn-simpan" class="btn btn-primary btn-full btn-lg mt-4">Simpan Laporan</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
    
    window.Components.renderPage(html);
    
    // Auto set Petugas 1 to current user
    if (window.APP_STATE?.currentGuru?.id) {
      setTimeout(() => {
        const p1 = document.getElementById('petugas-1');
        if (p1) p1.value = window.APP_STATE.currentGuru.id;
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
      <div id="${blockId}" class="kelas-block mb-4" style="border: 1px solid var(--primary); border-radius: 8px; padding: 12px; background: #fff;">
        ${blockCounter > 1 ? `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
          <button type="button" class="btn-remove-block" data-target="${blockId}" style="background:none; border:none; color: var(--error); cursor:pointer;"><span class="material-icons-outlined">delete</span></button>
        </div>` : ''}
        
        <select class="form-input select-kelas-dinamis" data-block="${blockId}" required>
          <option value="" disabled selected>-- Pilih Kelas --</option>
          ${kelasList.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')}
        </select>
        
        <div class="siswa-container mt-3" id="siswa-container-${blockId}" style="display: none;">
          <p style="font-size: 13px; color: var(--error); margin-bottom: 8px; font-weight: 500;">
            * Centang nama siswa yang TIDAK HADIR
          </p>
          <div class="siswa-list" id="siswa-list-${blockId}" style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border); border-radius: 4px; padding: 8px; background: #fafafa;">
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
      
      container.style.display = 'block';
      list.innerHTML = '<div style="text-align:center; font-size:12px; color:#666;">Memuat data siswa...</div>';
      
      const siswa = await window.APP_DATA.getSiswaByKelas(kelasId);
      
      if (!siswa || siswa.length === 0) {
        list.innerHTML = '<div style="text-align:center; font-size:12px; color:#666;">Data siswa kosong.</div>';
        return;
      }
      
      list.innerHTML = siswa.map((nama, idx) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid #eee;">
          <label style="display: flex; align-items: center; cursor: pointer; flex: 1;">
            <input type="checkbox" class="absen-checkbox" data-nama="${nama}" data-kelas="${kelasId}" data-idx="${idx}" style="margin-right: 12px; transform: scale(1.2);" onchange="document.getElementById('status-container-${blockId}-${idx}').style.display = this.checked ? 'block' : 'none'">
            <span style="font-size: 14px;">${nama}</span>
          </label>
          <div id="status-container-${blockId}-${idx}" style="display: none;">
            <select class="form-input absen-status" id="status-${blockId}-${idx}" style="padding: 4px; font-size: 12px; width: auto;">
              <option value="Alpha">A (Alpha)</option>
              <option value="Izin">I (Izin)</option>
              <option value="Sakit">S (Sakit)</option>
            </select>
          </div>
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
      btnSimpan.innerHTML = 'Menyimpan...';
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
        btnSimpan.innerHTML = 'Simpan Laporan';
        btnSimpan.disabled = false;
      }
    });
  }
  
  window.Router.register('/guru/piket/laporan', render);
})();
