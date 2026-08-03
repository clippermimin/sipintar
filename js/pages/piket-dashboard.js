(function() {
  async function render() {
    window.Components.showLoading();
    const guru = window.APP_STATE.currentGuru || {};
    const guruId = guru.id;

    // Fetch riwayat laporan milik guru ini dari Supabase
    const { data: laporanList } = await window.supabase
      .from('laporan_piket')
      .select('id, tanggal, sesi, status')
      .eq('guru_id', guruId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Hitung jumlah siswa absen hari ini dari laporan guru ini
    const today = new Date().toISOString().split('T')[0];
    const { count: siswaAbsenHariIni } = await window.supabase
      .from('absensi_piket')
      .select('id, laporan_piket!inner(guru_id, tanggal)', { count: 'exact', head: true })
      .eq('laporan_piket.guru_id', guruId)
      .eq('laporan_piket.tanggal', today);

    window.Components.hideLoading();

    const laporan = laporanList || [];

    const riwayatHtml = laporan.length > 0
      ? laporan.map(lap => {
          const badgeStyle = lap.status === 'Selesai'
            ? 'background: #e8f5e9; color: #2e7d32;'
            : 'background: #fff3e0; color: #ef6c00;';
          return `
            <div class="card list-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;">
              <div>
                <div style="font-weight: 500;">${lap.tanggal} — Sesi ${lap.sesi}</div>
              </div>
              <span class="badge" style="${badgeStyle} padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${lap.status}</span>
            </div>
          `;
        }).join('')
      : '<div class="empty-state" style="text-align:center; color:#999; padding: 24px;">Belum ada riwayat laporan</div>';

    const html = `
      <div class="page piket-dashboard">
        ${window.Components.header({ title: 'Guru Piket', subtitle: 'SIPINTER', back: true, backPath: '/guru/dashboard' })}
        <div class="page-content">
          
          <div class="card piket-status-banner" style="background: linear-gradient(135deg, #f5b041, #f39c12); color: white; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="material-icons-outlined" style="font-size: 2.5rem;">assignment</span>
              <div>
                <div style="font-size: 1.2rem; font-weight: bold;">Halaman Piket</div>
                <div style="opacity: 0.9; font-size: 0.9rem;">Kelola laporan piket harian Anda</div>
              </div>
            </div>
          </div>

          <div class="stat-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div class="card stat-card" style="text-align: center;">
              <div class="stat-card-label" style="color: var(--text-secondary, #666); font-size: 0.85rem; margin-bottom: 0.5rem;">Siswa Absen Hari Ini</div>
              <div class="stat-card-value" style="color: var(--warning, #f39c12); font-size: 2rem; font-weight: bold;">${siswaAbsenHariIni || 0}</div>
            </div>
            <div class="card stat-card" style="text-align: center;">
              <div class="stat-card-label" style="color: var(--text-secondary, #666); font-size: 0.85rem; margin-bottom: 0.5rem;">Total Laporan Saya</div>
              <div class="stat-card-value" style="color: var(--primary, #1a73e8); font-size: 2rem; font-weight: bold;">${laporan.length}</div>
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

          <div class="section-title" style="margin-bottom: 1rem; font-weight: bold;">Riwayat Laporan Saya</div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
            ${riwayatHtml}
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
    if (btnBuat) btnBuat.addEventListener('click', () => window.Router.navigate('/guru/piket/laporan'));

    const btnUnduh = document.getElementById('btnUnduhLaporan');
    if (btnUnduh) btnUnduh.addEventListener('click', () => window.Router.navigate('/export'));
  }

  window.Router.register('/guru/piket', render);
})();
