import React from "react";

const DistanceSalesAgreement = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 bg-white text-gray-800 font-sans leading-relaxed border shadow-md my-10">
      {/* ANA BAŞLIK */}
      <div className="text-center border-b-2 border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
          Mesafeli Satış Sözleşmesi
        </h1>
      </div>

      <article className="space-y-8 text-sm md:text-base text-justify">
        {/* MADDE 1 */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-1 uppercase">
            Madde 1- Taraflar
          </h2>

          <div className="space-y-4">
            <div className="pl-4 border-l-4 border-blue-100">
              <h3 className="font-bold underline mb-2">1.1. Satıcı</h3>
              <p>
                <strong>ADI:</strong> İşPool Tekstil Üretim ve Paz. San. ve Tic.
                A.Ş
              </p>
              <p>
                <strong>ADRESİ:</strong> Küçük Çamlıca Mah. Adilbey Sk. No:4
                34696 Üsküdar / İSTANBUL
              </p>
              <p>
                <strong>TEL:</strong> 0216 472 73 00 (Pbx)
              </p>
              <p>
                <strong>E-POSTA:</strong> bilgi@ispool.com.tr
              </p>
              <p>
                <strong>MERSİS NO:</strong> 0482039841800018
              </p>
            </div>

            <div className="pl-4 border-l-4 border-blue-100">
              <h3 className="font-bold underline mb-2">1.2. Alıcı</h3>
              <p>Söz konusu ürünün satın alan kişi bilgileri</p>
            </div>
          </div>
        </section>

        {/* MADDE 2 */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-1 uppercase">
            Madde 2- Konu-Mesafeli Satış Sözleşmesi
          </h2>
          <p className="mb-4">
            İşbu sözleşmenin konusu, ALICI’nın SATICI’ya ait www.ispool.com.tr
            internet sitesinden elektronik ortamda siparişini yaptığı aşağıda
            nitelikleri ve satış ücreti belirtilen ürünün satışı ve teslimi ile
            ilgili olarak 4077 sayılı Tüketicilerin Korunması Hakkındaki Kanun
            ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince
            tarafların hak ve yükümlülüklerinin saptanmasıdır.
          </p>
          <p>
            Alıcı, satıcının isim, unvan, açık adres, telefon ve diğer erişim
            bilgileri , satışa konu malın temel nitelikleri, vergiler dahil
            olmak üzere satış fiyatı , ödeme sekli, teslimat koşulları ve
            masrafları vs. satışa konu mal ile ilgili tüm ön bilgiler ve “cayma”
            hakkının kullanılması ve bu hakkın nasıl kullanılacağı , şikayet ve
            itirazlarını iletebilecekleri resmi makamlar vs. konusunda açık ,
            anlaşılır ve internet ortamına uygun şekilde satıcı tarafından
            bilgilendirildiğini , bu ön bilgileri elektronik ortamda teyit
            ettiğini ve sonrasında mal sipariş verdiğini is bu sözleşme
            hükümlerince kabul ve beyan eder.
          </p>
          <p className="mt-4 italic">
            www.ispool.com.tr sitesinde yer alan ön bilgilendirme ve alıcı
            tarafından verilen sipariş üzerine düzenlenen fatura is bu
            sözleşmenin ayrılmaz parçalarıdır.
          </p>
        </section>

        {/* MADDE 3 */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-1 uppercase">
            Madde 3- Sözleşme Konusu Ürün/Ödeme/Teslimat Bilgileri
          </h2>
          <p>
            Elektronik ortamda alınan ürün/ürünlerin cinsi ve türü, miktarı,
            marka/modeli, satış bedeli, ödeme şekli, teslim alacak kişi,
            teslimat adresi, fatura bilgileri, kargo ücreti aşağıda belirtildiği
            gibidir. Fatura edilecek kişi ile sözleşmeyi yapan kişi aynı olmak
            zorundadır.Aşağıda yer alan bilgiler doğru ve eksiksiz olmalıdır. Bu
            bilgilerin doğru olmadığı veya noksan olduğu durumlardan doğacak
            zararları tamamıyla karşılamayı alıcı kabul eder ve ayrıca bu
            durumdan oluşabilecek her türlü sorumluluğu alıcı kabul eder.
          </p>
          <p className="mt-4">
            SATICI gerekli gördüğü durumlarda, ALICI’nın vermiş olduğu bilgiler
            gerçekle örtüşmediğinde, siparişi durdurma hakkını saklı tutar.
            SATICI siparişte sorun tespit ettiği durumlarda ALICI’nın vermiş
            olduğu telefon, e-posta ve posta adreslerinden ALICI’ya ulaşamadığı
            takdirde siparişin yürürlüğe koyulmasını 15 (onbeş) gün süreyle
            dondurur. ALICI’nın bu süre zarfında SATICI ile konuyla ilgili
            olarak iletişime geçmesi beklenir. Bu süre içerisinde ALICI’dan
            herhangi bir cevap alınamazsa SATICI, her iki tarafın da zarar
            görmemesi için siparişi iptal eder.
          </p>
          <div className="mt-4 p-4 bg-gray-50 border rounded italic">
            Sipariş sırasında satın alınan ürünler / Sipariş aşamasında seçilen
            ödeme yöntemi bilgileri
          </div>
        </section>

        {/* MADDE 4 */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-1 uppercase">
            Madde 4- Sözleşme Tarihi ve Mücbir Nedenler
          </h2>
          <p>
            Sözleşme tarihi, alıcı tarafından siparişin verildiği sipariş
            tarihidir.
          </p>
          <p className="mt-2 text-sm italic">
            Mücbir sebep (Doğal afet, savaş, terör, ayaklanma, değişen mevzuat
            hükümleri, el koyma veya grev, lokavt, üretim ve iletişim
            tesislerinde önemli ölçüde arıza vb.) durumunda tarafların
            sorumlulukları askıya alınır. Bu durum 30 gün sürerse taraflar tek
            taraflı fesih hakkına sahiptir.
          </p>
        </section>

        {/* MADDE 5 */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-1 uppercase">
            Madde 5- Satıcının Hak ve Yükümlülükleri
          </h2>
          <div className="space-y-3">
            <p>
              <strong>5.1.</strong> Satıcı, ilgili kanun ve yönetmelikler
              uyarınca edimlerini mücbir haller dışında eksiksiz yerine
              getirmeyi taahhüt eder.
            </p>
            <p>
              <strong>5.2.</strong> 18 yaşından küçükler alışveriş yapamaz.
              Satıcı beyan edilen yaşı esas alır.
            </p>
            <p>
              <strong>5.3.</strong> Sistem hatalarından kaynaklanan fiyat
              yanlışlıklarından satıcı sorumlu tutulamaz.
            </p>
          </div>
        </section>

        {/* MADDE 6 */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-1 uppercase">
            Madde 6- Alıcının Hak ve Yükümlülükleri
          </h2>
          <p>
            Alıcı, sipariş vermekle ödeme yükümlülüğünü ve sözleşme şartlarını
            kabul etmiş sayılır. Sağlık ve hijyen açısından uygun olmayacağından
            dolayı ürün ambalajına zarar vermemeyi kabul eder.
          </p>
        </section>

        {/* MADDE 7 */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-1 uppercase">
            Madde 7- Sipariş/Ödeme Prosedürü
          </h2>
          <p className="mb-4">
            <strong>Sipariş:</strong> Banka onayı alındıktan sonra süreç başlar.
            Stok problemleri durumunda alıcı bilgilendirilerek benzer kalitede
            ürün önerilebilir veya sipariş iptal edilebilir.
          </p>
          <p>
            <strong>Ödeme:</strong> Kredi kartı veya havale seçenekleri
            sunulmuştur. Havale ile ödemelerde Fatura Bilgileri ile gönderen
            bilgilerinin aynı olması ve sipariş numarasının yazılması
            gereklidir.
          </p>
        </section>

        {/* MADDE 8 */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-1 uppercase">
            Madde 8- Sevkiyat/Teslimat Prosedürü
          </h2>
          <p>
            Teslimat süresi 30 gündür, bildirimle 10 gün uzatılabilir. Paket
            hasarlıysa kargo yetkilisine tutanak tutturulmalı ve paket teslim
            alınmamalıdır.
          </p>
        </section>

        {/* MADDE 9 */}
        <section>
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-1 uppercase">
            Madde 9- Ürün İade ve Cayma Hakkı
          </h2>
          <div className="space-y-4">
            <p>
              Alıcı, malı teslim aldıktan sonra <strong>14 gün</strong>{" "}
              içerisinde cayma hakkına sahiptir. İade edilecek ürünün sağlık ve
              hijyen kuralları gereği ambalajının açılmamış, kullanılmamış ve
              tahrip edilmemiş olması şarttır.
            </p>

            <div className="bg-red-50 p-4 border-l-4 border-red-200">
              <h3 className="font-bold mb-2">Cayma Hakkının İstisnaları:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Kişisel ihtiyaçlar doğrultusunda hazırlanan mallar.</li>
                <li>Çabuk bozulabilen mallar.</li>
                <li>
                  Ambalajı açılmış, iadesi sağlık ve hijyen açısından uygun
                  olmayan ürünler.
                </li>
                <li>Elektronik ortamda anında ifa edilen hizmetler.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* MADDE 10, 11, 12 */}
        <div className="grid md:grid-cols-3 gap-6 pt-6">
          <section className="p-4 border rounded">
            <h2 className="font-bold uppercase text-blue-900 mb-2 underline">
              Madde 10- Garanti
            </h2>
            <p className="text-sm">
              Üretim hatalarına karşı 2 yıl garantilidir (Kullanım talimatına
              uygun kullanım şartıyla).
            </p>
          </section>
          <section className="p-4 border rounded">
            <h2 className="font-bold uppercase text-blue-900 mb-2 underline">
              Madde 11- Gizlilik
            </h2>
            <p className="text-sm">
              Kart bilgileri saklanmaz. Bilgiler sadece yasal zorunluluk
              hallerinde yetkili makamlarla paylaşılır.
            </p>
          </section>
          <section className="p-4 border rounded">
            <h2 className="font-bold uppercase text-blue-900 mb-2 underline">
              Madde 12- Yetkili Mahkeme
            </h2>
            <p className="text-sm">
              Uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri
              yetkilidir.
            </p>
          </section>
        </div>

        {/* ALT BİLGİ */}
        <footer className="mt-12 pt-8 border-t text-center text-xs text-gray-400">
          <p>
            Siparişin gerçekleşmesi durumunda Alıcı işbu sözleşmenin tüm
            koşullarını kabul etmiş sayılır.
          </p>
          <p className="mt-2">MERSİS: 0482039841800018</p>
        </footer>
      </article>
    </div>
  );
};

export default DistanceSalesAgreement;
