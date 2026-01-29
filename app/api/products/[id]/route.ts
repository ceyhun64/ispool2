import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

// --- GET /api/products/:id ---
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        middleCategory: true,
        subCategory: true,
        brand: true,
        Review: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Ortalama puanı hesapla
    const averageRating =
      product.Review.length > 0
        ? product.Review.reduce((sum, review) => sum + review.rating, 0) /
          product.Review.length
        : 0;

    // Puan dağılımını hesapla
    const ratingDistribution = {
      5: product.Review.filter((r) => r.rating === 5).length,
      4: product.Review.filter((r) => r.rating === 4).length,
      3: product.Review.filter((r) => r.rating === 3).length,
      2: product.Review.filter((r) => r.rating === 2).length,
      1: product.Review.filter((r) => r.rating === 1).length,
    };

    // İlgili ürünleri getir (aynı kategoriden)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 8,
      include: {
        category: true,
        brand: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Aynı markadan ürünleri getir
    const brandProducts = product.brandId
      ? await prisma.product.findMany({
          where: {
            brandId: product.brandId,
            id: { not: product.id },
          },
          take: 6,
          include: {
            category: true,
            brand: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : [];

    // Tüm görselleri birleştir
    const images = [
      product.mainImage,
      product.subImage,
      product.subImage2,
      product.subImage3,
      product.subImage4,
    ].filter(Boolean);

    // İndirim bilgilerini hesapla
    const hasDiscount = product.oldPrice && product.oldPrice > product.price;
    const discountAmount = hasDiscount ? product.oldPrice! - product.price : 0;
    const discountPercentage = hasDiscount
      ? Math.round(
          ((product.oldPrice! - product.price) / product.oldPrice!) * 100,
        )
      : 0;

    // Stok durumu (şimdilik sabit, ileride dinamik yapılabilir)
    const stockStatus = {
      inStock: true,
      quantity: 100,
      lowStock: false,
    };

    // Ürün özellikleri
    const specifications = {
      weight: null,
      dimensions: null,
      material: null,
      warranty: "2 Yıl Garanti",
      origin: "Türkiye",
      certifications: ["CE", "ISO 9001", "TSE"],
    };

    // Kargo bilgileri
    const shipping = {
      freeShipping: product.price >= 500,
      estimatedDelivery: "2-4 İş Günü",
      shippingCost: product.price >= 500 ? 0 : 29.99,
      expressAvailable: true,
      expressDelivery: "1-2 İş Günü",
      expressCost: 49.99,
    };

    // Meta bilgileri
    const meta = {
      views: Math.floor(Math.random() * 1000) + 100,
      favorites: Math.floor(Math.random() * 50) + 10,
      purchaseCount: Math.floor(Math.random() * 200) + 20,
      lastUpdated: product.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        product: {
          // Temel Bilgiler
          id: product.id,
          title: product.title,
          description: product.description,

          // Fiyat Bilgileri
          price: product.price,
          oldPrice: product.oldPrice,
          discountPercentage: product.discountPercentage || discountPercentage,
          hasDiscount,
          discountAmount,

          // Görsel Bilgileri
          mainImage: product.mainImage,
          images,

          // Kategori Bilgileri
          category: {
            id: product.category.id,
            name: product.category.name,
          },
          middleCategory: product.middleCategory
            ? {
                id: product.middleCategory.id,
                name: product.middleCategory.name,
              }
            : null,
          subCategory: product.subCategory
            ? {
                id: product.subCategory.id,
                name: product.subCategory.name,
              }
            : null,

          // Marka Bilgileri
          brand: product.brand
            ? {
                id: product.brand.id,
                name: product.brand.name,
                image: product.brand.image,
              }
            : null,

          // Değerlendirme Bilgileri
          rating: averageRating,
          reviewCount: product.Review.length,
          ratingDistribution,
          reviews: product.Review.map((review) => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            createdAt: review.createdAt,
            user: {
              name: review.user.name,
              surname: review.user.surname,
            },
          })),

          // Stok ve Kargo
          stock: stockStatus,
          shipping,

          // Teknik Özellikler
          specifications,

          // İlgili Ürünler
          relatedProducts: relatedProducts.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            oldPrice: p.oldPrice,
            mainImage: p.mainImage,
            category: p.category.name,
            brand: p.brand?.name,
            hasDiscount: p.oldPrice && p.oldPrice > p.price,
          })),

          // Aynı Markadan Ürünler
          brandProducts: brandProducts.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            oldPrice: p.oldPrice,
            mainImage: p.mainImage,
            category: p.category.name,
            hasDiscount: p.oldPrice && p.oldPrice > p.price,
          })),

          // Meta Bilgiler
          meta,

          // Tarihler
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ürün getirirken hata:", error);
    return NextResponse.json(
      { success: false, error: "Ürün alınamadı" },
      { status: 500 },
    );
  }
}

