// /api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Video MIME türleri
const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderNameInput = formData.get("folderName") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadı. Lütfen bir dosya yükleyin." },
        { status: 400 },
      );
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
          // Video için ek ayarlar
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

    return NextResponse.json({
      path: uploadResult.secure_url,
      resourceType: isVideo ? "video" : "image",
    });
  } catch (err: any) {
    console.error("Dosya yükleme hatası:", err);
    return NextResponse.json(
      { error: err.message || "Yükleme başarısız" },
      { status: 500 },
    );
  }
}
