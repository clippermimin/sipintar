(function() {
  async function render() {
    const laporanPiket = window.APP_DATA.laporanPiket || [];
    const weeklyData = window.APP_DATA.getWeeklyData ? await window.APP_DATA.getWeeklyData() : [];

    const html = `
      <div class="page piket-dashboard">
        ${window.Components.header({ title: 'Guru Piket', subtitle: 'SIPINTER', back: true, backPath: '/guru/dashboard' })}
        <div class="page-content">
          
          <div class="card piket-status-banner" style="background: linear-gradient(135deg, #f5b041, #f39c12); color: white; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="material-icons-outlined" style="font-size: 2.5rem;">assignment</span>
              <div>
                <div style="font-size: 1.2rem; font-weight: bold;">Piket Aktif &mdash; Sesi Pagi</div>
                <div style="opacity: 0.9; font-size: 0.9rem;">Anda bertugas sebagai guru piket hari ini</div>
              </div>
            </div>
          </div>

          <div class="stat-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div class="card stat-card" style="text-align: center;">
              <div class="stat-card-label" style="color: var(--text-secondary, #666); font-size: 0.85rem; margin-bottom: 0.5rem;">Siswa Tidak Hadir</div>
              <div class="stat-card-value" style="color: var(--warning, #f39c12); font-size: 2rem; font-weight: bold;">5</div>
            </div>
            <div class="card stat-card" style="text-align: center;">
              <div class="stat-card-label" style="color: var(--text-secondary, #666); font-size: 0.85rem; margin-bottom: 0.5rem;">Guru Tidak Hadir</div>
              <div class="stat-card-value" style="color: var(--error, #e74c3c); font-size: 2rem; font-weight: bold;">1</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 2rem;">
            <button id="btnBuatLaporan" class="btn btn-primary btn-full btn-lg">
              <span class="material-icons-outlined" style="margin-right: 0.5rem;">edit_document</span>
              Buat Laporan Baru
            </button>
            <button id="btnUnduhLaporan" class="btn btn-outline btn-full btn-lg" style="border-style: dashed; color: var(--primary);">
              <span class="material-icons-outlined" style="margin-right: 0.5rem;">download</span>
              Unduh Rekap Laporan
            </button>
          </div>

          <div class="section-title" style="margin-bottom: 1rem; font-weight: bold;">Riwayat Laporan</div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
            ${laporanPiket.map(lap => `
              <div class="card list-item" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 500;">${lap.tanggal} &mdash; Sesi ${lap.sesi}</div>
                  <div style="font-size: 0.85rem; color: var(--text-secondary, #666);">Siswa Absen: ${lap.siswaAbsen}</div>
                </div>
                <div>
                  <span class="badge ${lap.status === 'Selesai' ? 'badge-success' : 'badge-warning'}">${lap.status}</span>
                </div>
              </div>
            `).join('') || '<div class="empty-state">Belum ada riwayat laporan</div>'}
          </div>

          <div class="section-title" style="margin-bottom: 1rem; font-weight: bold;">Rekap Mingguan</div>
          <div class="card" style="margin-bottom: 2rem;">
            <div class="bar-chart" style="display: flex; align-items: flex-end; gap: 0.5rem; height: 150px; padding-top: 1rem;">
              ${weeklyData.map(data => {
                const heightPercent = Math.max(10, Math.min(100, (data.value / 20) * 100)); // dummy scale
                return `
                <div class="bar-chart-item" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%;">
                  <div class="bar-chart-bar" style="width: 100%; background-color: var(--primary, #007bff); border-radius: 4px 4px 0 0; height: ${heightPercent}%; transition: height 0.3s;"></div>
                  <div class="bar-chart-label" style="font-size: 0.75rem; margin-top: 0.5rem; color: var(--text-secondary, #666);">${data.hari.substring(0,3)}</div>
                </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>
        ${window.Components.bottomNavGuru ? window.Components.bottomNavGuru('piket') : ''}
        ${window.Components.footer ? window.Components.footer() : ''}
      </div>
    `;
    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    const btnBuat = document.getElementById('btnBuatLaporan');
    if (btnBuat) {
      btnBuat.addEventListener('click', () => {
        window.Router.navigate('/guru/piket/laporan');
      });
    }
    const btnUnduh = document.getElementById('btnUnduhLaporan');
    if (btnUnduh) {
      btnUnduh.addEventListener('click', () => {
        window.Router.navigate('/export');
      });
    }
  }

  window.Router.register('/guru/piket', render);
})();
