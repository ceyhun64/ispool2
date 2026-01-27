// /app/api/category/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    // Kategoriyi ID'ye göre çek (middleCategories ve subCategories ile birlikte)
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        middleCategories: {
          include: {
            subCategories: true,
          },
        },
      },
    });

    // Kategori bulunamadıysa 404 döndür
    if (!category) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 },
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error: any) {
    console.error("Kategori çekilirken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}