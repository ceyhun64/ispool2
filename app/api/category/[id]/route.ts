// /app/api/category/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

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

    if (!category) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error: any) {
    console.error("Kategori çekilirken hata:", error);
    return NextResponse.json(
      { success: false, error: "Kategori alınamadı" },
      { status: 500 }
    );
  }
}