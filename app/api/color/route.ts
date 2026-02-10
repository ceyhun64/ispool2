import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/color
 * Tüm renkleri listeler (Herkese açık)
 */
export async function GET() {
  try {
    const colors = await prisma.color.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        hexCode: true,
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
      data: colors,
      count: colors.length,
    });
  } catch (error) {
    console.error("[COLOR_GET_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Renkler yüklenirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/color
 * Yeni renk oluşturur (Sadece ADMIN)
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
    const { name, hexCode } = body;

    // Validasyon
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Renk adı zorunludur ve geçerli olmalıdır",
        },
        { status: 400 },
      );
    }

    if (!hexCode || !/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçerli bir hex kodu giriniz (Örn: #FF5733)",
        },
        { status: 400 },
      );
    }

    // Aynı isimde renk var mı kontrol et
    const existingColor = await prisma.color.findUnique({
      where: { name: name.trim() },
    });

    if (existingColor) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu renk adı zaten kullanılmaktadır",
        },
        { status: 409 },
      );
    }

    const newColor = await prisma.color.create({
      data: {
        name: name.trim(),
        hexCode: hexCode.toUpperCase(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newColor,
        message: "Renk başarıyla oluşturuldu",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[COLOR_POST_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Renk oluşturulurken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}
