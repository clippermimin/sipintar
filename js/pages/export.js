(function() {
  async function render() {
    let backPath = '/login';
    if (window.APP_STATE.role === 'admin') backPath = '/admin/dashboard';
    else if (window.APP_STATE.role === 'kepsek') backPath = '/kepsek/dashboard';
    else if (window.APP_STATE.role === 'guru') backPath = '/guru/piket';

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
          gap: 12px;
          background: rgba(242, 242, 247, 0.8);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 10;
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
          font-size: 28px;
          font-weight: 800;
          color: #000;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .ios-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin: 0 20px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
        }
        .ios-card-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1C1C1E;
        }
        .ios-chip-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ios-chip {
          padding: 8px 16px;
          border-radius: 20px;
          background: #F2F2F7;
          color: #8E8E93;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
          border: 2px solid transparent;
        }
        .ios-chip.active {
          background: #007AFF;
          color: white;
        }
        .ios-input-group {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        .ios-input-wrap {
          flex: 1;
        }
        .ios-input-label {
          font-size: 12px;
          color: #8E8E93;
          font-weight: 600;
          margin-bottom: 4px;
          display: block;
        }
        .ios-input {
          width: 100%;
          background: #F2F2F7;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-size: 14px;
          font-family: inherit;
          color: #1C1C1E;
          box-sizing: border-box;
          outline: none;
        }
        .ios-btn-primary {
          background: #34C759;
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
          box-shadow: 0 4px 16px rgba(52, 199, 89, 0.2);
        }
        .ios-btn-primary:active {
          transform: scale(0.96);
        }
      </style>
      
      <div class="page ios-page">
        <div class="ios-nav">
          <a class="ios-back-btn" onclick="window.Router.navigate('${backPath}')">
            <span class="material-icons-outlined">arrow_back</span>
          </a>
          <h1 class="ios-nav-title">Unduh Rekap</h1>
        </div>

        <div class="ios-card">
          <div class="ios-card-title">Rentang Waktu Laporan</div>
          <div class="ios-chip-group time-chips">
            <div class="ios-chip active" id="chipHariIni">Hari Ini</div>
            <div class="ios-chip" id="chipMingguIni">Minggu Ini</div>
            <div class="ios-chip" id="chipBulanIni">Bulan Ini</div>
            <div class="ios-chip" id="chipKustom">Kustom Date</div>
          </div>
          
          <div id="kustomDateInputs" class="ios-input-group" style="display: none;">
            <div class="ios-input-wrap">
              <label class="ios-input-label">Dari Tanggal</label>
              <input type="date" id="startDate" class="ios-input">
            </div>
            <div class="ios-input-wrap">
              <label class="ios-input-label">Sampai Tanggal</label>
              <input type="date" id="endDate" class="ios-input">
            </div>
          </div>
        </div>

        <div class="ios-card">
          <div class="ios-card-title">Format File</div>
          <div class="ios-chip-group format-chips">
            <div class="ios-chip active" style="background: #E4F8EB; color: #34C759; border-color: #34C759;">Excel (.xlsx)</div>
            <div class="ios-chip" style="background: #F2F2F7; color: #8E8E93;">PDF Document</div>
          </div>
        </div>

        <div style="padding: 0 20px;">
          <button id="btnDownload" class="ios-btn-primary">
            <span class="material-icons-outlined">download</span> Unduh Data
          </button>
        </div>
      </div>
    `;

    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    // Time Chips
    const timeChips = document.querySelectorAll('.time-chips .ios-chip');
    const kustomInputs = document.getElementById('kustomDateInputs');
    
    timeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        timeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        if (chip.id === 'chipKustom') {
          kustomInputs.style.display = 'flex';
        } else {
          kustomInputs.style.display = 'none';
        }
      });
    });

    // Format Chips
    const formatChips = document.querySelectorAll('.format-chips .ios-chip');
    formatChips.forEach(chip => {
      chip.addEventListener('click', () => {
        formatChips.forEach(c => {
          c.classList.remove('active');
          c.style.background = '#F2F2F7';
          c.style.color = '#8E8E93';
          c.style.borderColor = 'transparent';
        });
        
        chip.classList.add('active');
        if (chip.textContent.includes('Excel')) {
          chip.style.background = '#E4F8EB';
          chip.style.color = '#34C759';
          chip.style.borderColor = '#34C759';
        } else {
          chip.style.background = '#FFE5E5';
          chip.style.color = '#FF3B30';
          chip.style.borderColor = '#FF3B30';
        }
      });
    });

    // Download
    document.getElementById('btnDownload').addEventListener('click', async () => {
      window.Components.showLoading('Menyiapkan file...');
      
      try {
        let startDate = null;
        let endDate = null;
        
        const activeTime = document.querySelector('.time-chips .active').id;
        const now = new Date();
        
        const getLocalYYYYMMDD = (d) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        if (activeTime === 'chipKustom') {
          startDate = document.getElementById('startDate').value;
          endDate = document.getElementById('endDate').value;
          if (!startDate || !endDate) throw new Error('Harap pilih rentang tanggal.');
        } else if (activeTime === 'chipHariIni') {
          startDate = getLocalYYYYMMDD(now);
          endDate = getLocalYYYYMMDD(now);
        } else if (activeTime === 'chipMingguIni') {
          const day = now.getDay() || 7; 
          const firstDay = new Date(now);
          firstDay.setDate(now.getDate() - day + 1);
          const lastDay = new Date(now);
          lastDay.setDate(now.getDate() - day + 7);
          
          startDate = getLocalYYYYMMDD(firstDay);
          endDate = getLocalYYYYMMDD(lastDay);
        } else if (activeTime === 'chipBulanIni') {
          const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          startDate = getLocalYYYYMMDD(firstDay);
          endDate = getLocalYYYYMMDD(lastDay);
        }

        const data = await window.APP_DATA.getExportData(startDate, endDate);
        if (!data || data.length === 0) throw new Error('Tidak ada data laporan pada rentang waktu ini.');

        const isExcel = document.querySelector('.format-chips .active').textContent.includes('Excel');

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
