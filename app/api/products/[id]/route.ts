// app/api/products/[id]/route.ts
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
    const productId = Number(id);
    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, error: "Geçersiz ürün ID" },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        middleCategory: true,
        subCategory: true,
        brand: true,
        sizes: {
          include: { size: true },
          orderBy: { size: { sortOrder: "asc" } },
        },
        stock: {
          orderBy: { sizeId: "asc" },
        },
        Review: {
          include: {
            user: {
              select: { id: true, name: true, surname: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 },
      );
    }

    // Ortalama puan
    const averageRating =
      product.Review.length > 0
        ? Number(
            (
              product.Review.reduce((sum, r) => sum + r.rating, 0) /
              product.Review.length
            ).toFixed(1),
          )
        : 0;

    // Puan dağılımı
    const ratingDistribution = {
      5: product.Review.filter((r) => r.rating === 5).length,
      4: product.Review.filter((r) => r.rating === 4).length,
      3: product.Review.filter((r) => r.rating === 3).length,
      2: product.Review.filter((r) => r.rating === 2).length,
      1: product.Review.filter((r) => r.rating === 1).length,
    };

    // İlgili ürünler (aynı kategori)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 8,
      include: { category: true, brand: true },
      orderBy: { createdAt: "desc" },
    });

    // Aynı markadan ürünler
    const brandProducts = product.brandId
      ? await prisma.product.findMany({
          where: {
            brandId: product.brandId,
            id: { not: product.id },
          },
          take: 6,
          include: { category: true, brand: true },
          orderBy: { createdAt: "desc" },
        })
      : [];

    // Görseller
    const images = [
      product.mainImage,
      product.subImage,
      product.subImage2,
      product.subImage3,
      product.subImage4,
    ].filter(Boolean) as string[];

    // İndirim
    const hasDiscount = !!(
      product.oldPrice && product.oldPrice > product.price
    );
    const discountAmount = hasDiscount ? product.oldPrice! - product.price : 0;
    const discountPercentage = hasDiscount
      ? Math.round(
          ((product.oldPrice! - product.price) / product.oldPrice!) * 100,
        )
      : 0;

    // Stok durumu
    let stockStatus;
    if (product.hasVariants && product.stock.length > 0) {
      const totalStock = product.stock.reduce((sum, s) => sum + s.stock, 0);
      stockStatus = {
        inStock: totalStock > 0,
        quantity: totalStock,
        lowStock: totalStock > 0 && totalStock <= 10,
      };
    } else {
      const singleStock = product.stock.find((s) => s.sizeId === null);
      stockStatus = {
        inStock: singleStock ? singleStock.stock > 0 : true,
        quantity: singleStock ? singleStock.stock : 100,
        lowStock: singleStock
          ? singleStock.stock > 0 && singleStock.stock <= 10
          : false,
      };
    }

    // Bedenleri çıkar (ProductSize → Size)
    const availableSizes = product.sizes.map((ps) => ({
      id: ps.size.id,
      value: ps.size.value,
      type: ps.size.type,
      sortOrder: ps.size.sortOrder,
    }));

    // Stok matrisi (beden bazlı)
    const stockMatrix = product.stock.map((s) => ({
      id: s.id,
      sizeId: s.sizeId,
      stock: s.stock,
      priceModifier: s.priceModifier || 0,
    }));

    // Özellikler
    const specifications = {
      weight: null,
      dimensions: null,
      material: null,
      warranty: "2 Yıl Garanti",
      origin: "Türkiye",
      certifications: ["CE", "ISO 9001", "TSE"],
    };

    // Kargo
    const shipping = {
      freeShipping: product.price >= 500,
      estimatedDelivery: "2-4 İş Günü",
      shippingCost: product.price >= 500 ? 0 : 29.99,
      expressAvailable: true,
      expressDelivery: "1-2 İş Günü",
      expressCost: 49.99,
    };

    // Meta
    const meta = {
      views: Math.floor(Math.random() * 1000) + 100,
      favorites: Math.floor(Math.random() * 50) + 10,
      purchaseCount: Math.floor(Math.random() * 200) + 20,
      lastUpdated: product.updatedAt,
    };

    // Helper: ürün listesi formatlama
    const formatProductCard = (p: (typeof relatedProducts)[0]) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      oldPrice: p.oldPrice,
      mainImage: p.mainImage,
      category: p.category.name,
      brand: p.brand?.name ?? null,
      hasDiscount: !!(p.oldPrice && p.oldPrice > p.price),
      discountPercentage: p.oldPrice
        ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
        : 0,
    });

    return NextResponse.json(
      {
        success: true,
        product: {
          // Temel
          id: product.id,
          title: product.title,
          description: product.description,

          // Fiyat
          price: product.price,
          oldPrice: product.oldPrice,
          discountPercentage: product.discountPercentage || discountPercentage,
          hasDiscount,
          discountAmount,

          // Görseller
          mainImage: product.mainImage,
          images,

          // Kategoriler
          category: { id: product.category.id, name: product.category.name },
          middleCategory: product.middleCategory
            ? {
                id: product.middleCategory.id,
                name: product.middleCategory.name,
              }
            : null,
          subCategory: product.subCategory
            ? { id: product.subCategory.id, name: product.subCategory.name }
            : null,

          // Marka
          brand: product.brand
            ? {
                id: product.brand.id,
                name: product.brand.name,
                image: product.brand.image,
              }
            : null,

          // Beden & Stok
          hasVariants: product.hasVariants,
          availableSizes,
          stockMatrix,

          // Değerlendirmeler
          rating: averageRating,
          reviewCount: product.Review.length,
          ratingDistribution,
          reviews: product.Review.map((review) => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            createdAt: review.createdAt,
            user: { name: review.user.name, surname: review.user.surname },
          })),

          // Stok & Kargo
          stock: stockStatus,
          shipping,

          // Teknik
          specifications,

          // İlgili
          relatedProducts: relatedProducts.map(formatProductCard),
          brandProducts: brandProducts.map(formatProductCard),

          // Meta & Tarihler
          meta,
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
    const productId = Number(id);
    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, error: "Geçersiz ürün ID" },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 },
      );
    }

    // Dosya silme
    const deleteFile = async (filePath?: string | null) => {
      if (!filePath) return;
      try {
        const fullPath = path.join(process.cwd(), "public", filePath);
        await fs.unlink(fullPath);
        console.log(`Dosya silindi: ${fullPath}`);
      } catch (error) {
        console.log(`Dosya silinemedi: ${filePath}`, error);
      }
    };

    await Promise.all([
      deleteFile(existingProduct.mainImage),
      deleteFile(existingProduct.subImage),
      deleteFile(existingProduct.subImage2),
      deleteFile(existingProduct.subImage3),
      deleteFile(existingProduct.subImage4),
    ]);

    // Sil — ProductSize, ProductStock cascade ile otomatik silinir
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ürün başarıyla silindi",
        product: deletedProduct,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Ürün silinirken hata:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 },
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "Bu ürün başka kayıtlarda kullanıldığı için silinemez",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Ürün silinemedi" },
      { status: 500 },
    );
  }
}

