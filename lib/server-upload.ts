// lib/server-upload.ts
// Sunucu tarafı API route'larında kullanılır.
// Dosyayı doğrudan Cloudinary'e stream eder — Vercel body limit'i bypass edilir.
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
];

export async function uploadToCloudinary(
  file: File,
  folderName: string = "genel",
): Promise<string> {
  const isVideo = VIDEO_TYPES.includes(file.type);

  const folder = `products/${
    (folderName || "genel")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "") || "genel"
  }`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? "video" : "image",
        ...(!isVideo && {
          format: "webp",
          transformation: [{ quality: "auto:good" }],
        }),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });

  return result.secure_url as string;
}
