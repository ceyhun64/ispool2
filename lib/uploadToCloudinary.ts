// lib/uploadToCloudinary.ts

const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
];

/**
 * Dosyayı önce /api/cloudinary-signature'dan imza alarak
 * direkt Cloudinary'ye yükler. Vercel body limitini bypass eder.
 */
export async function uploadFileToCloudinary(
  file: File,
  folder = "products",
): Promise<string> {
  const isVideo = VIDEO_TYPES.includes(file.type);

  // 1. Sunucudan imzalı upload parametrelerini al
  const sigRes = await fetch("/api/cloudinary-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      folder,
      resource_type: isVideo ? "video" : "image",
    }),
  });

  if (!sigRes.ok) {
    throw new Error("Upload imzası alınamadı");
  }

  const {
    signature,
    timestamp,
    api_key,
    cloud_name,
    folder: signedFolder,
    format,
  } = await sigRes.json();

  // 2. Cloudinary'ye direkt yükle
  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", api_key);
  formData.append("folder", signedFolder);
  if (format) formData.append("format", format);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/${isVideo ? "video" : "image"}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json();
    throw new Error(err.error?.message || "Cloudinary yükleme başarısız");
  }

  const data = await uploadRes.json();
  return data.secure_url as string;
}
