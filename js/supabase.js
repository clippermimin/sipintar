const SUPABASE_URL = 'https://aneiasgayibrfqewtsol.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZWlhc2dheWlicmZxZXd0c29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjIwODUsImV4cCI6MjEwMDUzODA4NX0.xKuyrRhztpF0Me3PZdlgEoy3EtUuFfcS60WQ33mVqgM';

// Initialize Supabase Client
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Listen to auth state changes
window.supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // When signed in, we could load the user profile
    console.log('User signed in:', session.user.email);
  } else if (event === 'SIGNED_OUT') {
    window.APP_STATE.role = null;
    window.APP_STATE.currentGuru = null;
    window.Router.navigate('/login');
  }
});
