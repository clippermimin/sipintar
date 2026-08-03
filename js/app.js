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
});
