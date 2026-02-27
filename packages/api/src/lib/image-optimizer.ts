import { exec } from "child_process";
import { promisify } from "util";
import { readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

const execAsync = promisify(exec);

/**
 * Supported image formats for optimization
 */
export const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

/**
 * Convert image to WebP format with compression
 * Requires ImageMagick or cwebp to be installed
 */
export async function convertToWebP(
  buffer: Buffer,
  quality: number = 80,
): Promise<Buffer> {
  const tempInput = join(tmpdir(), `input-${Date.now()}.img`);
  const tempOutput = join(tmpdir(), `output-${Date.now()}.webp`);

  try {
    // Write input buffer to temp file
    await writeFile(tempInput, buffer);

    // Convert to WebP using ImageMagick
    // Falls back to original if conversion fails
    try {
      await execAsync(
        `convert "${tempInput}" -quality ${quality} -define webp:lossless=false "${tempOutput}"`,
      );
      const webpBuffer = await readFile(tempOutput);
      return webpBuffer;
    } catch (convertError) {
      console.warn("WebP conversion failed, using original:", convertError);
      return buffer;
    }
  } finally {
    // Cleanup temp files
    try {
      await unlink(tempInput);
      await unlink(tempOutput).catch(() => {});
    } catch {}
  }
}

/**
 * Get optimal quality setting based on content type
 */
export function getOptimizedQuality(contentType: string): number {
  switch (contentType) {
    case "image/jpeg":
      return 85; // JPEG compresses well
    case "image/png":
      return 90; // PNG needs higher quality for transparency
    case "image/webp":
      return 80; // WebP can go lower
    default:
      return 85;
  }
}

/**
 * Generate multiple sizes for responsive images
 */
export async function generateResponsiveSizes(
  buffer: Buffer,
  contentType: string,
): Promise<{ size: number; buffer: Buffer }[]> {
  const sizes = [
    { width: 1920, quality: 85 }, // Full HD
    { width: 1280, quality: 85 }, // HD
    { width: 768, quality: 80 },  // Tablet
    { width: 480, quality: 75 },  // Mobile
  ];

  const results: { size: number; buffer: Buffer }[] = [];

  for (const sizeConfig of sizes) {
    try {
      const resizedBuffer = await resizeImage(buffer, sizeConfig.width, contentType);
      results.push({
        size: sizeConfig.width,
        buffer: resizedBuffer,
      });
    } catch (error) {
      console.warn(`Failed to generate ${sizeConfig.width}px version:`, error);
    }
  }

  // Always include original as fallback
  results.push({ size: 0, buffer });

  return results;
}

/**
 * Resize image to specific width
 */
async function resizeImage(
  buffer: Buffer,
  width: number,
  _contentType: string,
): Promise<Buffer> {
  const tempInput = join(tmpdir(), `resize-input-${Date.now()}.img`);
  const tempOutput = join(tmpdir(), `resize-output-${Date.now()}.img`);

  try {
    await writeFile(tempInput, buffer);

    await execAsync(
      `convert "${tempInput}" -resize ${width}x -quality 85 "${tempOutput}"`,
    );

    return await readFile(tempOutput);
  } finally {
    try {
      await unlink(tempInput);
      await unlink(tempOutput).catch(() => {});
    } catch {}
  }
}

/**
 * Simple write file utility (Node.js built-in)
 */
async function writeFile(path: string, data: Buffer): Promise<void> {
  const { writeFile } = await import("fs/promises");
  return writeFile(path, data);
}
