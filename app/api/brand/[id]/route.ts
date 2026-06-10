import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/brand/[id]
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const brandId = parseInt(id);

    if (isNaN(brandId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz marka ID'si",
        },
        { status: 400 },
      );
    }

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          error: "Marka bulunamadı",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error("[BRAND_GET_BY_ID_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Marka yüklenirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/brand/[id]
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

    const { id } = await params;
    const brandId = parseInt(id);

    if (isNaN(brandId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz marka ID'si",
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { name, image } = body;

    const updateData: any = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Marka adı geçerli olmalıdır",
          },
          { status: 400 },
        );
      }

      const existingBrand = await prisma.brand.findFirst({
        where: {
          name: name.trim(),
          NOT: { id: brandId },
        },
      });

      if (existingBrand) {
        return NextResponse.json(
          {
            success: false,
            error: "Bu marka adı başka bir marka tarafından kullanılmaktadır",
          },
          { status: 409 },
        );
      }

      updateData.name = name.trim();
    }

    if (image !== undefined) {
      if (image !== null && typeof image !== "string") {
        return NextResponse.json(
          {
            success: false,
            error: "Marka görseli geçerli bir metin olmalıdır",
          },
          { status: 400 },
        );
      }
      updateData.image = image ? image.trim() : null;
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

    const updatedBrand = await prisma.brand.update({
      where: { id: brandId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedBrand,
      message: "Marka başarıyla güncellendi",
    });
  } catch (error: any) {
    console.error("[BRAND_PATCH_ERROR]", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Marka bulunamadı",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Marka güncellenirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/brand/[id]
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

    const { id } = await params;
    const brandId = parseInt(id);

    if (isNaN(brandId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz marka ID'si",
        },
        { status: 400 },
      );
    }

    const productCount = await prisma.product.count({
      where: { brandId },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Bu marka ${productCount} üründe kullanılmaktadır. Önce bu ürünlerin markalarını değiştirmelisiniz`,
        },
        { status: 409 },
      );
    }

    await prisma.brand.delete({
      where: { id: brandId },
    });

    return NextResponse.json({
      success: true,
      message: "Marka başarıyla silindi",
    });
  } catch (error: any) {
    console.error("[BRAND_DELETE_ERROR]", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "Marka bulunamadı",
        },
        { status: 404 },
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error: "Bu marka başka kayıtlarda kullanılmaktadır",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Marka silinirken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}
