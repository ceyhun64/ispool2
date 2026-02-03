// app/api/size/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ======================================================
// GET /api/size
// ======================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parametreleri
    const type = searchParams.get("type"); // NUMBER, ROMAN, SHOE, GLOVE, STANDARD
    const isActive = searchParams.get("isActive"); // "true" veya "false"
    const includeInactive = searchParams.get("includeInactive"); // "true" ise inaktif bedenler de gelir

    // Filtreler
    const where: any = {};

    // Beden tipine göre filtrele
    if (type) {
      where.type = type;
    }

    // Aktiflik durumuna göre filtrele
    if (isActive === "true") {
      where.isActive = true;
    } else if (isActive === "false") {
      where.isActive = false;
    } else if (includeInactive !== "true") {
      // Default: sadece aktif bedenler
      where.isActive = true;
    }

    // Bedenleri getir
    const sizes = await prisma.size.findMany({
      where,
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
    });

    // Tip bazlı gruplama
    const groupedByType = sizes.reduce((acc: any, size) => {
      if (!acc[size.type]) {
        acc[size.type] = [];
      }
      acc[size.type].push({
        id: size.id,
        value: size.value,
        sortOrder: size.sortOrder,
        isActive: size.isActive,
      });
      return acc;
    }, {});

    // İstatistikler
    const stats = {
      total: sizes.length,
      byType: Object.keys(groupedByType).map((type) => ({
        type,
        count: groupedByType[type].length,
        active: groupedByType[type].filter((s: any) => s.isActive).length,
        inactive: groupedByType[type].filter((s: any) => !s.isActive).length,
      })),
      activeCount: sizes.filter((s) => s.isActive).length,
      inactiveCount: sizes.filter((s) => !s.isActive).length,
    };

    // Formatlı beden listesi
    const formattedSizes = sizes.map((s) => ({
      id: s.id,
      value: s.value,
      type: s.type,
      sortOrder: s.sortOrder,
      isActive: s.isActive,
    }));

    return NextResponse.json(
      {
        success: true,
        sizes: formattedSizes,
        grouped: groupedByType,
        stats,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Size fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Beden verileri alınamadı",
      },
      { status: 500 },
    );
  }
}

// ======================================================
// POST /api/size - Yeni Beden Ekle
// ======================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { value, type, sortOrder, isActive } = body;

    // Validasyon
    if (!value || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "Beden değeri ve tipi zorunludur",
        },
        { status: 400 },
      );
    }

    // Geçerli tip kontrolü
    const validTypes = ["NUMBER", "ROMAN", "SHOE", "GLOVE", "STANDARD"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Geçersiz beden tipi. Geçerli tipler: ${validTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Aynı tip ve değerde beden var mı kontrol et
    const existing = await prisma.size.findFirst({
      where: { value, type },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu beden değeri zaten mevcut",
        },
        { status: 409 },
      );
    }

    // sortOrder belirtilmemişse, aynı tipteki son bedenin sortOrder'ını al ve 1 ekle
    let finalSortOrder = sortOrder;
    if (finalSortOrder === undefined) {
      const lastSize = await prisma.size.findFirst({
        where: { type },
        orderBy: { sortOrder: "desc" },
      });
      finalSortOrder = lastSize ? lastSize.sortOrder + 1 : 1;
    }

    // Yeni beden oluştur
    const newSize = await prisma.size.create({
      data: {
        value,
        type,
        sortOrder: finalSortOrder,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Beden başarıyla eklendi",
        size: {
          id: newSize.id,
          value: newSize.value,
          type: newSize.type,
          sortOrder: newSize.sortOrder,
          isActive: newSize.isActive,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Size create error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Beden eklenemedi",
      },
      { status: 500 },
    );
  }
}

// ======================================================
// PATCH /api/size - Toplu Güncelleme (sortOrder, isActive)
// ======================================================
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { updates } = body; // [{ id: 1, sortOrder: 5, isActive: true }, ...]

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Güncellenecek beden listesi gerekli",
        },
        { status: 400 },
      );
    }

    // Transaction ile toplu güncelleme
    const updatedSizes = await prisma.$transaction(
      updates.map((update) =>
        prisma.size.update({
          where: { id: update.id },
          data: {
            ...(update.sortOrder !== undefined && {
              sortOrder: update.sortOrder,
            }),
            ...(update.isActive !== undefined && { isActive: update.isActive }),
            ...(update.value !== undefined && { value: update.value }),
          },
        }),
      ),
    );

    return NextResponse.json(
      {
        success: true,
        message: `${updatedSizes.length} beden güncellendi`,
        sizes: updatedSizes.map((s) => ({
          id: s.id,
          value: s.value,
          type: s.type,
          sortOrder: s.sortOrder,
          isActive: s.isActive,
        })),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Size bulk update error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Bir veya daha fazla beden bulunamadı",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Bedenler güncellenemedi",
      },
      { status: 500 },
    );
  }
}

// ======================================================
// DELETE /api/size - Toplu Silme
// ======================================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids"); // Örn: "1,2,3,4"

    if (!idsParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Silinecek beden ID'leri gerekli",
        },
        { status: 400 },
      );
    }

    const ids = idsParam.split(",").map((id) => parseInt(id.trim()));

    if (ids.some((id) => isNaN(id))) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz ID formatı",
        },
        { status: 400 },
      );
    }

    // Bedenleri sil
    const deleted = await prisma.size.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${deleted.count} beden silindi`,
        deletedCount: deleted.count,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Size delete error:", error);

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "Bu beden başka kayıtlarda kullanıldığı için silinemez",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Bedenler silinemedi",
      },
      { status: 500 },
    );
  }
}
