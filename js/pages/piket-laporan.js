(function() {
  let currentStep = 0;
  
  let state = {
    sesi: 'Pagi',
    jenjang: null,
    jurusan: null,
    kelasId: null,
    kelasNama: null,
    selectedSiswa: [], // array of names
    absensiStatus: {}, // name -> status (Sakit/Izin/Alpha)
    catatan: ''
  };

  async function getStepHtml() {
    if (currentStep === 0) {
      const today = window.APP_DATA.getHariTanggal ? await window.APP_DATA.getHariTanggal() : '';
      return `
        <div style="margin-bottom: 2rem;">
          ${window.Components.stepIndicator ? window.Components.stepIndicator(5, 0) : ''}
          <div class="section-title" style="margin-bottom: 1rem; font-weight: bold;">Informasi Piket</div>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Tanggal</label>
            <input type="text" class="form-input" value="${today}" readonly style="background: #f1f3f4; border: 1px solid #ddd;" />
          </div>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Sesi</label>
            <select id="inpSesi" class="form-select">
              <option value="Pagi" ${state.sesi === 'Pagi' ? 'selected' : ''}>Pagi</option>
              <option value="Siang" ${state.sesi === 'Siang' ? 'selected' : ''}>Siang</option>
            </select>
          </div>
          <button id="btnNext0" class="btn btn-primary btn-full btn-lg">Lanjutkan</button>
        </div>
      `;
    } 
    
    else if (currentStep === 1) {
      const jenjangList = window.APP_DATA.jenjang || ['X', 'XI', 'XII'];
      const jurusanList = window.APP_DATA.jurusan || ['IPA', 'IPS', 'Perhotelan', 'TKJ'];
      let kelasiList = [];
      if (state.jenjang && state.jurusan) {
        kelasiList = window.APP_DATA.getKelasByFilter ? await window.APP_DATA.getKelasByFilter(state.jenjang, state.jurusan) : [];
      }

      return `
        <div style="margin-bottom: 2rem;">
          ${window.Components.stepIndicator ? window.Components.stepIndicator(5, 1) : ''}
          
          <div class="section-title" style="margin-bottom: 0.5rem; font-weight: bold;">Pilih Jenjang</div>
          <div class="chip-group" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
            ${jenjangList.map(j => `<div class="chip jenjang-chip ${state.jenjang === j ? 'active' : ''}" data-val="${j}" style="padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 20px; cursor: pointer; ${state.jenjang === j ? 'background: var(--primary, #007bff); color: white;' : ''}">${j}</div>`).join('')}
          </div>

          ${state.jenjang ? `
            <div class="section-title" style="margin-bottom: 0.5rem; font-weight: bold;">Pilih Jurusan</div>
            <div class="chip-group" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
              ${jurusanList.map(j => `<div class="chip jurusan-chip ${state.jurusan === j ? 'active' : ''}" data-val="${j}" style="padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 20px; cursor: pointer; ${state.jurusan === j ? 'background: var(--primary, #007bff); color: white;' : ''}">${j}</div>`).join('')}
            </div>
          ` : ''}

          ${state.jurusan ? `
            <div class="section-title" style="margin-bottom: 0.5rem; font-weight: bold;">Pilih Kelas</div>
            <div class="chip-group" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
              ${kelasiList.map(k => `<div class="chip kelas-chip ${state.kelasId === k.id ? 'active' : ''}" data-id="${k.id}" data-nama="${k.nama}" style="padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 20px; cursor: pointer; ${state.kelasId === k.id ? 'background: var(--primary, #007bff); color: white;' : ''}">${k.nama}</div>`).join('')}
              ${kelasiList.length === 0 ? '<div style="color: #666;">Tidak ada kelas ditemukan</div>' : ''}
            </div>
          ` : ''}

          <button id="btnNext1" class="btn btn-primary btn-full btn-lg" ${!state.kelasId ? 'disabled style="opacity: 0.5;"' : ''}>Lanjutkan</button>
        </div>
      `;
    }

    else if (currentStep === 2) {
      const siswaList = state.kelasId && window.APP_DATA.getSiswaByKelas ? await window.APP_DATA.getSiswaByKelas(state.kelasId) : [];
      const selCount = state.selectedSiswa.length;
      
      return `
        <div style="margin-bottom: 2rem;">
          ${window.Components.stepIndicator ? window.Components.stepIndicator(5, 2) : ''}
          <div class="section-title" style="margin-bottom: 0.5rem; font-weight: bold;">Siswa Tidak Hadir &mdash; ${state.kelasNama}</div>
          <p style="color: var(--text-secondary, #666); margin-bottom: 1rem;">Centang siswa yang TIDAK HADIR hari ini</p>
          
          <div style="background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 4px; margin-bottom: 1rem; font-weight: 500;">
            ${selCount} siswa dipilih
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem; max-height: 50vh; overflow-y: auto;">
            ${siswaList.map(s => {
              const checked = state.selectedSiswa.includes(s);
              return `
              <div class="card checkbox-item ${checked ? 'checked' : ''}" data-nama="${s}" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; cursor: pointer; ${checked ? 'border-color: var(--primary, #007bff); background: #e8f0fe;' : ''}">
                <div class="checkbox-box" style="width: 24px; height: 24px; border: 2px solid ${checked ? 'var(--primary, #007bff)' : '#ccc'}; border-radius: 4px; display: flex; align-items: center; justify-content: center; background: ${checked ? 'var(--primary, #007bff)' : 'transparent'};">
                  ${checked ? '<span class="material-icons-outlined" style="color: white; font-size: 18px;">check</span>' : ''}
                </div>
                <div style="font-weight: ${checked ? 'bold' : 'normal'};">${s}</div>
              </div>
              `;
            }).join('')}
          </div>

          <button id="btnNext2" class="btn btn-primary btn-full btn-lg">
            ${selCount === 0 ? 'Semua siswa hadir? Lanjutkan tanpa memilih' : 'Lanjutkan'}
          </button>
        </div>
      `;
    }

    else if (currentStep === 3) {
      return `
        <div style="margin-bottom: 2rem;">
          ${window.Components.stepIndicator ? window.Components.stepIndicator(5, 3) : ''}
          <div class="section-title" style="margin-bottom: 1rem; font-weight: bold;">Status Absensi</div>
          
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
            ${state.selectedSiswa.map(s => {
              const status = state.absensiStatus[s] || 'Alpha';
              return `
              <div class="card" style="padding: 1rem;">
                <div style="font-weight: bold; margin-bottom: 0.5rem;">${s}</div>
                <div class="radio-group" style="display: flex; gap: 1rem;">
                  ${['Sakit', 'Izin', 'Alpha'].map(opt => `
                    <div class="radio-item ${status === opt ? 'active' : ''}" data-nama="${s}" data-val="${opt}" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                      <div style="width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${status === opt ? 'var(--primary, #007bff)' : '#ccc'}; display: flex; align-items: center; justify-content: center;">
                        ${status === opt ? '<div style="width: 10px; height: 10px; border-radius: 50%; background: var(--primary, #007bff);"></div>' : ''}
                      </div>
                      <span>${opt}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              `;
            }).join('')}
          </div>

          <button id="btnNext3" class="btn btn-primary btn-full btn-lg">Lanjutkan</button>
        </div>
      `;
    }

    else if (currentStep === 4) {
      return `
        <div style="margin-bottom: 2rem;">
          ${window.Components.stepIndicator ? window.Components.stepIndicator(5, 4) : ''}
          
          <div class="section-title" style="margin-bottom: 0.5rem; font-weight: bold;">Catatan Tambahan</div>
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <textarea id="inpCatatan" class="form-input" rows="3" placeholder="Tambahkan catatan jika diperlukan...">${state.catatan}</textarea>
          </div>

          <div class="section-title" style="margin-bottom: 0.5rem; font-weight: bold;">Upload Dokumentasi</div>
          <div id="uploadArea" class="upload-area" style="border: 2px dashed #ccc; border-radius: 8px; padding: 2rem; text-align: center; margin-bottom: 1.5rem; cursor: pointer; background: #f8f9fa;">
            <span class="material-icons-outlined" style="font-size: 3rem; color: #999; margin-bottom: 0.5rem;">cloud_upload</span>
            <div style="color: #666;">Tap untuk upload foto</div>
          </div>

          <div class="section-title" style="margin-bottom: 0.5rem; font-weight: bold;">Tanda Tangan Petugas</div>
          <div style="border: 1px solid #ccc; border-radius: 8px; margin-bottom: 0.5rem; background: white;">
            <canvas id="sigPad" class="signature-pad" width="400" height="200" style="width: 100%; touch-action: none; display: block;"></canvas>
          </div>
          <button id="btnClearSig" class="btn btn-outline" style="margin-bottom: 2rem; padding: 0.25rem 0.5rem; font-size: 0.85rem;">Hapus</button>

          <button id="btnSimpan" class="btn btn-primary btn-full btn-lg">
            <span class="material-icons-outlined" style="margin-right: 0.5rem;">save</span>
            Simpan Laporan
          </button>
        </div>
      `;
    }
    
    else if (currentStep === 5) {
      return `
        <div class="success-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; text-align: center;">
          <span class="material-icons-outlined success-icon" style="color: #34a853; font-size: 6rem; margin-bottom: 1rem; animation: scaleIn 0.5s ease-out;">check_circle</span>
          <style>
            @keyframes scaleIn {
              0% { transform: scale(0); opacity: 0; }
              80% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
          </style>
          <h2 class="success-title" style="font-size: 1.75rem; margin-bottom: 0.5rem;">Laporan Berhasil Disimpan!</h2>
          <p class="success-subtitle" style="color: var(--text-secondary, #666); margin-bottom: 2rem;">Laporan piket sesi ${state.sesi} telah tercatat</p>
          
          <button id="btnKembaliPiket" class="btn btn-primary btn-full btn-lg" style="max-width: 300px;">Kembali ke Dashboard Piket</button>
        </div>
      `;
    }

    return '';
  }

  async function render() {
    const html = `
      <div class="page piket-laporan-page">
        ${currentStep < 5 ? window.Components.header({ title: 'Laporan Piket Baru', subtitle: 'SIPINTER', back: true, backPath: currentStep === 0 ? '/guru/piket' : undefined, onBack: currentStep > 0 ? () => { currentStep--; render(); } : undefined }) : ''}
        <div class="page-content" style="${currentStep === 5 ? 'padding: 0;' : ''}">
          ${await getStepHtml()}
        </div>
      </div>
    `;
    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    if (currentStep === 0) {
      const inpSesi = document.getElementById('inpSesi');
      if (inpSesi) {
        inpSesi.addEventListener('change', (e) => {
          state.sesi = e.target.value;
        });
      }
      document.getElementById('btnNext0')?.addEventListener('click', () => {
        currentStep = 1;
        render();
      });
    }
    else if (currentStep === 1) {
      document.querySelectorAll('.jenjang-chip').forEach(el => {
        el.addEventListener('click', (e) => {
          state.jenjang = e.target.getAttribute('data-val');
          state.jurusan = null;
          state.kelasId = null;
          state.kelasNama = null;
          render();
        });
      });
      document.querySelectorAll('.jurusan-chip').forEach(el => {
        el.addEventListener('click', (e) => {
          state.jurusan = e.target.getAttribute('data-val');
          state.kelasId = null;
          state.kelasNama = null;
          render();
        });
      });
      document.querySelectorAll('.kelas-chip').forEach(el => {
        el.addEventListener('click', (e) => {
          state.kelasId = e.target.getAttribute('data-id');
          state.kelasNama = e.target.getAttribute('data-nama');
          state.selectedSiswa = []; // reset siswa selection on class change
          state.absensiStatus = {};
          render();
        });
      });
      document.getElementById('btnNext1')?.addEventListener('click', () => {
        if (state.kelasId) {
          currentStep = 2;
          render();
        }
      });
    }
    else if (currentStep === 2) {
      document.querySelectorAll('.checkbox-item').forEach(el => {
        el.addEventListener('click', (e) => {
          const nama = e.currentTarget.getAttribute('data-nama');
          if (state.selectedSiswa.includes(nama)) {
            state.selectedSiswa = state.selectedSiswa.filter(n => n !== nama);
            delete state.absensiStatus[nama];
          } else {
            state.selectedSiswa.push(nama);
            state.absensiStatus[nama] = 'Alpha'; // default
          }
          render(); // re-render to update counts and UI
        });
      });
      document.getElementById('btnNext2')?.addEventListener('click', () => {
        if (state.selectedSiswa.length > 0) {
          currentStep = 3;
        } else {
          currentStep = 4; // skip status step if no one absent
        }
        render();
      });
    }
    else if (currentStep === 3) {
      document.querySelectorAll('.radio-item').forEach(el => {
        el.addEventListener('click', (e) => {
          const nama = e.currentTarget.getAttribute('data-nama');
          const val = e.currentTarget.getAttribute('data-val');
          state.absensiStatus[nama] = val;
          render();
        });
      });
      document.getElementById('btnNext3')?.addEventListener('click', () => {
        currentStep = 4;
        render();
      });
    }
    else if (currentStep === 4) {
      const inpCatatan = document.getElementById('inpCatatan');
      if (inpCatatan) {
        inpCatatan.addEventListener('input', (e) => {
          state.catatan = e.target.value;
        });
      }

      const uploadArea = document.getElementById('uploadArea');
      if (uploadArea) {
        uploadArea.addEventListener('click', () => {
          if (window.Components.toast) window.Components.toast('Demo: Upload berhasil', 'success');
          uploadArea.innerHTML = `<div style="width: 100%; height: 100px; background: #e0e0e0; border-radius: 4px; display: flex; align-items: center; justify-content: center;"><span class="material-icons-outlined">image</span> Gambar terunggah</div>`;
        });
      }

      // Canvas signature
      const canvas = document.getElementById('sigPad');
      const btnClearSig = document.getElementById('btnClearSig');
      if (canvas && btnClearSig) {
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#202124';
        ctx.lineCap = 'round';
        let isDrawing = false;
        
        // Resize canvas correctly for device pixel ratio if needed, for simplicity keeping it CSS-sized
        // Just correcting internal coordinate system
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        function getPos(e) {
          const r = canvas.getBoundingClientRect();
          if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
          }
          return { x: e.clientX - r.left, y: e.clientY - r.top };
        }

        function startDrawing(e) {
          e.preventDefault();
          isDrawing = true;
          const pos = getPos(e);
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
        }

        function draw(e) {
          if (!isDrawing) return;
          e.preventDefault();
          const pos = getPos(e);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        }

        function stopDrawing(e) {
          if (!isDrawing) return;
          e.preventDefault();
          isDrawing = false;
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);

        btnClearSig.addEventListener('click', () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
      }

      document.getElementById('btnSimpan')?.addEventListener('click', async () => {
        if (window.Components.showLoading) window.Components.showLoading('Menyimpan laporan...');
        
        try {
          if (window.APP_DATA.submitLaporanPiket) {
            const absensiArr = Object.keys(state.absensiStatus).map(s => ({ namaSiswa: s, status: state.absensiStatus[s] }));
            await window.APP_DATA.submitLaporanPiket({
              sesi: state.sesi,
              catatan: state.catatan,
              foto_url: '',
              guru_id: window.APP_STATE && window.APP_STATE.currentGuru ? window.APP_STATE.currentGuru.id : 'G1',
              absensi: absensiArr
            });
          }
        } catch (e) {
          console.error(e);
        }

        if (window.Components.hideLoading) window.Components.hideLoading();
        currentStep = 5;
        render();
        setTimeout(() => {
          if (currentStep === 5) window.Router.navigate('/guru/piket');
        }, 2500);
      });
    }
    else if (currentStep === 5) {
      document.getElementById('btnKembaliPiket')?.addEventListener('click', () => {
        window.Router.navigate('/guru/piket');
      });
    }
  }

  window.Router.register('/guru/piket/laporan', () => {
    currentStep = 0;
    state = { sesi: 'Pagi', jenjang: null, jurusan: null, kelasId: null, kelasNama: null, selectedSiswa: [], absensiStatus: {}, catatan: '' };
    render();
  });
})();
