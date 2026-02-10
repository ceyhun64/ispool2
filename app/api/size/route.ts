import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/size
 * Tüm bedenleri listeler
 * Query params: includeInactive=true (inaktif bedenleri de getirir)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const sizes = await prisma.size.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        value: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
            CartItem: true,
            OrderItem: true,
          },
        },
      },
    });

    const stats = {
      total: sizes.length,
      active: sizes.filter((s) => s.isActive).length,
      inactive: sizes.filter((s) => !s.isActive).length,
    };

    return NextResponse.json({
      success: true,
      data: sizes,
      stats,
    });
  } catch (error) {
    console.error("[SIZE_GET_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Bedenler yüklenirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/size
 * Yeni beden oluşturur (Sadece ADMIN)
 */
export async function POST(request: Request) {
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

    const body = await request.json();
    const { value, sortOrder, isActive } = body;

    // Validasyon
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Beden değeri zorunludur ve geçerli olmalıdır",
        },
        { status: 400 },
      );
    }

    // Aynı değerde beden var mı kontrol et
    const existingSize = await prisma.size.findUnique({
      where: { value: value.trim().toUpperCase() },
    });

    if (existingSize) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu beden değeri zaten kullanılmaktadır",
        },
        { status: 409 },
      );
    }

    const newSize = await prisma.size.create({
      data: {
        value: value.trim().toUpperCase(),
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newSize,
        message: "Beden başarıyla oluşturuldu",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[SIZE_POST_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Beden oluşturulurken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}
