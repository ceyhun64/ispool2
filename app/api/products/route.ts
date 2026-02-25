// app/api/products/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ======================================================
// GET /api/products
// ======================================================
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        middleCategory: true,
        subCategory: true,
        color: true,
        sizes: {
          include: { size: true },
          orderBy: { size: { sortOrder: "asc" } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const productsData = products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      oldPrice: p.oldPrice ?? undefined,
      discountPercentage: p.discountPercentage ?? undefined,
      rating: p.rating,
      reviewCount: p.reviewCount ?? undefined,
      description: p.description,
      mainImage: p.mainImage,
      subImage: p.subImage ?? undefined,
      subImage2: p.subImage2 ?? undefined,
      subImage3: p.subImage3 ?? undefined,
      subImage4: p.subImage4 ?? undefined,
      videoUrl: p.videoUrl ?? undefined,
      showVideo: p.showVideo,
      category: p.category.name,
      middleCategory: p.middleCategory?.name ?? undefined,
      subCategory: p.subCategory?.name ?? undefined,
      brandId: p.brandId ?? undefined,
      colorId: p.color?.id ?? undefined,
      colorName: p.color?.name ?? undefined,
      colorHexCode: p.color?.hexCode ?? undefined,
      sizes: p.sizes.map((ps) => ({
        id: ps.size.id,
        sizeId: ps.sizeId,
        value: ps.size.value,
        sortOrder: ps.size.sortOrder,
      })),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      bulkDiscountQty: p.bulkDiscountQty ?? undefined,
      bulkDiscountRate: p.bulkDiscountRate ?? undefined,
    }));

    return NextResponse.json({ products: productsData }, { status: 200 });
  } catch (error: any) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// ======================================================
