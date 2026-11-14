import React from "react";
import { COMPANY_LEGAL_TITLE, COMPANY_NAME } from "@/lib/company";

const sections = [
  {
    title: "Ne sunuyoruz?",
    text: "İş elbiseleri, iş ayakkabıları, eldiven ve diğer kişisel koruyucu donanımları tek bir mağazada topluyoruz. Bireysel alışverişin yanında toplu alım ve özel tasarım talepleri de alıyoruz.",
  },
  {
    title: "Ürün seçimi ve tedarik",
    text: "Kataloğa girecek ürünleri kullanım alanına, malzemesine ve ürün açıklamalarının eksiksiz olmasına bakarak seçiyoruz. Ürün sayfalarında gösterilen bilgilerin ürünle uyuşması önceliğimizdir.",
  },
  {
    title: "Kurumsal baskı ve nakış",
    text: "Firma logosu ya da isim baskısı isteyen müşterilerimiz için baskı ve nakış hizmeti veriyoruz. Uygulama öncesinde istek ve ölçüler müşteriyle netleştirilir.",
  },
  {
    title: "Ödeme",
    text: "Ödemeler iyzico altyapısıyla alınır. Uygun kartlarda 12 taksit seçeneğine kadar ödeme yapabilirsiniz.",
  },
  {
    title: "Kontrol ve sevkiyat",
    text: "Sipariş verildiğinde ürünlerin stok durumu ve tutarlar sunucu tarafında yeniden hesaplanır. Gönderiler Horoz Lojistik ile yola çıkar ve kargo takip numarasıyla sipariş sayfanızdan izlenebilir.",
  },
  {
    title: "Satış sonrası destek",
    text: "Sipariş, iade ya da ürün hakkında sorularınız için e-posta ve telefon üzerinden bize ulaşabilirsiniz. İade ve değişim koşulları ilgili sayfada ayrıca açıklanmıştır.",
  },
];

const QualityPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto my-12 px-6 md:px-10 py-10 font-sans text-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Hizmet Anlayışımız
      </h1>
      <p className="text-gray-600 mb-10 leading-relaxed">
        {COMPANY_NAME}, çalışma hayatında ihtiyaç duyulan koruyucu giyim ve
        ekipmanı güvenilir biçimde müşterisine ulaştırmak için çalışır. Aşağıda
        siparişin verilmesinden teslimatına kadar nasıl çalıştığımızı
        özetledik.
      </p>

      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.title} className="border-l-4 border-blue-900 pl-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {s.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{s.text}</p>
          </section>
        ))}

        <section className="border-l-4 border-gray-300 pl-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Sahip olunan belgeler
          </h2>
          <p className="text-gray-700 leading-relaxed">
            ⚠ DOLDURULACAK: sahip olunan belgeler
          </p>
        </section>
      </div>

      <p className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        {COMPANY_LEGAL_TITLE}
      </p>
    </div>
  );
};

export default QualityPolicy;