// --- PUT /api/products/:id ---
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const productId = Number(id);
    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, error: "Geçersiz ürün ID" },
        { status: 400 },
      );
    }

    const formData = await request.formData();

    // Dosyalar
    const mainFile = formData.get("file") as File | null;
    const subFile = formData.get("subImageFile") as File | null;
    const subFile2 = formData.get("subImage2File") as File | null;
    const subFile3 = formData.get("subImage3File") as File | null;
    const subFile4 = formData.get("subImage4File") as File | null;

    // Zorunlu alan validasyon
    const title = formData.get("title")?.toString();
    const priceStr = formData.get("price") as string;

    if (!title || !priceStr) {
      return NextResponse.json(
        { success: false, error: "Ürün başlığı ve fiyat zorunludur" },
        { status: 400 },
      );
    }

    const price = parseInt(priceStr);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { success: false, error: "Geçersiz fiyat değeri" },
        { status: 400 },
      );
    }

    // Optional fields
    const oldPriceStr = formData.get("oldPrice") as string;
    const discountPercentageStr = formData.get("discountPercentage") as string;
    const ratingStr = formData.get("rating") as string;
    const reviewCountStr = formData.get("reviewCount") as string;
    const description = formData.get("description")?.toString() || "";
    const brandIdStr = formData.get("brandId") as string;

    const oldPrice = oldPriceStr ? parseInt(oldPriceStr) : null;
    const discountPercentage = discountPercentageStr
      ? parseInt(discountPercentageStr)
      : null;
    const rating = ratingStr ? parseInt(ratingStr) : 0;
    const reviewCount = reviewCountStr ? parseInt(reviewCountStr) : 0;
    const brandId = brandIdStr ? parseInt(brandIdStr) : null;

    // Kategori
    const mainCategoryName = formData.get("category") as string;
    const middleCategoryName = formData.get("middleCategory") as string | null;
    const subCategoryName = formData.get("subCategory") as string | null;
    const hasVariants = formData.get("hasVariants") === "true";

    if (!mainCategoryName) {
      return NextResponse.json(
        { success: false, error: "Ana kategori seçilmedi" },
        { status: 400 },
      );
    }

    const mainCategory = await prisma.category.findFirst({
      where: { name: mainCategoryName },
    });
    if (!mainCategory) {
      return NextResponse.json(
        { success: false, error: "Ana kategori bulunamadı" },
        { status: 404 },
      );
    }

    let middleCategoryId: number | null = null;
    if (middleCategoryName && middleCategoryName !== "null") {
      const mc = await prisma.middleCategory.findFirst({
        where: { name: middleCategoryName, categoryId: mainCategory.id },
      });
      if (!mc) {
        return NextResponse.json(
          { success: false, error: "Orta kategori bulunamadı" },
          { status: 404 },
        );
      }
      middleCategoryId = mc.id;
    }

    let subCategoryId: number | null = null;
    if (subCategoryName && subCategoryName !== "null" && middleCategoryId) {
      const sc = await prisma.subCategory.findFirst({
        where: { name: subCategoryName, middleCategoryId },
      });
      if (!sc) {
        return NextResponse.json(
          { success: false, error: "Alt kategori bulunamadı" },
          { status: 404 },
        );
      }
      subCategoryId = sc.id;
    }

    // Mevcut ürün kontrolü
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 },
      );
    }

    // Dosya yükleme
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
      if (!res.ok) throw new Error("Dosya yüklenemedi");
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

    // Beden ve stok verileri (JSON string olarak gelir)
    // sizes: [{ sizeId: number }, ...]
    // stock: [{ sizeId: number | null, stock: number, priceModifier: number }, ...]
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
        console.error("sizes parse hatası");
      }
    }
    if (stockRaw) {
      try {
        stockInput = JSON.parse(stockRaw as string);
      } catch {
        console.error("stock parse hatası");
      }
    }

    // Transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Ürün güncelle
      const product = await tx.product.update({
        where: { id: productId },
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
          brandId,
          hasVariants,
        },
        include: {
          category: true,
          middleCategory: true,
          subCategory: true,
          brand: true,
        },
      });

      // 2. Mevcut ProductSize + ProductStock temizle
      await tx.productSize.deleteMany({ where: { productId } });
      await tx.productStock.deleteMany({ where: { productId } });

      if (hasVariants && sizesInput.length > 0) {
        // 3. Frontend'den gelen sizeId listesini ekle
        await tx.productSize.createMany({
          data: sizesInput.map((s) => ({ productId, sizeId: s.sizeId })),
        });

        // 4. Stok kayıtları
        if (stockInput.length > 0) {
          await tx.productStock.createMany({
            data: stockInput.map((s) => ({
              productId,
              sizeId: s.sizeId,
              stock: s.stock,
              priceModifier: s.priceModifier,
            })),
          });
        }
      } else {
        // Varyant yok → tek stok kayıtı (sizeId: null)
        const singleStock = stockInput.find((s) => s.sizeId === null);
        await tx.productStock.create({
          data: {
            productId,
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
        message: "Ürün başarıyla güncellendi",
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

    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Bu ürün bilgileri zaten mevcut" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Ürün güncellenemedi" },
      { status: 500 },
    );
  }
}
