import React from "react";
import Link from "next/link";

const reasons = [
  {
    title: "İhtiyacınız tek yerde",
    text: "İş elbiseleri, iş ayakkabıları, iş eldivenleri, koruyucu teknik kıyafetler ve iş güvenlik ekipmanları aynı mağazada. Kategorilerden ya da filtrelerden ürünü bulup doğrudan sipariş verebilirsiniz.",
    href: "/products",
    cta: "Ürünlere göz atın",
  },
  {
    title: "Logonuz ürünün üzerinde",
    text: "Ekibinizin kıyafetlerine logo baskısı ya da nakış yaptırabilirsiniz. Hangi yöntemin hangi iş için uygun olduğunu karşılaştırma tablosunda anlattık.",
    href: "/help/printing",
    cta: "Baskı ve nakış yöntemleri",
  },
  {
    title: "Kendi görselinizle tasarım",
    text: "Ürün sayfasındaki tasarım aracında kendi görselinizi yükleyip ürünün üzerine yerleştirebilir, sonucu görerek siparişe ekleyebilirsiniz.",
    href: "/products/special_production",
    cta: "Özel tasarım",
  },
  {
    title: "Toplu alımda indirim",
    text: "Bazı ürünlerde belirli bir adet ve üzerindeki alımlarda sepette otomatik indirim uygulanır. Adet ve oran ürüne göre değişir; ürün sayfalarında ve sepette görebilirsiniz. Daha büyük siparişler için toplu alım talebi gönderebilirsiniz.",
    href: "/products/wholesale",
    cta: "Toplu alım",
  },
  {
    title: "Ödeme ve taksit",
    text: "Ödemeler iyzico altyapısıyla alınır. Tek çekim yapabilir ya da 12 taksite kadar seçenekleri kullanabilirsiniz; taksitli ödemede vade farkı ödeme sayfasında gösterilir.",
  },
  {
    title: "Kargo ve takip",
    text: "Gönderiler Horoz Lojistik ile yapılır. Siparişinizin kargo durumunu profilinizdeki kargo takip bölümünden takip numarasıyla sorgulayabilirsiniz.",
    href: "/profile/cargo_tracking",
    cta: "Kargo takibi",
  },
];

export default function WhyUs() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Neden İşPool?</h1>
      <p className="text-gray-600 mb-10">
        İş güvenliği ve iş giyimi alışverişinde işinizi kolaylaştıran
        özellikleri aşağıda topladık.
      </p>

      <div className="space-y-8">
        {reasons.map((r) => (
          <section key={r.title} className="border-l-4 border-blue-900 pl-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {r.title}
            </h2>
            <p className="text-gray-700">{r.text}</p>
            {r.href && (
              <Link
                href={r.href}
                className="inline-block mt-2 text-sm font-medium underline"
              >
                {r.cta}
              </Link>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
