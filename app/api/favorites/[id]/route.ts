import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// DELETE /api/favorite/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params artık Promise
) {
  const { id } = await context.params; // 👈 await ile çöz

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = Number(id);
  if (isNaN(productId) || productId <= 0) {
    return NextResponse.json(
      { error: "Invalid or missing productId" },
      { status: 400 }
    );
  }

  try {
    const deleted = await prisma.favorite.deleteMany({
      where: {
        userId: Number(session.user.id),
        productId,
      },
    });

    return NextResponse.json({ deletedCount: deleted.count });
  } catch (error: any) {
    console.error("Favorite DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete favorite" },
      { status: 500 }
    );
  }
}
