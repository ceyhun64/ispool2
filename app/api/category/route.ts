// app/api/category/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ======================================================
// GET /api/category
// ======================================================
export async function GET() {
  try {
    // Kategori hiyerarşisini ve Markaları paralel olarak getir
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        include: {
          middleCategories: {
            include: {
              subCategories: true,
            },
            orderBy: {
              name: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.brand.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    // Kategorileri formatlayalım
    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      middleCategories: cat.middleCategories.map((mid) => ({
        id: mid.id,
        name: mid.name,
        categoryId: mid.categoryId,
        subCategories: mid.subCategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
          middleCategoryId: sub.middleCategoryId,
        })),
      })),
    }));

    // Markaları formatlayalım
    const formattedBrands = brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      image: brand.image,
    }));

    return NextResponse.json(
      {
        success: true,
        categories: formattedCategories,
        brands: formattedBrands,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Category fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Veriler yüklenemedi",
      },
      { status: 500 },
    );
  }
}
