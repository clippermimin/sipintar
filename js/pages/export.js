(function() {
  async function render() {
    let backPath = '/login';
    if (window.APP_STATE.role === 'admin') backPath = '/admin/dashboard';
    else if (window.APP_STATE.role === 'kepsek') backPath = '/kepsek/dashboard';
    else if (window.APP_STATE.role === 'guru') backPath = '/guru/piket';

    const headerHtml = window.Components.header({ 
      title: 'Ekspor Laporan', 
      subtitle: '', 
      back: true, 
      backPath: backPath
    });

    const riwayatData = window.APP_DATA.riwayatExport || [];
    const riwayatHtml = riwayatData.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #e8f5e9; color: #2e7d32; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons-outlined" style="font-size: 20px;">table_chart</span>
          </div>
          <div>
            <div style="font-weight: 500; font-size: 14px; color: #333;">${item.nama}</div>
            <div style="font-size: 12px; color: #666;">${item.waktu} &bull; ${item.size}</div>
          </div>
        </div>
        <button class="btn-icon" style="background: none; border: none; color: #1a73e8; cursor: pointer;">
          <span class="material-icons-outlined">file_download</span>
        </button>
      </div>
    `).join('');

    const html = `
      <div class="export-page" style="max-width: 480px; margin: 0 auto; min-height: 100vh; background: #f8f9fa; padding-bottom: 24px;">
        ${headerHtml}
        
        <div style="padding: 16px;">
          <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 16px;">
            <h3 style="margin: 0 0 16px 0; font-size: 15px; color: #333;">Rentang Waktu</h3>
            <div class="chip-group time-chips" style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
              <div class="chip active" style="padding: 6px 16px; border-radius: 16px; background: #1a73e8; color: white; font-size: 13px; cursor: pointer;">Bulan Ini</div>
              <div class="chip" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 13px; cursor: pointer;">Bulan Lalu</div>
              <div class="chip" id="chipKustom" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 13px; cursor: pointer;">Kustom</div>
            </div>
            
            <div id="kustomDateInputs" class="hidden" style="display: none; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
              <div>
                <label style="font-size: 12px; color: #666; display: block; margin-bottom: 4px;">Dari</label>
                <input type="date" class="form-input" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 13px;">
              </div>
              <div>
                <label style="font-size: 12px; color: #666; display: block; margin-bottom: 4px;">Sampai</label>
                <input type="date" class="form-input" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 13px;">
              </div>
            </div>
          </div>

          <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 16px;">
            <h3 style="margin: 0 0 16px 0; font-size: 15px; color: #333;">Filter Tingkat</h3>
            <div class="chip-group tingkat-chips" style="display: flex; gap: 8px; flex-wrap: wrap;">
              <div class="chip active" style="padding: 6px 16px; border-radius: 16px; background: #1a73e8; color: white; font-size: 13px; cursor: pointer;">Kelas X</div>
              <div class="chip" style="padding: 6px 16px; border-radius: 16px; background: white; border: 1px solid #ddd; color: #666; font-size: 13px; cursor: pointer;">Kelas XI</div>
              <div class="chip active" style="padding: 6px 16px; border-radius: 16px; background: #1a73e8; color: white; font-size: 13px; cursor: pointer;">Kelas XII</div>
            </div>
          </div>

          <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 16px;">
            <h3 style="margin: 0 0 16px 0; font-size: 15px; color: #333;">Kategori Data</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: #1a73e8;">
                <span style="font-size: 14px; color: #333;">Rekap Kehadiran Harian</span>
              </label>
              <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: #1a73e8;">
                <span style="font-size: 14px; color: #333;">Detail Ketidakhadiran (S/I/A)</span>
              </label>
              <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                <input type="checkbox" style="width: 18px; height: 18px; accent-color: #1a73e8;">
                <span style="font-size: 14px; color: #333;">Laporan Guru Piket</span>
              </label>
            </div>
          </div>

          <div class="card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 15px; color: #333;">Format Export</h3>
            <div class="chip-group format-chips" style="display: flex; gap: 8px;">
              <div class="chip active" style="padding: 8px 24px; border-radius: 8px; background: #e8f5e9; color: #2e7d32; border: 1px solid #4caf50; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <span class="material-icons-outlined" style="font-size: 18px;">table_chart</span> Excel (.xlsx)
              </div>
              <div class="chip" style="padding: 8px 24px; border-radius: 8px; background: white; color: #666; border: 1px solid #ddd; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <span class="material-icons-outlined" style="font-size: 18px;">picture_as_pdf</span> PDF
              </div>
            </div>
          </div>

          <button id="btnDownload" class="btn btn-primary btn-full btn-lg" style="width: 100%; padding: 14px; background: #1a73e8; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(26,115,232,0.2);">
            <span class="material-icons-outlined">download</span> Unduh Laporan (.xlsx)
          </button>

          <div style="margin-top: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="margin: 0; font-size: 15px; color: #333;">Riwayat Unduhan</h3>
              <a href="#" style="font-size: 13px; color: #1a73e8; text-decoration: none;">Lihat Semua</a>
            </div>
            <div style="background: white; padding: 8px 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              ${riwayatHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    // Time chips toggle
    const timeChips = document.querySelectorAll('.time-chips .chip');
    const kustomInputs = document.getElementById('kustomDateInputs');
    
    timeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        timeChips.forEach(c => {
          c.classList.remove('active');
          c.style.background = 'white';
          c.style.color = '#666';
          c.style.border = '1px solid #ddd';
        });
        
        chip.classList.add('active');
        chip.style.background = '#1a73e8';
        chip.style.color = 'white';
        chip.style.border = 'none';

        if (chip.id === 'chipKustom') {
          kustomInputs.style.display = 'grid';
        } else {
          kustomInputs.style.display = 'none';
        }
      });
    });

    // Tingkat chips toggle (multi-select)
    const tingkatChips = document.querySelectorAll('.tingkat-chips .chip');
    tingkatChips.forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('active')) {
          chip.classList.remove('active');
          chip.style.background = 'white';
          chip.style.color = '#666';
          chip.style.border = '1px solid #ddd';
        } else {
          chip.classList.add('active');
          chip.style.background = '#1a73e8';
          chip.style.color = 'white';
          chip.style.border = 'none';
        }
      });
    });

    // Format chips toggle
    const formatChips = document.querySelectorAll('.format-chips .chip');
    const btnDownload = document.getElementById('btnDownload');
    
    formatChips.forEach(chip => {
      chip.addEventListener('click', () => {
        formatChips.forEach(c => {
          c.classList.remove('active');
          c.style.background = 'white';
          c.style.color = '#666';
          c.style.border = '1px solid #ddd';
        });
        
        chip.classList.add('active');
        
        if (chip.textContent.includes('Excel')) {
          chip.style.background = '#e8f5e9';
          chip.style.color = '#2e7d32';
          chip.style.border = '1px solid #4caf50';
          btnDownload.innerHTML = '<span class="material-icons-outlined">download</span> Unduh Laporan (.xlsx)';
        } else {
          chip.style.background = '#ffebee';
          chip.style.color = '#c62828';
          chip.style.border = '1px solid #f44336';
          btnDownload.innerHTML = '<span class="material-icons-outlined">download</span> Unduh Laporan (.pdf)';
        }
      });
    });

    // Download button action
    btnDownload.addEventListener('click', async () => {
      window.Components.showLoading('Menyiapkan file...');
      
      try {
        // Determine date range
        let startDate = null;
        let endDate = null;
        
        const activeTimeChip = document.querySelector('.time-chips .chip.active');
        if (activeTimeChip.id === 'chipKustom') {
          const inputs = document.querySelectorAll('#kustomDateInputs input');
          startDate = inputs[0].value;
          endDate = inputs[1].value;
          
          if (!startDate || !endDate) {
            throw new Error('Pilih tanggal awal dan akhir untuk mode kustom.');
          }
        } else if (activeTimeChip.textContent === 'Bulan Ini') {
          const now = new Date();
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        } else if (activeTimeChip.textContent === 'Bulan Lalu') {
          const now = new Date();
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
          endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
        }

        // Fetch data
        const data = await window.APP_DATA.getExportData(startDate, endDate);
        
        if (!data || data.length === 0) {
          throw new Error('Tidak ada data pada rentang waktu tersebut.');
        }

        // Determine format
        const formatBtn = document.querySelector('.format-chips .chip.active');
        const isExcel = formatBtn.textContent.includes('Excel');

        // Prepare table data
        const headers = ['Tanggal', 'Sesi', 'Petugas', 'Siswa Absen', 'Kelas', 'Status Absen', 'Catatan Laporan'];
        const rows = [];

        data.forEach(laporan => {
          const petugas = laporan.profiles?.nama || 'Unknown';
          const catatan = laporan.catatan || '';
          const absensi = laporan.absensi_piket || [];
          
          if (absensi.length === 0) {
            rows.push([laporan.tanggal, laporan.sesi, petugas, '-', '-', '-', catatan]);
          } else {
            absensi.forEach(a => {
              const siswaNama = a.siswa?.nama || '-';
              const kelasNama = a.siswa?.kelas?.nama || '-';
              rows.push([laporan.tanggal, laporan.sesi, petugas, siswaNama, kelasNama, a.status, catatan]);
            });
          }
        });

        if (isExcel) {
          // Export to Excel using SheetJS
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
          
          // Basic styling adjustments for col width
          ws['!cols'] = [
            {wch: 12}, // Tanggal
            {wch: 8},  // Sesi
            {wch: 20}, // Petugas
            {wch: 20}, // Siswa Absen
            {wch: 10}, // Kelas
            {wch: 12}, // Status
            {wch: 40}  // Catatan
          ];
          
          XLSX.utils.book_append_sheet(wb, ws, "Laporan Piket");
          XLSX.writeFile(wb, `Laporan_Piket_${startDate}_to_${endDate}.xlsx`);
        } else {
          // Export to PDF using jsPDF + autoTable
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF({ orientation: 'landscape' });
          
          doc.setFontSize(16);
          doc.text('Laporan Guru Piket & Presensi', 14, 15);
          doc.setFontSize(11);
          doc.text(`Periode: ${startDate} s/d ${endDate}`, 14, 22);

          doc.autoTable({
            startY: 28,
            head: [headers],
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [26, 115, 232] },
            styles: { fontSize: 9 }
          });

          doc.save(`Laporan_Piket_${startDate}_to_${endDate}.pdf`);
        }
        
        window.Components.hideLoading();
        window.Components.toast('File berhasil diunduh!', 'success');
        
      } catch (err) {
        window.Components.hideLoading();
        console.error(err);
        window.Components.toast(err.message || 'Gagal mengekspor data', 'error');
      }
    });
  }

  window.Router.register('/export', render);
})();
