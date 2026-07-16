// app/api/order/route.ts - Schema'ya Uygun Düzenlenmiş Versiyon
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { internalHeaders } from "@/lib/internalAuth";
import { calculatePricing, voidIyzicoPayment } from "@/lib/iyzico";

interface BasketItem {
  id: number;
  productId?: number;
  name: string;
  totalPrice: number;
  unitPrice: number;
  category?: string;
  quantity?: number;
  sizeId?: number; // Değişti: size yerine sizeId
  customImage?: string;
}

interface Address {
  firstName?: string;
  lastName?: string;
  address: string;
  district: string;
  city: string;
  zipCode?: string;
  zip?: string;
  phone: string;
  country: string;
  tcno?: string;
  billingType?: "bireysel" | "kurumsal";
}

interface CreateOrderBody {
  basketItems: BasketItem[];
  shippingAddress: Address;
  billingAddress: Address;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  paymentCard: any;
  buyer: any;
  installment?: number;
  couponCode?: string;
}

interface UpdateOrderBody {
  orderId: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
}

// Helper: mail gönder
const sendMail = async (
  recipients: string[],
  subject: string,
  message: string,
) => {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-mail`, {
    method: "POST",
    headers: internalHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ recipients, subject, message }),
  });
};

// POST: Yeni sipariş ve ödeme
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "failure", error: "Bu işlem için giriş yapmalısınız" },
        { status: 401 },
      );
    }
    const userId = Number(session.user.id);

    const body: CreateOrderBody = await req.json();
    const {
      basketItems,
      shippingAddress,
      billingAddress,
      currency,
      paymentMethod,
      firstName,
      lastName,
      email,
      paymentCard,
      installment = 1,
      couponCode = null,
    } = body;

    if (!basketItems || basketItems.length === 0) {
      return NextResponse.json(
        { status: "failure", error: "Sepet boş" },
        { status: 400 },
      );
    }

    // --- Sunucu tarafında fiyat & stok doğrulama ---------------------------
    // Fiyatlar HİÇBİR ZAMAN client'tan alınmaz; her zaman DB'deki güncel ürün
    // fiyatı üzerinden yeniden hesaplanır (fiyat manipülasyonunu engeller).
    const productIds = [...new Set(basketItems.map((i) => Number(i.id)))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { stock: true, category: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    interface RecalculatedItem {
      productId: number;
      name: string;
      category: string;
      quantity: number;
      sizeId: number | null;
      customImage: string | null;
      unitPrice: number;
      totalPrice: number;
      hasStockTracking: boolean;
    }

    const recalculatedItems: RecalculatedItem[] = [];

    for (const item of basketItems) {
      const productId = Number(item.id);
      const product = productMap.get(productId);
      if (!product) {
        return NextResponse.json(
          { status: "failure", error: `Ürün bulunamadı (#${productId})` },
          { status: 400 },
        );
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const sizeId = item.sizeId ? Number(item.sizeId) : null;

      let priceModifier = 0;
      const hasStockTracking = product.stock.length > 0;
      if (hasStockTracking) {
        const stockRow =
          product.stock.find((s) => s.sizeId === sizeId) ??
          product.stock.find((s) => s.sizeId === null);
        if (!stockRow || stockRow.stock < quantity) {
          return NextResponse.json(
            {
              status: "failure",
              error: `${product.title} için yeterli stok yok`,
            },
            { status: 400 },
          );
        }
        priceModifier = stockRow.priceModifier || 0;
      }

      const unitPrice = product.price + priceModifier;
      let itemTotal = unitPrice * quantity;
      if (
        product.bulkDiscountQty &&
        product.bulkDiscountRate &&
        quantity >= product.bulkDiscountQty
      ) {
        itemTotal -= (itemTotal * product.bulkDiscountRate) / 100;
      }

      recalculatedItems.push({
        productId,
        name: product.title,
        category: product.category?.name ?? "Genel",
        quantity,
        sizeId,
        customImage: item.customImage || null,
        unitPrice,
        totalPrice: itemTotal,
        hasStockTracking,
      });
    }

    const subtotal = recalculatedItems.reduce((s, i) => s + i.totalPrice, 0);
    const baseTotal = subtotal * 1.1; // %10 hizmet bedeli — calculatePricing ile aynı formül

    // --- Kupon sunucu tarafında yeniden doğrulanır --------------------------
    let validatedDiscount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (!coupon || !coupon.isActive) {
        return NextResponse.json(
          { status: "failure", error: "Geçersiz veya süresi dolmuş kupon" },
          { status: 400 },
        );
      }
      if (coupon.expiryDate && new Date() > coupon.expiryDate) {
        return NextResponse.json(
          { status: "failure", error: "Kuponun süresi dolmuş" },
          { status: 400 },
        );
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json(
          { status: "failure", error: "Kupon kullanım sınırı doldu" },
          { status: 400 },
        );
      }
      if (coupon.minAmount && baseTotal < coupon.minAmount) {
        return NextResponse.json(
          {
            status: "failure",
            error: `Bu kupon en az ${coupon.minAmount} TL tutarındaki sepetlerde geçerlidir.`,
          },
          { status: 400 },
        );
      }

      if (coupon.type === "PERCENTAGE") {
        validatedDiscount = (baseTotal * coupon.value) / 100;
        if (coupon.maxDiscount && validatedDiscount > coupon.maxDiscount) {
          validatedDiscount = coupon.maxDiscount;
        }
      } else {
        validatedDiscount = Math.min(coupon.value, baseTotal);
      }
    }

    // Buyer objesi — kimlik (id) her zaman oturumdan, iletişim bilgileri formdan
    const buyer = {
      id: userId.toString(),
      name: body.buyer?.buyerName || body.buyer?.name || "",
      surname: body.buyer?.buyerSurname || body.buyer?.surname || "",
      email: body.buyer?.email || email || "",
      identityNumber: body.buyer?.identityNumber || "11111111111",
      registrationAddress: body.shippingAddress?.address || "",
      registrationDate:
        body.buyer?.registrationDate || new Date().toISOString(),
      lastLoginDate: body.buyer?.lastLoginDate || new Date().toISOString(),
      phone: body.buyer?.phone || shippingAddress.phone || "",
      city: body.buyer?.city || shippingAddress.city || "",
      country: body.buyer?.country || shippingAddress.country || "Türkiye",
      zipCode: body.buyer?.zipCode || shippingAddress.zipCode || "",
      ip: body.buyer?.ip || "127.0.0.1",
    };

    // Shipping & Billing adres
    const shipping = {
      contactName: `${buyer.name} ${buyer.surname}`.trim(),
      city: shippingAddress.city ?? "",
      country: shippingAddress.country ?? "Türkiye",
      address: shippingAddress.address ?? "",
      zipCode: shippingAddress.zip ?? shippingAddress.zipCode ?? "",
    };

    const billing = {
      contactName: `${buyer.name} ${buyer.surname}`.trim(),
      city: billingAddress.city ?? "",
      country: billingAddress.country ?? "Türkiye",
      address: billingAddress.address ?? "",
      zipCode: billingAddress.zip ?? billingAddress.zipCode ?? "",
    };

    // Basket items formatlama — SUNUCUDA HESAPLANAN fiyatlarla
    const basketItemsFormatted = recalculatedItems.map((item) => ({
      id: item.productId.toString(),
      name: item.name,
      category1: item.category,
      itemType: "PHYSICAL",
      price: item.totalPrice.toFixed(2),
    }));

    // Payment card formatlama
    const paymentCardFormatted = {
      cardHolderName: paymentCard.cardHolderName,
      cardNumber: paymentCard.cardNumber,
      expireMonth: paymentCard.expireMonth,
      expireYear: paymentCard.expireYear,
      cvc: paymentCard.cvc,
    };

    // Payment API payload (KUPON BİLGİSİ DAHİL)
    const paymentPayload = {
      paymentCard: paymentCardFormatted,
      buyer,
      shippingAddress: shipping,
      billingAddress: billing,
      basketItems: basketItemsFormatted,
      currency: currency ?? "TRY",
      basketId: "B" + Date.now(),
      installment: installment,
      discountAmount: validatedDiscount,
      couponCode: couponCode,
    };

    // Payment API çağrısı (sunucu içi, internal secret ile korunuyor)
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    const paymentRes = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: internalHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(paymentPayload),
    });

    if (!paymentRes.ok) {
      const errText = await paymentRes.text();
      console.error("❌ Payment API HTTP hatası:", paymentRes.status, errText);
      return NextResponse.json(
        {
          status: "failure",
          error: "Ödeme başarısız, lütfen tekrar deneyin",
        },
        { status: 400 },
      );
    }

    const paymentResult = await paymentRes.json();

    if (!paymentResult || paymentResult.status !== "success") {
      console.error("❌ İyzipay ödeme hatası:", paymentResult);
      return NextResponse.json(
        {
          status: "failure",
          error:
            paymentResult?.error ||
            paymentResult?.errorMessage ||
            "Ödeme başarısız",
          errorCode: paymentResult?.errorCode,
        },
        { status: 400 },
      );
    }

    // Gerçek ödenen/liste tutarları — iyzico'ya gönderilenle AYNI formülle hesaplanır
    const pricingNoDiscount = calculatePricing(basketItemsFormatted, installment, 0);
    const pricingWithDiscount = calculatePricing(
      basketItemsFormatted,
      installment,
      validatedDiscount,
    );

    // --- Sipariş kaydı + stok düşümü + kupon sayacı tek transaction'da -----
    // Ödeme başarılı olduktan sonra bu adım başarısız olursa (ör. eşzamanlı
    // bir başka sipariş stoğu tüketmişse) tahsilat otomatik iade edilir.
    let order;
    try {
      order = await prisma.$transaction(async (tx) => {
        for (const item of recalculatedItems) {
          if (!item.hasStockTracking) continue;
          const result = await tx.productStock.updateMany({
            where: {
              productId: item.productId,
              sizeId: item.sizeId,
              stock: { gte: item.quantity },
            },
            data: { stock: { decrement: item.quantity } },
          });
          if (result.count === 0) {
            throw new Error(`STOCK_UNAVAILABLE:${item.name}`);
          }
        }

        if (couponCode && validatedDiscount > 0) {
          await tx.coupon.update({
            where: { code: couponCode.toUpperCase() },
            data: { usedCount: { increment: 1 } },
          });
        }

        return tx.order.create({
          data: {
            userId,
            status: "paid",
            // totalPrice ve paidPrice Int olarak schema'da tanımlı - kuruş cinsinden saklanmalı
            totalPrice: Math.round(pricingNoDiscount.total * 100),
            paidPrice: Math.round(pricingWithDiscount.total * 100),
            currency: currency || "TRY",
            paymentMethod: paymentMethod || "iyzipay",
            transactionId: paymentResult?.paymentId || null,
            installment: installment,
            couponCode: couponCode || null,
            discountAmount: validatedDiscount || null,
            items: {
              create: recalculatedItems.map((item) => ({
                product: { connect: { id: item.productId } },
                customImage: item.customImage,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                ...(item.sizeId && {
                  size: { connect: { id: item.sizeId } },
                }),
              })),
            },
            addresses: {
              create: [
                {
                  type: "shipping",
                  firstName: body.buyer?.buyerName ?? "",
                  lastName: body.buyer?.buyerSurname ?? "",
                  address: shippingAddress.address ?? "",
                  district: shippingAddress.district ?? "",
                  city: shippingAddress.city ?? "",
                  zip: shippingAddress.zip ?? shippingAddress.zipCode ?? "",
                  phone: body.buyer?.phone ?? "",
                  country: shippingAddress.country ?? "Türkiye",
                  tcno: shippingAddress.tcno ?? body.buyer?.tcno ?? "",
                },
                {
                  type: "billing",
                  firstName:
                    billingAddress.firstName ?? body.buyer?.buyerName ?? "",
                  lastName:
                    billingAddress.lastName ?? body.buyer?.buyerSurname ?? "",
                  address: billingAddress.address ?? "",
                  district: billingAddress.district ?? "",
                  city: billingAddress.city ?? "",
                  zip: billingAddress.zip ?? billingAddress.zipCode ?? "",
                  phone: body.buyer?.phone ?? "",
                  country: billingAddress.country ?? "Türkiye",
                  tcno: billingAddress.tcno ?? body.buyer?.tcno ?? "",
                  billingType:
                    billingAddress.billingType === "kurumsal" ||
                    billingAddress.billingType === "bireysel"
                      ? billingAddress.billingType
                      : null,
                },
              ],
            },
          },
          include: { items: true, addresses: true },
        });
      });
    } catch (txErr: any) {
      console.error(
        "💥 Sipariş kaydı oluşturulamadı, ödeme iade ediliyor:",
        txErr,
      );
      if (paymentResult?.paymentId) {
        await voidIyzicoPayment(paymentResult.paymentId, buyer.ip);
      }
      const message: string = txErr?.message ?? "";
      const stockIssue = message.startsWith("STOCK_UNAVAILABLE:");
      return NextResponse.json(
        {
          status: "failure",
          error: stockIssue
            ? `${message.split(":")[1]} için stok tükendi, ödemeniz iade edildi.`
            : "Sipariş oluşturulamadı, ödemeniz iade edildi.",
        },
        { status: 409 },
      );
    }

    // Format helper - kuruştan TL'ye çevirme
    const formatPrice = (priceInCents: number) =>
      (priceInCents / 100).toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    // Taksit bilgisini formatlama
    const installmentText =
      installment > 1 ? `${installment} Taksit` : "Tek Çekim";

    const monthlyPayment =
      installment > 1 ? (pricingNoDiscount.total / installment).toFixed(2) : null;

    // Mail Gönderimi
    try {
      // Müşteri onay maili
      if (buyer.email) {
        await sendMail(
          [buyer.email],
          `Siparişiniz Başarıyla Alınmıştır - #${order.id}`,
          `
Sayın ${firstName || ""} ${lastName || ""},

**İŞPOOL** üzerinden vermiş olduğunuz **#${
            order.id
          }** numaralı siparişiniz başarıyla oluşturulmuş ve ödemesi onaylanmıştır.

**Sipariş Detayları:**
* **Sipariş Numarası:** #${order.id}
* **Sipariş Tarihi:** ${new Date().toLocaleDateString("tr-TR")}
* **Ödeme Şekli:** ${installmentText}
${
  monthlyPayment
    ? `* **Aylık Ödeme:** ${formatPrice(Number(monthlyPayment) * 100)} ${currency}`
    : ""
}
${
  couponCode && validatedDiscount
    ? `* **Kullanılan Kupon:** ${couponCode} (-${validatedDiscount.toFixed(2)} ${currency})`
    : ""
}
* **Toplam Tutar (KDV Dahil):** ${formatPrice(order.totalPrice)} ${currency || "TRY"}
* **Ödenen Tutar (KDV Dahil):** ${formatPrice(order.paidPrice)} ${currency || "TRY"}
* **Ödeme Yöntemi:** ${paymentMethod || "Kredi Kartı"}

**Sipariş Edilen Ürünler:**
${recalculatedItems
  .map(
    (item) =>
      `• ${item.name} (${item.quantity} Adet) — Birim Fiyat: ${item.unitPrice.toFixed(2)} ${currency}`,
  )
  .join("\n")}

**Teslimat Adresi:**
* **Alıcı Adı:** ${shippingAddress.firstName || firstName || ""} ${
            shippingAddress.lastName || lastName || ""
          }
* **Adres:** ${shippingAddress.address}
* **İl/İlçe:** ${shippingAddress.city} / ${shippingAddress.district}
* **Telefon:** ${shippingAddress.phone}

${
  installment > 1
    ? `\n**Taksit Bilgisi:**\nÖdemeniz ${installment} taksit olarak alınacaktır. Her ay ${monthlyPayment} ${currency} tutarında ödeme kartınızdan çekilecektir.`
    : ""
}

${
  couponCode && validatedDiscount
    ? `\n**İndirim Bilgisi:**\n${couponCode} kupon koduyla ${validatedDiscount.toFixed(2)} ${currency} indirim kazandınız!`
    : ""
}

Siparişinizin tüm aşamaları hakkında e-posta ile bilgilendirileceksiniz.

Bizi tercih ettiğiniz için teşekkür eder, iyi günler dileriz.

Saygılarımızla,
**İŞPOOL Ekibi**
`,
        );
      }

      // Admin bilgilendirme maili
      await sendMail(
        ["info@ispool.com.tr"],
        `🔔 Yeni Sipariş Kaydı - Acil İşlem Gerekiyor: #${order.id}`,
        `
Sayın Yönetici,

Web sitesi üzerinden yeni bir sipariş başarıyla alınmış ve ödemesi onaylanmıştır.

**Genel Sipariş Bilgileri:**
* **Sipariş Numarası:** #${order.id}
* **Müşteri ID:** ${userId}
* **Müşteri E-posta:** ${buyer.email || "Belirtilmemiş"}
* **Ödeme Şekli:** ${installmentText}
${monthlyPayment ? `* **Aylık Ödeme:** ${monthlyPayment} ${currency}` : ""}
${
  couponCode && validatedDiscount
    ? `* **Kullanılan Kupon:** ${couponCode} (-${validatedDiscount.toFixed(2)} ${currency})`
    : ""
}
* **Ödenen Tutar:** ${formatPrice(order.paidPrice)} ${currency || "TRY"}
* **Ödeme Yöntemi:** ${paymentMethod || "Kredi Kartı"}

**Sipariş Kalemleri:**
${recalculatedItems
  .map(
    (item) =>
      `• ${item.name} — Miktar: ${item.quantity} Adet — Toplam Fiyat: ${item.totalPrice.toFixed(2)} ${currency}`,
  )
  .join("\n")}

**Teslimat Bilgileri:**
* **Adres:** ${shippingAddress.address}
* **İl/İlçe:** ${shippingAddress.city} / ${shippingAddress.district}
* **Telefon:** ${shippingAddress.phone}

Lütfen siparişin detaylarını kontrol ederek üretim ve gönderim sürecini başlatınız.

İyi çalışmalar.
`,
      );
    } catch (mailErr) {
      console.error("⚠️ Mail gönderimi sırasında hata:", mailErr);
    }

    return NextResponse.json({ status: "success", order, paymentResult });
  } catch (err: any) {
    console.error("💥 Order POST Error:", err);
    return NextResponse.json(
      { status: "failure", error: "Sipariş oluşturulamadı" },
      { status: 500 },
    );
  }
}

