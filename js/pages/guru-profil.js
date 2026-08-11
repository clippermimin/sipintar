(function() {
  async function render() {
    window.Components.showLoading();
    const guru = window.APP_STATE.currentGuru || {};
    
    // Fix Avatar Initials
    const namaGuru = guru.nama || 'Guru';
    const nameParts = namaGuru.trim().split(' ');
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
      : namaGuru.substring(0, 2).toUpperCase();
      
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
          background: rgba(242, 242, 247, 0.8);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .ios-nav-title {
          font-size: 28px;
          font-weight: 800;
          color: #000;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .profile-card {
          background: white;
          border-radius: 20px;
          margin: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007AFF 0%, #0056D6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          box-shadow: 0 8px 16px rgba(0, 122, 255, 0.3);
        }
        .profile-name {
          font-size: 20px;
          font-weight: 700;
          color: #000;
          margin-bottom: 4px;
          text-align: center;
        }
        .profile-role {
          font-size: 14px;
          color: #8E8E93;
          font-weight: 500;
        }
        .info-list {
          margin: 20px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
        }
        .info-item {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #F2F2F7;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #E5F1FF;
          color: #007AFF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
        }
        .info-content {
          flex: 1;
        }
        .info-label {
          font-size: 13px;
          color: #8E8E93;
          margin-bottom: 2px;
        }
        .info-value {
          font-size: 15px;
          font-weight: 600;
          color: #000;
        }
        .logout-btn-container {
          margin: 32px 20px;
        }
        .ios-btn-danger {
          width: 100%;
          padding: 16px;
          background: #FF3B30;
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(255, 59, 48, 0.3);
          transition: transform 0.15s;
        }
        .ios-btn-danger:active {
          transform: scale(0.97);
        }
      </style>
      <div class="page ios-page">
        <div class="ios-nav">
          <h1 class="ios-nav-title">Profil Saya</h1>
        </div>

        <div class="profile-card">
          <div class="profile-avatar">${initials}</div>
          <div class="profile-name">${guru.nama || 'Nama Guru'}</div>
          <div class="profile-role">Guru</div>
        </div>

        <div class="info-list">
          <div class="info-item">
            <div class="info-icon">
              <span class="material-icons-outlined">badge</span>
            </div>
            <div class="info-content">
              <div class="info-label">NIP</div>
              <div class="info-value">${guru.nip || '-'}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <span class="material-icons-outlined">email</span>
            </div>
            <div class="info-content">
              <div class="info-label">Email</div>
              <div class="info-value">${guru.email || '-'}</div>
            </div>
          </div>
        </div>

        <div class="logout-btn-container">
          <button class="ios-btn-danger" onclick="window.APP_DATA.logout()">
            <span class="material-icons-outlined">logout</span> Logout
          </button>
        </div>

        ${window.Components.bottomNavGuru('profil')}
      </div>
    `;
    
    window.Components.renderPage(html);
  }

  window.Router.register('/guru/profil', render);
})();
