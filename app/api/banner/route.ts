// app/api/banner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

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
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title || !subtitle) {
      return NextResponse.json(
        { message: "Başlık ve açıklama zorunludur." },
        { status: 400 },
      );
    }

    let imagePath: string | null = null;

    // Resim yüklemesi varsa
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Benzersiz dosya adı oluştur
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `banner-${uniqueSuffix}${path.extname(imageFile.name)}`;

      // Public klasörüne kaydet
      const filepath = path.join(
        process.cwd(),
        "public/uploads/banners",
        filename,
      );
      await writeFile(filepath, buffer);

      imagePath = `/uploads/banners/${filename}`;
    }

    // Eski banner'ları pasif yap
    await prisma.banner.updateMany({
      data: { isActive: false },
    });

    // Yeni banner oluştur
    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image: imagePath,
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
