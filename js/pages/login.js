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
                <label class="form-label">NIP (Nomor Induk Pegawai)</label>
                <input type="text" id="login-nip" class="form-input" placeholder="Masukkan NIP anda" required>
              </div>
              <div class="form-group mb-4">
                <label class="form-label">Password</label>
                <input type="password" id="login-password" class="form-input" placeholder="Masukkan password (default: NIP)" required>
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
            <p style="font-size: 11px; text-align: center; color: #888; margin-top: 8px;">*NIP admin akan di-append @sipintar.com di balik layar</p>
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
      const nip = document.getElementById('login-nip').value.trim();
      const password = document.getElementById('login-password').value;
      const email = `${nip}@sipintar.com`;
      
      const { error } = await window.supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // On success, the onAuthStateChange in supabase.js will handle profile loading and redirect
      Components.toast('Login berhasil, memuat profil...');
    } catch (error) {
      Components.hideLoading();
      let errMsg = error.message;
      if (errMsg.includes('Invalid login credentials')) {
        errMsg = 'NIP atau Password salah';
      }
      window.Components.toast(errMsg, 'error');
    }
  }
  
  function bindEvents() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    const setLogin = (nip, password) => {
      document.getElementById('login-nip').value = nip;
      document.getElementById('login-password').value = password;
      document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true }));
    };
    
    // Asumsikan NIP admin demo adalah 'admin123'
    document.getElementById('role-guru').addEventListener('click', () => setLogin('123456', '123456'));
    document.getElementById('role-admin').addEventListener('click', () => setLogin('admin123', 'admin123'));
  }
  
  Router.register('/login', render);
})();
