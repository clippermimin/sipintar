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
                <label class="form-label">Username</label>
                <input type="text" id="login-nip" class="form-input" placeholder="silahkan masukan username anda" required>
              </div>
              <div class="form-group mb-4">
                <label class="form-label">Password</label>
                <div style="position: relative;">
                  <input type="password" id="login-password" class="form-input" placeholder="Masukkan password" required style="padding-right: 40px;">
                  <button type="button" id="toggle-password" style="position: absolute; right: 12px; top: 10px; background: none; border: none; cursor: pointer; color: #666; display: flex; padding: 0;">
                    <span class="material-icons-outlined" id="toggle-password-icon" style="font-size: 20px;">visibility_off</span>
                  </button>
                </div>
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
        errMsg = 'Username atau Password salah';
      }
      window.Components.toast(errMsg, 'error');
    }
  }
  
  function bindEvents() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    document.getElementById('toggle-password').addEventListener('click', () => {
      const pwdInput = document.getElementById('login-password');
      const icon = document.getElementById('toggle-password-icon');
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        icon.innerText = 'visibility';
      } else {
        pwdInput.type = 'password';
        icon.innerText = 'visibility_off';
      }
    });
  }
  
  Router.register('/login', render);
})();
