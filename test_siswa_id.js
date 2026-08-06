require('dotenv').config({ path: '/Users/agung5s7/Desktop/SIPINTAR/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://fake.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "fake";
console.log("Found URL?", supabaseUrl ? "yes" : "no");
