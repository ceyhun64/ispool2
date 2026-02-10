// app/api/admin/hero-slides/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // ✅ Promise eklendi
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; // ✅ await eklendi
    const slideId = parseInt(id);

    await prisma.heroSlide.delete({
      where: { id: slideId },
    });

    return NextResponse.json({ message: "Hero slide silindi." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Hero slide silme hatası." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // ✅ Promise eklendi
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; // ✅ await eklendi
    const slideId = parseInt(id);
    const body = await request.json();

    // Schema'ya uygun alanları güncelle
    const updateData: any = {};

    if (body.tag !== undefined) updateData.tag = body.tag;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.desktopImage !== undefined)
      updateData.desktopImage = body.desktopImage;
    if (body.mobileImage !== undefined)
      updateData.mobileImage = body.mobileImage;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const slide = await prisma.heroSlide.update({
      where: { id: slideId },
      data: updateData,
    });

    return NextResponse.json({ slide });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Hero slide güncelleme hatası." },
      { status: 500 },
    );
  }
}
