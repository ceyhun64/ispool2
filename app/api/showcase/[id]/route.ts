import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const imageId = parseInt(id);

    await prisma.showcaseImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ message: "Örnek çalışma silindi." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Örnek çalışma silme hatası." },
      { status: 500 },
    );
  }
}