// GET: Tüm siparişleri getirme
export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true, size: true } },
        addresses: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fiyatları TL'ye çevir
    const formattedOrders = orders.map((order) => ({
      ...order,
      totalPrice: order.totalPrice / 100,
      paidPrice: order.paidPrice / 100,
    }));

    return NextResponse.json({ status: "success", orders: formattedOrders });
  } catch (error: any) {
    console.error("Order GET Error:", error);
    return NextResponse.json(
      { status: "failure", error: "Siparişler alınamadı" },
      { status: 500 },
    );
  }
}

// PATCH: Sipariş durumunu güncelle
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body: UpdateOrderBody = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { status: "failure", error: "orderId ve status gerekli" },
        { status: 400 },
      );
    }

    const validStatuses: UpdateOrderBody["status"][] = [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { status: "failure", error: "Geçersiz sipariş durumu" },
        { status: 400 },
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status },
      include: {
        items: { include: { product: true, size: true } },
        addresses: true,
        user: true,
      },
    });

    const statusMap: { [key in UpdateOrderBody["status"]]: string } = {
      pending: "Beklemede",
      paid: "Ödeme Alındı (Hazırlanıyor)",
      shipped: "Kargoya Verildi",
      delivered: "Teslim Edildi",
      cancelled: "İptal Edildi",
    };

    const turkishStatus = statusMap[updatedOrder.status] || updatedOrder.status;

    // Kullanıcı bilgilendirme maili
    if (updatedOrder.user?.email) {
      let specificNote = "";
      if (updatedOrder.status === "shipped") {
        specificNote =
          "Siparişiniz kargo firmasına teslim edilmiştir. Takip numaranızı e-postanıza ekleyerek güncel durumu izleyebilirsiniz.";
      } else if (updatedOrder.status === "delivered") {
        specificNote =
          "Siparişiniz başarıyla adresinize teslim edilmiştir. Ürünlerimizle ilgili deneyiminizi bizimle paylaşmanız bizi mutlu edecektir.";
      } else if (updatedOrder.status === "cancelled") {
        specificNote =
          "Talebiniz üzerine veya operasyonel bir nedenle siparişiniz iptal edilmiştir. Geri ödeme süreciniz bankanıza bağlı olarak kısa süre içinde başlatılacaktır.";
      } else if (updatedOrder.status === "paid") {
        specificNote =
          "Ödemeniz alınmış olup, siparişiniz hazırlanma aşamasına geçmiştir.";
      }

      const userMessage = `
Sayın ${updatedOrder.user.name || updatedOrder.user.email},

**#${updatedOrder.id}** numaralı siparişinizin durumu güncellenmiştir.

**Yeni Durum:** **${turkishStatus}**

${specificNote ? `\n${specificNote}` : ""}

Güncel sipariş bilgilerinizi web sitemizdeki hesabınız üzerinden de takip edebilirsiniz.

Saygılarımızla,
**İŞPOOL Ekibi**
`;

      await sendMail(
        [updatedOrder.user.email],
        `Sipariş Durumunuz Güncellendi: #${updatedOrder.id}`,
        userMessage,
      );
    }

    // Admin bilgilendirme maili
    const adminMessage = `
**#${
      updatedOrder.id
    }** numaralı siparişin durumu başarılı bir şekilde güncellenmiştir.

**Yeni Durum:** **${turkishStatus}** (${updatedOrder.status})
**Güncelleme Zamanı:** ${new Date().toLocaleString("tr-TR")}
`;

    await sendMail(
      ["info@ispool.com.tr"],
      `✅ Sipariş Durumu Değişikliği: #${updatedOrder.id}`,
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
    console.error("Order PATCH Error:", error);
    return NextResponse.json(
      { status: "failure", error: "Sipariş güncellenemedi" },
      { status: 500 },
    );
  }
}
