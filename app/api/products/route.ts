// app/api/products/route.ts
// Dosyalar client-side'dan direkt Cloudinary'e yükleniyor.
// Bu route sadece Cloudinary URL'lerini JSON olarak alır.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

// POST — JSON alır, formData/dosya almaz
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price: priceRaw,
      oldPrice: oldPriceRaw,
      discountPercentage: discountRaw,
      rating: ratingRaw,
      reviewCount: reviewCountRaw,
      category: categoryName,
      middleCategory: middleCategoryName,
      subCategory: subCategoryName,
      brandId: brandIdRaw,
      colorId: colorIdRaw,
      productGroupId,
      bulkDiscountQty: bulkQtyRaw,
      bulkDiscountRate: bulkRateRaw,
      sizes: sizesInput = [],
      stock: stockInput = [],
      mainImage,
      subImage,
      subImage2,
      subImage3,
      subImage4,
      videoUrl,
    } = body;

    if (!title || !priceRaw)
      return NextResponse.json(
        { success: false, error: "Başlık ve fiyat zorunludur" },
        { status: 400 },
      );
    if (!mainImage)
      return NextResponse.json(
        { success: false, error: "Ana görsel zorunludur." },
        { status: 400 },
      );
    if (!categoryName)
      return NextResponse.json(
        { success: false, error: "Ana kategori gerekli" },
        { status: 400 },
      );

    const price = parseFloat(priceRaw);
    if (isNaN(price) || price <= 0)
      return NextResponse.json(
        { success: false, error: "Geçersiz fiyat" },
        { status: 400 },
      );

    const oldPrice = oldPriceRaw ? parseFloat(oldPriceRaw) : null;
    const discountPercentage = discountRaw ? parseFloat(discountRaw) : null;
    const rating = ratingRaw ? parseFloat(ratingRaw) : 0;
    const reviewCount = reviewCountRaw ? parseInt(reviewCountRaw) : 0;
    const brandId = brandIdRaw ? parseInt(brandIdRaw) : null;
    const colorId = colorIdRaw ? parseInt(colorIdRaw) : null;
    const bulkDiscountQty = bulkQtyRaw ? parseInt(bulkQtyRaw) : null;
    const bulkDiscountRate = bulkRateRaw ? parseFloat(bulkRateRaw) : null;

    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category)
      return NextResponse.json(
        { success: false, error: "Ana kategori bulunamadı" },
        { status: 404 },
      );

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
          mainImage,
          subImage: subImage || null,
          subImage2: subImage2 || null,
          subImage3: subImage3 || null,
          subImage4: subImage4 || null,
          videoUrl: videoUrl || null,
          brandId,
          colorId,
          productGroupId: productGroupId || null,
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
          data: sizesInput.map((s: any) => ({
            productId: product.id,
            sizeId: s.sizeId,
          })),
        });
        const stockToCreate =
          stockInput.length > 0
            ? stockInput.filter((s: any) => s.sizeId !== null)
            : sizesInput.map((s: any) => ({
                sizeId: s.sizeId,
                stock: 10,
                priceModifier: 0,
              }));
        if (stockToCreate.length > 0) {
          await tx.productStock.createMany({
            data: stockToCreate.map((s: any) => ({
              productId: product.id,
              sizeId: s.sizeId,
              stock: s.stock,
              priceModifier: s.priceModifier || 0,
            })),
          });
        }
      } else {
        const singleStock = stockInput.find((s: any) => s.sizeId === null);
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
