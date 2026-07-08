// app/api/cloudinary-signature/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(req: NextRequest) {
  // Yalnızca admin panelinden (ürün/marka görselleri) doğrudan Cloudinary'ye
  // yükleme yapmak için kullanılır.
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { folder, resource_type } = await req.json();

    const timestamp = Math.round(new Date().getTime() / 1000);

    const params: Record<string, any> = {
      timestamp,
      folder: `products/${folder || "genel"}`,
    };

    // Görsel ise webp formatına çevir
    if (resource_type !== "video") {
      params.format = "webp";
    }

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.API_SECRET!,
    );

    return NextResponse.json({
      signature,
      timestamp,
      api_key: process.env.API_KEY,
      cloud_name: process.env.CLOUD_NAME,
      folder: params.folder,
      format: params.format,
    });
  } catch (err: any) {
    console.error("Cloudinary imza hatası:", err);
    return NextResponse.json({ error: "İmza oluşturulamadı" }, { status: 500 });
  }
}