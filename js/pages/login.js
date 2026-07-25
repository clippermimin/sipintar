(function() {
  function render() {
    const html = `
      <div class="page login-page">
        <div class="login-container">
          <div class="login-logo">
            <h1 style="font-size: 48px; margin-bottom: 16px;">🎓</h1>
            <h1>SIPINTER</h1>
            <p>Sistem Informasi Guru Piket & Presensi Digital</p>
          </div>
          
          <div class="login-card">
            <div class="demo-roles">
              <div class="demo-role-card" id="role-admin">
                <span class="role-emoji">👨‍💼</span>
                <span class="role-name">Admin</span>
              </div>
              <div class="demo-role-card" id="role-guru">
                <span class="role-emoji">👨‍🏫</span>
                <span class="role-name">Guru</span>
              </div>
              <div class="demo-role-card" id="role-kepsek">
                <span class="role-emoji">👔</span>
                <span class="role-name">Kepsek</span>
              </div>
            </div>
            
            <div class="login-divider">atau masuk dengan akun</div>
            
            <form id="login-form">
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" placeholder="Masukkan email anda" value="budi@sipinter.id" required>
              </div>
              <div class="form-group mb-4">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" placeholder="Masukkan password" value="password123" required>
              </div>
              
              <button type="submit" class="btn btn-primary btn-full btn-lg">Masuk</button>
            </form>
          </div>
          
          ${Components.footer()}
        </div>
      </div>
    `;
    
    Components.renderPage(html);
    setTimeout(bindEvents, 200);
  }
  
  function handleLogin(role) {
    Components.showLoading('Memverifikasi...');
    
    setTimeout(() => {
      Components.hideLoading();
      
      APP_STATE.role = role;
      
      if (role === 'guru') {
        APP_STATE.currentGuru = APP_DATA.getGuruById('guru-1');
        Router.navigate('/guru/dashboard');
      } else if (role === 'admin') {
        Router.navigate('/admin/dashboard');
      } else if (role === 'kepsek') {
        Router.navigate('/kepsek/dashboard');
      }
      
      Components.toast(`Berhasil masuk sebagai ${role}`);
    }, 800);
  }
  
  function bindEvents() {
    document.getElementById('role-admin').addEventListener('click', () => handleLogin('admin'));
    document.getElementById('role-guru').addEventListener('click', () => handleLogin('guru'));
    document.getElementById('role-kepsek').addEventListener('click', () => handleLogin('kepsek'));
    
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin('guru');
    });
  }
  
  Router.register('/login', render);
})();
