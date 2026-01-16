// app/api/banner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const banners = await prisma.banner.findMany();
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
    // Eğer veritabanında zaten bir banner varsa yeni eklemeyi engelle
    const existing = await prisma.banner.findFirst();
    if (existing) {
      return NextResponse.json(
        {
          message:
            "Sadece bir adet banner olabilir. Mevcut banner silinmeden yenisi eklenemez.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, subtitle } = body;

    if (!title || !subtitle) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
      },
    });

    return NextResponse.json({ banner });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Banner ekleme hatası." },
      { status: 500 }
    );
  }
}