// --- DELETE /api/products/:id ---
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    const deleteFile = async (filePath?: string | null) => {
      if (!filePath) return;
      try {
        await fs.unlink(path.join(process.cwd(), "public", filePath));
      } catch {}
    };

    await deleteFile(existingProduct.mainImage);
    await deleteFile(existingProduct.subImage);
    await deleteFile(existingProduct.subImage2);
    await deleteFile(existingProduct.subImage3);
    await deleteFile(existingProduct.subImage4);

    const product = await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
}

// --- PUT /api/products/:id ---
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const formData = await request.formData();
    const mainFile = formData.get("file") as File | null;
    const subFile = formData.get("subImageFile") as File | null;
    const subFile2 = formData.get("subImage2File") as File | null;
    const subFile3 = formData.get("subImage3File") as File | null;
    const subFile4 = formData.get("subImage4File") as File | null;

    const title = formData.get("title")?.toString();
    const price = parseFloat(formData.get("price") as string);
    const oldPrice = formData.get("oldPrice")
      ? parseFloat(formData.get("oldPrice") as string)
      : null;
    const discountPercentage = formData.get("discountPercentage")
      ? parseInt(formData.get("discountPercentage") as string)
      : null;
    const rating = parseInt(formData.get("rating") as string);
    const reviewCount = formData.get("reviewCount")
      ? parseInt(formData.get("reviewCount") as string)
      : 0;

    const mainCategoryName = formData.get("category") as string;
    const middleCategoryName = formData.get("middleCategory") as string | null;
    const subCategoryName = formData.get("subCategory") as string | null;
    const description = formData.get("description")?.toString() || "";

    if (!mainCategoryName) {
      return NextResponse.json(
        { success: false, error: "Ana kategori seçilmedi." },
        { status: 400 },
      );
    }

    // Ana kategoriyi bul
    const mainCategory = await prisma.category.findFirst({
      where: { name: mainCategoryName },
    });

    if (!mainCategory) {
      return NextResponse.json(
        { success: false, error: "Ana kategori bulunamadı." },
        { status: 404 },
      );
    }

    // Orta kategoriyi bul
    let middleCategoryId: number | undefined = undefined;
    if (middleCategoryName && middleCategoryName !== "null") {
      const middleCategory = await prisma.middleCategory.findFirst({
        where: { name: middleCategoryName, categoryId: mainCategory.id },
      });
      if (!middleCategory) {
        return NextResponse.json(
          { success: false, error: "Orta kategori bulunamadı." },
          { status: 404 },
        );
      }
      middleCategoryId = middleCategory.id;
    }

    // Alt kategoriyi bul
    let subCategoryId: number | undefined = undefined;
    if (subCategoryName && subCategoryName !== "null" && middleCategoryId) {
      const subCategory = await prisma.subCategory.findFirst({
        where: { name: subCategoryName, middleCategoryId: middleCategoryId },
      });
      if (!subCategory) {
        return NextResponse.json(
          { success: false, error: "Alt kategori bulunamadı." },
          { status: 404 },
        );
      }
      subCategoryId = subCategory.id;
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı." },
        { status: 404 },
      );
    }

    const uploadFile = async (
      file: File | null,
    ): Promise<string | undefined> => {
      if (!file) return undefined;
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("folderName", "products");

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      return data.path;
    };

    const mainImagePath = mainFile
      ? await uploadFile(mainFile)
      : existingProduct.mainImage;
    const subImagePath = subFile
      ? await uploadFile(subFile)
      : existingProduct.subImage;
    const subImage2Path = subFile2
      ? await uploadFile(subFile2)
      : existingProduct.subImage2;
    const subImage3Path = subFile3
      ? await uploadFile(subFile3)
      : existingProduct.subImage3;
    const subImage4Path = subFile4
      ? await uploadFile(subFile4)
      : existingProduct.subImage4;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title,
        price,
        oldPrice,
        discountPercentage,
        description,
        rating,
        reviewCount,
        mainImage: mainImagePath,
        subImage: subImagePath,
        subImage2: subImage2Path,
        subImage3: subImage3Path,
        subImage4: subImage4Path,
        categoryId: mainCategory.id,
        middleCategoryId,
        subCategoryId,
      },
      include: {
        category: true,
        middleCategory: true,
        subCategory: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        product: {
          ...updatedProduct,
          category: updatedProduct.category.name,
          middleCategory: updatedProduct.middleCategory?.name ?? null,
          subCategory: updatedProduct.subCategory?.name ?? null,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Ürün güncellenirken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Ürün güncellenemedi" },
      { status: 500 },
    );
  }
}
