import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>; // ✅ Promise eklendi
}

/**
 * GET /api/size/[id]
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // ✅ await eklendi
    const sizeId = parseInt(id);

    if (isNaN(sizeId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz beden ID'si",
        },
        { status: 400 },
      );
    }

    const size = await prisma.size.findUnique({
      where: { id: sizeId },
      include: {
        _count: {
          select: {
            products: true,
            CartItem: true,
            OrderItem: true,
          },
        },
      },
    });

    if (!size) {
      return NextResponse.json(
        {
          success: false,
          error: "Beden bulunamadı",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: size,
    });
  } catch (error) {
    console.error("[SIZE_GET_BY_ID_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Beden yüklenirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/size/[id]
 */
export async function PATCH(request: Request, { params }: RouteParams) {
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
    const sizeId = parseInt(id);

    if (isNaN(sizeId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz beden ID'si",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { value, sortOrder, isActive } = body;

    const updateData: any = {};

    if (value !== undefined) {
      if (typeof value !== "string" || value.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Beden değeri geçerli olmalıdır",
          },
          { status: 400 },
        );
      }

      const existingSize = await prisma.size.findFirst({
        where: {
          value: value.trim().toUpperCase(),
          NOT: { id: sizeId },
        },
      });

      if (existingSize) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Bu beden değeri başka bir beden tarafından kullanılmaktadır",
          },
          { status: 409 },
        );
      }

      updateData.value = value.trim().toUpperCase();
    }

    if (sortOrder !== undefined) {
      if (typeof sortOrder !== "number") {
        return NextResponse.json(
          {
            success: false,
            error: "Sıralama değeri sayı olmalıdır",
          },
          { status: 400 },
        );
      }
      updateData.sortOrder = sortOrder;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return NextResponse.json(
          {
            success: false,
            error: "Aktiflik durumu boolean olmalıdır",
          },
          { status: 400 },
        );
      }
      updateData.isActive = isActive;
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

    const updatedSize = await prisma.size.update({
      where: { id: sizeId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedSize,
      message: "Beden başarıyla güncellendi",
    });
  } catch (error: any) {
    console.error("[SIZE_PATCH_ERROR]", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Beden bulunamadı",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Beden güncellenirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/size/[id]
 */
export async function DELETE(request: Request, { params }: RouteParams) {
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
    const sizeId = parseInt(id);

    if (isNaN(sizeId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz beden ID'si",
        },
        { status: 400 },
      );
    }

    const usageCount = await prisma.size.findUnique({
      where: { id: sizeId },
      select: {
        _count: {
          select: {
            products: true,
            CartItem: true,
            OrderItem: true,
          },
        },
      },
    });

    if (!usageCount) {
      return NextResponse.json(
        {
          success: false,
          error: "Beden bulunamadı",
        },
        { status: 404 },
      );
    }

    const totalUsage =
      usageCount._count.products +
      usageCount._count.CartItem +
      usageCount._count.OrderItem;

    if (totalUsage > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Bu beden kullanımda olduğu için silinemez (${usageCount._count.products} ürün, ${usageCount._count.CartItem} sepet, ${usageCount._count.OrderItem} sipariş)`,
        },
        { status: 409 },
      );
    }

    await prisma.size.delete({
      where: { id: sizeId },
    });

    return NextResponse.json({
      success: true,
      message: "Beden başarıyla silindi",
    });
  } catch (error: any) {
    console.error("[SIZE_DELETE_ERROR]", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Beden bulunamadı",
        },
        { status: 404 },
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "Bu beden başka kayıtlarda kullanılmaktadır",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Beden silinirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}
