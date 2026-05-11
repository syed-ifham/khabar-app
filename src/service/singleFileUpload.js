import fs from 'fs/promises';
import path from 'path';

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

export async function uploadSingleFile(supabase, localFilePath, destinationPath, bucketName) {
  try {
    console.log(`Reading local file: ${localFilePath}...`);

    const fileBuffer = await fs.readFile(localFilePath);
    const fileName = path.basename(localFilePath);
    const contentType = getContentType(fileName);

    console.log(`Uploading ${fileName} to Supabase...`);

    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(destinationPath, fileBuffer, {
        contentType: contentType,
        upsert: true
      });

    if (error) throw error;
    console.log(`✅ Successfully uploaded: ${destinationPath}`);

  } catch (error) {
    console.error(`❌ Failed to upload ${localFilePath}:`, error.message);
  }
}
