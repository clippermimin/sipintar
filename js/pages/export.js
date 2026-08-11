(function() {
  async function render() {
    let backPath = '/login';
    if (window.APP_STATE.role === 'admin') backPath = '/admin/dashboard';
    else if (window.APP_STATE.role === 'kepsek') backPath = '/kepsek/dashboard';
    else if (window.APP_STATE.role === 'guru') backPath = '/guru/piket';

    const html = `
      <style>
        .export-page { background: #f4f6f8; min-height: 100vh; padding: 32px 20px; font-family: 'Inter', sans-serif; display: flex; justify-content: center; }
        .export-container { width: 100%; max-width: 500px; }
        .export-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
        .btn-back { width: 44px; height: 44px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); color: #1a73e8; text-decoration: none; cursor: pointer; transition: all 0.2s; border: 1px solid #eee; }
        .btn-back:hover { background: #f8f9fa; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .export-title { margin: 0; font-size: 24px; font-weight: 700; color: #111827; }
        .export-card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f3f4f6; }
        .export-card-title { margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #374151; display: flex; align-items: center; gap: 8px; }
        .date-input-group { display: flex; gap: 16px; }
        .date-input-wrap { flex: 1; }
        .date-input-label { display: block; font-size: 13px; font-weight: 600; color: #6b7280; margin-bottom: 6px; }
        .date-input { width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; color: #1f2937; background: #f9fafb; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .date-input:focus { border-color: #1a73e8; background: white; box-shadow: 0 0 0 3px rgba(26,115,232,0.1); }
        
        .format-chips { display: flex; gap: 16px; }
        .format-chip { flex: 1; padding: 16px; border-radius: 12px; border: 2px solid #e5e7eb; background: white; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
        .format-chip .icon { font-size: 24px; margin-bottom: 8px; display: block; }
        .format-chip .label { font-size: 14px; font-weight: 600; color: #4b5563; }
        .format-chip:hover { border-color: #d1d5db; background: #f9fafb; }
        
        .format-chip.active-excel { border-color: #10b981; background: #ecfdf5; }
        .format-chip.active-excel .label { color: #047857; }
        
        .format-chip.active-pdf { border-color: #ef4444; background: #fef2f2; }
        .format-chip.active-pdf .label { color: #b91c1c; }
        
        .btn-download { width: 100%; background: #1a73e8; color: white; border: none; border-radius: 14px; padding: 16px; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; box-shadow: 0 4px 12px rgba(26,115,232,0.25); transition: all 0.2s; }
        .btn-download:hover { background: #1557b0; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(26,115,232,0.3); }
        .btn-download:active { transform: translateY(0); }
        
        @media (max-width: 480px) {
          .date-input-group { flex-direction: column; }
        }
      </style>
      
      <div class="export-page">
        <div class="export-container">
          <div class="export-header">
            <a onclick="window.Router.navigate('${backPath}')" class="btn-back">
              <span class="material-icons-outlined">arrow_back</span>
            </a>
            <h1 class="export-title">Unduh Laporan</h1>
          </div>

          <div class="export-card">
            <h3 class="export-card-title">
              <span class="material-icons-outlined" style="color: #1a73e8; font-size: 20px;">event</span> Rentang Waktu
            </h3>
            <div class="date-input-group">
              <div class="date-input-wrap">
                <label class="date-input-label">Dari Tanggal</label>
                <input type="date" id="startDate" class="date-input">
              </div>
              <div class="date-input-wrap">
                <label class="date-input-label">Sampai Tanggal</label>
                <input type="date" id="endDate" class="date-input">
              </div>
            </div>
          </div>

          <div class="export-card">
            <h3 class="export-card-title">
              <span class="material-icons-outlined" style="color: #8b5cf6; font-size: 20px;">description</span> Format File
            </h3>
            <div class="format-chips">
              <div class="format-chip active-excel" data-format="excel">
                <span class="icon">📊</span>
                <span class="label">Excel (.xlsx)</span>
              </div>
              <div class="format-chip" data-format="pdf">
                <span class="icon">📄</span>
                <span class="label">PDF Document</span>
              </div>
            </div>
          </div>

          <button id="btnDownload" class="btn-download">
            <span class="material-icons-outlined">download</span> Unduh Rekap Laporan
          </button>
        </div>
      </div>
    `;

    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    // Set default dates to today
    const today = new Date();
    const getLocalYYYYMMDD = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    document.getElementById('startDate').value = getLocalYYYYMMDD(today);
    document.getElementById('endDate').value = getLocalYYYYMMDD(today);

    // Format Chips Logic
    const formatChips = document.querySelectorAll('.format-chip');
    formatChips.forEach(chip => {
      chip.addEventListener('click', () => {
        formatChips.forEach(c => {
          c.classList.remove('active-excel');
          c.classList.remove('active-pdf');
        });
        
        if (chip.dataset.format === 'excel') {
          chip.classList.add('active-excel');
        } else {
          chip.classList.add('active-pdf');
        }
      });
    });

    // Download Logic
    document.getElementById('btnDownload').addEventListener('click', async () => {
      window.Components.showLoading('Menyiapkan file...');
      
      try {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (!startDate || !endDate) {
          throw new Error('Harap tentukan rentang tanggal (Dari & Sampai).');
        }
        if (startDate > endDate) {
          throw new Error('Tanggal awal tidak boleh lebih besar dari tanggal akhir.');
        }

        const data = await window.APP_DATA.getExportData(startDate, endDate);
        if (!data || data.length === 0) throw new Error('Tidak ada data laporan pada rentang waktu ini.');

        const isExcel = document.querySelector('.format-chip.active-excel') !== null;

        const headers = ['Tanggal', 'Sesi', 'Guru/Petugas', 'Nama Siswa', 'Kelas', 'Status Kehadiran', 'Catatan Piket'];
        const rows = [];

        data.forEach(laporan => {
          let petugas = laporan.profiles?.nama || '-';
          let catatanStr = laporan.catatan || '-';
          
          const petugasMatch = catatanStr.match(/^\[(.*?)\]\s*/);
          if (petugasMatch) {
            // Remove "Petugas 1: " and "Petugas 2: " to get just the names
            petugas = petugasMatch[1].replace(/Petugas \d+:\s/g, '');
            // Remove the [Petugas...] prefix from the catatan string
            catatanStr = catatanStr.substring(petugasMatch[0].length) || '-';
          }
          const absensi = laporan.absensi_piket || [];
          
          if (absensi.length === 0) {
            rows.push([laporan.tanggal, laporan.sesi, petugas, '-', '-', '-', catatanStr]);
          } else {
            absensi.forEach(a => {
              const siswaNama = a.siswa?.nama || '-';
              const kelasNama = a.siswa?.kelas?.nama || '-';
              rows.push([laporan.tanggal, laporan.sesi, petugas, siswaNama, kelasNama, a.status, catatanStr]);
            });
          }
        });

        if (isExcel) {
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
          
          ws['!cols'] = [
            {wch: 12}, // Tanggal
            {wch: 8},  // Sesi
            {wch: 25}, // Guru
            {wch: 25}, // Nama Siswa
            {wch: 12}, // Kelas
            {wch: 15}, // Status
            {wch: 50}  // Catatan
          ];
          
          XLSX.utils.book_append_sheet(wb, ws, "Rekap Piket");
          XLSX.writeFile(wb, `Rekap_Piket_${startDate}_to_${endDate}.xlsx`);
        } else {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF({ orientation: 'landscape' });
          
          doc.setFontSize(16);
          doc.text('Laporan Rekap Piket', 14, 15);
          doc.setFontSize(11);
          doc.text(`Periode: ${startDate} s/d ${endDate}`, 14, 22);

          doc.autoTable({
            startY: 28,
            head: [headers],
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [52, 199, 89] },
            styles: { fontSize: 9 }
          });

          doc.save(`Rekap_Piket_${startDate}_to_${endDate}.pdf`);
        }
        
        window.Components.hideLoading();
        window.Components.toast('Berhasil mengunduh laporan!', 'success');
        
      } catch (err) {
        window.Components.hideLoading();
        window.Components.toast(err.message, 'error');
      }
    });
  }

  window.Router.register('/export', render);
})();
