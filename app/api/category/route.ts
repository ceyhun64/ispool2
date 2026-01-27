import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // 1. Kategori hiyerarşisini (Nested) ve Markaları paralel olarak getiriyoruz
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        include: {
          middleCategories: {
            include: {
              subCategories: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.brand.findMany({
        orderBy: {
          name: "asc", // Markaları da alfabetik getiriyoruz
        },
      }),
    ]);

    // 2. İki veriyi tek bir JSON objesi içinde döndürüyoruz
    return NextResponse.json({
      categories,
      brands,
    });
  } catch (error: any) {
    console.error("Veriler getirilirken hata:", error);
    return NextResponse.json({ error: "Veriler yüklenemedi" }, { status: 500 });
  }
}
