(function() {
  function render() {
    const headerHtml = window.Components.header({ 
      title: 'SIPINTER', 
      subtitle: '', 
      notif: true, 
      avatar: true, 
      avatarText: 'KS' 
    });

    const statGrid = `
      <div class="stat-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; padding: 0 16px;">
        <div class="stat-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #1976d2;">
          <div class="stat-card-label" style="font-size: 13px; color: #666; margin-bottom: 4px;">Kehadiran Guru</div>
          <div class="stat-card-value" style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 4px;">98%</div>
          <div style="font-size: 11px; color: #388e3c; display: flex; align-items: center;"><span class="material-icons-outlined" style="font-size: 14px;">trending_up</span> +2% dari bulan lalu</div>
        </div>
        <div class="stat-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #f57c00;">
          <div class="stat-card-label" style="font-size: 13px; color: #666; margin-bottom: 4px;">Absen Siswa</div>
          <div class="stat-card-value" style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 4px;">12</div>
          <div style="font-size: 11px; color: #666;">Orang hari ini</div>
        </div>
        <div class="stat-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #1976d2;">
          <div class="stat-card-label" style="font-size: 13px; color: #666; margin-bottom: 4px;">Laporan Piket</div>
          <div class="stat-card-value" style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 4px;">4/5</div>
          <div style="font-size: 11px; color: #666;">Selesai diperiksa</div>
        </div>
        <div class="stat-card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #388e3c;">
          <div class="stat-card-label" style="font-size: 13px; color: #666; margin-bottom: 4px;">Tren Kehadiran</div>
          <div class="stat-card-value" style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 4px;">Stabil</div>
          <div style="font-size: 11px; color: #666;">Minggu ini</div>
        </div>
      </div>
    `;

    const guruAbsenData = window.APP_DATA.getGuruAbsenHariIni() || [];
    const guruAbsenHtml = guruAbsenData.map(item => `
      <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #eee;">
        <div class="avatar" style="width: 40px; height: 40px; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #555;">
          ${item.guru.nama.substring(0,2).toUpperCase()}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 500; font-size: 14px; color: #333;">${item.guru.nama}</div>
          <div style="font-size: 12px; color: #666;">${item.alasan}</div>
        </div>
        <div>
          ${item.pengganti 
            ? `<span class="badge badge-success" style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 10px;">Ada Pengganti</span>`
            : `<span class="badge badge-error" style="background: #ffebee; color: #c62828; padding: 4px 8px; border-radius: 4px; font-size: 10px;">Belum Ada Pengganti</span>`
          }
        </div>
      </div>
    `).join('');

    const weeklyData = window.APP_DATA.getWeeklyData() || [];
    const maxVal = Math.max(...weeklyData.map(d => d.value));
    const chartBars = weeklyData.map(d => `
      <div class="bar-chart-item" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <div style="font-size: 10px; color: #666;">${d.value}%</div>
        <div class="bar-chart-bar" style="width: 24px; height: ${(d.value/maxVal)*100}px; background: ${d.value > 95 ? '#1976d2' : (d.value > 90 ? '#ffb300' : '#e53935')}; border-radius: 4px 4px 0 0;"></div>
        <div class="bar-chart-label" style="font-size: 10px; color: #666;">${d.hari.substring(0,3)}</div>
      </div>
    `).join('');

    const html = `
      <div class="kepsek-dashboard" style="max-width: 480px; margin: 0 auto; min-height: 100vh; background: #f8f9fa; padding-bottom: 80px;">
        ${headerHtml}
        
        <div class="kepsek-greeting" style="background: linear-gradient(135deg, #1a73e8, #0d47a1); color: white; padding: 24px 16px 40px; border-radius: 0 0 24px 24px; margin-bottom: -20px;">
          <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 500;">Selamat Pagi, Bapak/Ibu Kepala Sekolah</h2>
          <p style="margin: 0; font-size: 13px; opacity: 0.9;">Sabtu, 25 Juli 2026 &bull; Semester Genap 2026/2027</p>
        </div>

        <div style="padding: 0 16px; margin-bottom: 16px;">
          <div class="chip-group" style="display: flex; gap: 8px; overflow-x: auto; padding: 4px 0;">
            <select class="chip" style="padding: 6px 12px; border-radius: 16px; background: white; border: 1px solid #ddd; font-size: 13px; outline: none;">
              <option>Pilih Jenjang</option>
              <option>Semua</option>
              <option>Kelas X</option>
              <option>Kelas XI</option>
              <option>Kelas XII</option>
            </select>
            <div class="chip active" style="padding: 6px 16px; border-radius: 16px; background: #1a73e8; color: white; font-size: 13px;">Hari Ini</div>
          </div>
        </div>

        ${statGrid}

        <div style="padding: 0 16px; margin-bottom: 24px;">
          <div class="card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="margin: 0; font-size: 15px; color: #333;">Guru Tidak Hadir</h3>
              <span class="badge" style="background: #ffebee; color: #c62828; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">2 Guru</span>
            </div>
            <div>${guruAbsenHtml}</div>
          </div>
        </div>

        <div style="padding: 0 16px; margin-bottom: 24px;">
          <div class="card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="margin: 0; font-size: 15px; color: #333;">Laporan Piket Hari Ini</h3>
              <a href="#" style="font-size: 13px; color: #1a73e8; text-decoration: none;" onclick="window.Components.toast('Lihat Semua Laporan', 'info'); return false;">Lihat Semua</a>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0;">
                <div>
                  <div style="font-size: 14px; color: #333; font-weight: 500;">Sayap Barat - Pagi</div>
                  <div style="font-size: 12px; color: #666;">08:00</div>
                </div>
                <span class="material-icons-outlined" style="color: #4caf50;">check_circle</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0;">
                <div>
                  <div style="font-size: 14px; color: #333; font-weight: 500;">Sayap Timur - Pagi</div>
                  <div style="font-size: 12px; color: #666;">08:15</div>
                </div>
                <span class="material-icons-outlined" style="color: #4caf50;">check_circle</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 14px; color: #333; font-weight: 500;">Gedung Utama - Siang</div>
                  <div style="font-size: 12px; color: #666;">-</div>
                </div>
                <span class="badge" style="background: #fff3e0; color: #f57c00; font-size: 10px; padding: 4px 6px; border-radius: 4px;">Belum Lapor</span>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 0 16px; margin-bottom: 24px;">
          <div class="card" style="background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <div>
                <h3 style="margin: 0 0 4px 0; font-size: 15px; color: #333;">Ringkasan Mingguan</h3>
                <span class="badge" style="background: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Periode Terpilih</span>
              </div>
              <button onclick="window.Components.toast('Menyinkronkan data...', 'info')" class="btn-icon" style="background: none; border: none; color: #666; cursor: pointer;"><span class="material-icons-outlined">sync</span></button>
            </div>
            
            <div class="bar-chart" style="display: flex; justify-content: space-between; align-items: flex-end; height: 150px; padding: 0 8px; border-bottom: 1px solid #eee;">
              ${chartBars}
            </div>
          </div>
        </div>

        <div style="padding: 0 16px 24px; display: flex; flex-direction: column; gap: 12px;">
          <button onclick="window.Router.navigate('/export')" class="btn btn-primary btn-full btn-lg" style="width: 100%; padding: 14px; background: #1a73e8; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px;">
            <span class="material-icons-outlined">download</span> Export Laporan Bulanan
          </button>
          <button onclick="window.Components.toast('Fitur Detail Kehadiran', 'info')" class="btn btn-outline btn-full" style="width: 100%; padding: 14px; background: transparent; color: #1a73e8; border: 1px solid #1a73e8; border-radius: 8px; font-weight: bold; font-size: 15px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px;">
            <span class="material-icons-outlined">analytics</span> Lihat Detail Kehadiran
          </button>
        </div>

        ${window.Components.bottomNavKepsek('dashboard')}
      </div>
    `;

    window.Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }

  function bindEvents() {
    // any specific events beyond inline onclick
  }

  window.Router.register('/kepsek/dashboard', render);
})();
