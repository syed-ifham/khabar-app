import fs from 'fs/promises';
import path from 'path';
import { uploadSingleFile } from './singleFileUpload.js';

export async function uploadFolder(supabase, localFolderPath, bucketName, destinationFolderPrefix = 'bulk-uploads') {
  try {
    const files = await fs.readdir(localFolderPath);

    for (const file of files) {
      const localFilePath = path.join(localFolderPath, file);

      const stats = await fs.stat(localFilePath);
      if (stats.isFile()) {
        const destinationPath = `${destinationFolderPrefix}/${file}`;

        await uploadSingleFile(supabase, localFilePath, destinationPath, bucketName);
      }
    }

    console.log("🎉 Folder upload complete!");

  } catch (error) {
    console.error("❌ Error reading directory:", error.message);
  }
}
