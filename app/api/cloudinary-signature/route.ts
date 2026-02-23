// app/api/cloudinary-signature/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(req: NextRequest) {
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}