// /app/api/category/[id]/[midId]/[subId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; midId: string; subId: string }> },
) {
  try {
    const { id, midId, subId } = await context.params;

    const subCategory = await prisma.subCategory.findFirst({
      where: {
        id: Number(subId),
        middleCategoryId: Number(midId),
      },
      include: {
        middleCategory: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!subCategory) {
      return NextResponse.json(
        { error: "Alt kategori bulunamadı" },
        { status: 404 },
      );
    }

    // Response formatını düzenle
    const response = {
      id: subCategory.id,
      name: subCategory.name,
      middleCategoryId: subCategory.middleCategoryId,
      middleCategoryName: subCategory.middleCategory.name,
      categoryId: subCategory.middleCategory.categoryId,
      categoryName: subCategory.middleCategory.category.name,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Alt kategori çekilirken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
