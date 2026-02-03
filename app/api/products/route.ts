// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface ProductData {
  id: number;
  title: string;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  subImage4?: string;
  description: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount?: number;
  category: string;
  middleCategory?: string;
  subCategory?: string;
  brandId?: number;
  hasVariants?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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
      },
      orderBy: { createdAt: "desc" },
    });

    const productsData: ProductData[] = products.map((p) => ({
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
      category: p.category.name,
      middleCategory: p.middleCategory?.name ?? undefined,
      subCategory: p.subCategory?.name ?? undefined,
      brandId: p.brandId ?? undefined,
      hasVariants: p.hasVariants,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
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

    // Dosyalar
    const mainFile = formData.get("file") as File | null;
    const subFile = formData.get("subImageFile") as File | null;
    const subFile2 = formData.get("subImage2File") as File | null;
    const subFile3 = formData.get("subImage3File") as File | null;
    const subFile4 = formData.get("subImage4File") as File | null;

    if (!mainFile) {
      return NextResponse.json(
        { success: false, error: "Ana görsel zorunludur." },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Upload helper
    async function uploadFile(file: File, folder: string) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folderName", folder);
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      return data.path as string;
    }

    // Görseller
    const mainImagePath = await uploadFile(mainFile, "products");
    const subImagePath = subFile
      ? await uploadFile(subFile, "products")
      : undefined;
    const subImage2Path = subFile2
      ? await uploadFile(subFile2, "products")
      : undefined;
    const subImage3Path = subFile3
      ? await uploadFile(subFile3, "products")
      : undefined;
    const subImage4Path = subFile4
      ? await uploadFile(subFile4, "products")
      : undefined;

    // Temel alanlar
    const title = formData.get("title") as string;
    const price = parseInt(formData.get("price") as string);
    const oldPrice = formData.get("oldPrice")
      ? parseInt(formData.get("oldPrice") as string)
      : undefined;
    const discountPercentage = formData.get("discountPercentage")
      ? parseInt(formData.get("discountPercentage") as string)
      : undefined;
    const description = formData.get("description") as string;
    const rating = formData.get("rating")
      ? parseInt(formData.get("rating") as string)
      : 0;
    const reviewCount = formData.get("reviewCount")
      ? parseInt(formData.get("reviewCount") as string)
      : 0;
    const brandIdStr = formData.get("brandId") as string | null;
    const brandId = brandIdStr ? parseInt(brandIdStr) : undefined;

    // Beden / varyant
    const hasVariants = formData.get("hasVariants") === "true";

    // Kategori
    const categoryName = formData.get("category") as string;
    const middleCategoryName = formData.get("middleCategory") as string | null;
    const subCategoryName = formData.get("subCategory") as string | null;

    // ── Kategori lookup ──
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Ana kategori bulunamadı." },
        { status: 404 },
      );
    }

    let middleCategoryId: number | undefined;
    if (middleCategoryName) {
      const mc = await prisma.middleCategory.findFirst({
        where: { name: middleCategoryName, categoryId: category.id },
      });
      if (!mc) {
        return NextResponse.json(
          { success: false, error: "Orta kategori bulunamadı." },
          { status: 404 },
        );
      }
      middleCategoryId = mc.id;
    }

    let subCategoryId: number | undefined;
    if (subCategoryName && middleCategoryId) {
      const sc = await prisma.subCategory.findFirst({
        where: { name: subCategoryName, middleCategoryId },
      });
      if (!sc) {
        return NextResponse.json(
          { success: false, error: "Alt kategori bulunamadı." },
          { status: 404 },
        );
      }
      subCategoryId = sc.id;
    }

    // Beden ve stok verileri (JSON string olarak gelir)
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

    // ── Transaction: ürün + ProductSize + ProductStock ──
    const newProduct = await prisma.$transaction(async (tx) => {
      // 1. Ürün oluştur
      const product = await tx.product.create({
        data: {
          title,
          price,
          oldPrice,
          discountPercentage,
          rating,
          reviewCount,
          description,
          mainImage: mainImagePath,
          subImage: subImagePath,
          subImage2: subImage2Path,
          subImage3: subImage3Path,
          subImage4: subImage4Path,
          brandId,
          categoryId: category.id,
          middleCategoryId,
          subCategoryId,
          hasVariants,
        },
        include: {
          category: true,
          middleCategory: true,
          subCategory: true,
        },
      });

      // 2. Beden ve stok
      if (hasVariants && sizesInput.length > 0) {
        // ProductSize (ürün-beden ilişkisi)
        await tx.productSize.createMany({
          data: sizesInput.map((s) => ({
            productId: product.id,
            sizeId: s.sizeId,
          })),
        });

        // ProductStock (beden bazlı stok)
        if (stockInput.length > 0) {
          await tx.productStock.createMany({
            data: stockInput.map((s) => ({
              productId: product.id,
              sizeId: s.sizeId,
              stock: s.stock,
              priceModifier: s.priceModifier || 0,
            })),
          });
        } else {
          // Stok verisi gelmemişse default değerler
          await tx.productStock.createMany({
            data: sizesInput.map((s) => ({
              productId: product.id,
              sizeId: s.sizeId,
              stock: 10,
              priceModifier: 0,
            })),
          });
        }
      } else {
        // Varyant yok → tek stok kayıtı, sizeId: null
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

    const productData: ProductData = {
      id: newProduct.id,
      title: newProduct.title,
      price: newProduct.price,
      oldPrice: newProduct.oldPrice ?? undefined,
      discountPercentage: newProduct.discountPercentage ?? undefined,
      rating: newProduct.rating,
      reviewCount: newProduct.reviewCount ?? undefined,
      description: newProduct.description,
      mainImage: newProduct.mainImage,
      subImage: newProduct.subImage ?? undefined,
      subImage2: newProduct.subImage2 ?? undefined,
      subImage3: newProduct.subImage3 ?? undefined,
      subImage4: newProduct.subImage4 ?? undefined,
      category: newProduct.category.name,
      middleCategory: newProduct.middleCategory?.name ?? undefined,
      subCategory: newProduct.subCategory?.name ?? undefined,
      brandId: newProduct.brandId ?? undefined,
      hasVariants: newProduct.hasVariants,
    };

    return NextResponse.json(
      { success: true, product: productData },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
