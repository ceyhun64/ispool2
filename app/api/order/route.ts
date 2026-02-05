// app/api/order/route.ts - Kupon İndirimini Payment API'ye Geçir
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface BasketItem {
  id: number;
  productId?: number;
  name: string;
  totalPrice: number;
  unitPrice: number;
  category?: string;
  quantity?: number;
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
}

interface CreateOrderBody {
  userId: number;
  basketItems: BasketItem[];
  shippingAddress: Address;
  billingAddress: Address;
  totalPrice: number;
  paidPrice: number;
  baseTotalPrice?: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  paymentCard: any;
  buyer: any;
  installment?: number;
  couponCode?: string; // 🎟️ KUPON KODU
  discountAmount?: number; // 🎟️ İNDİRİM TUTARI
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipients, subject, message }),
  });
};

// POST: Yeni sipariş ve ödeme
export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderBody = await req.json();
    const {
      userId,
      basketItems,
      shippingAddress,
      billingAddress,
      totalPrice,
      paidPrice,
      baseTotalPrice,
      currency,
      paymentMethod,
      firstName,
      lastName,
      email,
      paymentCard,
      installment = 1,
      couponCode = null, // 🎟️ KUPON KODU
      discountAmount = 0, // 🎟️ İNDİRİM TUTARI
    } = body;

    if (!userId || !basketItems || basketItems.length === 0) {
      return NextResponse.json(
        { status: "failure", error: "Geçerli kullanıcı veya ürün yok" },
        { status: 400 },
      );
    }

    // Buyer objesi
    const buyer = {
      id: body.buyer?.id?.toString() || userId.toString(),
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

    // Basket items formatlama
    const basketItemsFormatted = basketItems.map((item) => ({
      id: item.id.toString(),
      name: item.name ?? "Ürün",
      category1: item.category ?? "Kategori",
      itemType: "PHYSICAL",
      price: Number(item.totalPrice || item.unitPrice).toFixed(2),
    }));

    // Payment card formatlama
    const paymentCardFormatted = {
      cardHolderName: paymentCard.cardHolderName,
      cardNumber: paymentCard.cardNumber,
      expireMonth: paymentCard.expireMonth,
      expireYear: paymentCard.expireYear,
      cvc: paymentCard.cvc,
    };

    // 🎟️ Payment API payload (KUPON BİLGİSİ DAHİL)
    const paymentPayload = {
      paymentCard: paymentCardFormatted,
      buyer,
      shippingAddress: shipping,
      billingAddress: billing,
      basketItems: basketItemsFormatted,
      currency: currency ?? "TRY",
      basketId: "B" + Date.now(),
      installment: installment,
      discountAmount: discountAmount, // 🎟️ İNDİRİM TUTARI
      couponCode: couponCode, // 🎟️ KUPON KODU
    };

    // Payment API çağrısı
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    console.log("🔄 Payment API çağrılıyor:", `${baseUrl}/api/payment`);
    console.log("💳 Taksit sayısı:", installment);
    console.log("🎟️ Kupon kodu:", couponCode || "YOK");
    console.log("💰 İndirim tutarı:", discountAmount);

    const paymentRes = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentPayload),
    });

    if (!paymentRes.ok) {
      const errText = await paymentRes.text();
      console.error("❌ Payment API HTTP hatası:", paymentRes.status, errText);
      return NextResponse.json(
        {
          status: "failure",
          error: "Ödeme başarısız: " + errText,
        },
        { status: 400 },
      );
    }

    const paymentResult = await paymentRes.json();
    console.log("💳 Payment API response:", paymentResult);

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

    console.log("✅ Ödeme başarılı! Sipariş oluşturuluyor...");

    // 🎟️ Kupon kullanımını güncelle (eğer kupon varsa)
    if (couponCode && discountAmount > 0) {
      try {
        await prisma.coupon.update({
          where: { code: couponCode },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
        console.log(`✅ Kupon kullanım sayısı güncellendi: ${couponCode}`);
      } catch (couponError) {
        console.error("⚠️ Kupon güncelleme hatası:", couponError);
        // Kupon güncellenemese bile sipariş devam etsin
      }
    }

    // Veritabanına kaydet - UPDATED: Schema'ya göre düzenlendi
    const order = await prisma.order.create({
      data: {
        userId: Number(userId),
        status: "paid",
        // totalPrice ve paidPrice Int olarak schema'da tanımlı - kuruş cinsinden saklanmalı
        totalPrice: Math.round(Number(totalPrice) * 100), // TL'yi kuruşa çevir
        paidPrice: Math.round(Number(paidPrice) * 100), // TL'yi kuruşa çevir
        currency: currency || "TRY",
        paymentMethod: paymentMethod || "iyzipay",
        transactionId: paymentResult?.paymentId || null,
        installment: installment,
        couponCode: couponCode || null, // 🎟️ KUPON KODU (nullable)
        discountAmount: discountAmount ? Number(discountAmount) : null, // Float, nullable
        items: {
          create: basketItems.map((item) => ({
            product: {
              connect: { id: Number(item.id) },
            },
            quantity: Number(item.quantity || 1),
            unitPrice: Number(item.unitPrice || 0),
            totalPrice: Number(item.totalPrice || 0),
            // sizeId eklenmedi çünkü basketItems'ta yok - gerekirse ekleyin
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
              firstName: body.buyer?.buyerName ?? "",
              lastName: body.buyer?.buyerSurname ?? "",
              address: billingAddress.address ?? "",
              district: billingAddress.district ?? "",
              city: billingAddress.city ?? "",
              zip: billingAddress.zip ?? billingAddress.zipCode ?? "",
              phone: body.buyer?.phone ?? "",
              country: billingAddress.country ?? "Türkiye",
              tcno: billingAddress.tcno ?? body.buyer?.tcno ?? "",
            },
          ],
        },
      },
      include: { items: true, addresses: true },
    });

    console.log("✅ Sipariş oluşturuldu:", order.id);

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
      installment > 1 ? (Number(totalPrice) / installment).toFixed(2) : null;

    // Mail Gönderimi
    try {
      // Müşteri onay maili
      if (buyer.email) {
        await sendMail(
          [buyer.email],
          `Siparişiniz Başarıyla Alınmıştır - #${order.id}`,
          `
Sayın ${firstName || ""} ${lastName || ""},

**BALKOLÜX** üzerinden vermiş olduğunuz **#${
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
  couponCode && discountAmount
    ? `* **Kullanılan Kupon:** ${couponCode} (-${discountAmount.toFixed(2)} ${currency})`
    : ""
}
* **Toplam Tutar (KDV Dahil):** ${formatPrice(order.totalPrice)} ${currency || "TRY"}
* **Ödenen Tutar (KDV Dahil):** ${formatPrice(order.paidPrice)} ${currency || "TRY"}
${
  baseTotalPrice && installment > 1
    ? `* **Taksitsiz Tutar:** ${baseTotalPrice.toFixed(2)} ${currency}`
    : ""
}
* **Ödeme Yöntemi:** ${paymentMethod || "Kredi Kartı"}

**Sipariş Edilen Ürünler:**
${basketItems
  .map(
    (item) =>
      `• ${item.name} (${item.quantity} Adet) — Birim Fiyat: ${(item.unitPrice || item.totalPrice).toFixed(2)} ${currency}`,
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
  couponCode && discountAmount
    ? `\n**İndirim Bilgisi:**\n${couponCode} kupon koduyla ${discountAmount.toFixed(2)} ${currency} indirim kazandınız!`
    : ""
}

Siparişinizin tüm aşamaları hakkında e-posta ile bilgilendirileceksiniz.

Bizi tercih ettiğiniz için teşekkür eder, iyi günler dileriz.

Saygılarımızla, 
**BALKOLÜX Ekibi**
`,
        );
      }

      // Admin bilgilendirme maili
      await sendMail(
        ["ispoolofficial@gmail.com"],
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
  couponCode && discountAmount
    ? `* **Kullanılan Kupon:** ${couponCode} (-${discountAmount.toFixed(2)} ${currency})`
    : ""
}
* **Ödenen Tutar:** ${formatPrice(order.paidPrice)} ${currency || "TRY"}
* **Ödeme Yöntemi:** ${paymentMethod || "Kredi Kartı"}

**Sipariş Kalemleri:**
${basketItems
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
      { status: "failure", error: err.message },
      { status: 500 },
    );
  }
}

// GET: Tüm siparişleri getirme
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true, size: true } }, // size eklendi
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
      { status: "failure", error: error.message },
      { status: 500 },
    );
  }
}

// PATCH: Sipariş durumunu güncelle
export async function PATCH(req: NextRequest): Promise<NextResponse> {
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
        items: { include: { product: true, size: true } }, // size eklendi
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
**BALKOLÜX Ekibi**
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
      ["ispoolofficial@gmail.com"],
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
      { status: "failure", error: error.message },
      { status: 500 },
    );
  }
}
