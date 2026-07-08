import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // ✅ Promise eklendi
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; // ✅ await eklendi
    const bannerId = parseInt(id);

    await prisma.banner.delete({
      where: { id: bannerId },
    });

    return NextResponse.json({ message: "Banner silindi." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Banner silme hatası." },
      { status: 500 },
    );
  }
}
