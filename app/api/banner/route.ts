// app/api/banner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ banners });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Banner alınamadı." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const subtitle = formData.get("subtitle") as string | null;
    const imageFile = formData.get("image") as File | null;

    // Resim zorunlu kontrolü
    if (!imageFile) {
      return NextResponse.json(
        { message: "Resim zorunludur." },
        { status: 400 },
      );
    }

    // Resim yükleme
    const { path: imagePath } = await uploadToCloudinary(
      imageFile,
      "banners",
    );

    // Eski banner'ları pasif yap
    await prisma.banner.updateMany({
      data: { isActive: false },
    });

    // Yeni banner oluştur
    const banner = await prisma.banner.create({
      data: {
        title: title || null,
        subtitle: subtitle || null,
        image: imagePath, // Schema'da String türünde
        isActive: true,
      },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Banner ekleme hatası." },
      { status: 500 },
    );
  }
}
