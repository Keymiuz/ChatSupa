import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`
    Missing Supabase environment variables. 
    Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in .env
    Current values:
    VITE_SUPABASE_URL: ${supabaseUrl}
    VITE_SUPABASE_ANON_KEY: ${supabaseKey}
  `);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
