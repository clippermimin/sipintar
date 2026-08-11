// Global Application State
window.APP_STATE = {
  role: null,          // 'guru', 'admin', 'kepsek'
  currentGuru: null,   // guru object for logged-in guru
  presensiDone: true,  // demo: guru already did presensi
};

// History API Router
window.Router = {
  routes: {},
  
  register(path, renderFn) {
    this.routes[path] = renderFn;
  },
  
  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  },
  
  handleRoute() {
    const path = this.getCurrentPath();
    const renderFn = this.routes[path];
    if (renderFn) {
      renderFn();
    } else {
      // Try to find a matching route (fallback)
      this.navigate('/login');
    }
  },
  
  getCurrentPath() {
    // Graceful upgrade for old hash URLs
    if (window.location.hash.startsWith('#/')) {
      const newPath = window.location.hash.slice(1);
      window.history.replaceState({}, '', newPath);
      return newPath;
    }
    const path = window.location.pathname;
    return path === '/' ? '/login' : path;
  },
  
  init() {
    window.addEventListener('popstate', () => this.handleRoute());
    // Initial route
    this.handleRoute();
  }
};

// AFK (Away From Keyboard) Manager
window.AFKManager = {
  timeout: null,
  timeoutMs: 15 * 60 * 1000, // 15 minutes

  init() {
    this.resetTimer = this.resetTimer.bind(this);
    this.logout = this.logout.bind(this);
    
    // Listen to various activity events
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, this.resetTimer));
    
    this.resetTimer();
  },

  resetTimer() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(this.logout, this.timeoutMs);
  },

  logout() {
    // Only logout if the user is actually logged in and not on login page
    const currentPath = window.Router.getCurrentPath();
    if (window.APP_STATE.role && currentPath !== '/login') {
      window.Components?.toast('Anda telah otomatis keluar karena tidak ada aktivitas (AFK)', 'warning');
      if (window.APP_DATA && window.APP_DATA.logout) {
        window.APP_DATA.logout();
      } else {
        window.APP_STATE.role = null;
        window.APP_STATE.currentGuru = null;
        window.Router.navigate('/login');
      }
    } else {
      // Just keep resetting if they are on the login page anyway
      this.resetTimer();
    }
  }
};

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', async () => {
  try {
    if (window.checkAuth) {
      await window.checkAuth();
    }
  } catch (err) {
    console.error("Auth check failed:", err);
  }

  // Hide initial loading
  const initialLoading = document.getElementById('initial-loading');
  if (initialLoading) {
    setTimeout(() => {
      initialLoading.style.opacity = '0';
      setTimeout(() => initialLoading.remove(), 300);
    }, 500);
  }
  
  Router.init();
  window.AFKManager.init();
});
