import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure directory exists
async function ensureDir(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function saveFile(file: File): Promise<{ url: string; size: number; mimeType: string; originalName: string; filename: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  
  const targetDir = path.join(UPLOADS_DIR, year, month);
  await ensureDir(targetDir);

  const ext = path.extname(file.name) || "";
  const randomName = crypto.randomBytes(16).toString("hex");
  const filename = `${randomName}${ext}`;
  const filepath = path.join(targetDir, filename);

  // If it's an image (and not svg), we can optimize it or just save it
  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
    // Save original but maybe optimized or webp
    // For simplicity, we just save original
    await fs.writeFile(filepath, buffer);
    
    // Create thumbnail
    const thumbFilename = `${randomName}-thumb.webp`;
    const thumbFilepath = path.join(targetDir, thumbFilename);
    try {
      await sharp(buffer)
        .resize(300, 300, { fit: "cover" })
        .webp({ quality: 80 })
        .toFile(thumbFilepath);
    } catch (e) {
      console.error("Failed to generate thumbnail:", e);
    }
  } else {
    // Non image file or SVG
    await fs.writeFile(filepath, buffer);
  }

  const url = `/uploads/${year}/${month}/${filename}`;
  
  return {
    url,
    size: file.size,
    mimeType: file.type,
    originalName: file.name,
    filename,
  };
}

export async function deleteFileFromDisk(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const relativePath = url.replace("/uploads/", "");
  const absolutePath = path.join(UPLOADS_DIR, relativePath);
  try {
    await fs.unlink(absolutePath);
    // Try to delete thumbnail if exists
    const ext = path.extname(absolutePath);
    const thumbPath = absolutePath.replace(ext, "-thumb.webp");
    await fs.unlink(thumbPath).catch(() => {});
  } catch (e) {
    console.error("Failed to delete file:", absolutePath, e);
  }
}
