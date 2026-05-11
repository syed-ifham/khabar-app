// Import modern ESM modules
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config'; // This automatically loads your .env file

// 1. Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables!");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'secure-uploads'; // Change this to your actual bucket name

// Helper: Guess Content-Type from extension
function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.webp': return 'image/webp';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

// 2. Function to upload a single file
async function uploadSingleFile(localFilePath, destinationPath) {
  try {
    console.log(`Reading local file: ${localFilePath}...`);

    // Read the file into a Buffer
    const fileBuffer = await fs.readFile(localFilePath);
    const fileName = path.basename(localFilePath);
    const contentType = getContentType(fileName);

    console.log(`Uploading ${fileName} to Supabase...`);

    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(destinationPath, fileBuffer, {
        contentType: contentType,
        upsert: true // Overwrite if a file with this name already exists
      });

    if (error) throw error;
    console.log(`✅ Successfully uploaded: ${destinationPath}`);

  } catch (error) {
    console.error(`❌ Failed to upload ${localFilePath}:`, error.message);
  }
}

// 3. Function to upload an entire folder (Bulk Upload)
async function uploadFolder(localFolderPath, destinationFolderPrefix = 'bulk-uploads') {
  try {
    // Read all files in the directory
    const files = await fs.readdir(localFolderPath);

    for (const file of files) {
      const localFilePath = path.join(localFolderPath, file);

      // Ensure we are only uploading files, not sub-directories
      const stats = await fs.stat(localFilePath);
      if (stats.isFile()) {
        const destinationPath = `${destinationFolderPrefix}/${file}`;

        // Upload sequentially
        await uploadSingleFile(localFilePath, destinationPath);
      }
    }

    console.log("🎉 Folder upload complete!");

  } catch (error) {
    console.error("❌ Error reading directory:", error.message);
  }
}



// To test a single file upload:
// await uploadSingleFile('./test-image.png', 'profile-pictures/test-image.png');

// To test a bulk folder upload:
// await uploadFolder('./my-images', 'ngo-campaign-assets');