// app/api/order/user/route.ts - Schema'ya Uygun Düzenlenmiş
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { internalHeaders } from "@/lib/internalAuth";

interface CancelOrderBody {
  orderId: number;
}

// Helper: mail gönder
const sendMail = async (
  recipients: string[],
  subject: string,
  message: string,
) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-mail`, {
      method: "POST",
      headers: internalHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ recipients, subject, message }),
    });
  } catch (err) {
    console.error("Mail gönderilemedi:", err);
  }
};

// GET: Belirli kullanıcının siparişlerini getirme
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: Number(session.user.id) },
      include: {
        items: {
          include: {
            product: true,
            size: true, // Beden bilgisi
          },
        },
        addresses: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fiyatları TL'ye çevir (kuruştan)
    const formattedOrders = orders.map((order) => ({
      ...order,
      totalPrice: order.totalPrice / 100,
      paidPrice: order.paidPrice / 100,
      items: order.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    }));

    return NextResponse.json({ status: "success", orders: formattedOrders });
  } catch (error: any) {
    console.error("User Orders GET Error:", error);
    return NextResponse.json(
      { status: "failure", error: "Siparişler alınamadı" },
      { status: 500 },
    );
  }
}

// PATCH: Kullanıcı siparişini iptal et
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: CancelOrderBody = await req.json();
    const { orderId } = body;

    if (!orderId)
      return NextResponse.json(
        { status: "failure", error: "orderId gerekli" },
        { status: 400 },
      );

    // Kullanıcının kendi siparişi mi kontrol et
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        items: {
          include: {
            product: true,
            size: true, // Beden bilgisi
          },
        },
        addresses: true,
        user: true, // kullanıcının emailini almak için
      },
    });

    if (!order || order.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { status: "failure", error: "Sipariş bulunamadı veya erişim yok" },
        { status: 403 },
      );
    }

    // Eğer sipariş durumu delivered/shipped/cancelled ise iptal edilemez
    if (["delivered", "shipped", "cancelled"].includes(order.status)) {
      return NextResponse.json(
        { status: "failure", error: "Bu sipariş artık iptal edilemez." },
        { status: 400 },
      );
    }

    // Sadece cancelled olarak güncelle
    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: "cancelled" },
      include: {
        items: {
          include: {
            product: true,
            size: true, // Beden bilgisi
          },
        },
        addresses: true,
        user: true,
      },
    });

    // Kullanıcıya mail
    const userName = order.user?.name ?? order.user?.email ?? "User";
    const userEmail = order.user?.email ?? "";
    if (userEmail) {
      const userMessage = `Sayın ${userName},\n\n#${order.id} numaralı siparişiniz başarıyla iptal edilmiştir.\n\nTeşekkür ederiz.`;
      await sendMail(
        [userEmail],
        `Sipariş #${order.id} İptal Edildi`,
        userMessage,
      );
    }

    // Admin'e mail
    const adminMessage = `Kullanıcı ${userEmail}, #${order.id} numaralı siparişi iptal etti.`;
    await sendMail(
      ["info@ispool.com.tr"],
      `Sipariş #${order.id} Kullanıcı Tarafından İptal Edildi`,
      adminMessage,
    );

    // Fiyatları TL'ye çevir
    const formattedOrder = {
      ...updatedOrder,
      totalPrice: updatedOrder.totalPrice / 100,
      paidPrice: updatedOrder.paidPrice / 100,
    };

    return NextResponse.json({ status: "success", order: formattedOrder });
  } catch (error: any) {
    console.error("User Orders PATCH Error:", error);
    return NextResponse.json(
      { status: "failure", error: "Sipariş güncellenemedi" },
      { status: 500 },
    );
  }
}
