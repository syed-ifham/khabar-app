import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { uploadSingleFile } from './service/singleFileUpload.js';
import { uploadFolder } from './service/bulkUpload.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables!");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'khabarApp';

// To test a single file upload:
// await uploadSingleFile(supabase, './test/ss1.png', 'screenshots/ss1.png', BUCKET_NAME);

// To test a bulk folder upload:
await uploadFolder(supabase, './test', BUCKET_NAME, 'test');