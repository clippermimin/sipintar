const SUPABASE_URL = 'https://aneiasgayibrfqewtsol.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZWlhc2dheWlicmZxZXd0c29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjIwODUsImV4cCI6MjEwMDUzODA4NX0.xKuyrRhztpF0Me3PZdlgEoy3EtUuFfcS60WQ33mVqgM';

window.supabaseUrl = SUPABASE_URL;
window.supabaseKey = SUPABASE_KEY;

// Initialize Supabase Client
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// We override window.supabase to use the client directly to avoid confusion
window.supabase = window.supabaseClient;

window.loadProfileAndRedirect = async function(userId) {
  const { data: profile, error } = await window.supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (profile) {
    window.APP_STATE.role = profile.role;
    window.APP_STATE.currentGuru = profile;
    return profile;
  }
  return null;
};

window.checkAuth = async function() {
  const { data: { session } } = await window.supabase.auth.getSession();
  if (session) {
    await window.loadProfileAndRedirect(session.user.id);
  }
  return session;
};

// Listen to auth state changes
window.supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    window.loadProfileAndRedirect(session.user.id).then(profile => {
      window.Components.hideLoading();
      if (profile) {
        const currentPath = window.Router.getCurrentPath();
        if (currentPath === '/login' || currentPath === '/') {
          if (profile.role === 'guru') window.Router.navigate('/guru/dashboard');
          else if (profile.role === 'admin') window.Router.navigate('/admin/dashboard');
        } else {
          window.Router.handleRoute();
        }
      } else {
        window.Components.toast('Profil belum didaftarkan di tabel profiles. Silakan tambahkan UID ke tabel profiles.', 'error');
        window.supabase.auth.signOut();
      }
    }).catch(err => {
      window.Components.hideLoading();
      console.error(err);
    });
  } else if (event === 'SIGNED_OUT') {
    window.APP_STATE.role = null;
    window.APP_STATE.currentGuru = null;
    window.Components.hideLoading();
    window.Router.navigate('/login');
  }
});
