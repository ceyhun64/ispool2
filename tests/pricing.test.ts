// tests/pricing.test.ts
//
// Ödeme tutar zincirinin birim testleri. CLAUDE.md Bölüm 8 gereği, tutar
// hesabını değiştiren düzeltmelerle birlikte eklendi.
//
// Çalıştırmak için: npm test
//
// Kapsanan bulgular:
//   PAY-001/002 — kupon tabanı ile tahsilat tabanının aynı olması
//   PAY-003     — sum(basketItems.price) === price (iyzico errorCode 5062)
//   PAY-008     — vade farkının yalnızca paidPrice'a bindirilmesi

import test from "node:test";
import assert from "node:assert/strict";
import { calculatePricing, buildIyzicoBasket } from "../lib/iyzico";
import {
  withKdv,
  getShippingFee,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "../lib/pricing";

type Item = { id: number | string; price: string };

const item = (id: number | string, price: number): Item => ({
  id,
  price: price.toFixed(2),
});

/** Yerel katalogdaki gerçek ürün fiyatları (prisma seed). */
const CATALOG = [1250, 2100, 145, 1450, 850, 275, 1750, 620, 3400, 2850];
const INSTALLMENTS = [1, 2, 3, 6, 9, 12];

/** Sunucudaki kalem toplamı hesabıyla aynı (order/route.ts). */
function lineTotal(
  unitPrice: number,
  quantity: number,
  bulkQty = 0,
  bulkRate = 0,
): number {
  let total = unitPrice * quantity;
  if (bulkQty && bulkRate && quantity >= bulkQty) {
    total -= (total * bulkRate) / 100;
  }
  return total;
}

// ---------------------------------------------------------------------------
// PAY-003 — iyzico 5062: kalem toplamı ile price birebir eşit olmalı
// ---------------------------------------------------------------------------

test("PAY-003: sum(basketItems.price) her zaman price'a eşittir", () => {
  let checked = 0;

  for (const productPrice of CATALOG) {
    for (let qty = 1; qty <= 5; qty++) {
      for (const installment of INSTALLMENTS) {
        for (const couponPct of [0, 10, 13, 20]) {
          const total = lineTotal(productPrice, qty, 3, 20);
          const items = [item(1, total)];

          const pre = calculatePricing(items, installment, 0);
          const discount = couponPct ? (pre.baseTotal * couponPct) / 100 : 0;

          const { basketItems, price } = buildIyzicoBasket(
            items,
            installment,
            discount,
          );

          const sum = basketItems
            .reduce((s, i) => s + parseFloat(i.price), 0)
            .toFixed(2);

          assert.equal(
            sum,
            price,
            `Uyuşmazlık: ürün=${productPrice} adet=${qty} taksit=${installment} kupon=%${couponPct} → price=${price} sum=${sum}`,
          );
          checked++;
        }
      }
    }
  }

  assert.equal(checked, 1200, "beklenen senaryo sayısı taranmadı");
});

test("PAY-003: kuruşlu fiyatlarda da kalem toplamı price'a eşittir", () => {
  // CLAUDE.md'nin istediği örnek: 10.01 × 3
  const items = [item(1, 10.01), item(2, 10.01), item(3, 10.01)];

  for (const installment of INSTALLMENTS) {
    for (const discount of [0, 5, 13.37]) {
      const { basketItems, price } = buildIyzicoBasket(
        items,
        installment,
        discount,
      );
      const sum = basketItems
        .reduce((s, i) => s + parseFloat(i.price), 0)
        .toFixed(2);
      assert.equal(sum, price, `taksit=${installment} indirim=${discount}`);
    }
  }
});

test("PAY-003: regresyon — 2850 TL ürün, 2 taksit (eski kodda 5062 veriyordu)", () => {
  const { basketItems, price, paidPrice } = buildIyzicoBasket(
    [item(10, 2850)],
    2,
    0,
  );
  const sum = basketItems
    .reduce((s, i) => s + parseFloat(i.price), 0)
    .toFixed(2);

  // Kritik olan nokta: eski kodda price=3244.72 iken kalem toplamı 3244.73
  // çıkıyor ve iyzico 5062 döndürüyordu. Artık price ham mal bedelidir ve
  // kalem toplamına birebir eşittir.
  assert.equal(price, "3135.00", "price ham mal bedeli olmalı");
  assert.equal(sum, price, "kalem toplamı price'a eşit olmalı");
  assert.equal(
    paidPrice,
    (3135 + 3135 * 0.035).toFixed(2),
    "paidPrice vade farkını içermeli",
  );
  assert.ok(parseFloat(paidPrice) > parseFloat(price));
});

// ---------------------------------------------------------------------------
// PAY-008 — vade farkı yalnızca paidPrice'a bindirilir
// ---------------------------------------------------------------------------

test("PAY-008: taksit farkı sepet kalemi olarak eklenmez", () => {
  const { basketItems } = buildIyzicoBasket([item(1, 1000)], 12, 0);
  assert.equal(
    basketItems.some((i) => i.id === "INSTALLMENT_FEE"),
    false,
    "INSTALLMENT_FEE kalemi iyzico dokümantasyonuna aykırıdır",
  );
});

test("PAY-008: tek çekimde price ile paidPrice eşit, taksitte paidPrice büyük", () => {
  const tek = buildIyzicoBasket([item(1, 1000)], 1, 0);
  assert.equal(tek.price, tek.paidPrice);

  const taksitli = buildIyzicoBasket([item(1, 1000)], 6, 0);
  assert.equal(taksitli.price, tek.price, "price taksitten etkilenmemeli");
  assert.ok(
    parseFloat(taksitli.paidPrice) > parseFloat(taksitli.price),
    "vade farkı paidPrice'a bindirilmeli",
  );
});

test("PAY-008: indirimli işlemde paidPrice, price'tan indirim kadar düşük", () => {
  const { price, paidPrice } = buildIyzicoBasket([item(1, 1000)], 1, 100);
  assert.equal(parseFloat(price) - parseFloat(paidPrice), 100);
});

// ---------------------------------------------------------------------------
// PAY-001/002 — kupon tabanı, tahsilat tabanıyla aynı olmalı
// ---------------------------------------------------------------------------

test("PAY-001: kupon tabanı kargo ücretini İÇERİR", () => {
  // 1250 TL ürün → KDV dahil 1375, kargo eşiğinin (2000) altında
  const items = [item(1, 1250)];
  const { baseTotal, shippingFee } = calculatePricing(items, 1, 0);

  assert.equal(shippingFee, SHIPPING_FEE, "bu sepette kargo ücretli olmalı");
  assert.equal(
    baseTotal,
    withKdv(1250) + SHIPPING_FEE,
    "kupon tabanı = KDV dahil ara toplam + kargo",
  );

  // İstemcinin gösterdiği taban (checkout.tsx) ile birebir aynı olmalı
  const clientBase = withKdv(1250) + getShippingFee(withKdv(1250));
  assert.equal(baseTotal, clientBase);
});

test("PAY-001: %20 kupon, gösterilen ile çekilen tutarı eşitler", () => {
  const items = [item(1, 1250)];
  const { baseTotal } = calculatePricing(items, 1, 0);

  const discount = (baseTotal * 20) / 100; // 304.98
  const { paidPrice } = buildIyzicoBasket(items, 1, discount);

  // Regresyon: eski kodda kupon 1375 üzerinden (275.00) hesaplanıyor,
  // müşteriye 1219.92 gösterilirken 1249.90 çekiliyordu.
  assert.equal(discount.toFixed(2), "304.98");
  assert.equal(paidPrice, "1219.92");
});

test("PAY-002: minAmount eşiği tek ve aynı taban üzerinden değerlendirilir", () => {
  const items = [item(1, 1150)];
  const { baseTotal } = calculatePricing(items, 1, 0);

  // İstemci /api/coupon/validate'e bu değeri gönderir (cartSummary.tsx)
  const clientCartTotal = withKdv(1150) + getShippingFee(withKdv(1150));

  assert.equal(baseTotal, clientCartTotal);

  // Eşik ikisinin arasına düşemez → sepette kabul edilip siparişte reddedilemez
  const minAmount = 1300;
  assert.equal(baseTotal >= minAmount, clientCartTotal >= minAmount);
});

// ---------------------------------------------------------------------------
// Kargo eşiği
// ---------------------------------------------------------------------------

test("kargo eşiği: sınır değerleri", () => {
  assert.equal(getShippingFee(FREE_SHIPPING_THRESHOLD - 0.01), SHIPPING_FEE);
  assert.equal(getShippingFee(FREE_SHIPPING_THRESHOLD), 0);
  assert.equal(getShippingFee(FREE_SHIPPING_THRESHOLD + 0.01), 0);
});

test("kargo eşiği: KDV dahil tutara göre değerlendirilir", () => {
  // KDV hariç 1900 → KDV dahil 2090 → kargo ücretsiz
  const { shippingFee } = calculatePricing([item(1, 1900)], 1, 0);
  assert.equal(shippingFee, 0);

  // KDV hariç 1800 → KDV dahil 1980 → kargo ücretli
  const alti = calculatePricing([item(1, 1800)], 1, 0);
  assert.equal(alti.shippingFee, SHIPPING_FEE);
});

// ---------------------------------------------------------------------------
// Varyant fiyat farkı ve toplu indirim
// ---------------------------------------------------------------------------

test("PAY-005: varyant modifier — base 100 + modifier 20 × adet 2 = 240", () => {
  const unitPrice = 100 + 20;
  const total = lineTotal(unitPrice, 2);
  assert.equal(total, 240);

  const { price } = buildIyzicoBasket([item(1, total)], 1, 0);
  // 240 + %10 hizmet bedeli + kargo
  assert.equal(price, (240 * 1.1 + SHIPPING_FEE).toFixed(2));
});

test("toplu indirim: eşiğin altında uygulanmaz, üstünde uygulanır", () => {
  assert.equal(lineTotal(1250, 2, 3, 20), 2500);
  assert.equal(lineTotal(1250, 3, 3, 20), 3000);
});

// ---------------------------------------------------------------------------
// Negatif tutar koruması
// ---------------------------------------------------------------------------

test("indirim sepetten büyükse toplam 0'a sabitlenir, kalem negatife düşmez", () => {
  const items = [item(1, 100)];
  const { basketItems, paidPrice } = buildIyzicoBasket(items, 1, 99999);

  assert.equal(paidPrice, "0.00");
  for (const i of basketItems) {
    assert.ok(
      parseFloat(i.paidPrice) >= 0,
      `negatif kalem paidPrice: ${i.id} = ${i.paidPrice}`,
    );
    assert.ok(parseFloat(i.price) > 0, `sıfır/negatif kalem price: ${i.id}`);
  }
});

// ---------------------------------------------------------------------------
// Sayı formatı — iyzico nokta ayraçlı bekler
// ---------------------------------------------------------------------------

test("tüm tutarlar nokta ayraçlı ve 2 ondalıklı gönderilir", () => {
  const { basketItems, price, paidPrice } = buildIyzicoBasket(
    [item(1, 1234.56)],
    3,
    10,
  );
  const pattern = /^\d+\.\d{2}$/;

  assert.match(price, pattern);
  assert.match(paidPrice, pattern);
  for (const i of basketItems) {
    assert.match(i.price, pattern, `kalem price formatı: ${i.id}`);
  }
});
