// app/api/address/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

// 📌 PATCH: Adres güncelle
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // params artık Promise
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const addressId = Number(id);
    if (isNaN(addressId)) {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 }
      );
    }

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (
      !existingAddress ||
      existingAddress.userId !== Number(session.user.id)
    ) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    // TC validation (opsiyonel)
    if (body.tcno && (body.tcno.length !== 11 || !/^[0-9]+$/.test(body.tcno))) {
      return NextResponse.json({ error: "Invalid TC number" }, { status: 400 });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        title: body.title ?? existingAddress.title,
        firstName: body.firstName ?? existingAddress.firstName,
        lastName: body.lastName ?? existingAddress.lastName,
        address: body.address ?? existingAddress.address,
        neighborhood: body.neighborhood ?? existingAddress.neighborhood,
        district: body.district ?? existingAddress.district,
        city: body.city ?? existingAddress.city,
        zip: body.zip ?? existingAddress.zip,
        phone: body.phone ?? existingAddress.phone,
        country: body.country ?? existingAddress.country,
        tcno: body.tcno ?? existingAddress.tcno,
      },
    });

    return NextResponse.json({ address: updatedAddress });
  } catch (error) {
    console.error("Failed to update address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// 📌 DELETE: Adres sil
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addressId = Number(id);
    if (isNaN(addressId)) {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 }
      );
    }

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (
      !existingAddress ||
      existingAddress.userId !== Number(session.user.id)
    ) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.address.delete({ where: { id: addressId } });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Failed to delete address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
