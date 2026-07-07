// app/api/hero-slides/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const tag = formData.get("tag") as string | null;
    const title = formData.get("title") as string | null;
    const subtitle = formData.get("subtitle") as string | null;
    const description = formData.get("description") as string | null;
    const desktopImage = formData.get("desktopImage") as File | null;
    const order = parseInt(formData.get("order") as string) || 0;

    // Resim zorunlu kontrolü
    if (!desktopImage) {
      return NextResponse.json(
        { message: "Resim zorunludur." },
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

    // Hero slide oluştur
    const slide = await prisma.heroSlide.create({
      data: {
        tag: tag || null,
        title: title || null,
        subtitle: subtitle || null,
        description: description || null,
        desktopImage: imageUrl, // Schema'da String türünde
        mobileImage: null, // Schema'da String? türünde - opsiyonel
        order,
        isActive: true, // Default true zaten ama explicit belirtiyoruz
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
