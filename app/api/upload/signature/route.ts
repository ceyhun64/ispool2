// app/api/upload/signature/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { folderName, isVideo } = await req.json();

    const folder =
      (folderName || "genel")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_/]/g, "") || "genel";

    const timestamp = Math.round(new Date().getTime() / 1000);

    // İmzaya dahil edilecek parametreler — upload'da gönderileceklerle BİREBİR aynı olmalı
    const paramsToSign: Record<string, any> = { timestamp, folder };
    if (!isVideo) {
      paramsToSign.format = "webp";
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.API_SECRET!,
    );

    return NextResponse.json({
      timestamp,
      signature,
      folder,
      apiKey: process.env.API_KEY,
      cloudName: process.env.CLOUD_NAME,
    });
  } catch (err) {
    console.error("Signature error:", err);
    return NextResponse.json({ error: "İmza oluşturulamadı" }, { status: 500 });
  }
}
