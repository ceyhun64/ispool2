// lib/upload.ts
export async function uploadFile(
  file: File,
  folderName: string = "genel",
): Promise<{ path: string; resourceType: string }> {
  const isVideo = file.type.startsWith("video/");

  // İmzayı sunucudan al
  const sigRes = await fetch("/api/upload/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folderName }),
  });

  if (!sigRes.ok) throw new Error("İmza alınamadı");

  const { timestamp, signature, folder, apiKey, cloudName } =
    await sigRes.json();

  // Direkt Cloudinary'e yükle
  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("api_key", apiKey);
  formData.append("folder", folder);
  if (!isVideo) {
    formData.append("format", "webp");
  }

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "image"}/upload`,
    { method: "POST", body: formData },
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Cloudinary yükleme hatası");
  }

  const data = await uploadRes.json();
  return {
    path: data.secure_url,
    resourceType: isVideo ? "video" : "image",
  };
}
