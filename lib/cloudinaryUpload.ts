// lib/cloudinaryUpload.ts
// Cloudinary yükleme mantığı — hem /api/upload route'u (tarayıcıdan doğrudan
// çağrılır) hem de diğer route handler'lar (banner/hero-slides/showcase/blog/
// cart) tarafından sunucu içinden doğrudan çağrılır. Böylece bu route'lar
// kendi kendilerine HTTP fetch atmak zorunda kalmaz — bu, apex domain'in
// www'ye yönlendirdiği ortamlarda çok parçalı (multipart) gövdenin
// bozulmasına yol açıyordu.
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
];

export class UploadError extends Error {}

export async function uploadToCloudinary(
  file: File,
  folderNameInput: string,
): Promise<{ path: string; resourceType: "image" | "video" }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError("Dosya boyutu 25MB'dan büyük olamaz.");
  }

  const folderName =
    (folderNameInput || "genel")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "") || "genel";

  const isVideo = VIDEO_TYPES.includes(file.type);
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `products/${folderName}`,
        resource_type: isVideo ? "video" : "image",
        ...(isVideo && {
          chunk_size: 6000000, // 6MB chunk
        }),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });

  return {
    path: uploadResult.secure_url,
    resourceType: isVideo ? "video" : "image",
  };
}
