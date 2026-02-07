import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

// GET - Tüm slide'ları getir
export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ slides });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Slide'lar alınamadı." },
      { status: 500 },
    );
  }
}

// POST - Yeni slide ekle
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const tag = formData.get("tag") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const description = formData.get("description") as string;
    const desktopImage = formData.get("desktopImage") as File;
    const order = parseInt(formData.get("order") as string) || 0;

    if (!tag || !title || !subtitle || !description || !desktopImage) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur." },
        { status: 400 },
      );
    }

    // Resim upload işlemi
    const uploadFormData = new FormData();
    uploadFormData.append("file", desktopImage);
    uploadFormData.append("folderName", "hero_slides");

    const uploadRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        body: uploadFormData,
      },
    );

    if (!uploadRes.ok) {
      throw new Error("Resim yüklenemedi");
    }

    const { path: imageUrl } = await uploadRes.json();

    const slide = await prisma.heroSlide.create({
      data: {
        tag,
        title,
        subtitle,
        description,
        desktopImage: imageUrl,
        order,
      },
    });

    return NextResponse.json({ slide });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Slide ekleme hatası." },
      { status: 500 },
    );
  }
}
