import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

// --- GET /api/products/:id ---
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        subCategory: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(
      {
        product: {
          ...product,
          category: product.category.name,
          subCategory: product.subCategory?.name ?? null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ürünleri getirirken hata:", error);
    return NextResponse.json({ error: "Ürün alınamadı" }, { status: 500 });
  }
}

// --- DELETE /api/products/:id ---
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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
  context: { params: Promise<{ id: string }> }
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
    const subCategoryName = formData.get("subCategory") as string | null;
    const description = formData.get("description")?.toString() || "";

    if (!mainCategoryName) {
      return NextResponse.json(
        { success: false, error: "Ana kategori seçilmedi." },
        { status: 400 }
      );
    }

    const mainCategory = await prisma.category.findFirst({
      where: { name: mainCategoryName },
    });

    if (!mainCategory) {
      return NextResponse.json(
        { success: false, error: "Ana kategori bulunamadı." },
        { status: 404 }
      );
    }

    let subCategoryId: number | undefined = undefined;
    if (subCategoryName && subCategoryName !== "null") {
      const subCategory = await prisma.subCategory.findFirst({
        where: { name: subCategoryName, categoryId: mainCategory.id },
      });
      if (!subCategory) {
        return NextResponse.json(
          { success: false, error: "Alt kategori bulunamadı." },
          { status: 404 }
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
        { status: 404 }
      );
    }

    const uploadFile = async (
      file: File | null
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
        subCategoryId,
      },
      include: {
        category: true,
        subCategory: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        product: {
          ...updatedProduct,
          category: updatedProduct.category.name,
          subCategory: updatedProduct.subCategory?.name ?? null,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Ürün güncellenirken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Ürün güncellenemedi" },
      { status: 500 }
    );
  }
}
