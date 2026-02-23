// lib/upload.ts — client-side Cloudinary upload
export async function uploadFileToCloudinary(
  file: File,
  folderName: string = "genel",
): Promise<string> {
  const isVideo = file.type.startsWith("video/");

  // 1. Sunucudan imza al — isVideo bilgisini de gönder
  const sigRes = await fetch("/api/upload/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folderName, isVideo }),
  });
  if (!sigRes.ok) throw new Error("İmza alınamadı");

  const { timestamp, signature, folder, apiKey, cloudName } =
    await sigRes.json();

  // 2. Upload parametreleri — imzadakilerle BİREBİR aynı olmalı
  const fd = new FormData();
  fd.append("file", file);
  fd.append("timestamp", String(timestamp));
  fd.append("signature", signature);
  fd.append("api_key", apiKey);
  fd.append("folder", folder);
  if (!isVideo) fd.append("format", "webp");

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "image"}/upload`,
    { method: "POST", body: fd },
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Cloudinary yükleme hatası");
  }

  const data = await uploadRes.json();
  return data.secure_url as string;
}
