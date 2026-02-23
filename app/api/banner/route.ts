// app/api/banner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/server-upload";
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
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const subtitle = formData.get("subtitle") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { message: "Resim zorunludur." },
        { status: 400 },
      );
    }

    const imagePath = await uploadToCloudinary(imageFile, "banners");

    await prisma.banner.updateMany({
      data: { isActive: false },
    });

    const banner = await prisma.banner.create({
      data: {
        title: title || null,
        subtitle: subtitle || null,
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
