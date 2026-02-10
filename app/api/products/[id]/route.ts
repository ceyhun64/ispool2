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
  const params = await context.params;
  const { id } = params;
  console.log("app/api/products/[id]/route.ts productId", id);

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
        color: true,
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
      include: { category: true, brand: true, color: true },
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
          include: { category: true, brand: true, color: true },
          orderBy: { createdAt: "desc" },
        })
      : [];

    // Aynı grup ID'ye sahip diğer renkler
    let otherColors: any[] = [];
    if (product.productGroupId) {
      const groupProducts = await prisma.product.findMany({
        where: {
          productGroupId: product.productGroupId,
          id: { not: product.id },
        },
        include: {
          color: true,
          category: true,
          brand: true,
        },
        orderBy: { createdAt: "desc" },
      });

      otherColors = groupProducts.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        oldPrice: p.oldPrice,
        mainImage: p.mainImage,
        color: p.color
          ? {
              id: p.color.id,
              name: p.color.name,
              hexCode: p.color.hexCode,
            }
          : null,
        hasDiscount: !!(p.oldPrice && p.oldPrice > p.price),
        discountPercentage: p.oldPrice
          ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
          : 0,
      }));
    }

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
    if (product.stock.length > 0) {
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

    // Bedenleri çıkar
    const availableSizes = product.sizes.map((ps) => ({
      id: ps.size.id,
      value: ps.size.value,
      sortOrder: ps.size.sortOrder,
    }));

    // Stok matrisi
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
      color: p.color
        ? { id: p.color.id, name: p.color.name, hexCode: p.color.hexCode }
        : null,
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

          bulkDiscountQty: product.bulkDiscountQty,
          bulkDiscountRate: product.bulkDiscountRate,

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

          // Renk
          color: product.color
            ? {
                id: product.color.id,
                name: product.color.name,
                hexCode: product.color.hexCode,
              }
            : null,

          // Ürün Grubu
          productGroupId: product.productGroupId,
          otherColors, // Diğer renk seçenekleri

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
  // ✅ DÜZELTME: await'i önce yap, sonra destructure et
  const params = await context.params;
  const { id } = params;

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
      { success: false, error: error.message || "Ürün silinemedi" },
      { status: 500 },
    );
  }
}

// --- PUT /api/products/:id ---
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const { id } = params;

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

    const price = parseFloat(priceStr);
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
    const colorIdStr = formData.get("colorId") as string;

    // ✅ EKLEME: productGroupId
    const productGroupId = formData.get("productGroupId")?.toString() || null;

    // Toplu indirim alanları
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

    // Kategori
    const mainCategoryName = formData.get("category") as string;
    const middleCategoryName = formData.get("middleCategory") as string | null;
    const subCategoryName = formData.get("subCategory") as string | null;

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
    if (
      middleCategoryName &&
      middleCategoryName !== "null" &&
      middleCategoryName !== ""
    ) {
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
    if (
      subCategoryName &&
      subCategoryName !== "null" &&
      subCategoryName !== "" &&
      middleCategoryId
    ) {
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

    // Dosya silme helper
    const deleteFile = async (filePath?: string | null) => {
      if (!filePath) return;
      try {
        const fullPath = path.join(process.cwd(), "public", filePath);
        await fs.unlink(fullPath);
        console.log(`Eski dosya silindi: ${fullPath}`);
      } catch (error) {
        console.log(`Dosya silinemedi: ${filePath}`, error);
      }
    };

    // Dosya yükleme helper
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

    // Görseller - yeni yükleme varsa eski dosyayı sil ve yeniyi yükle
    let mainImagePath = existingProduct.mainImage;
    if (mainFile) {
      await deleteFile(existingProduct.mainImage);
      mainImagePath = (await uploadFile(mainFile)) || existingProduct.mainImage;
    }

    let subImagePath = existingProduct.subImage;
    if (subFile) {
      await deleteFile(existingProduct.subImage);
      subImagePath = (await uploadFile(subFile)) || existingProduct.subImage;
    }

    let subImage2Path = existingProduct.subImage2;
    if (subFile2) {
      await deleteFile(existingProduct.subImage2);
      subImage2Path = (await uploadFile(subFile2)) || existingProduct.subImage2;
    }

    let subImage3Path = existingProduct.subImage3;
    if (subFile3) {
      await deleteFile(existingProduct.subImage3);
      subImage3Path = (await uploadFile(subFile3)) || existingProduct.subImage3;
    }

    let subImage4Path = existingProduct.subImage4;
    if (subFile4) {
      await deleteFile(existingProduct.subImage4);
      subImage4Path = (await uploadFile(subFile4)) || existingProduct.subImage4;
    }

    // Dosya yükleme validasyonu
    if (mainFile && !mainImagePath) {
      return NextResponse.json(
        { success: false, error: "Ana görsel yüklenemedi" },
        { status: 500 },
      );
    }

    // Beden ve stok verileri
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
      } catch (e) {
        console.error("sizes parse hatası:", e);
        sizesInput = [];
      }
    }

    if (stockRaw) {
      try {
        stockInput = JSON.parse(stockRaw as string);
      } catch (e) {
        console.error("stock parse hatası:", e);
        stockInput = [];
      }
    }

    // Transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      try {
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
            colorId,
            productGroupId, // ✅ EKLEME
            bulkDiscountQty,
            bulkDiscountRate,
          },
          include: {
            category: true,
            middleCategory: true,
            subCategory: true,
            brand: true,
            color: true,
          },
        });

        // 2. Mevcut ProductSize + ProductStock temizle
        await tx.productSize.deleteMany({ where: { productId } });
        await tx.productStock.deleteMany({ where: { productId } });

        // 3. Yeni beden ve stok verileri
        if (sizesInput.length > 0) {
          // Beden varyantları var
          await tx.productSize.createMany({
            data: sizesInput.map((s) => ({ productId, sizeId: s.sizeId })),
          });

          // Stok kayıtları
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
                productId,
                sizeId: s.sizeId,
                stock: s.stock,
                priceModifier: s.priceModifier || 0,
              })),
            });
          }
        } else {
          // Varyant yok → tek stok kaydı
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
      } catch (error) {
        console.error("Transaction hatası:", error);
        throw error;
      }
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
          color: updatedProduct.color
            ? {
                id: updatedProduct.color.id,
                name: updatedProduct.color.name,
                hexCode: updatedProduct.color.hexCode,
              }
            : null,
          productGroupId: updatedProduct.productGroupId, // ✅ EKLEME
          bulkDiscountQty: updatedProduct.bulkDiscountQty ?? undefined,
          bulkDiscountRate: updatedProduct.bulkDiscountRate ?? undefined,
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
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Kayıt bulunamadı" },
        { status: 404 },
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "İlişkili kayıtlar nedeniyle işlem yapılamadı",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Ürün güncellenemedi" },
      { status: 500 },
    );
  }
}
