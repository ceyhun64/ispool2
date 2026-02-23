// app/api/hero-slides/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/server-upload";
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
  if (!session || !session.user?.id) {
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

    if (!desktopImage) {
      return NextResponse.json(
        { message: "Resim zorunludur." },
        { status: 400 },
      );
    }

    const imageUrl = await uploadToCloudinary(desktopImage, "hero_slides");

    const slide = await prisma.heroSlide.create({
      data: {
        tag: tag || null,
        title: title || null,
        subtitle: subtitle || null,
        description: description || null,
        desktopImage: imageUrl,
        mobileImage: null,
        order,
        isActive: true,
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
