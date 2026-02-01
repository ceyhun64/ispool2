// /app/api/category/[id]/[midId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; midId: string }> }
) {
  try {
    const { id, midId } = await context.params;

    const middleCategory = await prisma.middleCategory.findFirst({
      where: {
        id: Number(midId),
        categoryId: Number(id),
      },
      include: {
        category: true,
        subCategories: true,
      },
    });

    if (!middleCategory) {
      return NextResponse.json(
        { error: "Orta kategori bulunamadı" },
        { status: 404 }
      );
    }

    // Response formatını düzenle
    const response = {
      id: middleCategory.id,
      name: middleCategory.name,
      categoryId: middleCategory.categoryId,
      categoryName: middleCategory.category.name,
      subCategories: middleCategory.subCategories,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Orta kategori çekilirken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}