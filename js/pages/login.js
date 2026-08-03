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
                <input type="email" class="form-input" placeholder="Masukkan email anda" required>
              </div>
              <div class="form-group mb-4">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" placeholder="Masukkan password" required>
              </div>
              
              <button type="submit" class="btn btn-primary btn-full btn-lg">Masuk</button>
            </form>
          </div>
          
          <div class="login-demo-roles">
            <p class="demo-title">Login Cepat (Akun Demo):</p>
            <div class="demo-roles">
              <div class="demo-role-card" id="role-guru">
                <span class="role-emoji">👨‍🏫</span>
                <span class="role-name">Guru/Piket</span>
              </div>
              <div class="demo-role-card" id="role-admin">
                <span class="role-emoji">👨‍💼</span>
                <span class="role-name">Admin</span>
              </div>
            </div>
            <p style="font-size: 11px; text-align: center; color: #888; margin-top: 8px;">*Pastikan kamu sudah mendaftarkan email ini di Supabase Auth</p>
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
      
      const { error } = await window.supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // On success, the onAuthStateChange in supabase.js will handle profile loading and redirect
      Components.toast('Login berhasil, memuat profil...');
    } catch (error) {
      Components.hideLoading();
      window.Components.toast(error.message, 'error');
    }
  }
  
  function bindEvents() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    const setLogin = (email) => {
      document.querySelector('#login-form input[type="email"]').value = email;
      document.querySelector('#login-form input[type="password"]').value = 'password123';
      document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true }));
    };
    
    document.getElementById('role-guru').addEventListener('click', () => setLogin('budi@sipinter.id'));
    document.getElementById('role-admin').addEventListener('click', () => setLogin('admin@sipinter.id'));
  }
  
  Router.register('/login', render);
})();
