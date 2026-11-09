// app/api/order/user/route.ts - Schema'ya Uygun Düzenlenmiş
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail as sendMailDirect } from "@/lib/mailer";
import { cancelOrder } from "@/lib/orderCancel";
import { getClientIp } from "@/lib/rate-limit";

interface CancelOrderBody {
  orderId: number;
}

// Helper: mail gönder — doğrudan lib/mailer'ı çağırır (NEXT_PUBLIC_BASE_URL
// üzerinden kendi kendine HTTP isteği apex→www yönlendirmesi yüzünden
// kırılgandı).
const sendMail = async (
  recipients: string[],
  subject: string,
  message: string,
) => {
  try {
    await sendMailDirect({ to: recipients, subject, message });
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

    // İptal: sahiplik, durum, iyzico iadesi, stok ve kupon iadesi tek yerde
    const result = await cancelOrder(Number(orderId), {
      userId: Number(session.user.id),
      ip: getClientIp(req),
    });
    if (!result.ok) {
      const httpStatus =
        result.code === "NOT_FOUND"
          ? 403
          : result.code === "NOT_CANCELLABLE"
            ? 400
            : result.code === "REFUND_FAILED"
              ? 502
              : 500;
      return NextResponse.json(
        {
          status: "failure",
          error:
            result.code === "REFUND_FAILED"
              ? "Ödemeniz iade edilemediği için sipariş iptal edilemedi. Lütfen bizimle iletişime geçin."
              : result.message,
        },
        { status: httpStatus },
      );
    }

    const updatedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: Number(orderId) },
      include: {
        items: { include: { product: true, size: true } },
        addresses: true,
        user: true,
      },
    });
    const order = updatedOrder;

    // Kullanıcıya mail
    const userName = order.user?.name ?? order.user?.email ?? "User";
    const userEmail = order.user?.email ?? "";
    if (userEmail) {
      const userMessage = `Sayın ${userName},\n\n#${order.id} numaralı siparişiniz başarıyla iptal edilmiştir.${result.refunded ? " Ödemeniz için iade işlemi başlatılmıştır; kartınıza yansıma süresi bankanıza bağlıdır." : ""}\n\nTeşekkür ederiz.`;
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
