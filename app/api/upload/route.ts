// /api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isInternalRequest } from "@/lib/internalAuth";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

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
  // Doğrudan tarayıcıdan gelen isteklerde oturum, diğer route handler'ların
  // (banner/blog/hero-slides/cart) sunucu içi çağrılarında internal secret
  // aranır — her iki durumda da çağıran taraf zaten kendi yetki kontrolünü
  // yapmış olmalıdır.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id && !isInternalRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu 25MB'dan büyük olamaz." },
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
      { error: "Yükleme başarısız" },
      { status: 500 },
    );
  }
}
