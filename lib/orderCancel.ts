// lib/orderCancel.ts
// Sipariş iptalinin tek kaynağı. Hem admin (PATCH /api/order) hem müşteri
// (PATCH /api/order/user) iptali buradan geçer: durum geçişi, iyzico iadesi,
// stok iadesi ve kupon sayacı iadesi tek transaction içinde yapılır.
import { prisma } from "@/lib/db";
import { voidIyzicoPayment } from "@/lib/iyzico";

// Yalnızca bu durumlardaki siparişler iptal edilebilir.
export const CANCELLABLE_STATUSES = ["pending", "paid"] as const;

export type CancelOrderResult =
  | { ok: true; refunded: boolean }
  | {
      ok: false;
      code: "NOT_FOUND" | "NOT_CANCELLABLE" | "REFUND_FAILED" | "ERROR";
      message: string;
    };

interface CancelOptions {
  /** Müşteri iptalinde verilir: yalnızca kendi siparişi iptal edilebilir. */
  userId?: number;
  /**
   * İade iyzico paneli üzerinden elle yapıldıysa true. Otomatik iade
   * denenmez; sadece durum/stok/kupon geri alınır.
   */
  skipRefund?: boolean;
  ip?: string;
}

export async function cancelOrder(
  orderId: number,
  options: CancelOptions = {},
): Promise<CancelOrderResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || (options.userId !== undefined && order.userId !== options.userId)) {
    return { ok: false, code: "NOT_FOUND", message: "Sipariş bulunamadı." };
  }

  if (!(CANCELLABLE_STATUSES as readonly string[]).includes(order.status)) {
    return {
      ok: false,
      code: "NOT_CANCELLABLE",
      message: "Bu sipariş artık iptal edilemez.",
    };
  }

  // Ödemesi alınmış (iyzico paymentId'si olan) sipariş iade gerektirir.
  const paymentId = order.iyziPaymentId || order.transactionId;
  const needsRefund = order.status === "paid" && !!paymentId && !options.skipRefund;

  try {
    let refunded = false;

    await prisma.$transaction(
      async (tx) => {
        // Durum korumalı güncelleme: iki eşzamanlı iptalden yalnızca biri geçer,
        // böylece stok/kupon iki kez iade edilmez.
        const claimed = await tx.order.updateMany({
          where: { id: orderId, status: { in: [...CANCELLABLE_STATUSES] } },
          data: { status: "cancelled" },
        });
        if (claimed.count === 0) throw new Error("NOT_CANCELLABLE");

        for (const item of order.items) {
          // Satırı olmayan (stok takibi yapılmayan) ürünlerde etkisiz kalır.
          await tx.productStock.updateMany({
            where: { productId: item.productId, sizeId: item.sizeId },
            data: { stock: { increment: item.quantity } },
          });
        }

        if (order.couponCode && (order.discountAmount ?? 0) > 0) {
          await tx.coupon.updateMany({
            where: { code: order.couponCode.toUpperCase(), usedCount: { gt: 0 } },
            data: { usedCount: { decrement: 1 } },
          });
        }

        // İade en sonda: başarısız olursa yukarıdaki her şey geri alınır.
        if (needsRefund) {
          const result = await voidIyzicoPayment(paymentId!, options.ip);
          if (result?.status !== "success") {
            const detail =
              result?.errorMessage || result?.errorCode || "yanıt alınamadı";
            throw new Error(`REFUND_FAILED:${detail}`);
          }
          refunded = true;
        }
      },
      { timeout: 20000, maxWait: 10000 },
    );

    return { ok: true, refunded };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === "NOT_CANCELLABLE") {
      return {
        ok: false,
        code: "NOT_CANCELLABLE",
        message: "Bu sipariş artık iptal edilemez.",
      };
    }
    if (message.startsWith("REFUND_FAILED:")) {
      return {
        ok: false,
        code: "REFUND_FAILED",
        message: message.slice("REFUND_FAILED:".length),
      };
    }
    console.error(`Sipariş #${orderId} iptal edilemedi:`, err);
    return { ok: false, code: "ERROR", message: "Sipariş iptal edilemedi." };
  }
}
