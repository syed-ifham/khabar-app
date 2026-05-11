import 'dotenv/config';

console.log("DEBUG: Current working directory:", process.cwd());
console.log("DEBUG: SUPABASE_URL =", process.env.SUPABASE_URL);
console.log("DEBUG: SUPABASE_SERVICE_KEY =", process.env.SUPABASE_SERVICE_KEY);
console.log("DEBUG: All env vars:", Object.keys(process.env).filter(key => key.includes('SUPABASE')));
