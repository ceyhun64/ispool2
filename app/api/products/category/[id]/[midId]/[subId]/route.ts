// /app/api/products/category/[id]/[midId]/[subId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface ProductData {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount?: number;
  description: string;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  subImage4?: string;
  category: string;
  middleCategory?: string;
  subCategory?: string;
  brandId?: number;
  createdAt: Date;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; midId: string; subId: string }> },
) {
  try {
    const { id, midId, subId } = await context.params;

    const products = await prisma.product.findMany({
      where: {
        categoryId: Number(id),
        middleCategoryId: Number(midId),
        subCategoryId: Number(subId),
      },
      include: {
        category: true,
        middleCategory: true,
        subCategory: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const productsData: ProductData[] = products.map((p) => {
      const product = p as typeof p & {
        category: { name: string };
        middleCategory: { name: string } | null;
        subCategory: { name: string } | null;
      };

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        oldPrice: product.oldPrice ?? undefined,
        discountPercentage: product.discountPercentage ?? undefined,
        rating: product.rating,
        reviewCount: product.reviewCount ?? undefined,
        description: product.description,
        mainImage: product.mainImage,
        subImage: product.subImage ?? undefined,
        subImage2: product.subImage2 ?? undefined,
        subImage3: product.subImage3 ?? undefined,
        subImage4: product.subImage4 ?? undefined,
        category: product.category.name,
        middleCategory: product.middleCategory?.name ?? undefined,
        subCategory: product.subCategory?.name ?? undefined,
        brandId: product.brandId ?? undefined,
        createdAt: product.createdAt,
      };
    });

    return NextResponse.json({ products: productsData }, { status: 200 });
  } catch (error: any) {
    console.error("Alt kategoriye göre ürünler çekilemedi:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
