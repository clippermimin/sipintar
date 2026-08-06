const SUPABASE_URL = 'https://aneiasgayibrfqewtsol.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZWlhc2dheWlicmZxZXd0c29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjIwODUsImV4cCI6MjEwMDUzODA4NX0.xKuyrRhztpF0Me3PZdlgEoy3EtUuFfcS60WQ33mVqgM';

async function fetchSiswa() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/siswa?select=id,nama&limit=2`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  console.log(await res.json());
}
fetchSiswa();