// POST /api/products
// ======================================================
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const mainImageUrl = formData.get("mainImageUrl") as string | null;
    const subImageUrl1 = formData.get("subImageUrl1") as string | null;
    const subImageUrl2 = formData.get("subImageUrl2") as string | null;
    const subImageUrl3 = formData.get("subImageUrl3") as string | null;
    const subImageUrl4 = formData.get("subImageUrl4") as string | null;
    const videoUrl = formData.get("videoUrl") as string | null;
    const showVideo = formData.get("showVideo") === "true"; // ← YENİ

    if (!mainImageUrl) {
      return NextResponse.json(
        { success: false, error: "Ana görsel URL'si zorunludur." },
        { status: 400 },
      );
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;

    if (!title || !priceStr) {
      return NextResponse.json(
        { success: false, error: "Başlık ve fiyat zorunludur" },
        { status: 400 },
      );
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { success: false, error: "Geçersiz fiyat" },
        { status: 400 },
      );
    }

    const oldPriceStr = formData.get("oldPrice") as string;
    const discountPercentageStr = formData.get("discountPercentage") as string;
    const ratingStr = formData.get("rating") as string;
    const reviewCountStr = formData.get("reviewCount") as string;
    const brandIdStr = formData.get("brandId") as string;
    const colorIdStr = formData.get("colorId") as string;
    const productGroupId = formData.get("productGroupId") as string | null;
    const bulkDiscountQtyStr = formData.get("bulkDiscountQty") as string;
    const bulkDiscountRateStr = formData.get("bulkDiscountRate") as string;

    const oldPrice = oldPriceStr ? parseFloat(oldPriceStr) : null;
    const discountPercentage = discountPercentageStr
      ? parseFloat(discountPercentageStr)
      : null;
    const rating = ratingStr ? parseFloat(ratingStr) : 0;
    const reviewCount = reviewCountStr ? parseInt(reviewCountStr) : 0;
    const brandId = brandIdStr ? parseInt(brandIdStr) : null;
    const colorId = colorIdStr ? parseInt(colorIdStr) : null;
    const bulkDiscountQty = bulkDiscountQtyStr
      ? parseInt(bulkDiscountQtyStr)
      : null;
    const bulkDiscountRate = bulkDiscountRateStr
      ? parseFloat(bulkDiscountRateStr)
      : null;

    const categoryName = formData.get("category") as string;
    const middleCategoryName = formData.get("middleCategory") as string | null;
    const subCategoryName = formData.get("subCategory") as string | null;

    if (!categoryName) {
      return NextResponse.json(
        { success: false, error: "Ana kategori gerekli" },
        { status: 400 },
      );
    }

    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Ana kategori bulunamadı" },
        { status: 404 },
      );
    }

    let middleCategoryId: number | null = null;
    if (middleCategoryName && middleCategoryName !== "") {
      const mc = await prisma.middleCategory.findFirst({
        where: { name: middleCategoryName, categoryId: category.id },
      });
      if (!mc)
        return NextResponse.json(
          { success: false, error: "Orta kategori bulunamadı" },
          { status: 404 },
        );
      middleCategoryId = mc.id;
    }

    let subCategoryId: number | null = null;
    if (subCategoryName && subCategoryName !== "" && middleCategoryId) {
      const sc = await prisma.subCategory.findFirst({
        where: { name: subCategoryName, middleCategoryId },
      });
      if (!sc)
        return NextResponse.json(
          { success: false, error: "Alt kategori bulunamadı" },
          { status: 404 },
        );
      subCategoryId = sc.id;
    }

    let sizesInput: { sizeId: number }[] = [];
    let stockInput: {
      sizeId: number | null;
      stock: number;
      priceModifier: number;
    }[] = [];

    const sizesRaw = formData.get("sizes");
    const stockRaw = formData.get("stock");

    if (sizesRaw) {
      try {
        sizesInput = JSON.parse(sizesRaw as string);
      } catch {
        sizesInput = [];
      }
    }
    if (stockRaw) {
      try {
        stockInput = JSON.parse(stockRaw as string);
      } catch {
        stockInput = [];
      }
    }

    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title,
          price,
          oldPrice,
          discountPercentage,
          rating,
          reviewCount,
          description,
          mainImage: mainImageUrl,
          subImage: subImageUrl1,
          subImage2: subImageUrl2,
          subImage3: subImageUrl3,
          subImage4: subImageUrl4,
          videoUrl: videoUrl,
          showVideo, // ← YENİ
          brandId,
          colorId,
          productGroupId:
            productGroupId && productGroupId !== "" ? productGroupId : null,
          categoryId: category.id,
          middleCategoryId,
          subCategoryId,
          bulkDiscountQty,
          bulkDiscountRate,
        },
        include: {
          category: true,
          middleCategory: true,
          subCategory: true,
          color: true,
        },
      });

      if (sizesInput.length > 0) {
        await tx.productSize.createMany({
          data: sizesInput.map((s) => ({
            productId: product.id,
            sizeId: s.sizeId,
          })),
        });

        const stockToCreate =
          stockInput.length > 0
            ? stockInput.filter((s) => s.sizeId !== null)
            : sizesInput.map((s) => ({
                sizeId: s.sizeId,
                stock: 10,
                priceModifier: 0,
              }));

        if (stockToCreate.length > 0) {
          await tx.productStock.createMany({
            data: stockToCreate.map((s) => ({
              productId: product.id,
              sizeId: s.sizeId,
              stock: s.stock,
              priceModifier: s.priceModifier || 0,
            })),
          });
        }
      } else {
        const singleStock = stockInput.find((s) => s.sizeId === null);
        await tx.productStock.create({
          data: {
            productId: product.id,
            sizeId: null,
            stock: singleStock?.stock ?? 50,
            priceModifier: singleStock?.priceModifier ?? 0,
          },
        });
      }

      return product;
    });

    return NextResponse.json(
      {
        success: true,
        product: {
          id: newProduct.id,
          title: newProduct.title,
          price: newProduct.price,
          mainImage: newProduct.mainImage,
          videoUrl: newProduct.videoUrl ?? undefined,
          showVideo: newProduct.showVideo,
          category: newProduct.category.name,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Ürün oluşturulamadı" },
      { status: 500 },
    );
  }
}
