import React from "react";
import { COMPANY_EMAIL, COMPANY_PHONE } from "@/lib/company";

const methods = [
  {
    name: "Endüstriyel nakış",
    products: "Polo ve tişört yaka/göğüs, iş ceketi, yelek, şapka",
    when: "Logonun ürünle birlikte uzun yıllar kullanılacağı, kumaşı kalın ve dokulu işlerde; kabartmalı, kurumsal bir görünüm istendiğinde",
    wash: "Genel olarak çok iyi; iplik kumaşa dikildiği için sık yıkamada da yerinde kalır",
    detail: "Çok ince çizgiler ve küçük yazılar nakışta zor okunur, sade ve dolgulu logolarda en iyi sonucu verir",
  },
  {
    name: "DTF baskı",
    products: "Tişört, sweatshirt, çok renkli ya da fotoğraf benzeri tasarımlar",
    when: "Renk sayısı fazla, gradyanlı veya ayrıntılı tasarımlarda; az adetli işlerde",
    wash: "Doğru uygulandığında ve ürün etiketindeki yıkama talimatına uyulduğunda iyi; yüksek ısıda ütüden kaçınılmalı",
    detail: "Kumaşa ince bir katman olarak oturur; çok esneyen kumaşlarda baskı yüzeyi gerginlikten etkilenebilir",
  },
  {
    name: "Serigrafi",
    products: "Tişört, iş elbisesi, büyük adetli düz renkli logolar",
    when: "Az renkli, net kenarlı logoların yüksek adetle basılacağı işlerde",
    wash: "Genel olarak dayanıklı; sık yıkanan iş kıyafetlerinde tercih edilen bir yöntemdir",
    detail: "Her renk için ayrı kalıp hazırlandığı için renk sayısı arttıkça hazırlık da artar",
  },
];

const PrintingServices = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-gray-800">
      <h1 className="text-3xl font-bold text-sax-800 mb-2">
        Baskı ve Nakış
      </h1>
      <p className="text-gray-600 mb-10">
        Logonuzu ya da isim bilgisini ürüne işletebilirsiniz. Aşağıdaki tablo
        hangi yöntemin hangi iş için uygun olduğunu karşılaştırır.
      </p>

      <h2 className="text-xl font-semibold text-sax-800 mb-4">
        Hangi yöntem bana uygun?
      </h2>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 font-semibold">Yöntem</th>
              <th className="p-3 font-semibold">Sık kullanıldığı ürünler</th>
              <th className="p-3 font-semibold">Ne zaman tercih edilir?</th>
              <th className="p-3 font-semibold">Yıkamaya dayanım</th>
              <th className="p-3 font-semibold">Dikkat edilecek nokta</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m) => (
              <tr key={m.name} className="border-t border-gray-200 align-top">
                <th scope="row" className="p-3 font-semibold text-gray-900">
                  {m.name}
                </th>
                <td className="p-3">{m.products}</td>
                <td className="p-3">{m.when}</td>
                <td className="p-3">{m.wash}</td>
                <td className="p-3">{m.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        ⚠ DOLDURULACAK: sunulan baskı/nakış teknikleri (yukarıdaki üç yöntem
        dışında sunulanlar varsa eklenecek, sunulmayan varsa onaylanacak)
      </p>

      <section className="mt-12 rounded-lg bg-gray-50 border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-sax-800 mb-2">
          Teklif almak için
        </h2>
        <p className="text-gray-700 mb-3">
          Ürün türünü, adedi ve tercih ettiğiniz yöntemi aşağıdaki
          bilgilerden bize iletebilirsiniz.
        </p>
        <ul className="space-y-1 text-gray-800">
          <li>
            E-posta:{" "}
            <a className="underline" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>
          </li>
          <li>
            Telefon:{" "}
            <a className="underline" href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}>
              {COMPANY_PHONE}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default PrintingServices;
