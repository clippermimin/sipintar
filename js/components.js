window.Components = {
  // Render page with transition
  renderPage(html) {
    const app = document.getElementById('app');
    app.style.opacity = '0';
    app.style.transform = 'translateY(8px)';
    setTimeout(() => {
      app.innerHTML = html;
      app.style.opacity = '1';
      app.style.transform = 'translateY(0)';
      window.scrollTo(0, 0);
    }, 150);
  },
  
  // Header component
  header(opts = {}) {
    // opts: { title, subtitle, back, backPath, notif, avatar, avatarText, hamburger }
    const backBtn = opts.back ? `<button class="header-icon-btn" onclick="Router.navigate('${opts.backPath || '/login'}')" aria-label="Back"><span class="material-icons-outlined">arrow_back</span></button>` : '';
    const hamburgerBtn = opts.hamburger ? `<button class="header-icon-btn" id="hamburger-btn" aria-label="Menu"><span class="material-icons-outlined">menu</span></button>` : '';
    const subtitle = opts.subtitle ? `<span class="header-subtitle">${opts.subtitle}</span>` : '';
    const notifBtn = opts.notif !== false ? `<button class="header-icon-btn" aria-label="Notifications"><span class="material-icons-outlined">notifications</span></button>` : '';
    const avatar = opts.avatar !== false ? `<div class="header-avatar">${opts.avatarText || 'BS'}</div>` : '';
    
    return `
      <header class="header">
        <div class="header-left">
          ${backBtn}${hamburgerBtn}
          <div>
            ${subtitle}
            <div class="header-title">${opts.title || 'SIPINTER'}</div>
          </div>
        </div>
        <div class="header-right">
          ${notifBtn}
          ${avatar}
          <button class="header-icon-btn" onclick="window.APP_STATE.role = null; window.APP_STATE.currentGuru = null; window.Router.navigate('/login')" title="Logout" style="color: #EA4335;"><span class="material-icons-outlined">logout</span></button>
        </div>
      </header>
    `;
  },
  
  // Bottom navigation for Guru
  bottomNavGuru(active = 'dashboard') {
    let items = [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/guru/dashboard' },
      { id: 'piket', icon: 'assignment', label: 'Piket', path: '/guru/piket' },
      { id: 'absensi', icon: 'person_search', label: 'Absensi', path: '/guru/presensi' },
      { id: 'profil', icon: 'account_circle', label: 'Profil', path: '/guru/profil' }
    ];
    
    return `
      <nav class="bottom-nav">
        ${items.map(item => `
          <a class="bottom-nav-item ${active === item.id ? 'active' : ''}" onclick="Router.navigate('${item.path}')" href="javascript:void(0)">
            <span class="material-icons-outlined">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
    `;
  },
  

  // Toast notification
  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="material-icons-outlined">${icon}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
  
  // Loading overlay
  showLoading(message = 'Memuat...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <p class="loading-text">${message}</p>
    `;
    document.body.appendChild(overlay);
  },
  
  hideLoading() {
    const overlays = document.querySelectorAll('.loading-overlay');
    overlays.forEach(overlay => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    });
  },
  
  // Footer
  footer() {
    return ``;
  },
  
  // Step indicator for multi-step forms
  stepIndicator(totalSteps, currentStep) {
    let dots = '';
    for (let i = 0; i < totalSteps; i++) {
      const cls = i === currentStep ? 'active' : i < currentStep ? 'completed' : '';
      dots += `<div class="step-dot ${cls}"></div>`;
    }
    return `<div class="step-indicator">${dots}</div>`;
  },
  
  // Section title with optional action
  sectionTitle(title, action = '', actionPath = '') {
    const actionHtml = action ? `<span class="action-link" onclick="Router.navigate('${actionPath}')">${action}</span>` : '';
    return `<div class="section-title">${title}${actionHtml}</div>`;
  }
};
