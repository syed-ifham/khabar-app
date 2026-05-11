import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing keys. Check your .env file!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log("Testing connection to Supabase...");

  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error("❌ Connection Failed!");
    console.error("Reason:", error.message);
  } else {
    console.log("✅ Connection Successful!");
    console.log("--------------------------------");
    console.log("Buckets found in your project:");

    if (data.length === 0) {
      console.log(" - (No buckets exist yet)");
    } else {
      data.forEach(bucket => {
        console.log(` - ${bucket.name} (Public: ${bucket.public})`);
      });
    }
    console.log("--------------------------------");
    console.log("You are ready to start uploading!");
  }
}

// Run the test
testSupabase();