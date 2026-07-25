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
  
  async function handleLogin(e) {
    e.preventDefault();
    Components.showLoading('Memverifikasi...');
    
    try {
      const email = document.querySelector('#login-form input[type="email"]').value;
      const password = document.querySelector('#login-form input[type="password"]').value;
      
      const profile = await window.APP_DATA.login(email, password);
      
      Components.hideLoading();
      
      window.APP_STATE.role = profile.role;
      window.APP_STATE.currentGuru = profile;
      
      if (profile.role === 'guru') {
        Router.navigate('/guru/dashboard');
      } else if (profile.role === 'admin') {
        Router.navigate('/admin/dashboard');
      } else if (profile.role === 'kepsek') {
        Router.navigate('/kepsek/dashboard');
      }
      
      Components.toast(`Berhasil masuk sebagai ${profile.role}`);
    } catch (error) {
      Components.hideLoading();
      window.Components.toast(error.message, 'error');
    }
  }
  
  function bindEvents() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
  }
  
  Router.register('/login', render);
})();
