(function() {
  async function render() {
    const headerHtml = window.Components.header({ 
      title: 'Laporan Piket', 
      subtitle: 'Input Laporan', 
      back: true, 
      backPath: '/guru/dashboard' 
    });
    
    const hariTanggal = await window.APP_DATA.getHariTanggal();
    const kelasList = await window.APP_DATA.getAllKelas();

    const html = `
      ${headerHtml}
      <div class="page with-header">
        <div class="p-4 pb-24">
          <div class="card mb-4">
            <div class="card-header bg-primary text-white" style="border-radius: var(--radius-xl) var(--radius-xl) 0 0; padding: 16px;">
              <h2 style="font-size: 16px; margin: 0;">Laporan Baru</h2>
              <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 13px;">${hariTanggal}</p>
            </div>
            
            <div class="p-4">
              <form id="piket-form">
                
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

                <!-- Pemilihan Kelas -->
                <div class="form-group mb-4">
                  <label class="form-label" style="font-weight: 600;">Pilih Kelas</label>
                  <select id="select-kelas" class="form-input" required>
                    <option value="" disabled selected>-- Pilih Kelas --</option>
                    ${kelasList.map(k => `<option value="${k.id}">${k.nama} (${k.jurusan})</option>`).join('')}
                  </select>
                </div>

                <!-- Daftar Siswa (Dynamic) -->
                <div id="siswa-container" class="mb-4" style="display: none;">
                  <label class="form-label" style="font-weight: 600;">Status Presensi Siswa</label>
                  <div class="info-box mb-3" style="font-size: 13px;">
                    Centang siswa yang <b>TIDAK HADIR</b> (Sakit/Izin/Alpha). Biarkan kosong jika hadir.
                  </div>
                  <div id="siswa-list" style="max-height: 250px; overflow-y: auto; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 8px;">
                    <!-- Diisi via JS -->
                  </div>
                </div>

                <!-- Catatan -->
                <div class="form-group mb-4">
                  <label class="form-label" style="font-weight: 600;">Catatan Kejadian</label>
                  <textarea id="catatan" class="form-input" rows="3" placeholder="Tuliskan catatan kejadian selama piket..." required></textarea>
                </div>

                <!-- Bukti Foto -->
                <div class="form-group mb-4">
                  <label class="form-label" style="font-weight: 600;">Bukti Foto (Opsional)</label>
                  <div class="upload-area" onclick="document.getElementById('foto-upload').click()">
                    <span class="material-icons-outlined" style="font-size: 32px; color: var(--text-secondary); margin-bottom: 8px;">add_a_photo</span>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 13px;">Tap untuk ambil foto</p>
                    <input type="file" id="foto-upload" accept="image/*" style="display: none;">
                  </div>
                </div>

                <!-- Tanda Tangan -->
                <div class="form-group mb-4">
                  <label class="form-label" style="font-weight: 600;">Tanda Tangan Guru Piket</label>
                  <div style="border: 1px solid var(--border); border-radius: var(--radius-md); background: #f8f9fa;">
                    <canvas id="sig-pad" width="300" height="150" style="width: 100%; touch-action: none; display: block;"></canvas>
                  </div>
                  <div style="text-align: right; margin-top: 8px;">
                    <button type="button" id="btn-clear-sig" class="btn btn-outline" style="padding: 4px 12px; font-size: 12px;">Hapus</button>
                  </div>
                </div>
                
                <button type="submit" id="btn-simpan" class="btn btn-primary btn-full btn-lg mt-4">Kirim Laporan</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
    
    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }
  
  function bindEvents() {
    const selectKelas = document.getElementById('select-kelas');
    const siswaContainer = document.getElementById('siswa-container');
    const siswaList = document.getElementById('siswa-list');
    
    // Signature Pad Setup
    const canvas = document.getElementById('sig-pad');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    function getCoordinates(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Calculate scale since canvas display size might differ from actual width/height attrs
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }
    
    function startDrawing(e) {
      isDrawing = true;
      const coords = getCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      e.preventDefault(); // Prevent scrolling on touch
    }
    
    function draw(e) {
      if (!isDrawing) return;
      const coords = getCoordinates(e);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      e.preventDefault();
    }
    
    function stopDrawing() {
      isDrawing = false;
    }
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#333';
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
    
    document.getElementById('btn-clear-sig').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Handle Kelas Selection
    selectKelas.addEventListener('change', async (e) => {
      const kelasId = e.target.value;
      if (!kelasId) {
        siswaContainer.style.display = 'none';
        return;
      }
      
      siswaContainer.style.display = 'block';
      siswaList.innerHTML = '<div style="padding: 12px; text-align: center; color: #666;">Memuat siswa...</div>';
      
      const siswa = await window.APP_DATA.getSiswaByKelas(kelasId);
      
      if (siswa.length === 0) {
        siswaList.innerHTML = '<div style="padding: 12px; text-align: center; color: #666;">Tidak ada data siswa.</div>';
        return;
      }
      
      siswaList.innerHTML = siswa.map((nama, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee;">
          <span style="font-size: 14px; font-weight: 500;">${nama}</span>
          <select class="form-input absen-select" data-nama="${nama}" style="width: auto; padding: 4px 8px; font-size: 13px;">
            <option value="Hadir">Hadir</option>
            <option value="Sakit">Sakit</option>
            <option value="Izin">Izin</option>
            <option value="Alpha">Alpha</option>
          </select>
        </div>
      `).join('');
    });
    
    // Handle Form Submit
    document.getElementById('piket-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Check if signature is empty
      const blankCanvas = document.createElement('canvas');
      blankCanvas.width = canvas.width;
      blankCanvas.height = canvas.height;
      if (canvas.toDataURL() === blankCanvas.toDataURL()) {
        window.Components.toast('Tanda tangan wajib diisi', 'error');
        return;
      }
      
      if (!selectKelas.value) {
        window.Components.toast('Silakan pilih kelas', 'error');
        return;
      }
      
      const btnSimpan = document.getElementById('btn-simpan');
      btnSimpan.innerHTML = 'Menyimpan...';
      btnSimpan.disabled = true;
      
      // Collect absensi
      const absensiSelects = document.querySelectorAll('.absen-select');
      const absensi = [];
      absensiSelects.forEach(sel => {
        if (sel.value !== 'Hadir') {
          absensi.push({
            namaSiswa: sel.getAttribute('data-nama'),
            status: sel.value
          });
        }
      });
      
      try {
        const data = {
          sesi: document.querySelector('input[name="sesi"]:checked').value,
          catatan: document.getElementById('catatan').value,
          foto_url: null, // Dummy since no real upload
          guru_id: window.APP_STATE?.currentGuru?.id || 'd-guru-1',
          absensi: absensi,
          status: 'Selesai'
        };
        
        await window.APP_DATA.submitLaporanPiket(data);
        window.Components.toast('Laporan berhasil disimpan!');
        
        setTimeout(() => {
          window.Router.navigate('/guru/dashboard');
        }, 1500);
      } catch (error) {
        window.Components.toast('Gagal menyimpan laporan', 'error');
        btnSimpan.innerHTML = 'Kirim Laporan';
        btnSimpan.disabled = false;
      }
    });
  }
  
  window.Router.register('/guru/piket/laporan', render);
})();
