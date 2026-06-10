import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/brand
 * Tüm markaları listeler (Herkese açık)
 */
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: brands,
      count: brands.length,
    });
  } catch (error) {
    console.error("[BRAND_GET_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Markalar yüklenirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/brand
 * Yeni marka oluşturur (Sadece ADMIN)
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Bu işlem için yetkiniz bulunmamaktadır",
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { name, image } = body;

    // Validasyon
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Marka adı zorunludur ve geçerli olmalıdır",
        },
        { status: 400 },
      );
    }

    if (image !== undefined && image !== null && typeof image !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Marka görseli geçerli bir metin olmalıdır",
        },
        { status: 400 },
      );
    }

    // Aynı isimde marka var mı kontrol et
    const existingBrand = await prisma.brand.findUnique({
      where: { name: name.trim() },
    });

    if (existingBrand) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu marka adı zaten kullanılmaktadır",
        },
        { status: 409 },
      );
    }

    const newBrand = await prisma.brand.create({
      data: {
        name: name.trim(),
        image: image ? image.trim() : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newBrand,
        message: "Marka başarıyla oluşturuldu",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[BRAND_POST_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Marka oluşturulurken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}
