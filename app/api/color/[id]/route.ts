import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>; // ✅ Promise eklendi
}

/**
 * GET /api/color/[id]
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // ✅ await eklendi
    const colorId = parseInt(id);

    if (isNaN(colorId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz renk ID'si",
        },
        { status: 400 },
      );
    }

    const color = await prisma.color.findUnique({
      where: { id: colorId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!color) {
      return NextResponse.json(
        {
          success: false,
          error: "Renk bulunamadı",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: color,
    });
  } catch (error) {
    console.error("[COLOR_GET_BY_ID_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Renk yüklenirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/color/[id]
 */
export async function PATCH(req: Request, { params }: RouteParams) {
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

    const { id } = await params; // ✅ await eklendi
    const colorId = parseInt(id);

    if (isNaN(colorId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz renk ID'si",
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { name, hexCode } = body;

    const updateData: any = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Renk adı geçerli olmalıdır",
          },
          { status: 400 },
        );
      }

      const existingColor = await prisma.color.findFirst({
        where: {
          name: name.trim(),
          NOT: { id: colorId },
        },
      });

      if (existingColor) {
        return NextResponse.json(
          {
            success: false,
            error: "Bu renk adı başka bir renk tarafından kullanılmaktadır",
          },
          { status: 409 },
        );
      }

      updateData.name = name.trim();
    }

    if (hexCode !== undefined) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
        return NextResponse.json(
          {
            success: false,
            error: "Geçerli bir hex kodu giriniz (Örn: #FF5733)",
          },
          { status: 400 },
        );
      }
      updateData.hexCode = hexCode.toUpperCase();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Güncellenecek alan bulunamadı",
        },
        { status: 400 },
      );
    }

    const updatedColor = await prisma.color.update({
      where: { id: colorId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedColor,
      message: "Renk başarıyla güncellendi",
    });
  } catch (error: any) {
    console.error("[COLOR_PATCH_ERROR]", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Renk bulunamadı",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Renk güncellenirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/color/[id]
 */
export async function DELETE(req: Request, { params }: RouteParams) {
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

    const { id } = await params; // ✅ await eklendi
    const colorId = parseInt(id);

    if (isNaN(colorId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz renk ID'si",
        },
        { status: 400 },
      );
    }

    const productCount = await prisma.product.count({
      where: { colorId },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Bu renk ${productCount} üründe kullanılmaktadır. Önce bu ürünlerin renklerini değiştirmelisiniz`,
        },
        { status: 409 },
      );
    }

    await prisma.color.delete({
      where: { id: colorId },
    });

    return NextResponse.json({
      success: true,
      message: "Renk başarıyla silindi",
    });
  } catch (error: any) {
    console.error("[COLOR_DELETE_ERROR]", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Renk bulunamadı",
        },
        { status: 404 },
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "Bu renk başka kayıtlarda kullanılmaktadır",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Renk silinirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}
